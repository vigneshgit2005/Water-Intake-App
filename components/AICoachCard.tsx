
import React, { useEffect, useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
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
    setAdvice(text || "Drink up! You're doing great.");
    setLoading(false);
  };

  useEffect(() => {
    fetchAdvice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-lg shadow-indigo-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 -m-4 opacity-10">
        <Sparkles className="w-32 h-32 rotate-12" />
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-200" />
          <h3 className="font-bold text-indigo-50">AI Health Coach</h3>
        </div>
        <button 
          onClick={fetchAdvice}
          disabled={loading}
          className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="relative z-10">
        {loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-white/20 rounded w-3/4" />
            <div className="h-4 bg-white/20 rounded w-1/2" />
          </div>
        ) : (
          <p className="text-lg font-medium leading-relaxed">
            "{advice}"
          </p>
        )}
      </div>
    </div>
  );
};

export default AICoachCard;
