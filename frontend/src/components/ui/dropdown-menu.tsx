import React from 'react';
import { Dropdown, Button, Space } from 'antd-mobile';
import './dropdown-menu.css';

export interface DropdownMenuProps {
  label: string;
  options: { label: string; value: string | number }[];
  value: string | number;
  onChange: (value: string | number) => void;
  className?: string;
  disabled?: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  label,
  options,
  value,
  onChange,
  className = "",
  disabled = false,
}) => {
  // 将选项转换为Ant Design Mobile Dropdown需要的格式
  const dropdownOptions = options.map(option => ({
    key: option.value.toString(),
    text: option.label,
  }));

  // 找到当前选中的选项标签
  const selectedLabel = options.find(option => option.value === value)?.label || label;

  return (
    <div className={`wx-dropdown-container ${className}`}>
      <Dropdown>
        <Dropdown.Item
          key="dropdown-item"
          title={
            <div className="wx-dropdown-label">
              <span>{label}</span>
              <span className="wx-dropdown-selected">{selectedLabel}</span>
            </div>
          }
          disabled={disabled}
        >
          <div className="wx-dropdown-content">
            <Space direction="vertical" block>
              {options.map(option => (
                <Button
                  key={option.value.toString()}
                  fill="none"
                  block
                  className={`wx-dropdown-option ${value === option.value ? 'selected' : ''}`}
                  onClick={() => {
                    onChange(option.value);
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </Space>
          </div>
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
};

export default DropdownMenu;
