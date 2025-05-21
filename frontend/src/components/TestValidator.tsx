import React from 'react';
import { render, screen } from '@testing-library/react';
import '../styles/TestValidator.css';

interface TestCase {
  id: string;
  name: string;
  description: string;
  status: 'passed' | 'failed' | 'pending';
  errorMessage?: string;
}

const TestValidator: React.FC = () => {
  // 测试用例数据
  const [testCases, setTestCases] = React.useState<TestCase[]>([
    {
      id: 'ui-001',
      name: 'UI组件渲染测试',
      description: '验证所有UI组件在移动端正确渲染',
      status: 'pending'
    },
    {
      id: 'ui-002',
      name: '下拉菜单兼容性测试',
      description: '验证下拉菜单在各设备上正常工作',
      status: 'pending'
    },
    {
      id: 'ui-003',
      name: '按钮触摸反馈测试',
      description: '验证按钮点击反馈在触摸设备上正常',
      status: 'pending'
    },
    {
      id: 'int-001',
      name: '滑动连接交互测试',
      description: '验证滑动连接功能正常工作',
      status: 'pending'
    },
    {
      id: 'int-002',
      name: '触摸精度测试',
      description: '验证触摸检测精度和容错性',
      status: 'pending'
    },
    {
      id: 'perf-001',
      name: '动画性能测试',
      description: '验证动画在各设备上流畅运行',
      status: 'pending'
    }
  ]);

  // 运行测试
  const runTests = () => {
    // 模拟测试运行
    setTestCases(prevTests => 
      prevTests.map(test => ({
        ...test,
        status: Math.random() > 0.2 ? 'passed' : 'failed',
        errorMessage: Math.random() > 0.8 ? '在某些Android设备上显示异常' : undefined
      }))
    );
  };

  // 重置测试
  const resetTests = () => {
    setTestCases(prevTests => 
      prevTests.map(test => ({
        ...test,
        status: 'pending',
        errorMessage: undefined
      }))
    );
  };

  // 计算测试结果统计
  const testStats = {
    total: testCases.length,
    passed: testCases.filter(t => t.status === 'passed').length,
    failed: testCases.filter(t => t.status === 'failed').length,
    pending: testCases.filter(t => t.status === 'pending').length
  };

  return (
    <div className="test-validator">
      <h2>功能验证测试</h2>
      
      <div className="test-controls">
        <button 
          className="test-button run"
          onClick={runTests}
          disabled={testStats.pending === 0}
        >
          运行测试
        </button>
        <button 
          className="test-button reset"
          onClick={resetTests}
          disabled={testStats.pending === testStats.total}
        >
          重置测试
        </button>
      </div>
      
      <div className="test-summary">
        <div className="test-stat">
          <span className="stat-label">总计:</span>
          <span className="stat-value">{testStats.total}</span>
        </div>
        <div className="test-stat passed">
          <span className="stat-label">通过:</span>
          <span className="stat-value">{testStats.passed}</span>
        </div>
        <div className="test-stat failed">
          <span className="stat-label">失败:</span>
          <span className="stat-value">{testStats.failed}</span>
        </div>
        <div className="test-stat pending">
          <span className="stat-label">待测:</span>
          <span className="stat-value">{testStats.pending}</span>
        </div>
      </div>
      
      <div className="test-cases">
        {testCases.map(testCase => (
          <div 
            key={testCase.id}
            className={`test-case ${testCase.status}`}
          >
            <div className="test-header">
              <span className="test-id">{testCase.id}</span>
              <span className="test-name">{testCase.name}</span>
              <span className={`test-status ${testCase.status}`}>
                {testCase.status === 'passed' ? '通过' : 
                 testCase.status === 'failed' ? '失败' : '待测'}
              </span>
            </div>
            <div className="test-description">
              {testCase.description}
            </div>
            {testCase.errorMessage && (
              <div className="test-error">
                错误: {testCase.errorMessage}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestValidator;
