import React, { useState, useEffect, useRef } from 'react';
import '../../styles/core/SwipeConnector.css';
import { Toast } from 'antd-mobile';

interface SwipeConnectorProps {
  rows: number;
  cols: number;
  blockSize: number;
  onPathComplete: (path: {row: number, col: number}[]) => void;
  isEnabled: boolean;
  minPathLength?: number;
  blockColors: string[][];
  specialBlocks?: {row: number, col: number, type: string}[];
}

const SwipeConnector: React.FC<SwipeConnectorProps> = ({
  rows,
  cols,
  blockSize,
  onPathComplete,
  isEnabled,
  minPathLength = 3,
  blockColors,
  specialBlocks = []
}) => {
  // 当前路径状态
  const [currentPath, setCurrentPath] = useState<{row: number, col: number}[]>([]);
  // 触摸状态
  const [isTouching, setIsTouching] = useState(false);
  // 当前触摸位置（用于绘制指示器）
  const [touchPosition, setTouchPosition] = useState<{x: number, y: number} | null>(null);
  // 是否显示错误提示
  const [showError, setShowError] = useState(false);
  
  // 引用容器元素
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 设置CSS变量用于响应式布局
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--rows', rows.toString());
      containerRef.current.style.setProperty('--cols', cols.toString());
    }
  }, [rows, cols]);
  
  // 处理触摸开始
  const handleTouchStart = (e: React.TouchEvent, row: number, col: number) => {
    if (!isEnabled) return;
    
    // 阻止默认行为
    e.preventDefault();
    
    // 开始新路径
    setCurrentPath([{row, col}]);
    setIsTouching(true);
    
    // 记录触摸位置
    const touch = e.touches[0];
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTouchPosition({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      });
    }
    
    // 触感反馈
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };
  
  // 处理触摸移动
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isEnabled || !isTouching || !containerRef.current) return;
    
    // 阻止默认行为
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    
    // 更新触摸位置指示器
    setTouchPosition({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
    
    // 计算当前触摸的方块坐标
    const col = Math.floor((touch.clientX - rect.left) / (rect.width / cols));
    const row = Math.floor((touch.clientY - rect.top) / (rect.height / rows));
    
    // 确保坐标在有效范围内
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      // 获取最后一个方块
      const lastBlock = currentPath[currentPath.length - 1];
      
      // 如果触摸到了新方块
      if (lastBlock.row !== row || lastBlock.col !== col) {
        // 检查是否相邻
        const isAdjacent = Math.abs(row - lastBlock.row) <= 1 && 
                          Math.abs(col - lastBlock.col) <= 1;
        
        // 检查颜色是否匹配
        const isColorMatch = blockColors[row][col] === blockColors[lastBlock.row][lastBlock.col];
        
        // 检查是否是特殊方块（彩虹方块可以匹配任何颜色）
        const isCurrentSpecial = specialBlocks.some(
          block => block.row === row && block.col === col && block.type === 'rainbow'
        );
        const isLastSpecial = specialBlocks.some(
          block => block.row === lastBlock.row && block.col === lastBlock.col && block.type === 'rainbow'
        );
        
        // 检查是否已经在路径中
        const isAlreadyInPath = currentPath.some(block => block.row === row && block.col === col);
        
        // 如果是相邻的、颜色匹配的、未在路径中的方块，添加到路径
        if (isAdjacent && (isColorMatch || isCurrentSpecial || isLastSpecial) && !isAlreadyInPath) {
          setCurrentPath([...currentPath, {row, col}]);
          setShowError(false);
          
          // 轻微触感反馈
          if (navigator.vibrate) {
            navigator.vibrate(5);
          }
        } 
        // 如果是路径中倒数第二个方块，允许返回（撤销最后一步）
        else if (currentPath.length > 1 && 
                currentPath[currentPath.length - 2].row === row && 
                currentPath[currentPath.length - 2].col === col) {
          setCurrentPath(currentPath.slice(0, -1));
          setShowError(false);
        }
        // 如果是无效移动，显示错误提示
        else if (isAdjacent && !isAlreadyInPath) {
          setShowError(true);
          
          // 错误触感反馈
          if (navigator.vibrate) {
            navigator.vibrate([20, 30, 20]);
          }
          
          setTimeout(() => setShowError(false), 500);
        }
      }
    }
  };
  
  // 处理触摸结束
  const handleTouchEnd = () => {
    if (!isEnabled || !isTouching) return;
    
    // 如果路径长度达到最小要求，触发回调
    if (currentPath.length >= minPathLength) {
      onPathComplete(currentPath);
      
      // 成功触感反馈
      if (navigator.vibrate) {
        navigator.vibrate([10, 30, 10, 30, 10]);
      }
      
      // 添加成功动画类
      const pathElements = document.querySelectorAll('.path-segment');
      pathElements.forEach((el, i) => {
        setTimeout(() => {
          el.classList.add('complete');
        }, i * 50);
      });
      
      // 短暂延迟后重置路径（让动画有时间播放）
      setTimeout(() => {
        setCurrentPath([]);
        setTouchPosition(null);
        setIsTouching(false);
      }, currentPath.length * 50 + 200);
    } else if (currentPath.length > 0) {
      // 路径太短，显示错误提示
      setShowError(true);
      
      // 错误触感反馈
      if (navigator.vibrate) {
        navigator.vibrate([30, 50, 30]);
      }
      
      // 显示Toast提示
      if (currentPath.length > 1) {
        Toast.show({
          content: `至少需要${minPathLength}个相同颜色的方块`,
          position: 'center',
          duration: 1000,
        });
      }
      
      setTimeout(() => {
        setShowError(false);
        setCurrentPath([]);
        setTouchPosition(null);
        setIsTouching(false);
      }, 500);
    } else {
      // 重置状态
      setCurrentPath([]);
      setTouchPosition(null);
      setIsTouching(false);
    }
  };
  
  // 渲染路径线段
  const renderPathSegments = () => {
    if (currentPath.length < 2) return null;
    
    return currentPath.slice(0, -1).map((startBlock, index) => {
      const endBlock = currentPath[index + 1];
      
      // 计算线段起点和终点（方块中心）
      const startX = (startBlock.col + 0.5) * (100 / cols);
      const startY = (startBlock.row + 0.5) * (100 / rows);
      const endX = (endBlock.col + 0.5) * (100 / cols);
      const endY = (endBlock.row + 0.5) * (100 / rows);
      
      // 计算线段长度和角度
      const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
      
      // 获取线段颜色（使用方块颜色）
      const color = blockColors[startBlock.row][startBlock.col];
      
      return (
        <div 
          key={`segment-${index}`}
          className={`path-segment ${showError ? 'error' : ''}`}
          style={{
            left: `${startX}%`,
            top: `${startY}%`,
            width: `${length}%`,
            transform: `rotate(${angle}deg)`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}`
          }}
        />
      );
    });
  };
  
  // 渲染触摸指示器
  const renderTouchIndicator = () => {
    if (!touchPosition || !isTouching) return null;
    
    // 如果有当前路径，使用最后一个方块的颜色
    const color = currentPath.length > 0 
      ? blockColors[currentPath[0].row][currentPath[0].col]
      : '#ffffff';
    
    return (
      <div 
        className="touch-indicator"
        style={{
          left: `${touchPosition.x}px`,
          top: `${touchPosition.y}px`,
          backgroundColor: color,
          boxShadow: `0 0 12px ${color}`
        }}
      />
    );
  };
  
  // 渲染选中的方块指示器
  const renderSelectedBlocks = () => {
    return currentPath.map((block, index) => (
      <div
        key={`selected-${index}`}
        className={`selected-block ${showError ? 'error' : ''}`}
        style={{
          left: `${block.col * (100 / cols)}%`,
          top: `${block.row * (100 / rows)}%`,
          width: `${100 / cols}%`,
          height: `${100 / rows}%`,
          borderColor: blockColors[block.row][block.col]
        }}
      />
    ));
  };
  
  // 渲染加载状态
  const renderLoading = () => {
    if (isEnabled) return null;
    
    return (
      <div className="swipe-connector-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  };
  
  return (
    <div 
      ref={containerRef}
      className="swipe-connector"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* 这里会渲染游戏方块的容器，方块由父组件提供 */}
      {renderPathSegments()}
      {renderSelectedBlocks()}
      {renderTouchIndicator()}
      {renderLoading()}
      
      {/* 触摸区域覆盖层 - 用于捕获触摸事件 */}
      <div className="touch-overlay">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="touch-row">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <div
                key={`touch-${rowIndex}-${colIndex}`}
                className="touch-area"
                onTouchStart={(e) => handleTouchStart(e, rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SwipeConnector;
