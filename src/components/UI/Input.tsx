import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "search" | "password";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      variant = "default",
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseInputClasses =
      "w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:bg-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500";

    const variants = {
      default: "bg-white dark:bg-gray-800",
      search: "bg-gray-50 dark:bg-gray-700/50",
      password: "bg-white dark:bg-gray-800",
    };

    const stateClasses = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500";

    const paddingClasses = `${leftIcon ? "pl-11" : "pl-4"} ${
      rightIcon || error ? "pr-11" : "pr-4"
    }`;

    const inputClasses = `${baseInputClasses} ${variants[variant]} ${stateClasses} ${paddingClasses} ${className}`;

    return (
      <div className="w-full">
        {label && (
          <motion.label
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}

        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <motion.input
            ref={ref}
            id={inputId}
            className={inputClasses}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              [
                error ? `${inputId}-error` : null,
                hint ? `${inputId}-hint` : null,
              ]
                .filter(Boolean)
                .join(" ") || undefined
            }
            aria-required={props.required}
            role="textbox"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.currentTarget.blur();
              }
              props.onKeyDown?.(e);
            }}
            {...props}
          />

          {/* Right Icon or Error Icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {error ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : (
              rightIcon && (
                <div className="text-gray-400 dark:text-gray-500">
                  {rightIcon}
                </div>
              )
            )}
          </div>

          {/* Focus ring effect */}
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-red-500 opacity-0 pointer-events-none"
            whileFocus={{ opacity: 0.1 }}
            transition={{ duration: 0.2 }}
          />
        </div>

        {/* Helper Text */}
        {(error || hint) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2"
          >
            {error ? (
              <p
                id={`${inputId}-error`}
                className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </p>
            ) : (
              hint && (
                <p
                  id={`${inputId}-hint`}
                  className="text-sm text-gray-500 dark:text-gray-400"
                >
                  {hint}
                </p>
              )
            )}
          </motion.div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";