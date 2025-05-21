// 测试验证计划与结果记录

import React, { useState, useEffect } from 'react';
import '../styles/TestValidator.css';

interface TestCase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'pass' | 'fail';
  environment: 'web' | 'miniprogram' | 'both';
  category: 'ui' | 'interaction' | 'performance' | 'compatibility';
  notes?: string;
}

const TestValidator: React.FC = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([
    // UI测试用例
    {
      id: 'ui-001',
      name: '下拉菜单移动端适配',
      description: '验证下拉菜单在移动端的显示效果和触控体验',
      status: 'pending',
      environment: 'web',
      category: 'ui'
    },
    {
      id: 'ui-002',
      name: '按钮触摸反馈',
      description: '验证按钮点击时的视觉反馈和触感反馈',
      status: 'pending',
      environment: 'web',
      category: 'ui'
    },
    {
      id: 'ui-003',
      name: '弹窗动画效果',
      description: '验证弹窗打开和关闭的动画流畅性',
      status: 'pending',
      environment: 'web',
      category: 'ui'
    },
    {
      id: 'ui-004',
      name: '游戏界面响应式布局',
      description: '验证游戏界面在不同屏幕尺寸下的自适应效果',
      status: 'pending',
      environment: 'both',
      category: 'ui'
    },
    
    // 交互测试用例
    {
      id: 'int-001',
      name: '滑动连线基础功能',
      description: '验证滑动连接相同颜色方块的基本功能',
      status: 'pending',
      environment: 'web',
      category: 'interaction'
    },
    {
      id: 'int-002',
      name: '滑动连线视觉反馈',
      description: '验证滑动过程中的路径显示和动画效果',
      status: 'pending',
      environment: 'web',
      category: 'interaction'
    },
    {
      id: 'int-003',
      name: '特殊方块交互',
      description: '验证炸弹、彩虹等特殊方块的交互效果',
      status: 'pending',
      environment: 'web',
      category: 'interaction'
    },
    {
      id: 'int-004',
      name: '误操作处理',
      description: '验证无效滑动的错误提示和恢复机制',
      status: 'pending',
      environment: 'web',
      category: 'interaction'
    },
    
    // 性能测试用例
    {
      id: 'perf-001',
      name: '动画流畅性',
      description: '验证连线、消除等动画的流畅性',
      status: 'pending',
      environment: 'both',
      category: 'performance'
    },
    {
      id: 'perf-002',
      name: '触摸响应速度',
      description: '验证触摸操作的响应延迟',
      status: 'pending',
      environment: 'both',
      category: 'performance'
    },
    
    // 兼容性测试用例
    {
      id: 'comp-001',
      name: '不同浏览器兼容性',
      description: '验证在Chrome、Safari、Firefox等浏览器中的兼容性',
      status: 'pending',
      environment: 'web',
      category: 'compatibility'
    },
    {
      id: 'comp-002',
      name: '不同设备兼容性',
      description: '验证在iOS和Android设备上的兼容性',
      status: 'pending',
      environment: 'both',
      category: 'compatibility'
    }
  ]);
  
  const [activeFilter, setActiveFilter] = useState<'all' | 'web' | 'miniprogram'>('all');
  const [activeCategory, setActiveCategory] = useState<'all' | 'ui' | 'interaction' | 'performance' | 'compatibility'>('all');
  
  // 更新测试用例状态
  const updateTestStatus = (id: string, status: 'pending' | 'pass' | 'fail', notes?: string) => {
    setTestCases(prevCases => 
      prevCases.map(test => 
        test.id === id ? { ...test, status, notes: notes || test.notes } : test
      )
    );
  };
  
  // 过滤测试用例
  const filteredTests = testCases.filter(test => {
    const environmentMatch = activeFilter === 'all' || 
                            test.environment === activeFilter || 
                            test.environment === 'both';
    
    const categoryMatch = activeCategory === 'all' || 
                         test.category === activeCategory;
    
    return environmentMatch && categoryMatch;
  });
  
  // 计算测试统计
  const stats = {
    total: filteredTests.length,
    passed: filteredTests.filter(t => t.status === 'pass').length,
    failed: filteredTests.filter(t => t.status === 'fail').length,
    pending: filteredTests.filter(t => t.status === 'pending').length
  };
  
  return (
    <div className="test-validator">
      <h1>功能验证测试</h1>
      
      <div className="test-filters">
        <div className="filter-group">
          <h3>环境</h3>
          <div className="filter-buttons">
            <button 
              className={activeFilter === 'all' ? 'active' : ''} 
              onClick={() => setActiveFilter('all')}
            >
              全部
            </button>
            <button 
              className={activeFilter === 'web' ? 'active' : ''} 
              onClick={() => setActiveFilter('web')}
            >
              Web端
            </button>
            <button 
              className={activeFilter === 'miniprogram' ? 'active' : ''} 
              onClick={() => setActiveFilter('miniprogram')}
            >
              小程序端
            </button>
          </div>
        </div>
        
        <div className="filter-group">
          <h3>类别</h3>
          <div className="filter-buttons">
            <button 
              className={activeCategory === 'all' ? 'active' : ''} 
              onClick={() => setActiveCategory('all')}
            >
              全部
            </button>
            <button 
              className={activeCategory === 'ui' ? 'active' : ''} 
              onClick={() => setActiveCategory('ui')}
            >
              UI
            </button>
            <button 
              className={activeCategory === 'interaction' ? 'active' : ''} 
              onClick={() => setActiveCategory('interaction')}
            >
              交互
            </button>
            <button 
              className={activeCategory === 'performance' ? 'active' : ''} 
              onClick={() => setActiveCategory('performance')}
            >
              性能
            </button>
            <button 
              className={activeCategory === 'compatibility' ? 'active' : ''} 
              onClick={() => setActiveCategory('compatibility')}
            >
              兼容性
            </button>
          </div>
        </div>
      </div>
      
      <div className="test-stats">
        <div className="stat-item">
          <span className="stat-label">总计</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-item passed">
          <span className="stat-label">通过</span>
          <span className="stat-value">{stats.passed}</span>
        </div>
        <div className="stat-item failed">
          <span className="stat-label">失败</span>
          <span className="stat-value">{stats.failed}</span>
        </div>
        <div className="stat-item pending">
          <span className="stat-label">待测</span>
          <span className="stat-value">{stats.pending}</span>
        </div>
      </div>
      
      <div className="test-cases">
        {filteredTests.map(test => (
          <div key={test.id} className={`test-case ${test.status}`}>
            <div className="test-header">
              <div className="test-info">
                <h3>{test.name}</h3>
                <div className="test-meta">
                  <span className="test-id">{test.id}</span>
                  <span className={`test-env ${test.environment}`}>
                    {test.environment === 'web' ? 'Web端' : 
                     test.environment === 'miniprogram' ? '小程序端' : '全平台'}
                  </span>
                  <span className={`test-category ${test.category}`}>
                    {test.category === 'ui' ? 'UI' : 
                     test.category === 'interaction' ? '交互' : 
                     test.category === 'performance' ? '性能' : '兼容性'}
                  </span>
                </div>
              </div>
              <div className="test-status">
                <span className={`status-badge ${test.status}`}>
                  {test.status === 'pending' ? '待测' : 
                   test.status === 'pass' ? '通过' : '失败'}
                </span>
              </div>
            </div>
            
            <div className="test-body">
              <p className="test-description">{test.description}</p>
              
              {test.notes && (
                <div className="test-notes">
                  <h4>测试记录</h4>
                  <p>{test.notes}</p>
                </div>
              )}
              
              <div className="test-actions">
                <button 
                  className="pass-button"
                  onClick={() => updateTestStatus(test.id, 'pass')}
                  disabled={test.status === 'pass'}
                >
                  通过
                </button>
                <button 
                  className="fail-button"
                  onClick={() => {
                    const notes = prompt('请输入失败原因：');
                    if (notes) updateTestStatus(test.id, 'fail', notes);
                  }}
                  disabled={test.status === 'fail'}
                >
                  失败
                </button>
                <button 
                  className="reset-button"
                  onClick={() => updateTestStatus(test.id, 'pending')}
                  disabled={test.status === 'pending'}
                >
                  重置
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="test-export">
        <button 
          onClick={() => {
            const report = {
              timestamp: new Date().toISOString(),
              summary: stats,
              testCases: testCases
            };
            
            const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `test-report-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
        >
          导出测试报告
        </button>
      </div>
    </div>
  );
};

export default TestValidator;
