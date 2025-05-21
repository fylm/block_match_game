import React, { useState, useEffect } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import ItemShop from './components/ItemShop';
import Leaderboard from './components/Leaderboard';
import TestValidator from './components/TestValidator';
import SettingsPage from './components/SettingsPage';
import { ConfigProvider } from 'antd-mobile';

// 设置图标SVG组件
const SettingsIcon = () => (
  <svg className="nav-icon settings-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
  </svg>
);

// 游戏图标SVG组件
const GameIcon = () => (
  <svg className="nav-icon game-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
  </svg>
);

// 商店图标SVG组件
const ShopIcon = () => (
  <svg className="nav-icon shop-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
  </svg>
);

// 排行榜图标SVG组件
const LeaderboardIcon = () => (
  <svg className="nav-icon leaderboard-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 21H2V9h5.5v12zm7.25-18h-5.5v18h5.5V3zM22 11h-5.5v10H22V11z"/>
  </svg>
);

// 菜单图标SVG组件
const MenuIcon = () => (
  <svg className="menu-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
  </svg>
);

function App() {
  const [score, setScore] = useState<number>(0);
  const [energy, setEnergy] = useState<number>(0);
  const [moves, setMoves] = useState<number>(20);
  const [combo, setCombo] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'game' | 'shop' | 'leaderboard' | 'test' | 'settings'>('game');
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [navMenuOpen, setNavMenuOpen] = useState<boolean>(false);

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

  // 处理步数变化
  const handleMovesChange = (newMoves: number) => {
    setMoves(newMoves);
  };

  // 处理连击变化
  const handleComboChange = (newCombo: number) => {
    setCombo(newCombo);
  };

  // 切换测试模式
  const toggleTestMode = () => {
    setIsTestMode(!isTestMode);
    setActiveTab(isTestMode ? 'game' : 'test');
  };

  // 打开设置页面
  const openSettings = () => {
    setActiveTab('settings');
    setNavMenuOpen(false);
  };

  // 切换导航菜单
  const toggleNavMenu = () => {
    setNavMenuOpen(!navMenuOpen);
  };

  // 切换标签页
  const switchTab = (tab: 'game' | 'shop' | 'leaderboard' | 'test' | 'settings') => {
    setActiveTab(tab);
    setNavMenuOpen(false);
  };

  // 重新开始游戏
  const handleRestart = () => {
    // 游戏重置逻辑将在GameBoard组件中处理
    setActiveTab('game');
  };

  // 使用能量爆发
  const handleEnergyBurst = () => {
    // 能量爆发逻辑将在GameBoard组件中处理
  };

  return (
    <ConfigProvider>
      <div className="app-container">
        <header className="app-header">
          <h1>方块连连消</h1>
        </header>

        <main className="app-content">
          {activeTab === 'game' && (
            <GameBoard 
              rows={8} 
              cols={8} 
              onScoreChange={handleScoreChange}
              onEnergyChange={handleEnergyChange}
              onOpenSettings={openSettings}
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
              energy={energy}
              moves={moves}
              combo={combo}
              onBack={() => setActiveTab('game')}
              onRestart={handleRestart}
              onEnergyBurst={handleEnergyBurst}
              isTestMode={isTestMode}
              toggleTestMode={toggleTestMode}
            />
          )}
        </main>

        {/* 悬浮导航菜单按钮 */}
        <div className="floating-nav">
          <button 
            className="floating-nav-button"
            onClick={toggleNavMenu}
            aria-label="导航菜单"
          >
            <MenuIcon />
          </button>
          
          {/* 导航菜单 */}
          <div className={`nav-menu ${navMenuOpen ? 'open' : ''}`}>
            <button 
              className={`nav-menu-item ${activeTab === 'game' ? 'active' : ''}`}
              onClick={() => switchTab('game')}
            >
              <GameIcon />
              <span>游戏</span>
            </button>
            
            <button 
              className={`nav-menu-item ${activeTab === 'shop' ? 'active' : ''}`}
              onClick={() => switchTab('shop')}
            >
              <ShopIcon />
              <span>商店</span>
            </button>
            
            <button 
              className={`nav-menu-item ${activeTab === 'leaderboard' ? 'active' : ''}`}
              onClick={() => switchTab('leaderboard')}
            >
              <LeaderboardIcon />
              <span>排行榜</span>
            </button>
            
            <button 
              className={`nav-menu-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={openSettings}
            >
              <SettingsIcon />
              <span>设置</span>
            </button>
          </div>
        </div>
        
        {/* 导航菜单背景遮罩 */}
        {navMenuOpen && (
          <div 
            className="nav-menu-overlay"
            onClick={toggleNavMenu}
          />
        )}
        
        {/* 移动端设备提示 */}
        {isMobile && (
          <div className="mobile-optimized-notice">
            已优化移动端体验
          </div>
        )}
        
        <div className="app-version">
          <span>版本: 1.0.3</span>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default App;
