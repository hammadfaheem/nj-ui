import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, MoreHorizontal } from "lucide-react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  className?: string;
  actions?: React.ReactNode;
  height?: "sm" | "md" | "lg" | "xl";
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  loading = false,
  error = null,
  className = "",
  actions,
  height = "md",
}) => {
  const heightClasses = {
    sm: "h-48",
    md: "h-64",
    lg: "h-80",
    xl: "h-96",
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 ${className}`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <div className="skeleton h-6 rounded w-48"></div>
              {subtitle && <div className="skeleton h-4 rounded w-32"></div>}
            </div>
            <div className="skeleton h-8 w-8 rounded"></div>
          </div>
          <div className={`${heightClasses[height]} skeleton rounded-lg`}></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-red-200 dark:border-red-800 ${className}`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            {actions}
          </div>
          <div className={`flex items-center justify-center ${heightClasses[height]} bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800`}>
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-red-700 dark:text-red-300">
                Failed to load chart data
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1 max-w-sm">
                {error}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 transition-colors"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-3 h-3" />
                Retry
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg transition-all duration-200 ${className}`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {actions || (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Chart options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </motion.button>
          )}
        </div>
        <motion.div 
          className={heightClasses[height]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
};
