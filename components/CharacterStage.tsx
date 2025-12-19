
import React, { useMemo } from 'react';
import { Zap, Wind, Waves, Flame, Star } from 'lucide-react';

interface CharacterStageProps {
  percentage: number;
}

const CharacterStage: React.FC<CharacterStageProps> = ({ percentage }) => {
  const state = useMemo(() => {
    if (percentage < 30) return { 
      name: 'Zenitsu', 
      title: 'Thunder Breathing', 
      color: 'from-yellow-400 to-amber-600',
      accent: '#fbbf24',
      image: 'https://images.uncyc.org/pt/thumb/a/a2/Zenitsu_Agatsuma_render.png/300px-Zenitsu_Agatsuma_render.png',
      icon: <Zap className="w-4 h-4" />,
      text: 'Thunderclap and Flash!',
      auraClass: 'animate-thunder',
      bgEffect: '⚡'
    };
    if (percentage < 70) return { 
      name: 'Tanjiro', 
      title: 'Water Breathing', 
      color: 'from-emerald-500 to-teal-700',
      accent: '#10b981',
      image: 'https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/d/d4/Tanjiro_Kamado_render.png', // Note: Placeholder-style reliable link
      icon: <Wind className="w-4 h-4" />,
      text: 'Move like a dragon!',
      auraClass: 'animate-breathing',
      bgEffect: '🌊'
    };
    if (percentage < 100) return { 
      name: 'Giyu', 
      title: 'Dead Calm', 
      color: 'from-blue-600 to-indigo-900',
      accent: '#2563eb',
      image: 'https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/d/d8/Giyu_Tomioka_render.png',
      icon: <Waves className="w-4 h-4" />,
      text: 'Eleventh Form: Nagi.',
      auraClass: 'animate-calm',
      bgEffect: '🌸'
    };
    return { 
      name: 'Rengoku', 
      title: 'Flame Breathing', 
      color: 'from-orange-500 to-red-700',
      accent: '#ef4444',
      image: 'https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/8/8e/Kyojuro_Rengoku_render.png',
      icon: <Flame className="w-4 h-4" />,
      text: 'SET YOUR HEART ABLAZE!',
      auraClass: 'animate-blaze',
      bgEffect: '🔥'
    };
  }, [percentage]);

  // Using SVGs for character silhouettes as fallback or stylized renders
  const CharacterIcon = () => (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Rotating Background Nichirin Circle */}
      <div className={`absolute inset-0 rounded-full border-4 border-dashed opacity-20 animate-spin-slow`} style={{ borderColor: state.accent }} />
      <div className={`absolute inset-4 rounded-full border-2 border-dotted opacity-10 animate-spin-reverse`} style={{ borderColor: state.accent }} />
      
      {/* Elemental Background Symbol */}
      <div className="absolute text-6xl opacity-10 select-none animate-pulse">
        {state.bgEffect}
      </div>

      {/* Main Character Render */}
      <div className={`relative z-10 w-40 h-40 flex items-center justify-center transition-all duration-700 ${state.auraClass}`}>
        <div className={`absolute inset-0 bg-gradient-to-t ${state.color} opacity-40 blur-2xl rounded-full`} />
        
        {/* We use a stylized representation if external images are blocked, but here we provide the structure for the img */}
        <div className="relative group">
           <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${state.color} p-1 shadow-2xl transform transition-transform group-hover:scale-110`}>
              <div className="w-full h-full bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center relative">
                 <div className="absolute inset-0 opacity-20 flex items-center justify-center text-4xl">{state.bgEffect}</div>
                 <div className="z-20 text-white font-black text-xs text-center px-2 italic uppercase">
                    {state.name}
                 </div>
              </div>
           </div>
           {/* Floaties */}
           <Star className="absolute -top-2 -right-2 w-6 h-6 text-white fill-current opacity-50 animate-bounce" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-6 overflow-visible">
      {/* Global Background Glow */}
      <div className={`absolute w-64 h-64 rounded-full blur-[100px] opacity-10 transition-all duration-1000 bg-gradient-to-br ${state.color} animate-pulse`} />
      
      <CharacterIcon />

      {/* Character Identity Card */}
      <div className="z-30 text-center mt-6 space-y-3">
        <div className="flex flex-col items-center">
          <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] leading-none">
            {state.name}
          </h2>
          <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900/90 border-2 border-slate-800 rounded-xl shadow-xl">
             <span className={`p-1 rounded-lg bg-gradient-to-br ${state.color} text-white`}>
               {state.icon}
             </span>
             <p className="text-[11px] font-black uppercase tracking-[0.3em] text-cyan-400">
               {state.title}
             </p>
          </div>
        </div>

        {/* Quote Bubble */}
        <div className="relative inline-block">
          <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          <div className="relative z-20 text-[12px] font-black italic text-white bg-slate-900/40 backdrop-blur-md px-8 py-3 rounded-2xl border border-white/10 shadow-2xl">
            "{state.text}"
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 8s linear infinite; }
        .animate-shimmer { animation: shimmer 3s infinite; }

        @keyframes thunder {
          0%, 100% { transform: scale(1) translate(0, 0); }
          5% { transform: scale(1.05) translate(2px, -2px); filter: brightness(1.5); }
          10% { transform: scale(1) translate(-2px, 2px); }
        }
        @keyframes breathing {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.1) translateY(-8px); }
        }
        @keyframes calm {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.02); opacity: 1; }
        }
        @keyframes blaze {
          0%, 100% { transform: scale(1) skew(0deg); filter: brightness(1); }
          50% { transform: scale(1.15) skew(2deg); filter: brightness(1.3); }
        }
        
        .animate-thunder { animation: thunder 0.2s infinite; }
        .animate-breathing { animation: breathing 4s ease-in-out infinite; }
        .animate-calm { animation: calm 6s ease-in-out infinite; }
        .animate-blaze { animation: blaze 1.2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default CharacterStage;
