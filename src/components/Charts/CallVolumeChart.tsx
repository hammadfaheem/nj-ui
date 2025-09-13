import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { CallsOverTime } from '../../types/api';

interface CallVolumeChartProps {
  data: CallsOverTime[];
}

export const CallVolumeChart: React.FC<CallVolumeChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-700 border border-dark-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{`Date: ${label}`}</p>
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
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="time" 
          stroke="#9CA3AF"
          fontSize={12}
        />
        <YAxis 
          stroke="#9CA3AF"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="total" 
          stroke="#f01f3e" 
          strokeWidth={3}
          dot={{ fill: '#f01f3e', strokeWidth: 2, r: 4 }}
          name="Total Calls"
        />
        <Line 
          type="monotone" 
          dataKey="completed" 
          stroke="#10B981" 
          strokeWidth={2}
          dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
          name="Completed"
        />
        <Line 
          type="monotone" 
          dataKey="failed" 
          stroke="#EF4444" 
          strokeWidth={2}
          dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
          name="Failed"
        />
        <Line 
          type="monotone" 
          dataKey="no_answer" 
          stroke="#F59E0B" 
          strokeWidth={2}
          dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
          name="No Answer"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};