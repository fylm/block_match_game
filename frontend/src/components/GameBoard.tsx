import React, { useState, useEffect, useCallback } from 'react';
import '../styles/GameBoard.css';

// 方块类型定义
interface Block {
  id: number;
  type: number;
  special: string | null;
  x: number;
  y: number;
  selected: boolean;
}

// 特殊方块类型
type SpecialType = null | 'bomb' | 'rainbow' | 'line';

// 游戏面板属性
interface GameBoardProps {
  rows: number;
  cols: number;
  onScoreChange: (score: number) => void;
  onEnergyChange: (energy: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ rows, cols, onScoreChange, onEnergyChange }) => {
  // 游戏状态
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<Block[]>([]);
  const [score, setScore] = useState<number>(0);
  const [energy, setEnergy] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [movesLeft, setMovesLeft] = useState<number>(20);

  // 颜色映射
  const colorMap = [
    '#FF5252', // 红色
    '#4CAF50', // 绿色
    '#2196F3', // 蓝色
    '#FFEB3B', // 黄色
    '#9C27B0', // 紫色
    '#FF9800', // 橙色
  ];

  // 特殊方块图标
  const specialIcons = {
    bomb: '💣',
    rainbow: '🌈',
    line: '⚡',
  };

  // 初始化游戏面板
  const initializeBoard = useCallback(() => {
    const newBlocks: Block[] = [];
    let id = 0;
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // 随机生成方块类型（颜色）
        const type = Math.floor(Math.random() * 6);
        
        // 随机生成特殊方块（5%概率）
        let special: SpecialType = null;
        const specialRand = Math.random();
        if (specialRand < 0.02) {
          special = 'bomb';
        } else if (specialRand < 0.04) {
          special = 'rainbow';
        } else if (specialRand < 0.05) {
          special = 'line';
        }
        
        newBlocks.push({
          id: id++,
          type,
          special,
          x,
          y,
          selected: false
        });
      }
    }
    
    setBlocks(newBlocks);
    setSelectedBlocks([]);
    setScore(0);
    setEnergy(0);
    setCombo(0);
    setGameOver(false);
    setMovesLeft(20);
  }, [rows, cols]);

  // 组件挂载时初始化游戏
  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  // 检查两个方块是否相邻
  const areBlocksAdjacent = (block1: Block, block2: Block): boolean => {
    // 水平相邻
    if (Math.abs(block1.x - block2.x) === 1 && block1.y === block2.y) {
      return true;
    }
    // 垂直相邻
    if (Math.abs(block1.y - block2.y) === 1 && block1.x === block2.x) {
      return true;
    }
    // 对角线相邻
    if (Math.abs(block1.x - block2.x) === 1 && Math.abs(block1.y - block2.y) === 1) {
      return true;
    }
    return false;
  };

  // 检查方块是否可以被选中
  const canSelectBlock = (block: Block): boolean => {
    // 彩虹方块可以与任何方块连接
    if (block.special === 'rainbow') {
      return true;
    }
    
    // 如果没有选中的方块，任何方块都可以被选中
    if (selectedBlocks.length === 0) {
      return true;
    }
    
    const lastSelected = selectedBlocks[selectedBlocks.length - 1];
    
    // 彩虹方块可以与任何方块连接
    if (lastSelected.special === 'rainbow') {
      return true;
    }
    
    // 检查是否相邻
    if (!areBlocksAdjacent(block, lastSelected)) {
      return false;
    }
    
    // 检查类型是否相同
    return block.type === lastSelected.type;
  };

  // 处理方块点击
  const handleBlockClick = (block: Block) => {
    if (gameOver) return;
    
    // 如果方块已经被选中，取消选择链中该方块之后的所有方块
    const index = selectedBlocks.findIndex(b => b.id === block.id);
    if (index !== -1) {
      const newSelectedBlocks = selectedBlocks.slice(0, index + 1);
      setSelectedBlocks(newSelectedBlocks);
      
      // 更新方块选中状态
      setBlocks(blocks.map(b => ({
        ...b,
        selected: newSelectedBlocks.some(selected => selected.id === b.id)
      })));
      
      return;
    }
    
    // 检查是否可以选中
    if (!canSelectBlock(block)) {
      return;
    }
    
    // 添加到选中列表
    const newSelectedBlocks = [...selectedBlocks, block];
    setSelectedBlocks(newSelectedBlocks);
    
    // 更新方块选中状态
    setBlocks(blocks.map(b => ({
      ...b,
      selected: newSelectedBlocks.some(selected => selected.id === b.id)
    })));
  };

  // 处理方块连线完成
  const handleLineComplete = () => {
    if (selectedBlocks.length < 3) {
      // 取消选择
      setSelectedBlocks([]);
      setBlocks(blocks.map(b => ({ ...b, selected: false })));
      return;
    }
    
    // 计算得分
    const baseScore = selectedBlocks.length * 10;
    const comboMultiplier = Math.max(1, combo * 0.5);
    const specialBonus = selectedBlocks.reduce((bonus, block) => {
      if (block.special === 'bomb') return bonus + 50;
      if (block.special === 'rainbow') return bonus + 30;
      if (block.special === 'line') return bonus + 40;
      return bonus;
    }, 0);
    
    const totalScore = Math.floor((baseScore + specialBonus) * comboMultiplier);
    
    // 更新分数
    const newScore = score + totalScore;
    setScore(newScore);
    onScoreChange(newScore);
    
    // 更新连击
    const newCombo = combo + 1;
    setCombo(newCombo);
    
    // 更新能量
    const energyGain = selectedBlocks.length * 2;
    const newEnergy = Math.min(100, energy + energyGain);
    setEnergy(newEnergy);
    onEnergyChange(newEnergy);
    
    // 处理特殊方块效果
    let blocksToRemove: Block[] = [...selectedBlocks];
    
    selectedBlocks.forEach(block => {
      if (block.special === 'bomb') {
        // 炸弹效果：消除周围的方块
        blocks.forEach(b => {
          if (Math.abs(b.x - block.x) <= 1 && Math.abs(b.y - block.y) <= 1) {
            if (!blocksToRemove.some(rb => rb.id === b.id)) {
              blocksToRemove.push(b);
            }
          }
        });
      } else if (block.special === 'line') {
        // 直线消除：消除同一行或同一列的方块
        blocks.forEach(b => {
          if (b.x === block.x || b.y === block.y) {
            if (!blocksToRemove.some(rb => rb.id === b.id)) {
              blocksToRemove.push(b);
            }
          }
        });
      }
    });
    
    // 移除方块并生成新方块
    const newBlocks = blocks.filter(b => !blocksToRemove.some(rb => rb.id === b.id));
    
    // 生成新方块
    let maxId = blocks.reduce((max, block) => Math.max(max, block.id), 0);
    const addedBlocks: Block[] = [];
    
    // 计算每列需要添加的方块数量
    const columnsToFill: { [key: number]: number } = {};
    blocksToRemove.forEach(block => {
      columnsToFill[block.x] = (columnsToFill[block.x] || 0) + 1;
    });
    
    // 添加新方块
    Object.entries(columnsToFill).forEach(([colStr, count]) => {
      const col = parseInt(colStr);
      for (let i = 0; i < count; i++) {
        const type = Math.floor(Math.random() * 6);
        
        // 随机生成特殊方块
        let special: SpecialType = null;
        const specialRand = Math.random();
        if (specialRand < 0.02) {
          special = 'bomb';
        } else if (specialRand < 0.04) {
          special = 'rainbow';
        } else if (specialRand < 0.05) {
          special = 'line';
        }
        
        addedBlocks.push({
          id: ++maxId,
          type,
          special,
          x: col,
          y: -i - 1, // 从顶部落下
          selected: false
        });
      }
    });
    
    // 更新游戏面板
    setBlocks([...newBlocks, ...addedBlocks]);
    setSelectedBlocks([]);
    
    // 减少剩余步数
    const newMovesLeft = movesLeft - 1;
    setMovesLeft(newMovesLeft);
    
    // 检查游戏是否结束
    if (newMovesLeft <= 0) {
      setGameOver(true);
    }
  };

  // 使用能量爆发
  const useEnergyBurst = () => {
    if (energy < 100 || gameOver) return;
    
    // 随机移除30%的方块
    const blocksToRemove: Block[] = [];
    const blockCount = Math.floor(blocks.length * 0.3);
    
    for (let i = 0; i < blockCount; i++) {
      const randomIndex = Math.floor(Math.random() * blocks.length);
      if (!blocksToRemove.some(b => b.id === blocks[randomIndex].id)) {
        blocksToRemove.push(blocks[randomIndex]);
      }
    }
    
    // 计算得分
    const burstScore = blockCount * 20;
    const newScore = score + burstScore;
    setScore(newScore);
    onScoreChange(newScore);
    
    // 重置能量
    setEnergy(0);
    onEnergyChange(0);
    
    // 移除方块并生成新方块
    const newBlocks = blocks.filter(b => !blocksToRemove.some(rb => rb.id === b.id));
    
    // 生成新方块
    let maxId = blocks.reduce((max, block) => Math.max(max, block.id), 0);
    const addedBlocks: Block[] = [];
    
    // 计算每列需要添加的方块数量
    const columnsToFill: { [key: number]: number } = {};
    blocksToRemove.forEach(block => {
      columnsToFill[block.x] = (columnsToFill[block.x] || 0) + 1;
    });
    
    // 添加新方块
    Object.entries(columnsToFill).forEach(([colStr, count]) => {
      const col = parseInt(colStr);
      for (let i = 0; i < count; i++) {
        const type = Math.floor(Math.random() * 6);
        
        // 随机生成特殊方块
        let special: SpecialType = null;
        const specialRand = Math.random();
        if (specialRand < 0.02) {
          special = 'bomb';
        } else if (specialRand < 0.04) {
          special = 'rainbow';
        } else if (specialRand < 0.05) {
          special = 'line';
        }
        
        addedBlocks.push({
          id: ++maxId,
          type,
          special,
          x: col,
          y: -i - 1, // 从顶部落下
          selected: false
        });
      }
    });
    
    // 更新游戏面板
    setBlocks([...newBlocks, ...addedBlocks]);
  };

  // 重新开始游戏
  const restartGame = () => {
    initializeBoard();
  };

  // 渲染方块
  const renderBlock = (block: Block) => {
    const style = {
      backgroundColor: colorMap[block.type],
      border: block.selected ? '2px solid white' : '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: block.selected ? '0 0 10px white' : 'none',
    };
    
    return (
      <div
        key={block.id}
        className={`block ${block.selected ? 'selected' : ''}`}
        style={style}
        onClick={() => handleBlockClick(block)}
      >
        {block.special && <div className="special-icon">{specialIcons[block.special as keyof typeof specialIcons]}</div>}
      </div>
    );
  };

  return (
    <div className="game-container">
      <div className="game-info">
        <div className="score">分数: {score}</div>
        <div className="moves">剩余步数: {movesLeft}</div>
        <div className="combo">连击: {combo}x</div>
      </div>
      
      <div className="energy-bar-container">
        <div className="energy-bar" style={{ width: `${energy}%` }}></div>
        <button 
          className={`energy-burst-button ${energy < 100 ? 'disabled' : ''}`}
          onClick={useEnergyBurst}
          disabled={energy < 100}
        >
          能量爆发
        </button>
      </div>
      
      <div className="game-board" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {blocks.map(block => renderBlock(block))}
      </div>
      
      <div className="game-controls">
        <button className="control-button" onClick={handleLineComplete}>完成连线</button>
        <button className="control-button" onClick={() => {
          setSelectedBlocks([]);
          setBlocks(blocks.map(b => ({ ...b, selected: false })));
        }}>取消选择</button>
      </div>
      
      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-modal">
            <h2>游戏结束</h2>
            <p>最终得分: {score}</p>
            <button onClick={restartGame}>重新开始</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
