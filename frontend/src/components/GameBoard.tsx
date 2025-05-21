import React, { useState, useEffect, useRef } from 'react';
import '../styles/GameBoard.css';
import SwipeConnector from './core/SwipeConnector';
import { Toast } from 'antd-mobile';

// 设置图标SVG组件
const SettingsIcon = () => (
  <svg className="settings-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
  </svg>
);

// 关闭图标SVG组件
const CloseIcon = () => (
  <svg className="close-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

interface GameBoardProps {
  rows: number;
  cols: number;
  onScoreChange: (score: number) => void;
  onEnergyChange: (energy: number) => void;
}

interface Block {
  id: string;
  color: string;
  type: 'normal' | 'bomb' | 'rainbow' | 'line';
  selected: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  rows = 8, 
  cols = 8, 
  onScoreChange, 
  onEnergyChange 
}) => {
  const [blocks, setBlocks] = useState<Block[][]>([]);
  const [score, setScore] = useState<number>(0);
  const [moves, setMoves] = useState<number>(20);
  const [energy, setEnergy] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [selectedBlocks, setSelectedBlocks] = useState<{row: number, col: number}[]>([]);
  const [isSwipeEnabled, setIsSwipeEnabled] = useState<boolean>(true);
  const [blockColors, setBlockColors] = useState<string[][]>([]);
  const [specialBlocks, setSpecialBlocks] = useState<{row: number, col: number, type: string}[]>([]);
  const [showHapticFeedback, setShowHapticFeedback] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  
  const boardRef = useRef<HTMLDivElement>(null);
  const blockSize = useRef<number>(60); // 默认方块大小，会根据屏幕自适应调整

  // 颜色列表 - 优化后的色彩方案，更协调且减少视觉疲劳
  const colors = [
    '#FF6B6B', // 柔和红
    '#4ECDC4', // 薄荷绿
    '#45B7D1', // 天蓝
    '#FFC857', // 温暖黄
    '#A882DD', // 淡紫
    '#FF9A76'  // 珊瑚橙
  ];
  
  // 初始化游戏板
  useEffect(() => {
    initializeBoard();
    
    // 计算适合屏幕的方块大小
    const updateBlockSize = () => {
      if (boardRef.current) {
        const boardWidth = boardRef.current.clientWidth - 24; // 减去内边距
        const calculatedSize = Math.floor((boardWidth - (cols - 1) * 8) / cols); // 考虑间隙
        blockSize.current = calculatedSize;
      }
    };
    
    updateBlockSize();
    window.addEventListener('resize', updateBlockSize);
    
    // 添加新手引导
    if (!localStorage.getItem('gameIntroShown')) {
      setTimeout(() => {
        Toast.show({
          content: '滑动连接3个或更多相同颜色的方块来消除它们',
          position: 'center',
          duration: 3000,
        });
        localStorage.setItem('gameIntroShown', 'true');
      }, 1000);
    }
    
    return () => {
      window.removeEventListener('resize', updateBlockSize);
    };
  }, []);

  // 监听能量变化
  useEffect(() => {
    onEnergyChange(energy);
  }, [energy, onEnergyChange]);

  // 监听分数变化
  useEffect(() => {
    onScoreChange(score);
  }, [score, onScoreChange]);

  // 初始化游戏板
  const initializeBoard = () => {
    const newBlocks: Block[][] = [];
    const newBlockColors: string[][] = [];
    const newSpecialBlocks: {row: number, col: number, type: string}[] = [];
    
    for (let i = 0; i < rows; i++) {
      const row: Block[] = [];
      const colorRow: string[] = [];
      
      for (let j = 0; j < cols; j++) {
        const block = createRandomBlock();
        row.push(block);
        colorRow.push(block.color);
        
        if (block.type !== 'normal') {
          newSpecialBlocks.push({
            row: i,
            col: j,
            type: block.type
          });
        }
      }
      
      newBlocks.push(row);
      newBlockColors.push(colorRow);
    }
    
    setBlocks(newBlocks);
    setBlockColors(newBlockColors);
    setSpecialBlocks(newSpecialBlocks);
    setScore(0);
    setMoves(20);
    setEnergy(0);
    setCombo(0);
    setGameOver(false);
    setSelectedBlocks([]);
    setIsSwipeEnabled(true);
    setIsAnimating(false);
  };

  // 创建随机方块
  const createRandomBlock = (): Block => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomType = Math.random() < 0.9 ? 'normal' : 
                      (Math.random() < 0.5 ? 'bomb' : 
                      (Math.random() < 0.5 ? 'rainbow' : 'line'));
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      color: randomColor,
      type: randomType,
      selected: false
    };
  };

  // 处理滑动路径完成
  const handlePathComplete = (path: {row: number, col: number}[]) => {
    if (gameOver || moves <= 0 || path.length < 3 || isAnimating) return;
    
    // 设置动画状态，防止重复触发
    setIsAnimating(true);
    
    // 触发触感反馈
    triggerHapticFeedback();
    
    // 更新选中的方块
    setSelectedBlocks(path);
    
    // 显示连击提示
    if (combo > 0) {
      Toast.show({
        content: `${combo + 1}连击！`,
        position: 'center',
        duration: 1000,
      });
    }
    
    // 延迟消除，让玩家看到连线效果
    setTimeout(() => {
      eliminateBlocks(path);
    }, 500);
  };

  // 触发触感反馈
  const triggerHapticFeedback = () => {
    // 如果设备支持，触发振动
    if (navigator.vibrate) {
      navigator.vibrate(20);
    }
    
    // 显示视觉反馈
    setShowHapticFeedback(true);
    setTimeout(() => setShowHapticFeedback(false), 100);
  };

  // 消除选中的方块
  const eliminateBlocks = (path: {row: number, col: number}[]) => {
    if (path.length < 3) {
      setSelectedBlocks([]);
      setIsAnimating(false);
      return;
    }
    
    // 计算得分
    const baseScore = path.length * 10;
    const comboMultiplier = combo > 0 ? combo * 0.5 + 1 : 1;
    const newScore = score + Math.floor(baseScore * comboMultiplier);
    
    // 更新分数 - 添加动画效果
    const scoreElement = document.querySelector('.score span');
    if (scoreElement) {
      scoreElement.classList.add('score-change');
      setTimeout(() => {
        scoreElement.classList.remove('score-change');
      }, 500);
    }
    setScore(newScore);
    
    // 更新能量
    const energyGain = path.length * 5;
    const newEnergy = Math.min(energy + energyGain, 100);
    setEnergy(newEnergy);
    
    // 更新连击
    setCombo(combo + 1);
    
    // 创建新的方块数组和颜色数组
    const newBlocks = [...blocks];
    const newBlockColors = [...blockColors];
    const newSpecialBlocks: {row: number, col: number, type: string}[] = [];
    
    // 处理特殊方块效果
    path.forEach(pos => {
      const block = newBlocks[pos.row][pos.col];
      
      if (block.type === 'bomb') {
        // 炸弹效果：消除周围的方块
        for (let i = Math.max(0, pos.row - 1); i <= Math.min(rows - 1, pos.row + 1); i++) {
          for (let j = Math.max(0, pos.col - 1); j <= Math.min(cols - 1, pos.col + 1); j++) {
            if (i !== pos.row || j !== pos.col) {
              const newBlock = createRandomBlock();
              newBlocks[i][j] = newBlock;
              newBlockColors[i][j] = newBlock.color;
              
              if (newBlock.type !== 'normal') {
                newSpecialBlocks.push({
                  row: i,
                  col: j,
                  type: newBlock.type
                });
              }
            }
          }
        }
        
        // 显示炸弹效果提示
        Toast.show({
          content: '💣 爆炸！',
          position: 'center',
          duration: 1000,
        });
      } else if (block.type === 'line') {
        // 直线效果：消除同一行或列的方块
        for (let i = 0; i < rows; i++) {
          if (i !== pos.row) {
            const newBlock = createRandomBlock();
            newBlocks[i][pos.col] = newBlock;
            newBlockColors[i][pos.col] = newBlock.color;
            
            if (newBlock.type !== 'normal') {
              newSpecialBlocks.push({
                row: i,
                col: pos.col,
                type: newBlock.type
              });
            }
          }
        }
        for (let j = 0; j < cols; j++) {
          if (j !== pos.col) {
            const newBlock = createRandomBlock();
            newBlocks[pos.row][j] = newBlock;
            newBlockColors[pos.row][j] = newBlock.color;
            
            if (newBlock.type !== 'normal') {
              newSpecialBlocks.push({
                row: pos.row,
                col: j,
                type: newBlock.type
              });
            }
          }
        }
        
        // 显示直线效果提示
        Toast.show({
          content: '⚡ 闪电清除！',
          position: 'center',
          duration: 1000,
        });
      }
      
      // 重新生成被消除的方块
      const newBlock = createRandomBlock();
      newBlocks[pos.row][pos.col] = newBlock;
      newBlockColors[pos.row][pos.col] = newBlock.color;
      
      if (newBlock.type !== 'normal') {
        newSpecialBlocks.push({
          row: pos.row,
          col: pos.col,
          type: newBlock.type
        });
      }
    });
    
    // 更新方块数组和颜色数组
    setBlocks(newBlocks);
    setBlockColors(newBlockColors);
    setSpecialBlocks(newSpecialBlocks);
    
    // 减少移动次数
    const newMoves = moves - 1;
    setMoves(newMoves);
    
    // 检查游戏是否结束
    if (newMoves <= 0) {
      setGameOver(true);
      setIsSwipeEnabled(false);
    }
    
    // 重置选择
    setSelectedBlocks([]);
    
    // 延迟重置动画状态，确保动画有足够时间播放
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // 使用能量爆发
  const useEnergyBurst = () => {
    if (energy < 100 || isAnimating) return;
    
    // 设置动画状态
    setIsAnimating(true);
    
    // 触发触感反馈
    triggerHapticFeedback();
    
    // 显示能量爆发效果提示
    Toast.show({
      content: '⚡⚡⚡ 能量爆发！',
      position: 'center',
      duration: 1500,
    });
    
    // 随机消除一半的方块
    const newBlocks = [...blocks];
    const newBlockColors = [...blockColors];
    const newSpecialBlocks: {row: number, col: number, type: string}[] = [];
    
    const totalBlocks = rows * cols;
    const blocksToEliminate = Math.floor(totalBlocks / 2);
    
    let eliminated = 0;
    while (eliminated < blocksToEliminate) {
      const randomRow = Math.floor(Math.random() * rows);
      const randomCol = Math.floor(Math.random() * cols);
      
      // 重新生成随机方块
      const newBlock = createRandomBlock();
      newBlocks[randomRow][randomCol] = newBlock;
      newBlockColors[randomRow][randomCol] = newBlock.color;
      
      if (newBlock.type !== 'normal') {
        newSpecialBlocks.push({
          row: randomRow,
          col: randomCol,
          type: newBlock.type
        });
      }
      
      eliminated++;
    }
    
    // 更新方块数组和颜色数组
    setBlocks(newBlocks);
    setBlockColors(newBlockColors);
    setSpecialBlocks(newSpecialBlocks);
    
    // 增加分数
    setScore(score + 500);
    
    // 重置能量
    setEnergy(0);
    
    // 延迟重置动画状态
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  // 重新开始游戏
  const restartGame = () => {
    // 显示重新开始提示
    Toast.show({
      content: '游戏重新开始！',
      position: 'center',
      duration: 1000,
    });
    
    // 关闭设置菜单
    setSettingsOpen(false);
    
    // 初始化游戏
    initializeBoard();
  };

  // 打开设置菜单
  const openSettings = () => {
    setSettingsOpen(true);
  };

  // 关闭设置菜单
  const closeSettings = () => {
    setSettingsOpen(false);
  };

  // 渲染方块
  const renderBlock = (block: Block, row: number, col: number) => {
    let icon = '';
    let iconClass = '';
    
    if (block.type === 'bomb') {
      icon = '💣';
      iconClass = 'bomb-icon';
    } else if (block.type === 'rainbow') {
      icon = '🌈';
      iconClass = 'rainbow-icon';
    } else if (block.type === 'line') {
      icon = '⚡';
      iconClass = 'line-icon';
    }
    
    const isSelected = selectedBlocks.some(b => b.row === row && b.col === col);
    
    return (
      <div 
        key={`${row}-${col}`}
        className={`block ${isSelected ? 'selected' : ''}`}
        style={{ 
          backgroundColor: block.color,
          width: `${blockSize.current}px`,
          height: `${blockSize.current}px`
        }}
        data-row={row}
        data-col={col}
      >
        {icon && <span className={`special-icon ${iconClass}`}>{icon}</span>}
      </div>
    );
  };

  // 渲染设置菜单
  const renderSettingsMenu = () => {
    return (
      <>
        <div 
          className={`settings-overlay ${settingsOpen ? 'open' : ''}`}
          onClick={closeSettings}
        />
        <div className={`settings-menu ${settingsOpen ? 'open' : ''}`}>
          <div className="settings-header">
            <h2 className="settings-title">游戏设置</h2>
            <button className="close-settings" onClick={closeSettings}>
              <CloseIcon />
            </button>
          </div>
          <div className="settings-content">
            <div className="settings-section">
              <h3 className="settings-section-title">游戏信息</h3>
              <div className="settings-option">
                <span className="settings-option-label">当前分数</span>
                <span className="settings-option-value">{score}</span>
              </div>
              <div className="settings-option">
                <span className="settings-option-label">剩余步数</span>
                <span className="settings-option-value">{moves}</span>
              </div>
              <div className="settings-option">
                <span className="settings-option-label">当前连击</span>
                <span className="settings-option-value">{combo}x</span>
              </div>
              <div className="settings-option">
                <span className="settings-option-label">能量值</span>
                <span className="settings-option-value">{energy}%</span>
              </div>
            </div>
            
            <div className="settings-section">
              <h3 className="settings-section-title">游戏操作</h3>
              <div className="settings-button-group">
                <button 
                  className="settings-button-item"
                  onClick={restartGame}
                  disabled={isAnimating}
                >
                  重新开始
                </button>
                <button 
                  className={`settings-button-item ${energy < 100 ? 'secondary' : ''}`}
                  onClick={useEnergyBurst}
                  disabled={energy < 100 || isAnimating}
                >
                  使用能量爆发 {energy < 100 ? `(${energy}%)` : ''}
                </button>
              </div>
            </div>
            
            <div className="settings-section">
              <h3 className="settings-section-title">游戏规则</h3>
              <div className="settings-option">
                <span className="settings-option-label">滑动连接3个或更多相同颜色的方块来消除</span>
              </div>
              <div className="settings-option">
                <span className="settings-option-label">特殊方块有额外效果</span>
              </div>
              <div className="settings-option">
                <span className="settings-option-label">连击可以获得更多分数</span>
              </div>
              <div className="settings-option">
                <span className="settings-option-label">能量满后可以触发能量爆发</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="game-container">
      {/* 顶部栏 - 只保留设置按钮 */}
      <div className="game-header">
        <button 
          className="settings-button"
          onClick={openSettings}
          aria-label="设置"
        >
          <SettingsIcon />
        </button>
      </div>
      
      {/* 游戏信息区域 */}
      <div className="game-info">
        <div className="score">
          分数
          <span>{score}</span>
        </div>
        <div className="moves">
          步数
          <span>{moves}</span>
        </div>
        <div className="combo">
          连击
          <span>{combo}x</span>
        </div>
      </div>
      
      {/* 能量条 */}
      <div className="energy-bar-container">
        <div 
          className="energy-bar"
          style={{ width: `${energy}%` }}
        />
        <button 
          className={`energy-burst-button ${energy < 100 ? 'disabled' : ''}`}
          onClick={useEnergyBurst}
          disabled={energy < 100 || isAnimating}
        >
          能量爆发!
        </button>
      </div>
      
      {/* 游戏板 */}
      <div 
        ref={boardRef}
        className="game-board"
        style={{ 
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`
        }}
      >
        {/* 渲染方块 */}
        {blocks.map((row, rowIndex) => 
          row.map((block, colIndex) => 
            renderBlock(block, rowIndex, colIndex)
          )
        )}
        
        {/* 滑动连接组件 */}
        <SwipeConnector
          rows={rows}
          cols={cols}
          blockSize={blockSize.current}
          onPathComplete={handlePathComplete}
          isEnabled={isSwipeEnabled && !gameOver && !isAnimating}
          minPathLength={3}
          blockColors={blockColors}
          specialBlocks={specialBlocks}
        />
      </div>
      
      {/* 设置菜单 */}
      {renderSettingsMenu()}
      
      {/* 游戏结束弹窗 */}
      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-modal">
            <h2>游戏结束!</h2>
            <p>最终得分: {score}</p>
            <button onClick={restartGame}>再来一局</button>
          </div>
        </div>
      )}
      
      {/* 触感反馈视觉效果 */}
      {showHapticFeedback && <div className="haptic-feedback" />}
    </div>
  );
};

export default GameBoard;
