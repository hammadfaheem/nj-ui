import React from "react";
import { motion } from "framer-motion";
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  loading?: boolean;
  trend?: number[];
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  loading = false,
  trend,
  description,
}) => {
  const changeColors = {
    positive: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
    negative: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
    neutral: "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20",
  };

  const changeIcons = {
    positive: TrendingUp,
    negative: TrendingDown,
    neutral: Minus,
  };

  const ChangeIcon = changeIcons[changeType];

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-3 flex-1">
            <div className="skeleton h-4 rounded w-24"></div>
            <div className="skeleton h-8 rounded w-20"></div>
            <div className="skeleton h-3 rounded w-28"></div>
          </div>
          <div className="skeleton h-12 w-12 rounded-lg"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            {description && (
              <div className="group/tooltip relative">
                <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 cursor-help">
                  ?
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                  {description}
                </div>
              </div>
            )}
          </div>
          
          <div className="mb-3">
            <motion.p 
              className="text-3xl font-bold text-gray-900 dark:text-white"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {value}
            </motion.p>
          </div>

          {change && (
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${changeColors[changeType]}`}>
              <ChangeIcon className="w-3 h-3" />
              <span>{change}</span>
            </div>
          )}
        </div>
        
        <motion.div 
          className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg group-hover:shadow-red-500/25 transition-all duration-200"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="h-6 w-6 text-white" />
        </motion.div>
      </div>

      {/* Mini trend line */}
      {trend && trend.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Trend (7 days)</span>
            <div className="flex items-center gap-1 h-8">
              {trend.map((point, index) => (
                <motion.div
                  key={index}
                  className="w-1 bg-red-200 dark:bg-red-800 rounded-full"
                  style={{ height: `${(point / Math.max(...trend)) * 100}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(point / Math.max(...trend)) * 100}%` }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
