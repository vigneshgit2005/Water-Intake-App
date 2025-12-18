
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
  // Find the maximum value to scale the "Streak Zone" area
  const maxVal = Math.max(...data.map(d => Math.max(d.total, d.goal)), 1000);

  const processedData = data.map((item, index) => {
    const isGoalMet = item.total >= item.goal;
    
    // Logic to determine if this day should show the "streak highlight"
    // We highlight it if it's successful. If the day before or after is also successful, 
    // it will naturally form a continuous shaded area.
    return {
      ...item,
      displayDate: new Date(item.date).toLocaleDateString(undefined, { weekday: 'short' }),
      totalLitres: (item.total / 1000).toFixed(1),
      // The area chart value: if goal met, fill the background up to the max value
      streakArea: isGoalMet ? maxVal * 1.1 : 0,
      isGoalMet,
    };
  });

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-80">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Hydration Trends</h3>
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">
            Streak Highlighted in Blue
          </p>
        </div>
        <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Last 7 Days</span>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={processedData}>
          <defs>
            <linearGradient id="streakGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#dbeafe" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#dbeafe" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="displayDate" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} 
          />
          <YAxis hide domain={[0, maxVal * 1.1]} />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                // Find the data point from the payload (might be Bar or Area)
                const item = payload.find(p => p.dataKey === 'total')?.payload || payload[0].payload;
                return (
                  <div className="bg-slate-800 text-white p-3 rounded-2xl text-xs shadow-2xl border border-slate-700">
                    <p className="font-black mb-1 uppercase tracking-tighter">{item.displayDate} ({item.date})</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.isGoalMet ? 'bg-blue-400' : 'bg-slate-400'}`} />
                      <p className="font-medium">{item.total}ml / {item.goal}ml</p>
                    </div>
                    {item.isGoalMet && (
                      <p className="text-[10px] text-blue-300 font-bold mt-1 uppercase tracking-widest">Goal Achieved! ✨</p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          
          {/* Shaded Area for Streak Representation */}
          <Area 
            type="stepAfter" 
            dataKey="streakArea" 
            stroke="none" 
            fill="url(#streakGradient)" 
            connectNulls={false}
            animationDuration={1500}
            isAnimationActive={true}
          />

          <Bar dataKey="total" radius={[8, 8, 8, 8]} barSize={24}>
            {processedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.total >= entry.goal ? '#2563eb' : '#cbd5e1'} 
                className="transition-all duration-500"
              />
            ))}
          </Bar>

          {/* Average Goal Reference Line */}
          <ReferenceLine 
            y={data[0]?.goal || 2000} 
            stroke="#94a3b8" 
            strokeDasharray="3 3" 
            strokeOpacity={0.3}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryChart;
