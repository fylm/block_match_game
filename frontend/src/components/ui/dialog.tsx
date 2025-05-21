import React from 'react';
import { Dialog as AntDialog } from 'antd-mobile';
import './dialog.css';
import Button from './button';

interface DialogProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  actions?: React.ReactNode;
  className?: string;
}

const Dialog: React.FC<DialogProps> = ({
  title,
  children,
  isOpen,
  onClose,
  actions,
  className = "",
}) => {
  // 使用Ant Design Mobile的Dialog组件
  return (
    <>
      {isOpen && (
        <AntDialog
          visible={isOpen}
          title={title}
          content={
            <div className="wx-dialog-content">
              {children}
            </div>
          }
          closeOnAction
          onClose={onClose}
          actions={
            actions || [
              {
                key: 'close',
                text: '关闭',
                onClick: onClose
              }
            ]
          }
          className={`wx-dialog ${className}`}
        />
      )}
    </>
  );
};

// 创建一个对话框的静态方法，用于快速显示确认对话框
Dialog.confirm = (props: {
  title: string;
  content: React.ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}) => {
  return AntDialog.confirm({
    title: props.title,
    content: props.content,
    confirmText: props.confirmText || '确认',
    cancelText: props.cancelText || '取消',
    onConfirm: props.onConfirm,
    onCancel: props.onCancel,
    className: 'wx-dialog-confirm'
  });
};

// 创建一个对话框的静态方法，用于快速显示警告对话框
Dialog.alert = (props: {
  title: string;
  content: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
}) => {
  return AntDialog.alert({
    title: props.title,
    content: props.content,
    confirmText: props.confirmText || '确定',
    onConfirm: props.onConfirm,
    className: 'wx-dialog-alert'
  });
};

export default Dialog;
