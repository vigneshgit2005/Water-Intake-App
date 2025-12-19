
import React, { useMemo } from 'react';
import { Wind, Waves, Flame } from 'lucide-react';

interface CharacterStageProps {
  percentage: number;
}

const CharacterStage: React.FC<CharacterStageProps> = ({ percentage }) => {
  const state = useMemo(() => {
    // Starting with Tanjiro instead of Zenitsu
    if (percentage < 60) return { 
      name: 'Tanjiro', 
      title: 'Water Breathing', 
      color: 'from-emerald-500 to-teal-700', 
      shadow: 'shadow-emerald-500/50',
      icon: <Wind className="w-4 h-4" />,
      text: 'Total Concentration...',
      auraClass: 'animate-breathing'
    };
    if (percentage < 100) return { 
      name: 'Giyu', 
      title: 'Dead Calm', 
      color: 'from-blue-600 to-indigo-900', 
      shadow: 'shadow-blue-500/50',
      icon: <Waves className="w-4 h-4" />,
      text: 'Nagi...',
      auraClass: 'animate-calm'
    };
    return { 
      name: 'Rengoku', 
      title: 'Flame Breathing', 
      color: 'from-orange-500 to-red-700', 
      shadow: 'shadow-red-500/50',
      icon: <Flame className="w-4 h-4" />,
      text: 'Set your heart ablaze!',
      auraClass: 'animate-blaze'
    };
  }, [percentage]);

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-6 mb-4 overflow-hidden">
      {/* Background Aura Glow */}
      <div className={`absolute w-40 h-40 rounded-full blur-[60px] opacity-30 transition-all duration-1000 bg-gradient-to-br ${state.color} ${state.auraClass}`} />
      
      {/* Character Info */}
      <div className="z-10 text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <span className={`p-1 rounded-md bg-gradient-to-br ${state.color} text-white shadow-lg`}>
            {state.icon}
          </span>
          <h2 className="text-xl font-black italic tracking-tighter text-slate-100 uppercase">
            {state.name}
          </h2>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          {state.title}
        </p>
      </div>

      {/* Floating Silhouette Representation */}
      <div className="relative mt-4 h-12 w-full flex justify-center items-end">
        <div className={`w-8 h-1 bg-slate-800 rounded-full blur-sm opacity-50 mb-[-4px]`} />
        <div className={`absolute bottom-0 w-10 h-16 bg-gradient-to-t ${state.color} opacity-40 blur-md rounded-t-full ${state.auraClass}`} />
        <div className="z-20 text-[8px] font-bold text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800 animate-bounce">
          "{state.text}"
        </div>
      </div>

      <style>{`
        @keyframes breathing {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.4); opacity: 0.5; }
        }
        @keyframes calm {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.05); opacity: 0.3; }
        }
        @keyframes blaze {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.4; filter: blur(40px); }
          50% { transform: scale(1.6) rotate(5deg); opacity: 0.7; filter: blur(20px); }
        }
        .animate-breathing { animation: breathing 4s ease-in-out infinite; }
        .animate-calm { animation: calm 6s ease-in-out infinite; }
        .animate-blaze { animation: blaze 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default CharacterStage;
