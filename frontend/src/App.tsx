import { useState } from 'react';
import GameBoard from './components/GameBoard';
import ItemShop from './components/ItemShop';
import Leaderboard from './components/Leaderboard';
import './App.css';

function App() {
  const [coins, setCoins] = useState<number>(1000);
  const [gems, setGems] = useState<number>(50);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'game' | 'shop' | 'leaderboard'>('game');

  const handleScoreChange = (newScore: number) => {
    // 在实际应用中，这里可能需要更新全局状态或发送到服务器
    console.log(`分数更新: ${newScore}`);
  };

  const handleEnergyChange = (newEnergy: number) => {
    // 在实际应用中，这里可能需要更新全局状态或发送到服务器
    console.log(`能量更新: ${newEnergy}`);
  };

  const handlePurchase = (item: any) => {
    if (item.price.type === 'coins' && item.price.amount) {
      setCoins(coins - item.price.amount);
    } else if (item.price.type === 'gems' && item.price.amount) {
      setGems(gems - item.price.amount);
    }
    // 在实际应用中，这里应该处理道具的添加逻辑
    alert(`成功购买 ${item.name}`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>方块连连消</h1>
        <div className="header-buttons">
          <button onClick={() => setShowRules(true)}>游戏规则</button>
          <button onClick={() => setShowSettings(true)}>设置</button>
        </div>
      </header>

      <nav className="main-nav">
        <button 
          className={`nav-button ${activeTab === 'game' ? 'active' : ''}`}
          onClick={() => setActiveTab('game')}
        >
          游戏
        </button>
        <button 
          className={`nav-button ${activeTab === 'shop' ? 'active' : ''}`}
          onClick={() => setActiveTab('shop')}
        >
          商店
        </button>
        <button 
          className={`nav-button ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          排行榜
        </button>
      </nav>

      <main>
        {activeTab === 'game' && (
          <GameBoard 
            rows={8} 
            cols={8} 
            onScoreChange={handleScoreChange} 
            onEnergyChange={handleEnergyChange} 
          />
        )}
        
        {activeTab === 'shop' && (
          <ItemShop 
            coins={coins}
            gems={gems}
            onPurchase={handlePurchase}
          />
        )}
        
        {activeTab === 'leaderboard' && (
          <Leaderboard 
            currentUserId="user2"
          />
        )}
      </main>

      {showRules && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>游戏规则</h2>
            <div className="modal-content">
              <p>1. 连接三个或更多相同颜色的方块来消除它们</p>
              <p>2. 方块可以水平、垂直或对角线连接</p>
              <p>3. 特殊方块有额外效果：</p>
              <ul>
                <li>💣 炸弹方块：消除周围的方块</li>
                <li>🌈 彩虹方块：可以与任何颜色连接</li>
                <li>⚡ 直线方块：消除同一行或列的方块</li>
              </ul>
              <p>4. 消除方块会增加能量，能量满时可以触发"能量爆发"</p>
              <p>5. 在有限步数内获得尽可能高的分数</p>
            </div>
            <button onClick={() => setShowRules(false)}>关闭</button>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>设置</h2>
            <div className="modal-content">
              <div className="setting-item">
                <label>音效</label>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="setting-item">
                <label>音乐</label>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="setting-item">
                <label>难度</label>
                <select defaultValue="normal">
                  <option value="easy">简单</option>
                  <option value="normal">普通</option>
                  <option value="hard">困难</option>
                </select>
              </div>
            </div>
            <button onClick={() => setShowSettings(false)}>保存</button>
          </div>
        </div>
      )}

      <footer>
        <p>© 2025 方块连连消 - 版权所有</p>
      </footer>
    </div>
  );
}

export default App;
