import React from 'react';
import { useState, useEffect } from 'react';
import '../styles/ItemShop.css';

interface Item {
  id: string;
  name: string;
  description: string;
  price: {
    type: string;
    amount?: number;
  };
  imageUrl: string;
}

interface ItemShopProps {
  coins: number;
  gems: number;
  onPurchase: (item: Item) => void;
}

const ItemShop: React.FC<ItemShopProps> = ({ coins, gems, onPurchase }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'items' | 'skins'>('items');

  useEffect(() => {
    // 模拟从API获取商店数据
    const fetchItems = async () => {
      try {
        setLoading(true);
        // 实际项目中，这里应该是从后端API获取数据
        // const response = await fetch('http://localhost:3000/api/store/items');
        // const data = await response.json();
        
        // 模拟数据
        const mockItems = [
          { id: 'item1', name: '悔棋', description: '撤销上一步操作', price: { type: 'coins', amount: 50 }, imageUrl: '/assets/items/undo.png' },
          { id: 'item2', name: '刷新', description: '重新排列所有方块', price: { type: 'coins', amount: 100 }, imageUrl: '/assets/items/refresh.png' },
          { id: 'item3', name: '指定消除', description: '消除指定方块', price: { type: 'gems', amount: 5 }, imageUrl: '/assets/items/remove.png' },
          { id: 'item4', name: '时间延长', description: '延长关卡时间30秒', price: { type: 'gems', amount: 10 }, imageUrl: '/assets/items/time.png' },
          { id: 'item5', name: '能量加速', description: '能量槽充能速度提升50%', price: { type: 'gems', amount: 15 }, imageUrl: '/assets/items/energy.png' }
        ];
        
        setItems(mockItems);
        setLoading(false);
      } catch (err) {
        setError('无法加载商店数据');
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedTab]);

  const handlePurchase = (item: Item) => {
    // 检查玩家是否有足够的货币
    if (item.price.type === 'coins' && item.price.amount && coins >= item.price.amount) {
      onPurchase(item);
    } else if (item.price.type === 'gems' && item.price.amount && gems >= item.price.amount) {
      onPurchase(item);
    } else {
      alert('货币不足，无法购买');
    }
  };

  const renderPrice = (price: { type: string; amount?: number }) => {
    if (price.type === 'free') {
      return <span className="item-price free">免费</span>;
    } else if (price.type === 'coins') {
      return (
        <span className={`item-price coins ${coins < (price.amount || 0) ? 'insufficient' : ''}`}>
          {price.amount} 金币
        </span>
      );
    } else if (price.type === 'gems') {
      return (
        <span className={`item-price gems ${gems < (price.amount || 0) ? 'insufficient' : ''}`}>
          {price.amount} 钻石
        </span>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="shop-loading">加载商店数据...</div>;
  }

  if (error) {
    return <div className="shop-error">{error}</div>;
  }

  return (
    <div className="item-shop">
      <div className="shop-header">
        <h2>商店</h2>
        <div className="currency-display">
          <div className="currency coins">
            <span className="currency-icon">🪙</span>
            <span className="currency-amount">{coins}</span>
          </div>
          <div className="currency gems">
            <span className="currency-icon">💎</span>
            <span className="currency-amount">{gems}</span>
          </div>
        </div>
      </div>

      <div className="shop-tabs">
        <button 
          className={`shop-tab ${selectedTab === 'items' ? 'active' : ''}`}
          onClick={() => setSelectedTab('items')}
        >
          道具
        </button>
        <button 
          className={`shop-tab ${selectedTab === 'skins' ? 'active' : ''}`}
          onClick={() => setSelectedTab('skins')}
        >
          皮肤
        </button>
      </div>

      <div className="shop-items">
        {items.map(item => (
          <div key={item.id} className="shop-item">
            <div className="item-image">
              {/* 实际项目中应该使用真实图片 */}
              <div className="placeholder-image">{item.name.charAt(0)}</div>
            </div>
            <div className="item-info">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-description">{item.description}</p>
              {renderPrice(item.price)}
            </div>
            <button 
              className="purchase-button"
              onClick={() => handlePurchase(item)}
              disabled={
                (item.price.type === 'coins' && item.price.amount && coins < item.price.amount) || 
                (item.price.type === 'gems' && item.price.amount && gems < item.price.amount) ? 
                true : false
              }
            >
              购买
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemShop;
