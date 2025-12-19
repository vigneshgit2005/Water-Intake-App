
import React, { useEffect, useState, useRef } from 'react';

export default function WaterWave({ percentage }: { percentage: number }) {
  const clamped = Math.min(100, Math.max(0, percentage));
  const fillLevel = 100 - clamped;
  const isFull = clamped >= 100;
  const [ripples, setRipples] = useState<{ id: number }[]>([]);
  const [isSurging, setIsSurging] = useState(false);
  const prevRef = useRef(clamped);

  useEffect(() => {
    if (clamped > prevRef.current) {
      setIsSurging(true);
      setTimeout(() => setIsSurging(false), 800);
    }
    prevRef.current = clamped;
  }, [clamped]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRipples(p => [...p.slice(-4), { id: Date.now() }]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <div className={`absolute -inset-10 rounded-full opacity-10 blur-[80px] transition-all duration-1000 ${isSurging ? 'scale-150 opacity-30 bg-sky-300' : 'bg-sky-500'}`} />
      <div className={`relative w-72 h-72 rounded-full border-[6px] border-sky-900/40 bg-slate-950 overflow-hidden shadow-[0_0_80px_rgba(14,165,233,0.3)] transition-transform duration-700 ${isSurging ? 'scale-105' : ''}`}>
        <div className="absolute inset-0 bg-[#070f2b]" />
        
        {/* Sky Reflections */}
        <div className="absolute inset-0 opacity-20 pointer-events-none z-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white blur-3xl rounded-full animate-pulse" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-sky-400 blur-3xl rounded-full" />
        </div>

        <div className="absolute inset-0 transition-transform duration-1000 ease-in-out" style={{ transform: `translateY(${fillLevel}%)` }}>
          {/* Surface Line */}
          <div className={`absolute top-0 left-0 w-full z-20 transition-all ${isSurging ? 'h-4 bg-white shadow-[0_0_40px_white]' : 'h-[3px] bg-sky-200 shadow-[0_0_20px_#bae6fd]'}`}>
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
          </div>
          
          {/* Liquid Body */}
          <div className={`w-full h-full transition-colors relative overflow-hidden ${isSurging ? 'bg-sky-400' : 'bg-gradient-to-b from-sky-400 via-sky-600 to-sky-950'}`}>
            {/* Inner highlights */}
            <div className="absolute inset-0 bg-white/5 animate-pulse" />
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {ripples.map(r => <div key={r.id} className="absolute border border-sky-200/20 rounded-full animate-ripple w-4 h-4" />)}
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
          <span className={`text-7xl font-black transition-colors duration-1000 ${clamped > 50 ? 'text-white drop-shadow-lg' : 'text-sky-400'}`}>
            {Math.round(clamped)}%
          </span>
          <span className={`text-[10px] font-black uppercase tracking-[0.5em] mt-2 ${clamped > 50 ? 'text-sky-100/60' : 'text-sky-600/80'}`}>
            {isFull ? 'Sky Bound' : 'Cloud Level'}
          </span>
        </div>
      </div>
      <style>{`
        @keyframes ripple { 0% { transform: scale(0); opacity: 0.8; } 100% { transform: scale(45); opacity: 0; } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-ripple { animation: ripple 6s cubic-bezier(0, 0, 0.2, 1) forwards; }
        .animate-shimmer { animation: shimmer 2s linear infinite; }
      `}</style>
    </div>
  );
}
