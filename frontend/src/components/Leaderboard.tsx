import React from 'react';
import '../styles/Leaderboard.css';

interface LeaderboardProps {
  currentUserId: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  score: number;
  level: number;
  province: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ currentUserId }) => {
  const [activeTab, setActiveTab] = React.useState<'friends' | 'global' | 'province'>('friends');
  const [timeRange, setTimeRange] = React.useState<'daily' | 'weekly' | 'allTime'>('weekly');

  // 模拟数据
  const friendsData: User[] = [
    { id: 'user1', name: '张三', avatar: '👨', score: 12500, level: 42, province: '北京' },
    { id: 'user2', name: '李四', avatar: '👩', score: 10800, level: 38, province: '上海' },
    { id: 'user3', name: '王五', avatar: '👦', score: 9200, level: 35, province: '广州' },
    { id: 'user4', name: '赵六', avatar: '👧', score: 8500, level: 30, province: '深圳' },
    { id: 'user5', name: '钱七', avatar: '👴', score: 7800, level: 28, province: '杭州' },
    { id: 'user6', name: '孙八', avatar: '👵', score: 6500, level: 25, province: '成都' },
    { id: 'user7', name: '周九', avatar: '👲', score: 5200, level: 20, province: '武汉' },
    { id: 'user8', name: '吴十', avatar: '👳', score: 4800, level: 18, province: '南京' },
  ];

  const globalData: User[] = [
    { id: 'global1', name: '游戏达人', avatar: '👑', score: 25000, level: 80, province: '北京' },
    { id: 'global2', name: '消除王者', avatar: '🏆', score: 22000, level: 75, province: '上海' },
    { id: 'global3', name: '方块大师', avatar: '🥇', score: 20000, level: 70, province: '广州' },
    { id: 'user1', name: '张三', avatar: '👨', score: 12500, level: 42, province: '北京' },
    { id: 'global4', name: '消除达人', avatar: '🥈', score: 18000, level: 65, province: '深圳' },
    { id: 'global5', name: '游戏高手', avatar: '🥉', score: 16000, level: 60, province: '杭州' },
    { id: 'global6', name: '方块能手', avatar: '🎮', score: 15000, level: 55, province: '成都' },
    { id: 'global7', name: '消除新星', avatar: '⭐', score: 14000, level: 50, province: '武汉' },
    { id: 'global8', name: '游戏精英', avatar: '🌟', score: 13000, level: 45, province: '南京' },
    { id: 'user2', name: '李四', avatar: '👩', score: 10800, level: 38, province: '上海' },
  ];

  const provinceData: { name: string; score: number; users: number }[] = [
    { name: '北京', score: 1250000, users: 12500 },
    { name: '上海', score: 1180000, users: 11800 },
    { name: '广州', score: 980000, users: 9800 },
    { name: '深圳', score: 920000, users: 9200 },
    { name: '杭州', score: 850000, users: 8500 },
    { name: '成都', score: 780000, users: 7800 },
    { name: '武汉', score: 720000, users: 7200 },
    { name: '南京', score: 680000, users: 6800 },
    { name: '重庆', score: 650000, users: 6500 },
    { name: '西安', score: 620000, users: 6200 },
  ];

  // 根据当前选择的时间范围获取数据
  const getDataByTimeRange = () => {
    if (activeTab === 'friends') {
      return friendsData;
    } else if (activeTab === 'global') {
      return globalData;
    } else {
      return provinceData;
    }
  };

  const data = getDataByTimeRange();

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>排行榜</h2>
        <div className="time-filter">
          <button 
            className={`time-button ${timeRange === 'daily' ? 'active' : ''}`}
            onClick={() => setTimeRange('daily')}
          >
            日榜
          </button>
          <button 
            className={`time-button ${timeRange === 'weekly' ? 'active' : ''}`}
            onClick={() => setTimeRange('weekly')}
          >
            周榜
          </button>
          <button 
            className={`time-button ${timeRange === 'allTime' ? 'active' : ''}`}
            onClick={() => setTimeRange('allTime')}
          >
            总榜
          </button>
        </div>
      </div>

      <div className="leaderboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          好友榜
        </button>
        <button 
          className={`tab-button ${activeTab === 'global' ? 'active' : ''}`}
          onClick={() => setActiveTab('global')}
        >
          全球榜
        </button>
        <button 
          className={`tab-button ${activeTab === 'province' ? 'active' : ''}`}
          onClick={() => setActiveTab('province')}
        >
          省份榜
        </button>
      </div>

      <div className="leaderboard-content">
        {activeTab !== 'province' ? (
          <div className="user-list">
            {(data as User[]).map((user, index) => (
              <div 
                key={user.id} 
                className={`user-item ${user.id === currentUserId ? 'current-user' : ''}`}
              >
                <div className="rank">
                  {index < 3 ? (
                    <span className={`rank-medal rank-${index + 1}`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                  ) : (
                    <span className="rank-number">{index + 1}</span>
                  )}
                </div>
                <div className="user-avatar">{user.avatar}</div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-level">Lv.{user.level}</div>
                </div>
                <div className="user-score">{user.score.toLocaleString()}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="province-list">
            {(data as { name: string; score: number; users: number }[]).map((province, index) => (
              <div key={province.name} className="province-item">
                <div className="rank">
                  {index < 3 ? (
                    <span className={`rank-medal rank-${index + 1}`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                  ) : (
                    <span className="rank-number">{index + 1}</span>
                  )}
                </div>
                <div className="province-info">
                  <div className="province-name">{province.name}</div>
                  <div className="province-users">{province.users.toLocaleString()}名玩家</div>
                </div>
                <div className="province-score">{province.score.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="leaderboard-footer">
        <button className="join-team-button">
          加入我的省份战队
        </button>
        <button className="share-button">
          分享我的排名
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
