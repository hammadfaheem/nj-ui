import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { MetricsCostTrend } from "../../types/api";

interface CostTrendsChartProps {
  data: MetricsCostTrend[];
}

export const CostTrendsChart: React.FC<CostTrendsChartProps> = ({ data }) => {
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: any[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-700 border border-dark-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{`Date: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${
                entry.dataKey === "total_cost" ? "Total Cost" : "Avg Cost/Call"
              }: $${entry.value.toFixed(3)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
        <YAxis stroke="#9CA3AF" fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="total_cost"
          stroke="#f01f3e"
          strokeWidth={3}
          dot={{ fill: "#f01f3e", strokeWidth: 2, r: 4 }}
          name="Total Cost"
        />
        <Line
          type="monotone"
          dataKey="avg_cost_per_call"
          stroke="#8B5CF6"
          strokeWidth={2}
          dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 3 }}
          name="Avg Cost per Call"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
