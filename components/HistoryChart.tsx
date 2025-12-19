
import React from 'react';
import { 
  ComposedChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  Area, 
  ReferenceLine 
} from 'recharts';
import { DailySummary } from '../types';

interface HistoryChartProps {
  data: DailySummary[];
}

const HistoryChart: React.FC<HistoryChartProps> = ({ data }) => {
  const maxVal = Math.max(...data.map(d => Math.max(d.total, d.goal)), 1000);

  const processedData = data.map((item) => {
    const isGoalMet = item.total >= item.goal;
    return {
      ...item,
      displayDate: new Date(item.date).toLocaleDateString(undefined, { weekday: 'short' }),
      streakArea: isGoalMet ? maxVal * 1.1 : 0,
      isGoalMet,
    };
  });

  return (
    <div className="bg-[#070f2b] rounded-[2.5rem] p-8 shadow-2xl border border-sky-900/30 h-80 relative overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-white italic tracking-tighter">Atmospheric Trends</h3>
          <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest mt-1">
            Goal Completion Highlights
          </p>
        </div>
        <div className="px-4 py-1.5 bg-sky-900/40 rounded-full border border-sky-800 text-[10px] font-black text-sky-400 uppercase tracking-widest">
          7D Forecast
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={processedData}>
          <defs>
            <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="displayDate" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#0c4a6e', fontSize: 10, fontWeight: 900 }} 
          />
          <YAxis hide domain={[0, maxVal * 1.1]} />
          <Tooltip 
            cursor={{ fill: 'rgba(14, 165, 233, 0.05)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload.find(p => p.dataKey === 'total')?.payload || payload[0].payload;
                return (
                  <div className="bg-sky-950/90 backdrop-blur-xl text-white p-4 rounded-3xl text-xs shadow-2xl border border-sky-400/20">
                    <p className="font-black mb-1 uppercase tracking-widest text-sky-400">{item.displayDate}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className={`w-3 h-3 rounded-full ${item.isGoalMet ? 'bg-sky-300 shadow-[0_0_10px_#7dd3fc]' : 'bg-sky-900'}`} />
                      <p className="font-black text-sm">{item.total}ml <span className="text-sky-700">/ {item.goal}ml</span></p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          
          <Area 
            type="monotone" 
            dataKey="streakArea" 
            stroke="none" 
            fill="url(#skyGradient)" 
            connectNulls={false}
            animationDuration={1500}
            isAnimationActive={true}
          />

          <Bar dataKey="total" radius={[6, 6, 6, 6]} barSize={28}>
            {processedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.total >= entry.goal ? '#0ea5e9' : '#0c4a6e'} 
                className="transition-all duration-700"
              />
            ))}
          </Bar>

          <ReferenceLine 
            y={data[0]?.goal || 2000} 
            stroke="#0369a1" 
            strokeDasharray="4 4" 
            strokeOpacity={0.4}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryChart;
