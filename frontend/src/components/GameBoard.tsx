import React, { useState, useEffect, useRef } from 'react';
import '../styles/GameBoard.css';
import SwipeConnector from './core/SwipeConnector';

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

const GameBoard: React.FC<GameBoardProps> = ({ rows, cols, onScoreChange, onEnergyChange }) => {
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
  
  const boardRef = useRef<HTMLDivElement>(null);
  const blockSize = useRef<number>(60); // 默认方块大小，会根据屏幕自适应调整

  // 颜色列表
  const colors = ['#FF5252', '#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#00BCD4'];
  
  // 初始化游戏板
  useEffect(() => {
    initializeBoard();
    
    // 计算适合屏幕的方块大小
    const updateBlockSize = () => {
      if (boardRef.current) {
        const boardWidth = boardRef.current.clientWidth;
        const calculatedSize = Math.floor(boardWidth / cols);
        blockSize.current = calculatedSize;
      }
    };
    
    updateBlockSize();
    window.addEventListener('resize', updateBlockSize);
    
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
    if (gameOver || moves <= 0 || path.length < 3) return;
    
    // 触发触感反馈
    triggerHapticFeedback();
    
    // 更新选中的方块
    setSelectedBlocks(path);
    
    // 延迟消除，让玩家看到连线效果
    setTimeout(() => {
      eliminateBlocks(path);
    }, 300);
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
      return;
    }
    
    // 计算得分
    const baseScore = path.length * 10;
    const comboMultiplier = combo > 0 ? combo * 0.5 + 1 : 1;
    const newScore = score + Math.floor(baseScore * comboMultiplier);
    
    // 更新分数
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
  };

  // 使用能量爆发
  const useEnergyBurst = () => {
    if (energy < 100) return;
    
    // 触发触感反馈
    triggerHapticFeedback();
    
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
  };

  // 重新开始游戏
  const restartGame = () => {
    initializeBoard();
    setIsSwipeEnabled(true);
  };

  // 渲染方块
  const renderBlock = (block: Block, row: number, col: number) => {
    let icon = '';
    
    if (block.type === 'bomb') {
      icon = '💣';
    } else if (block.type === 'rainbow') {
      icon = '🌈';
    } else if (block.type === 'line') {
      icon = '⚡';
    }
    
    return (
      <div 
        key={`${row}-${col}`}
        className={`block ${block.selected ? 'selected' : ''}`}
        style={{ 
          backgroundColor: block.color,
          width: `${blockSize.current}px`,
          height: `${blockSize.current}px`
        }}
      >
        {icon && <span className="special-icon">{icon}</span>}
      </div>
    );
  };

  return (
    <div className="game-container">
      <div className="game-info">
        <div className="score">分数: {score}</div>
        <div className="moves">步数: {moves}</div>
        <div className="combo">连击: {combo}x</div>
      </div>
      
      <div className="energy-bar-container">
        <div 
          className="energy-bar"
          style={{ width: `${energy}%` }}
        />
        <button 
          className={`energy-burst-button ${energy < 100 ? 'disabled' : ''}`}
          onClick={useEnergyBurst}
          disabled={energy < 100}
        >
          能量爆发!
        </button>
      </div>
      
      <div 
        ref={boardRef}
        className="game-board"
        style={{ 
          width: `${cols * blockSize.current}px`,
          height: `${rows * blockSize.current}px`
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
          isEnabled={isSwipeEnabled && !gameOver}
          minPathLength={3}
          blockColors={blockColors}
          specialBlocks={specialBlocks}
        />
      </div>
      
      <div className="game-controls">
        <button 
          className="control-button"
          onClick={restartGame}
        >
          重新开始
        </button>
      </div>
      
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
