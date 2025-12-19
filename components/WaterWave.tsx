
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
      <div className={`absolute -inset-6 rounded-full opacity-20 blur-2xl transition-all duration-1000 ${isSurging ? 'scale-125 opacity-40 bg-blue-400' : 'bg-blue-600'}`} />
      <div className={`relative w-72 h-72 rounded-full border-4 border-slate-800 bg-slate-950 overflow-hidden shadow-[0_0_60px_rgba(30,58,138,0.4)] transition-transform duration-700 ${isSurging ? 'scale-105' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] to-[#0f172a]" />
        <div className="absolute inset-0 transition-transform duration-1000" style={{ transform: `translateY(${fillLevel}%)` }}>
          <div className={`absolute top-0 left-0 w-full z-20 transition-all ${isSurging ? 'h-3 bg-white shadow-[0_0_30px_white]' : 'h-[2px] bg-blue-400 shadow-[0_0_15px_blue]'}`} />
          <div className={`w-full h-full transition-colors ${isSurging ? 'bg-blue-700' : 'bg-gradient-to-b from-blue-900 to-black'}`} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {ripples.map(r => <div key={r.id} className="absolute border border-blue-400/20 rounded-full animate-ripple w-4 h-4" />)}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
          <span className={`text-7xl font-black transition-colors ${clamped > 50 ? 'text-white' : 'text-blue-500'}`}>{Math.round(clamped)}%</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] mt-2 text-blue-400">{isFull ? 'Target Achieved' : 'Daily Progress'}</span>
        </div>
      </div>
      <style>{`
        @keyframes ripple { 0% { transform: scale(0); opacity: 0.8; } 100% { transform: scale(40); opacity: 0; } }
        .animate-ripple { animation: ripple 6s cubic-bezier(0, 0, 0.2, 1) forwards; }
      `}</style>
    </div>
  );
}
