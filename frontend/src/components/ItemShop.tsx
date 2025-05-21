import React, { useState } from 'react';
import '../styles/ItemShop.css';

interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: {
    type: 'coins' | 'gems';
    amount: number;
  };
}

interface ItemShopProps {
  coins: number;
  gems: number;
  onPurchase: (item: Item) => void;
}

const ItemShop: React.FC<ItemShopProps> = ({ coins, gems, onPurchase }) => {
  const [activeCategory, setActiveCategory] = useState<'items' | 'skins'>('items');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // 道具数据
  const items: Item[] = [
    {
      id: 'item1',
      name: '重排',
      description: '重新排列所有方块',
      icon: '🔄',
      price: { type: 'coins', amount: 100 }
    },
    {
      id: 'item2',
      name: '炸弹',
      description: '获得一个炸弹方块',
      icon: '💣',
      price: { type: 'coins', amount: 150 }
    },
    {
      id: 'item3',
      name: '彩虹',
      description: '获得一个彩虹方块',
      icon: '🌈',
      price: { type: 'gems', amount: 5 }
    },
    {
      id: 'item4',
      name: '直线',
      description: '获得一个直线方块',
      icon: '⚡',
      price: { type: 'coins', amount: 200 }
    },
    {
      id: 'item5',
      name: '+5步',
      description: '增加5步移动次数',
      icon: '👣',
      price: { type: 'gems', amount: 10 }
    },
    {
      id: 'item6',
      name: '能量+50%',
      description: '立即增加50%能量',
      icon: '⚡',
      price: { type: 'coins', amount: 250 }
    }
  ];

  // 皮肤数据
  const skins: Item[] = [
    {
      id: 'skin1',
      name: '经典主题',
      description: '默认游戏主题',
      icon: '🎮',
      price: { type: 'coins', amount: 0 }
    },
    {
      id: 'skin2',
      name: '太空主题',
      description: '星空背景与行星方块',
      icon: '🚀',
      price: { type: 'gems', amount: 20 }
    },
    {
      id: 'skin3',
      name: '海洋主题',
      description: '海底世界与海洋生物',
      icon: '🐠',
      price: { type: 'gems', amount: 20 }
    },
    {
      id: 'skin4',
      name: '糖果主题',
      description: '缤纷糖果与甜点',
      icon: '🍭',
      price: { type: 'gems', amount: 20 }
    }
  ];

  const handlePurchase = (item: Item) => {
    if (item.price.type === 'coins' && item.price.amount > coins) {
      alert('金币不足！');
      return;
    }
    if (item.price.type === 'gems' && item.price.amount > gems) {
      alert('钻石不足！');
      return;
    }
    
    onPurchase(item);
  };

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
  };

  return (
    <div className="item-shop">
      <div className="shop-header">
        <div className="currency-display">
          <div className="currency">
            <span className="currency-icon">🪙</span>
            <span className="currency-amount">{coins}</span>
          </div>
          <div className="currency">
            <span className="currency-icon">💎</span>
            <span className="currency-amount">{gems}</span>
          </div>
        </div>
        <button className="add-currency-button">充值</button>
      </div>

      <div className="shop-categories">
        <button 
          className={`category-button ${activeCategory === 'items' ? 'active' : ''}`}
          onClick={() => setActiveCategory('items')}
        >
          道具
        </button>
        <button 
          className={`category-button ${activeCategory === 'skins' ? 'active' : ''}`}
          onClick={() => setActiveCategory('skins')}
        >
          皮肤
        </button>
      </div>

      <div className="shop-items">
        {(activeCategory === 'items' ? items : skins).map(item => (
          <div 
            key={item.id} 
            className={`shop-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            <div className="item-icon">{item.icon}</div>
            <div className="item-info">
              <div className="item-name">{item.name}</div>
              <div className="item-price">
                <span className="price-icon">{item.price.type === 'coins' ? '🪙' : '💎'}</span>
                <span className="price-amount">{item.price.amount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="item-details">
          <h3>{selectedItem.name}</h3>
          <p>{selectedItem.description}</p>
          <div className="item-price-large">
            <span className="price-icon-large">{selectedItem.price.type === 'coins' ? '🪙' : '💎'}</span>
            <span className="price-amount-large">{selectedItem.price.amount}</span>
          </div>
          <button 
            className="purchase-button"
            onClick={() => handlePurchase(selectedItem)}
            disabled={(selectedItem.price.type === 'coins' && selectedItem.price.amount > coins) || 
                     (selectedItem.price.type === 'gems' && selectedItem.price.amount > gems)}
          >
            购买
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemShop;
