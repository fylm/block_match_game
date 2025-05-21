import React from 'react';
import { Button as AntButton } from 'antd-mobile';
import './button.css';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  block = false,
  className = '',
  onClick,
  type = 'button',
}) => {
  // 映射variant到Ant Design Mobile的color属性
  const colorMap = {
    primary: 'primary',
    secondary: 'default',
    outline: 'default',
    text: 'default',
  };
  
  // 映射variant到Ant Design Mobile的fill属性
  const fillMap = {
    primary: 'solid',
    secondary: 'solid',
    outline: 'outline',
    text: 'none',
  };
  
  // 映射size到Ant Design Mobile的size属性
  const sizeMap = {
    small: 'mini',
    medium: 'small',
    large: 'middle',
  };
  
  return (
    <AntButton
      color={colorMap[variant]}
      fill={fillMap[variant]}
      size={sizeMap[size]}
      disabled={disabled}
      loading={loading}
      block={block}
      onClick={onClick}
      type={type}
      className={`wx-button wx-button-${variant} wx-button-${size} ${className}`}
    >
      {children}
    </AntButton>
  );
};

export default Button;
