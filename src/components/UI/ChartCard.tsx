import React from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  loading = false,
  error = null,
  className = "",
}) => {
  if (loading) {
    return (
      <div
        className={`bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700 ${className}`}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 dark:bg-dark-700 rounded w-48 animate-pulse"></div>
            {subtitle && (
              <div className="h-4 bg-gray-200 dark:bg-dark-700 rounded w-32 animate-pulse"></div>
            )}
          </div>
          <div className="h-64 bg-gray-200 dark:bg-dark-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700 ${className}`}
      >
        <div className="space-y-4">
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
          <div className="flex items-center justify-center h-64 text-red-500 dark:text-red-400">
            <div className="text-center">
              <p className="text-sm">Failed to load chart data</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700 hover:border-gray-300 dark:hover:border-dark-600 transition-all duration-200 animate-fade-in ${className}`}
    >
      <div className="space-y-4">
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
        <div className="h-64">{children}</div>
      </div>
    </div>
  );
};
