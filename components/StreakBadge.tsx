
import React from 'react';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  count: number;
  size?: 'sm' | 'lg';
}

const StreakBadge: React.FC<StreakBadgeProps> = ({ count, size = 'sm' }) => {
  if (count === 0 && size === 'sm') return null;

  const isLarge = size === 'lg';

  return (
    <div className={`flex items-center gap-1.5 rounded-full transition-all duration-500 animate-in fade-in slide-in-from-top-2 ${
      isLarge 
        ? 'px-6 py-3 bg-orange-50 text-orange-600 border border-orange-100' 
        : 'px-3 py-1 bg-orange-500 text-white shadow-lg shadow-orange-200'
    }`}>
      <Flame className={`${isLarge ? 'w-8 h-8' : 'w-4 h-4'} ${count > 0 ? 'fill-current animate-pulse' : ''}`} />
      <div className="flex flex-col leading-none">
        <span className={`${isLarge ? 'text-3xl font-black' : 'text-sm font-bold'}`}>
          {count}
        </span>
        {isLarge && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 mt-1">
            Day Streak
          </span>
        )}
      </div>
    </div>
  );
};

export default StreakBadge;
