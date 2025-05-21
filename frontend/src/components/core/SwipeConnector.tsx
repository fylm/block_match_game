import React, { useState, useEffect, useRef } from 'react';
import '../../styles/core/SwipeConnector.css';

interface SwipeConnectorProps {
  rows: number;
  cols: number;
  blockColors: string[][];
  blockSize: number;
  onPathComplete: (path: {row: number, col: number}[]) => void;
  isEnabled: boolean;
  specialBlocks?: {row: number, col: number, type: string}[];
}

const SwipeConnector: React.FC<SwipeConnectorProps> = ({
  rows,
  cols,
  blockColors,
  blockSize,
  onPathComplete,
  isEnabled,
  specialBlocks = []
}) => {
  const [path, setPath] = useState<{row: number, col: number}[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [touchIndicator, setTouchIndicator] = useState<{x: number, y: number, visible: boolean}>({
    x: 0,
    y: 0,
    visible: false
  });
  const [connectionLines, setConnectionLines] = useState<{
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    angle: number,
    length: number,
    color: string
  }[]>([]);
  
  const boardRef = useRef<HTMLDivElement>(null);
  const lastBlockRef = useRef<{row: number, col: number} | null>(null);
  
  // 清除路径
  const clearPath = () => {
    setPath([]);
    setConnectionLines([]);
    lastBlockRef.current = null;
  };
  
  // 处理触摸/鼠标开始
  const handleStart = (e: React.TouchEvent | React.MouseEvent, row: number, col: number) => {
    if (!isEnabled) return;
    
    e.preventDefault();
    
    // 获取触摸/鼠标位置
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // 显示触摸指示器
    setTouchIndicator({
      x: clientX,
      y: clientY,
      visible: true
    });
    
    // 开始新路径
    setIsDragging(true);
    setPath([{row, col}]);
    lastBlockRef.current = {row, col};
  };
  
  // 处理触摸/鼠标移动
  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || !isEnabled || !boardRef.current) return;
    
    e.preventDefault();
    
    // 获取触摸/鼠标位置
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // 更新触摸指示器位置
    setTouchIndicator({
      x: clientX,
      y: clientY,
      visible: true
    });
    
    // 获取board的位置信息
    const boardRect = boardRef.current.getBoundingClientRect();
    
    // 计算相对于board的位置
    const relativeX = clientX - boardRect.left;
    const relativeY = clientY - boardRect.top;
    
    // 计算当前触摸的方块行列
    const col = Math.floor(relativeX / (blockSize + 8)); // 8是间隙
    const row = Math.floor(relativeY / (blockSize + 8));
    
    // 检查是否在有效范围内
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      // 检查是否与上一个方块相邻
      const lastBlock = lastBlockRef.current;
      if (lastBlock) {
        const isAdjacent = (
          (Math.abs(row - lastBlock.row) <= 1 && Math.abs(col - lastBlock.col) <= 1) &&
          !(row === lastBlock.row && col === lastBlock.col)
        );
        
        // 检查是否与路径中的第一个方块颜色相同
        const isSameColor = blockColors[row][col] === blockColors[path[0].row][path[0].col];
        
        // 检查是否已经在路径中
        const isInPath = path.some(p => p.row === row && p.col === col);
        
        // 如果相邻、颜色相同且不在路径中，添加到路径
        if (isAdjacent && isSameColor && !isInPath) {
          // 添加到路径
          const newPath = [...path, {row, col}];
          setPath(newPath);
          
          // 更新连接线
          updateConnectionLines(newPath);
          
          // 更新最后一个方块
          lastBlockRef.current = {row, col};
        }
        // 如果是路径中的倒数第二个方块，允许返回（撤销最后一步）
        else if (path.length >= 2 && row === path[path.length - 2].row && col === path[path.length - 2].col) {
          // 移除路径中的最后一个方块
          const newPath = path.slice(0, -1);
          setPath(newPath);
          
          // 更新连接线
          updateConnectionLines(newPath);
          
          // 更新最后一个方块
          lastBlockRef.current = {row, col};
        }
      }
    }
  };
  
  // 处理触摸/鼠标结束
  const handleEnd = () => {
    if (!isDragging || !isEnabled) return;
    
    // 隐藏触摸指示器
    setTouchIndicator({
      ...touchIndicator,
      visible: false
    });
    
    // 结束拖动
    setIsDragging(false);
    
    // 如果路径长度大于等于3，触发回调
    if (path.length >= 3) {
      onPathComplete(path);
    }
    
    // 清除路径
    clearPath();
  };
  
  // 更新连接线
  const updateConnectionLines = (currentPath: {row: number, col: number}[]) => {
    if (currentPath.length < 2 || !boardRef.current) return;
    
    const boardRect = boardRef.current.getBoundingClientRect();
    const newLines: {
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      angle: number,
      length: number,
      color: string
    }[] = [];
    
    // 获取第一个方块的颜色
    const pathColor = blockColors[currentPath[0].row][currentPath[0].col];
    
    // 为每对相邻方块创建连接线
    for (let i = 0; i < currentPath.length - 1; i++) {
      const current = currentPath[i];
      const next = currentPath[i + 1];
      
      // 计算方块中心位置
      const x1 = (current.col * (blockSize + 8)) + (blockSize / 2) + 12; // 12是board的padding
      const y1 = (current.row * (blockSize + 8)) + (blockSize / 2) + 12;
      const x2 = (next.col * (blockSize + 8)) + (blockSize / 2) + 12;
      const y2 = (next.row * (blockSize + 8)) + (blockSize / 2) + 12;
      
      // 计算角度和长度
      const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
      const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      
      // 添加连接线
      newLines.push({
        x1,
        y1,
        x2,
        y2,
        angle,
        length,
        color: pathColor
      });
    }
    
    setConnectionLines(newLines);
  };
  
  // 渲染连接线
  const renderConnectionLines = () => {
    return connectionLines.map((line, index) => (
      <div
        key={`line-${index}`}
        className="path-segment"
        style={{
          left: `${line.x1}px`,
          top: `${line.y1}px`,
          width: `${line.length}px`,
          transform: `rotate(${line.angle}deg)`,
          backgroundColor: line.color,
          boxShadow: `0 0 10px ${line.color}`
        }}
      />
    ));
  };
  
  // 渲染选中方块指示器
  const renderSelectedBlocks = () => {
    return path.map((block, index) => {
      // 计算方块位置
      const left = (block.col * (blockSize + 8)) + 12; // 12是board的padding
      const top = (block.row * (blockSize + 8)) + 12;
      
      return (
        <div
          key={`selected-${index}`}
          className="selected-block-indicator"
          style={{
            left: `${left}px`,
            top: `${top}px`,
            width: `${blockSize}px`,
            height: `${blockSize}px`,
            borderColor: blockColors[block.row][block.col],
            boxShadow: `0 0 10px ${blockColors[block.row][block.col]}`
          }}
        />
      );
    });
  };
  
  // 渲染触摸指示器
  const renderTouchIndicator = () => {
    if (!touchIndicator.visible) return null;
    
    return (
      <div
        className="touch-indicator"
        style={{
          left: `${touchIndicator.x}px`,
          top: `${touchIndicator.y}px`
        }}
      />
    );
  };
  
  // 清理函数
  useEffect(() => {
    return () => {
      clearPath();
    };
  }, []);
  
  return (
    <div 
      ref={boardRef}
      className="swipe-connector"
      onTouchMove={handleMove}
      onMouseMove={handleMove}
      onTouchEnd={handleEnd}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
      {/* 渲染连接线 */}
      {renderConnectionLines()}
      
      {/* 渲染选中方块指示器 */}
      {renderSelectedBlocks()}
      
      {/* 渲染触摸指示器 */}
      {renderTouchIndicator()}
      
      {/* 渲染方块触摸区域 */}
      {Array.from({ length: rows }).map((_, row) => (
        Array.from({ length: cols }).map((_, col) => {
          // 计算方块位置
          const left = (col * (blockSize + 8)) + 12; // 12是board的padding
          const top = (row * (blockSize + 8)) + 12;
          
          // 检查是否为特殊方块
          const isSpecial = specialBlocks.some(
            block => block.row === row && block.col === col
          );
          
          return (
            <div
              key={`touch-${row}-${col}`}
              className={`block-touch-area ${isSpecial ? 'special' : ''}`}
              style={{
                left: `${left}px`,
                top: `${top}px`,
                width: `${blockSize}px`,
                height: `${blockSize}px`
              }}
              onTouchStart={(e) => handleStart(e, row, col)}
              onMouseDown={(e) => handleStart(e, row, col)}
              data-row={row}
              data-col={col}
            />
          );
        })
      ))}
    </div>
  );
};

export default SwipeConnector;
