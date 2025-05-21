import React from 'react';
import { useState, useEffect } from 'react';
import '../styles/Leaderboard.css';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  score: number;
}

interface LeaderboardProps {
  currentUserId?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ currentUserId }) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'friends' | 'global' | 'province'>('friends');

  useEffect(() => {
    // 模拟从API获取排行榜数据
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        // 实际项目中，这里应该是从后端API获取数据
        // const response = await fetch(`http://localhost:3000/api/leaderboard?type=${activeTab}`);
        // const data = await response.json();
        
        // 模拟数据
        let mockData: LeaderboardEntry[] = [];
        
        if (activeTab === 'friends') {
          mockData = [
            { rank: 1, userId: 'user1', username: '好友张三', score: 9500 },
            { rank: 2, userId: 'user2', username: '好友李四', score: 9200 },
            { rank: 3, userId: 'user3', username: '好友王五', score: 8800 },
            { rank: 4, userId: 'user4', username: '好友赵六', score: 8500 },
            { rank: 5, userId: 'user5', username: '好友钱七', score: 8200 }
          ];
        } else if (activeTab === 'global') {
          mockData = [
            { rank: 1, userId: 'user10', username: '玩家10086', score: 12500 },
            { rank: 2, userId: 'user11', username: '玩家8848', score: 12200 },
            { rank: 3, userId: 'user12', username: '玩家7777', score: 11800 },
            { rank: 4, userId: 'user13', username: '玩家6666', score: 11500 },
            { rank: 5, userId: 'user14', username: '玩家5555', score: 11200 },
            { rank: 6, userId: 'user15', username: '玩家4444', score: 10900 },
            { rank: 7, userId: 'user16', username: '玩家3333', score: 10600 },
            { rank: 8, userId: 'user17', username: '玩家2222', score: 10300 },
            { rank: 9, userId: 'user18', username: '玩家1111', score: 10000 },
            { rank: 10, userId: 'user19', username: '玩家0000', score: 9700 }
          ];
        } else if (activeTab === 'province') {
          mockData = [
            { rank: 1, userId: 'province1', username: '北京', score: 125000 },
            { rank: 2, userId: 'province2', username: '上海', score: 120000 },
            { rank: 3, userId: 'province3', username: '广东', score: 118000 },
            { rank: 4, userId: 'province4', username: '四川', score: 105000 },
            { rank: 5, userId: 'province5', username: '浙江', score: 98000 }
          ];
        }
        
        setLeaderboardData(mockData);
        setLoading(false);
      } catch (err) {
        setError('无法加载排行榜数据');
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [activeTab]);

  if (loading) {
    return <div className="leaderboard-loading">加载排行榜数据...</div>;
  }

  if (error) {
    return <div className="leaderboard-error">{error}</div>;
  }

  return (
    <div className="leaderboard">
      <h2>排行榜</h2>
      
      <div className="leaderboard-tabs">
        <button 
          className={`leaderboard-tab ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          好友排行
        </button>
        <button 
          className={`leaderboard-tab ${activeTab === 'global' ? 'active' : ''}`}
          onClick={() => setActiveTab('global')}
        >
          全球排行
        </button>
        <button 
          className={`leaderboard-tab ${activeTab === 'province' ? 'active' : ''}`}
          onClick={() => setActiveTab('province')}
        >
          省份战队
        </button>
      </div>
      
      <div className="leaderboard-list">
        <div className="leaderboard-header">
          <div className="rank-column">排名</div>
          <div className="name-column">名称</div>
          <div className="score-column">分数</div>
        </div>
        
        {leaderboardData.map((entry) => (
          <div 
            key={entry.userId} 
            className={`leaderboard-entry ${currentUserId === entry.userId ? 'current-user' : ''}`}
          >
            <div className="rank-column">
              {entry.rank <= 3 ? (
                <div className={`rank-badge rank-${entry.rank}`}>{entry.rank}</div>
              ) : (
                entry.rank
              )}
            </div>
            <div className="name-column">{entry.username}</div>
            <div className="score-column">{entry.score.toLocaleString()}</div>
          </div>
        ))}
        
        {leaderboardData.length === 0 && (
          <div className="no-data">暂无排行数据</div>
        )}
      </div>
      
      {activeTab === 'friends' && (
        <div className="invite-friends">
          <button className="invite-button">邀请好友</button>
          <button className="challenge-button">挑战好友</button>
        </div>
      )}
      
      {activeTab === 'province' && (
        <div className="province-info">
          <p>加入省份战队，为家乡贡献分数！</p>
          <button className="join-province-button">选择我的省份</button>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
