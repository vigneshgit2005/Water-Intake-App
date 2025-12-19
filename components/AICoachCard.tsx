
import React, { useEffect, useState } from 'react';
import { Sparkles, RefreshCw, Cloud } from 'lucide-react';
import { UserProfile } from '../types';
import { getHydrationAdvice } from '../services/geminiService';

interface AICoachCardProps {
  profile: UserProfile;
  currentIntake: number;
}

const AICoachCard: React.FC<AICoachCardProps> = ({ profile, currentIntake }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAdvice = async () => {
    setLoading(true);
    const text = await getHydrationAdvice(profile, currentIntake);
    setAdvice(text || "Clear skies ahead! Keep your hydration level optimal.");
    setLoading(false);
  };

  useEffect(() => {
    fetchAdvice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-gradient-to-br from-sky-400 to-sky-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-sky-500/20 relative overflow-hidden">
      {/* Decorative cloud background */}
      <div className="absolute top-0 right-0 -m-8 opacity-20">
        <Cloud className="w-48 h-48" />
      </div>
      <div className="absolute bottom-0 left-0 -m-6 opacity-10">
        <Sparkles className="w-32 h-32" />
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
            <Sparkles className="w-5 h-5 text-sky-100" />
          </div>
          <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-sky-100">Stratospheric Insight</h3>
        </div>
        <button 
          onClick={fetchAdvice}
          disabled={loading}
          className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-sky-100 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="relative z-10">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-5 bg-white/20 rounded-xl w-full" />
            <div className="h-5 bg-white/20 rounded-xl w-3/4" />
          </div>
        ) : (
          <p className="text-xl font-black italic leading-tight tracking-tight drop-shadow-sm">
            "{advice}"
          </p>
        )}
      </div>
    </div>
  );
};

export default AICoachCard;
