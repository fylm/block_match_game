import React, { useState, useEffect } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import ItemShop from './components/ItemShop';
import Leaderboard from './components/Leaderboard';
import TestValidator from './components/TestValidator';
import SettingsPage from './components/SettingsPage';
import { Button, Dialog } from './components/ui/index';
import { ConfigProvider } from 'antd-mobile';

// 设置图标SVG组件
const SettingsIcon = () => (
  <svg className="settings-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
  </svg>
);

function App() {
  const [score, setScore] = useState<number>(0);
  const [energy, setEnergy] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'game' | 'shop' | 'leaderboard' | 'test' | 'settings'>('game');
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

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

  // 打开设置页面
  const openSettings = () => {
    setActiveTab('settings');
  };

  return (
    <ConfigProvider>
      <div className="app-container">
        <header className="app-header">
          <h1>方块连连消</h1>
          <div className="header-actions">
            <button 
              className="settings-button"
              onClick={openSettings}
              aria-label="设置"
            >
              <SettingsIcon />
            </button>
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
          
          {activeTab === 'settings' && (
            <SettingsPage 
              score={score}
              onBack={() => setActiveTab('game')}
              onRestart={() => {
                // 重置游戏逻辑将在GameBoard组件中处理
                setActiveTab('game');
              }}
              isTestMode={isTestMode}
              toggleTestMode={toggleTestMode}
            />
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
          </nav>
          
          <div className="app-version">
            <span>版本: 1.0.2</span>
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
