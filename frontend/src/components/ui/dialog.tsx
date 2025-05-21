import React, { useState, useRef } from "react";
import "../../styles/ui/dialog.css";
import Button from "./button";

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
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // 处理关闭动画
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 200);
  };

  // 处理点击背景关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  if (!isOpen && !closing) return null;

  return (
    <div 
      className={`wx-dialog-backdrop ${closing ? "closing" : ""}`}
      onClick={handleBackdropClick}
    >
      <div 
        ref={dialogRef}
        className={`wx-dialog ${closing ? "closing" : ""} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="wx-dialog-header">
          <h3 className="wx-dialog-title">{title}</h3>
          <button className="wx-dialog-close" onClick={handleClose}>
            ×
          </button>
        </div>
        
        <div className="wx-dialog-content">
          {children}
        </div>
        
        {actions && (
          <div className="wx-dialog-actions">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dialog;
