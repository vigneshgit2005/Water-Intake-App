
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { DailySummary } from '../types';

interface HistoryChartProps {
  data: DailySummary[];
}

const HistoryChart: React.FC<HistoryChartProps> = ({ data }) => {
  const processedData = data.map(item => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString(undefined, { weekday: 'short' }),
    totalLitres: (item.total / 1000).toFixed(1),
  }));

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-80">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800">Hydration Trends</h3>
        <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Last 7 Days</span>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={processedData}>
          <XAxis 
            dataKey="displayDate" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
          />
          <YAxis hide />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-slate-800 text-white p-2 rounded-lg text-xs shadow-xl">
                    <p className="font-bold">{item.displayDate}</p>
                    <p>{item.total}ml / {item.goal}ml</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="total" radius={[8, 8, 0, 0]}>
            {processedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.total >= entry.goal ? '#2563eb' : '#93c5fd'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryChart;
