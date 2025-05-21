import React, { useState, useRef, useEffect } from "react";
import "../../styles/ui/dropdown-menu.css";

interface DropdownMenuProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  label,
  options,
  value,
  onChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 获取当前选中选项的标签
  const selectedLabel = options.find(option => option.value === value)?.label || "";

  // 处理点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // 处理选项选择
  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`wx-dropdown-container ${className}`} ref={dropdownRef}>
      {label && <div className="wx-dropdown-label">{label}</div>}
      
      <div 
        className={`wx-dropdown-selector ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="wx-dropdown-selected">{selectedLabel}</span>
        <span className={`wx-dropdown-arrow ${isOpen ? "up" : "down"}`}>
          {isOpen ? "▲" : "▼"}
        </span>
      </div>
      
      {isOpen && (
        <div className="wx-dropdown-options">
          {options.map((option) => (
            <div
              key={option.value}
              className={`wx-dropdown-option ${option.value === value ? "selected" : ""}`}
              onClick={() => handleOptionSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
