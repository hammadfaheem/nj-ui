import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden";

  const variants = {
    primary:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md active:shadow-sm dark:bg-red-500 dark:hover:bg-red-600",
    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 shadow-sm hover:shadow-md dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
    outline:
      "border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-red-500 bg-transparent dark:border-red-400 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white hover:shadow-md",
    ghost:
      "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100",
    destructive:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md dark:bg-red-600 dark:hover:bg-red-700",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm gap-1.5 h-8",
    md: "px-4 py-2.5 text-sm gap-2 h-10",
    lg: "px-6 py-3 text-base gap-2 h-12",
    xl: "px-8 py-4 text-lg gap-3 h-14",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      transition={{ duration: 0.15 }}
      className={classes}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled && !isLoading) {
          e.preventDefault();
          e.currentTarget.click();
        }
      }}
      {...props}
    >
      {/* Ripple effect overlay */}
      <motion.div
        className="absolute inset-0 bg-white/20 dark:bg-black/20 opacity-0"
        whileTap={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
      />
      
      {/* Content */}
      <div className="relative flex items-center gap-inherit">
        {isLoading ? (
          <Loader2 className={`${iconSizes[size]} animate-spin`} aria-hidden="true" />
        ) : leftIcon ? (
          <span className={iconSizes[size]} aria-hidden="true">{leftIcon}</span>
        ) : null}
        
        <span className="truncate">{children}</span>
        
        {!isLoading && rightIcon && (
          <span className={iconSizes[size]} aria-hidden="true">{rightIcon}</span>
        )}
      </div>
    </motion.button>
  );
};
