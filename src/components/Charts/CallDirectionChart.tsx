import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { CallDirectionAnalysis } from '../../types/api';

interface CallDirectionChartProps {
  data: CallDirectionAnalysis[];
}

export const CallDirectionChart: React.FC<CallDirectionChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-700 border border-dark-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{`Direction: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="direction" 
          stroke="#9CA3AF"
          fontSize={12}
        />
        <YAxis 
          stroke="#9CA3AF"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar 
          dataKey="total_calls" 
          fill="#f01f3e" 
          name="Total Calls"
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          dataKey="completed_calls" 
          fill="#10B981" 
          name="Completed"
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          dataKey="failed_calls" 
          fill="#EF4444" 
          name="Failed"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};