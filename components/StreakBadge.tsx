
import React from 'react';
import { Cloud, Sparkles } from 'lucide-react';

interface StreakBadgeProps {
  count: number;
  size?: 'sm' | 'lg';
}

const StreakBadge: React.FC<StreakBadgeProps> = ({ count, size = 'sm' }) => {
  if (count === 0 && size === 'sm') return null;

  const isLarge = size === 'lg';

  return (
    <div className={`flex items-center gap-2 rounded-2xl transition-all duration-500 animate-in fade-in slide-in-from-top-2 ${
      isLarge 
        ? 'px-8 py-4 bg-sky-900/10 text-sky-300 border border-sky-400/20 backdrop-blur-md' 
        : 'px-4 py-1.5 bg-sky-500 text-white shadow-lg shadow-sky-500/20'
    }`}>
      <Sparkles className={`${isLarge ? 'w-10 h-10' : 'w-4 h-4'} ${count > 0 ? 'fill-white animate-pulse' : ''}`} />
      <div className="flex flex-col leading-none">
        <span className={`${isLarge ? 'text-4xl font-black italic' : 'text-sm font-black italic'}`}>
          {count}
        </span>
        {isLarge && (
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-600 mt-2">
            Horizon Days
          </span>
        )}
      </div>
    </div>
  );
};

export default StreakBadge;
