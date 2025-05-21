import React, { useState, useEffect } from 'react';
import '../styles/SettingsPage.css';
import { Tabs } from 'antd-mobile';

// 设置页面组件
interface SettingsPageProps {
  score: number;
  energy: number;
  moves: number;
  combo: number;
  onBack: () => void;
  onRestart: () => void;
  onEnergyBurst: () => void;
  isTestMode: boolean;
  toggleTestMode: () => void;
}

// 返回图标SVG组件
const BackIcon = () => (
  <svg className="back-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
);

// 重启图标SVG组件
const RestartIcon = () => (
  <svg className="restart-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
  </svg>
);

// 能量图标SVG组件
const EnergyIcon = () => (
  <svg className="energy-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
  </svg>
);

// 测试图标SVG组件
const TestIcon = () => (
  <svg className="test-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 2h1.5v3l2-3h1.7l-2 3 2 3h-1.7l-2-3v3H12V5zM7 7.25h2.5V6.5H7V5h4v3.75H8.5v.75H11V11H7V7.25zM19 13l-6 6-4-4-4 4v-2.5l4-4 4 4 6-6V13z"/>
  </svg>
);

// 音效图标SVG组件
const SoundIcon = () => (
  <svg className="sound-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
  </svg>
);

// 振动图标SVG组件
const VibrationIcon = () => (
  <svg className="vibration-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 15h2V9H0v6zm3 2h2V7H3v10zm19-8v6h2V9h-2zm-3 8h2V7h-2v10zM16.5 3h-9C6.67 3 6 3.67 6 4.5v15c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5v-15c0-.83-.67-1.5-1.5-1.5zM16 19H8V5h8v14z"/>
  </svg>
);

// 主题图标SVG组件
const ThemeIcon = () => (
  <svg className="theme-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
  </svg>
);

// 游戏图标SVG组件
const GameIcon = () => (
  <svg className="game-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
  </svg>
);

// 商店图标SVG组件
const ShopIcon = () => (
  <svg className="shop-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
  </svg>
);

// 排行榜图标SVG组件
const LeaderboardIcon = () => (
  <svg className="leaderboard-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 21H2V9h5.5v12zm7.25-18h-5.5v18h5.5V3zM22 11h-5.5v10H22V11z"/>
  </svg>
);

const SettingsPage: React.FC<SettingsPageProps> = ({
  score,
  energy,
  moves,
  combo,
  onBack,
  onRestart,
  onEnergyBurst,
  isTestMode,
  toggleTestMode
}) => {
  // 设置状态
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [theme, setTheme] = useState<string>('默认');
  const [activeTab, setActiveTab] = useState<string>('game');
  
  // 切换声音设置
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };
  
  // 切换振动设置
  const toggleVibration = () => {
    setVibrationEnabled(!vibrationEnabled);
  };
  
  // 切换主题
  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
  };

  // 切换标签页
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };
  
  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="back-button" onClick={onBack}>
          <BackIcon />
        </button>
        <h2>游戏设置</h2>
      </div>
      
      <div className="settings-content">
        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange}
          className="settings-tabs"
        >
          <Tabs.Tab title="游戏" key="game">
            <div className="settings-section">
              <h3 className="settings-section-title">游戏信息</h3>
              <div className="settings-info-card">
                <div className="info-item">
                  <span className="info-label">当前分数</span>
                  <span className="info-value">{score}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">剩余步数</span>
                  <span className="info-value">{moves}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">当前连击</span>
                  <span className="info-value">{combo}x</span>
                </div>
                <div className="info-item">
                  <span className="info-label">最高分数</span>
                  <span className="info-value">{localStorage.getItem('highScore') || '0'}</span>
                </div>
              </div>
            </div>
            
            <div className="settings-section">
              <h3 className="settings-section-title">游戏操作</h3>
              <div className="settings-button-group">
                <button className="settings-action-button" onClick={onRestart}>
                  <RestartIcon />
                  <span>重新开始</span>
                </button>
                
                <button 
                  className={`settings-action-button ${energy < 100 ? 'disabled' : 'energy-ready'}`} 
                  onClick={onEnergyBurst}
                  disabled={energy < 100}
                >
                  <EnergyIcon />
                  <span>能量爆发 {energy < 100 ? `(${energy}%)` : ''}</span>
                </button>
              </div>
            </div>
            
            <div className="settings-section">
              <h3 className="settings-section-title">游戏规则</h3>
              <div className="settings-rule-card">
                <p>• 滑动连接3个或更多相同颜色的方块来消除</p>
                <p>• 特殊方块有额外效果：💣爆炸、⚡闪电、🌈彩虹</p>
                <p>• 连击可以获得更多分数和能量</p>
                <p>• 能量满时可以使用能量爆发清除大量方块</p>
              </div>
            </div>
          </Tabs.Tab>
          
          <Tabs.Tab title="设置" key="settings">
            <div className="settings-section">
              <h3 className="settings-section-title">游戏设置</h3>
              <div className="settings-option">
                <div className="option-info">
                  <SoundIcon />
                  <span className="option-label">游戏音效</span>
                </div>
                <div className="toggle-switch">
                  <input 
                    type="checkbox" 
                    id="sound-toggle" 
                    checked={soundEnabled}
                    onChange={toggleSound}
                  />
                  <label htmlFor="sound-toggle"></label>
                </div>
              </div>
              
              <div className="settings-option">
                <div className="option-info">
                  <VibrationIcon />
                  <span className="option-label">振动反馈</span>
                </div>
                <div className="toggle-switch">
                  <input 
                    type="checkbox" 
                    id="vibration-toggle" 
                    checked={vibrationEnabled}
                    onChange={toggleVibration}
                  />
                  <label htmlFor="vibration-toggle"></label>
                </div>
              </div>
              
              <div className="settings-option">
                <div className="option-info">
                  <ThemeIcon />
                  <span className="option-label">游戏主题</span>
                </div>
                <div className="theme-selector">
                  <select 
                    value={theme}
                    onChange={(e) => changeTheme(e.target.value)}
                  >
                    <option value="默认">默认</option>
                    <option value="暗黑">暗黑</option>
                    <option value="明亮">明亮</option>
                    <option value="彩虹">彩虹</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="settings-section">
              <h3 className="settings-section-title">开发者选项</h3>
              <div className="settings-option">
                <div className="option-info">
                  <TestIcon />
                  <span className="option-label">测试模式</span>
                </div>
                <div className="toggle-switch">
                  <input 
                    type="checkbox" 
                    id="test-toggle" 
                    checked={isTestMode}
                    onChange={toggleTestMode}
                  />
                  <label htmlFor="test-toggle"></label>
                </div>
              </div>
              <div className="settings-option">
                <div className="option-info">
                  <span className="option-label">游戏版本</span>
                </div>
                <span className="option-value">1.0.3</span>
              </div>
            </div>
          </Tabs.Tab>
          
          <Tabs.Tab title="导航" key="navigation">
            <div className="settings-section">
              <h3 className="settings-section-title">快速导航</h3>
              <div className="navigation-buttons">
                <button className="navigation-button" onClick={() => onBack()}>
                  <GameIcon />
                  <span>游戏</span>
                </button>
                <button className="navigation-button">
                  <ShopIcon />
                  <span>商店</span>
                </button>
                <button className="navigation-button">
                  <LeaderboardIcon />
                  <span>排行榜</span>
                </button>
              </div>
            </div>
          </Tabs.Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
