
import React from 'react';

interface WaterWaveProps {
  percentage: number;
}

const WaterWave: React.FC<WaterWaveProps> = ({ percentage }) => {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const fillLevel = 100 - clampedPercentage;

  return (
    <div className="relative w-64 h-64 rounded-full border-8 border-white shadow-2xl overflow-hidden bg-slate-50 group">
      {/* Background container for the wave */}
      <div 
        className="absolute inset-0 transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateY(${fillLevel}%)` }}
      >
        <div className="relative w-[400%] h-full">
          {/* Main Wave Layer 1 */}
          <div className="absolute top-0 left-0 w-full h-24 -mt-12 bg-blue-500/40 wave-animation opacity-70">
            <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-current">
              <path d="M0,50 C150,0 350,100 500,50 C650,0 850,100 1000,50 L1000,100 L0,100 Z" />
            </svg>
          </div>
          {/* Wave Layer 2 */}
          <div className="absolute top-0 left-0 w-full h-24 -mt-12 bg-blue-600 wave-animation opacity-90" style={{ animationDelay: '-5s' }}>
            <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="w-full h-full fill-current">
              <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" />
            </svg>
          </div>
        </div>
        {/* Solid fill below waves */}
        <div className="w-full h-full bg-blue-600" />
      </div>

      {/* Percentage Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 drop-shadow-md">
        <span className={`text-5xl font-black ${percentage > 50 ? 'text-white' : 'text-blue-600'}`}>
          {Math.round(percentage)}%
        </span>
        <span className={`text-sm font-medium uppercase tracking-wider ${percentage > 50 ? 'text-blue-100' : 'text-slate-400'}`}>
          Reached
        </span>
      </div>
    </div>
  );
};

export default WaterWave;
