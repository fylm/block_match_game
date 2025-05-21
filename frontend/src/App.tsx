import React, { useState, useEffect } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import ItemShop from './components/ItemShop';
import Leaderboard from './components/Leaderboard';
import TestValidator from './components/TestValidator';
import { Button, Dialog } from './components/ui/index';
import { ConfigProvider } from 'antd-mobile';

function App() {
  const [score, setScore] = useState<number>(0);
  const [energy, setEnergy] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'game' | 'shop' | 'leaderboard' | 'test'>('game');
  const [isTestMode, setIsTestMode] = useState<boolean>(false);

  // 检测是否为移动设备
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // 处理分数变化
  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
  };

  // 处理能量变化
  const handleEnergyChange = (newEnergy: number) => {
    setEnergy(newEnergy);
  };

  // 切换测试模式
  const toggleTestMode = () => {
    setIsTestMode(!isTestMode);
    setActiveTab(isTestMode ? 'game' : 'test');
  };

  return (
    <ConfigProvider>
      <div className="app-container">
        <header className="app-header">
          <h1>方块连连消</h1>
          <div className="header-info">
            <div className="score-display">分数: {score}</div>
            <div className="energy-display">能量: {energy}%</div>
          </div>
        </header>

        <main className="app-content">
          {activeTab === 'game' && (
            <GameBoard 
              rows={8} 
              cols={8} 
              onScoreChange={handleScoreChange}
              onEnergyChange={handleEnergyChange}
            />
          )}
          
          {activeTab === 'shop' && (
            <ItemShop />
          )}
          
          {activeTab === 'leaderboard' && (
            <Leaderboard />
          )}
          
          {activeTab === 'test' && (
            <TestValidator />
          )}
        </main>

        <footer className="app-footer">
          <nav className="app-nav">
            <Button 
              variant={activeTab === 'game' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('game')}
              className="nav-button"
            >
              游戏
            </Button>
            
            <Button 
              variant={activeTab === 'shop' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('shop')}
              className="nav-button"
            >
              商店
            </Button>
            
            <Button 
              variant={activeTab === 'leaderboard' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('leaderboard')}
              className="nav-button"
            >
              排行榜
            </Button>
            
            {isTestMode && (
              <Button 
                variant={activeTab === 'test' ? 'primary' : 'secondary'}
                onClick={() => setActiveTab('test')}
                className="nav-button"
              >
                测试
              </Button>
            )}
          </nav>
          
          <div className="app-version">
            <span>版本: 1.0.1</span>
            <Button 
              variant="text" 
              size="small"
              onClick={toggleTestMode}
            >
              {isTestMode ? '退出测试' : '测试模式'}
            </Button>
          </div>
        </footer>
        
        {/* 移动端设备提示 */}
        {isMobile && (
          <div className="mobile-optimized-notice">
            已优化移动端体验
          </div>
        )}
      </div>
    </ConfigProvider>
  );
}

export default App;
