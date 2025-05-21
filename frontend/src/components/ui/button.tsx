import React from "react";
import "../../styles/ui/button.css";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  icon,
  onClick,
  className = "",
}) => {
  return (
    <button
      className={`wx-button ${variant} ${size} ${fullWidth ? "full-width" : ""} ${
        disabled ? "disabled" : ""
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="button-icon">{icon}</span>}
      <span className="button-text">{children}</span>
    </button>
  );
};

export default Button;
