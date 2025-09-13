import React from "react";
import type { CorrelationMatrix } from "../../types/api";

interface CorrelationHeatmapProps {
  data: CorrelationMatrix;
}

export const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({
  data,
}) => {
  const keys = Object.keys(data);

  const getColor = (value: number) => {
    const intensity = Math.abs(value);
    if (value > 0) {
      return `rgba(16, 185, 129, ${intensity})`;
    } else {
      return `rgba(239, 68, 68, ${intensity})`;
    }
  };

  const formatLabel = (key: string) => {
    return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      {/* Correlation Matrix Grid */}
      <div className="flex flex-col items-center space-y-2 mb-4">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${keys.length}, minmax(0, 1fr))`,
            maxWidth: "100%",
          }}
        >
          {keys.map((rowKey) =>
            keys.map((colKey) => {
              const value = data[rowKey][colKey];
              return (
                <div
                  key={`${rowKey}-${colKey}`}
                  className="w-12 h-12 flex items-center justify-center text-xs font-medium text-white rounded border border-dark-600"
                  style={{ backgroundColor: getColor(value) }}
                  title={`${formatLabel(rowKey)} vs ${formatLabel(
                    colKey
                  )}: ${value.toFixed(2)}`}
                >
                  {value.toFixed(2)}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="w-full max-w-sm">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 text-center">
          Variables
        </h4>
        <div className="grid grid-cols-1 gap-1 text-xs">
          {keys.map((key, index) => (
            <div
              key={key}
              className="flex items-center justify-between p-2 bg-gray-100 dark:bg-dark-700 rounded border border-gray-200 dark:border-dark-600"
            >
              <span className="text-gray-700 dark:text-gray-300">
                {index + 1}.
              </span>
              <span className="text-gray-700 dark:text-gray-300 capitalize flex-1 ml-2">
                {formatLabel(key)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Color Scale Legend */}
      <div className="mt-4 w-full max-w-sm">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 text-center">
          Correlation Scale
        </h4>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>-1.0</span>
          <div
            className="flex-1 mx-2 h-4 rounded bg-gray-200 dark:bg-dark-700"
            style={{
              background:
                "linear-gradient(to right, rgba(239, 68, 68, 1), rgba(239, 68, 68, 0.5), rgba(255, 255, 255, 0.1), rgba(16, 185, 129, 0.5), rgba(16, 185, 129, 1))",
            }}
          ></div>
          <span>+1.0</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>Negative</span>
          <span>Positive</span>
        </div>
      </div>
    </div>
  );
};
