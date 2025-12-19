
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
      setTimeout(() => setIsSurging(false), 1200);
    }
    prevRef.current = clamped;
  }, [clamped]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRipples(p => [...p.slice(-6), { id: Date.now() }]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative group">
      {/* Outer Halo */}
      <div className={`absolute -inset-10 rounded-full opacity-20 blur-3xl transition-all duration-1000 ${isSurging ? 'scale-125 opacity-40 bg-cyan-400' : 'bg-blue-600'}`} />
      
      {/* Main Nichirin Circle */}
      <div className={`relative w-80 h-80 rounded-full border-[6px] border-slate-800 bg-slate-950 overflow-hidden shadow-[0_0_80px_rgba(30,58,138,0.5)] transition-all duration-700 ${isSurging ? 'scale-105 border-cyan-500 shadow-cyan-500/30' : ''}`}>
        
        {/* Pattern Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #334155 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />

        {/* The Water */}
        <div className="absolute inset-0 transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1)" style={{ transform: `translateY(${fillLevel}%)` }}>
          {/* Surface Glow Line */}
          <div className={`absolute top-0 left-0 w-full z-20 transition-all ${isSurging ? 'h-6 bg-white shadow-[0_0_60px_white]' : 'h-[3px] bg-cyan-400 shadow-[0_0_20px_cyan]'}`} />
          
          {/* Water Body */}
          <div className={`w-full h-[120%] relative transition-colors duration-1000 ${isSurging ? 'bg-gradient-to-b from-cyan-400 via-blue-600 to-blue-900' : 'bg-gradient-to-b from-blue-700 via-blue-900 to-black'}`}>
            {/* Wave Pattern Overlay */}
            <div className="absolute inset-0 opacity-20 animate-pattern-slide" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='40' viewBox='0 0 80 40'%3E%3Cpath d='M0 40a40 40 0 0 1 40-40 40 40 0 0 1 40 40H70a30 30 0 0 0-30-30 30 30 0 0 0-30 30H0z' fill='%23ffffff' fill-opacity='0.4'/%3E%3C/svg%3E")`,
              backgroundSize: '40px 20px'
            }} />
          </div>
        </div>

        {/* Ripples Layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          {ripples.map(r => <div key={r.id} className="absolute border-2 border-cyan-400/30 rounded-full animate-ripple" />)}
        </div>

        {/* Central Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
          <div className="relative group/text">
             <span className={`text-[8.5rem] font-black leading-none transition-all duration-700 ${clamped > 50 ? 'text-white' : 'text-blue-500'} ${isSurging ? 'scale-110 blur-[2px]' : ''}`}>
              {Math.round(clamped)}
            </span>
            <span className="absolute -top-4 -right-4 text-4xl font-black text-cyan-400">%</span>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400 mb-1">
               {isFull ? 'TOTAL CONCENTRATION' : 'BREATHING CYCLE'}
            </span>
            <div className="h-1 w-24 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-cyan-400 transition-all duration-1000" style={{width: `${clamped}%`}} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ripple { 
          0% { width: 0; height: 0; opacity: 1; border-width: 4px; } 
          100% { width: 600px; height: 600px; opacity: 0; border-width: 0px; } 
        }
        @keyframes pattern-slide {
          from { background-position: 0 0; }
          to { background-position: 80px 40px; }
        }
        .animate-ripple { animation: ripple 3s cubic-bezier(0, 0, 0.2, 1) forwards; }
        .animate-pattern-slide { animation: pattern-slide 10s linear infinite; }
      `}</style>
    </div>
  );
}
