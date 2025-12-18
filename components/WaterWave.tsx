
import React, { useMemo, useEffect, useState, useRef } from 'react';

interface WaterWaveProps {
  percentage: number;
}

const WaterWave: React.FC<WaterWaveProps> = ({ percentage }) => {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const fillLevel = 100 - clampedPercentage;
  const isFull = clampedPercentage >= 100;
  
  const [ripples, setRipples] = useState<{ id: number; scale: number; opacity: number }[]>([]);
  const [isSurging, setIsSurging] = useState(false);
  const prevPercentageRef = useRef(clampedPercentage);

  // Trigger surge animation on increase
  useEffect(() => {
    if (clampedPercentage > prevPercentageRef.current) {
      setIsSurging(true);
      const timer = setTimeout(() => setIsSurging(false), 1000);
      return () => clearTimeout(timer);
    }
    prevPercentageRef.current = clampedPercentage;
  }, [clampedPercentage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRipples(prev => [
        ...prev.slice(-5),
        { id: Date.now(), scale: 0, opacity: 0.8 }
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const haoriPattern = "conic-gradient(from 0deg at 50% 50%, #7c2d12 0deg 90deg, #f59e0b 90deg 180deg, #15803d 180deg 270deg, #1e3a8a 270deg 360deg)";

  return (
    <div className="relative group">
      {/* Outer Haori Pattern Ring */}
      <div className={`absolute -inset-4 rounded-full opacity-20 blur-xl transition-all duration-1000 ${isSurging ? 'scale-125 opacity-40' : 'animate-pulse'}`} 
           style={{ background: haoriPattern }} />
      
      <div className={`relative w-72 h-72 rounded-full border-4 border-slate-800 shadow-[0_0_50px_rgba(30,58,138,0.3)] overflow-hidden bg-slate-950 transition-all duration-700 ${isFull ? 'ring-2 ring-blue-400' : ''} ${isSurging ? 'scale-105 shadow-[0_0_80px_rgba(34,211,238,0.5)]' : ''}`}>
        
        {/* Still Water Background */}
        <div className="absolute inset-0 bg-[#020617]" />

        {/* The Water Level (Dead Calm Surface) */}
        <div 
          className="absolute inset-0 transition-transform duration-1000 cubic-bezier(0.16, 1, 0.3, 1)"
          style={{ transform: `translateY(${fillLevel}%)` }}
        >
          {/* Surface Glow Line */}
          <div className={`absolute top-0 left-0 w-full transition-all duration-500 ${isSurging ? 'h-[10px] bg-white shadow-[0_0_30px_#fff]' : 'h-[2px] bg-cyan-400 shadow-[0_0_15px_#22d3ee]'} z-20`} />
          
          {/* Deep Water Gradient */}
          <div className={`w-full h-full transition-colors duration-500 ${isSurging ? 'bg-cyan-600' : 'bg-gradient-to-b from-[#1e3a8a] via-[#172554] to-[#020617]'}`} />
        </div>

        {/* Concentric Ripples */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {ripples.map((ripple) => (
            <div
              key={ripple.id}
              className="absolute border border-cyan-400/30 rounded-full animate-ripple"
              style={{ width: '10px', height: '10px' }}
            />
          ))}
          {isSurging && (
             <div className="absolute inset-0 border-[20px] border-white/20 rounded-full animate-ping opacity-0" />
          )}
        </div>

        {/* Floating Petals */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-float-petal"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${4 + i}s`
              }}
            />
          ))}
        </div>

        {/* Center Text UI */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
          <div className="relative">
            {isFull && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-cyan-400/20 text-4xl font-serif select-none animate-bounce">
                凪
              </div>
            )}
            <span className={`text-7xl font-black tracking-tighter transition-all duration-700 ${clampedPercentage > 50 ? 'text-white' : 'text-blue-500'} ${isFull || isSurging ? 'drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]' : ''}`}>
              {Math.round(clampedPercentage)}<span className="text-3xl opacity-60">%</span>
            </span>
          </div>
          <div className={`text-[10px] font-black uppercase tracking-[0.4em] mt-2 transition-all duration-500 ${clampedPercentage > 50 ? 'text-cyan-200' : 'text-slate-500'} ${isSurging ? 'scale-125 text-white' : ''}`}>
            {isSurging ? 'Water Breathing' : isFull ? 'Dead Calm' : 'Form XI'}
          </div>
        </div>

        {/* Edge Vignette */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_60px_rgba(0,0,0,0.8)] pointer-events-none" />
      </div>

      <style>{`
        @keyframes ripple {
          0% { transform: scale(0); opacity: 0.8; }
          100% { transform: scale(30); opacity: 0; }
        }
        .animate-ripple {
          animation: ripple 6s cubic-bezier(0, 0, 0.2, 1) forwards;
        }
        @keyframes float-petal {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translate(40px, 100px) rotate(360deg); opacity: 0; }
        }
        .animate-float-petal {
          animation: float-petal linear infinite;
        }
      `}</style>
    </div>
  );
};

export default WaterWave;
