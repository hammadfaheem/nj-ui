import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { PerformanceQuadrant } from '../../types/api';

interface PerformanceScatterProps {
  data: PerformanceQuadrant[];
}

export const PerformanceScatter: React.FC<PerformanceScatterProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-dark-700 border border-dark-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{data.sip_domain}</p>
          <p className="text-sm text-gray-300">Success Rate: {data.success_rate}%</p>
          <p className="text-sm text-gray-300">Cost Efficiency: {data.cost_efficiency}</p>
          <p className="text-sm text-gray-300">Total Calls: {data.total_calls}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          type="number" 
          dataKey="success_rate" 
          name="Success Rate"
          stroke="#9CA3AF"
          fontSize={12}
        />
        <YAxis 
          type="number" 
          dataKey="cost_efficiency" 
          name="Cost Efficiency"
          stroke="#9CA3AF"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Scatter 
          name="SIP Domains" 
          data={data} 
          fill="#f01f3e"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};