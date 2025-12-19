
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Settings, 
  Trash2, 
  Clock, 
  History, 
  ChevronRight,
  TrendingUp,
  Droplets,
  Award,
  Flame,
  Waves,
  Zap,
  Sparkles
} from 'lucide-react';
import { UserProfile, IntakeLog, DailySummary } from './types';
import { STORAGE_KEYS, INTAKE_PRESETS, OTHER_DRINKS } from './constants';
import { getTodayKey, formatVolume, calculateStreaks } from './utils/calculations';
import SetupForm from './components/SetupForm';
import WaterWave from './components/WaterWave';
import AICoachCard from './components/AICoachCard';
import HistoryChart from './components/HistoryChart';
import StreakBadge from './components/StreakBadge';
import ImageEditor from './components/ImageEditor';
import CharacterStage from './components/CharacterStage';

const BREATHING_FORMS = [
  "First Form: Water Surface Slice",
  "Second Form: Water Wheel",
  "Third Form: Flowing Dance",
  "Fourth Form: Striking Tide",
  "Fifth Form: Blessed Rain After the Drought",
  "Sixth Form: Whirlpool",
  "Seventh Form: Drop Ripple Thrust",
  "Eighth Form: Waterfall Basin",
  "Ninth Form: Splashing Water Flow",
  "Tenth Form: Constant Flux",
  "Eleventh Form: Dead Calm"
];

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<IntakeLog[]>([]);
  const [activeTab, setActiveTab] = useState<'today' | 'trends' | 'aura'>('today');
  const [showSlash, setShowSlash] = useState(false);
  const [currentForm, setCurrentForm] = useState<string | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    const savedLogs = localStorage.getItem(STORAGE_KEYS.INTAKE_LOGS);
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INTAKE_LOGS, JSON.stringify(logs));
  }, [logs]);

  const handleProfileComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(newProfile));
  };

  const addLog = (amount: number, type: string = "Water") => {
    const randomForm = BREATHING_FORMS[Math.floor(Math.random() * BREATHING_FORMS.length)];
    setCurrentForm(randomForm);
    setShowSlash(true);
    
    setTimeout(() => {
      setShowSlash(false);
      setCurrentForm(null);
    }, 850);
    
    const newLog: IntakeLog = {
      id: Math.random().toString(36).substr(2, 9),
      amount,
      type,
      timestamp: Date.now(),
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const deleteLog = (id: string) => {
    setLogs(prev => prev.filter(log => log.id !== id));
  };

  const todayKey = getTodayKey();
  const todayLogs = useMemo(() => {
    return logs.filter(log => new Date(log.timestamp).toISOString().split('T')[0] === todayKey);
  }, [logs, todayKey]);

  const todayTotal = todayLogs.reduce((acc, log) => acc + log.amount, 0);
  const progressPercentage = profile ? (todayTotal / profile.dailyGoal) * 100 : 0;
  const isGoalMetToday = progressPercentage >= 100;

  const streakStats = useMemo(() => {
    if (!profile) return { currentStreak: 0, bestStreak: 0 };
    return calculateStreaks(logs, profile.dailyGoal);
  }, [logs, profile]);

  const historyData = useMemo<DailySummary[]>(() => {
    if (!profile) return [];
    const map = new Map<string, number>();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();
    last7Days.forEach(date => map.set(date, 0));
    logs.forEach(log => {
      const dateKey = new Date(log.timestamp).toISOString().split('T')[0];
      if (map.has(dateKey)) map.set(dateKey, map.get(dateKey)! + log.amount);
    });
    return Array.from(map.entries()).map(([date, total]) => ({
      date,
      total,
      goal: profile.dailyGoal
    }));
  }, [logs, profile]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 py-12 px-4 flex items-center justify-center">
        <SetupForm onComplete={handleProfileComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] pb-32 text-slate-200 overflow-x-hidden relative">
      
      {/* Cinematic Announcement Layer */}
      {currentForm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center pointer-events-none">
          <div className="w-full bg-slate-900/60 backdrop-blur-xl py-12 border-y-4 border-white/20 animate-form-slide">
             <div className="flex flex-col items-center">
                <div className="text-cyan-400 text-[10px] font-black tracking-[1em] mb-4 uppercase animate-pulse">Total Concentration</div>
                <h2 className="text-3xl md:text-5xl font-black italic text-center text-white tracking-tighter uppercase italic drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                  {currentForm}
                </h2>
             </div>
          </div>
        </div>
      )}

      {/* Tri-Slash Animation Layer */}
      {showSlash && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="absolute w-[250%] h-2 bg-white shadow-[0_0_60px_#fff] rotate-[35deg] animate-slash-1" />
          <div className="absolute w-[250%] h-1 bg-cyan-400 shadow-[0_0_40px_#22d3ee] rotate-[-15deg] animate-slash-2" />
          <div className="absolute w-[250%] h-3 bg-white shadow-[0_0_80px_#fff] rotate-[55deg] animate-slash-3" />
          <div className="absolute inset-0 bg-white/30 animate-slash-flash" />
        </div>
      )}

      <header className="bg-[#020617]/90 backdrop-blur-md border-b border-slate-800/50 sticky top-0 z-50 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-2xl shadow-2xl shadow-blue-900/40 border border-white/10">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-slate-100 leading-none">WATER HASHIRA</h1>
            <div className="text-[9px] font-black text-slate-500 tracking-[0.3em] mt-1 uppercase">Demon Slayer Corps</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <StreakBadge count={streakStats.currentStreak} />
          <button onClick={() => setProfile(null)} className="p-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-500 hover:text-cyan-400 transition-all">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-8 space-y-10">
        {activeTab === 'today' && (
          <>
            <div className="flex flex-col items-center justify-center">
              <CharacterStage percentage={progressPercentage} />
              
              <div className="mt-8 flex flex-col items-center space-y-12">
                <WaterWave percentage={progressPercentage} />
                <div className="text-center group">
                  <div className={`text-7xl font-black transition-all duration-700 ${isGoalMetToday ? 'text-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]' : 'text-slate-100'}`}>
                    {formatVolume(todayTotal)}
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="h-0.5 w-8 bg-slate-800" />
                    <div className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">
                      Target: {formatVolume(profile.dailyGoal)}
                    </div>
                    <div className="h-0.5 w-8 bg-slate-800" />
                  </div>
                </div>
              </div>
            </div>

            <AICoachCard profile={profile} currentIntake={todayTotal} />

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-cyan-500 rounded-full" />
                  <h3 className="text-xl font-black tracking-tight uppercase">Quick Strike</h3>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                {INTAKE_PRESETS.map((preset, idx) => (
                  <button key={idx} onClick={() => addLog(preset.amount)} className="flex items-center gap-4 p-6 bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] hover:border-cyan-500 hover:bg-slate-900/80 transition-all active:scale-90 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
                      {preset.icon}
                    </div>
                    <div className="bg-slate-800/80 p-3.5 rounded-[1.25rem] group-hover:bg-cyan-600 text-cyan-400 group-hover:text-white transition-all shadow-xl">
                      {preset.icon}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-black text-xl text-slate-100">{preset.amount}ml</span>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{preset.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-5">
              <h3 className="text-lg font-black tracking-tight uppercase text-slate-400 tracking-[0.2em] ml-2">Auxiliary Intake</h3>
              <div className="bg-slate-900/30 border border-slate-800/50 rounded-[3rem] p-7 flex gap-8 overflow-x-auto scrollbar-hide shadow-inner">
                {OTHER_DRINKS.map((drink, idx) => (
                  <button key={idx} onClick={() => addLog(Math.round(drink.amount * drink.hydratingFactor), drink.label)} className="flex-shrink-0 flex flex-col items-center gap-3 group">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:scale-110 group-active:scale-95 transition-all shadow-lg">
                      {drink.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter group-hover:text-slate-300">{drink.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-black tracking-tight uppercase tracking-[0.1em] text-slate-200">Battle Log</h3>
                <div className="text-[10px] font-black bg-cyan-950/40 border border-cyan-800 text-cyan-400 px-4 py-1.5 rounded-full">{todayLogs.length} STRIKES</div>
              </div>
              <div className="space-y-4">
                {todayLogs.length === 0 ? (
                  <div className="text-center py-20 bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-800/30 text-slate-700 font-black uppercase tracking-[0.3em] text-sm italic">Focus... First breath awaits.</div>
                ) : (
                  todayLogs.map(log => (
                    <div key={log.id} className="group bg-slate-900/40 p-6 rounded-[2.25rem] flex items-center justify-between border border-slate-800 hover:bg-slate-900/60 transition-all">
                      <div className="flex items-center gap-5">
                        <div className="bg-slate-800 p-3 rounded-2xl text-cyan-500 group-hover:text-cyan-300 transition-colors shadow-lg">
                           <Droplets size={24} />
                        </div>
                        <div>
                          <div className="font-black text-2xl tracking-tighter text-slate-100">+{log.amount}ml</div>
                          <div className="text-[11px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-2 mt-1">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <span className="w-1.5 h-1.5 bg-slate-800 rounded-full" /> {log.type}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => deleteLog(log.id)} className="p-3 text-slate-700 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"><Trash2 size={22} /></button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <HistoryChart data={historyData} />
            <div className="bg-slate-900/40 rounded-[3rem] p-12 border border-slate-800 flex flex-col items-center text-center shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              <StreakBadge count={streakStats.currentStreak} size="lg" />
              <div className="mt-10 grid grid-cols-2 w-full gap-10 border-t border-slate-800/50 pt-10">
                <div className="group">
                  <div className="text-[11px] font-black text-slate-600 uppercase mb-2 tracking-widest group-hover:text-cyan-400 transition-colors">Continuous Path</div>
                  <div className="text-5xl font-black text-slate-100">{streakStats.currentStreak} <span className="text-sm font-bold text-slate-500">Days</span></div>
                </div>
                <div className="border-l border-slate-800/50 group">
                  <div className="text-[11px] font-black text-slate-600 uppercase mb-2 tracking-widest group-hover:text-cyan-400 transition-colors">Training Yield</div>
                  <div className="text-5xl font-black text-cyan-400">
                    {Math.round(historyData.reduce((acc, curr) => acc + curr.total, 0) / (historyData.length || 1))}<span className="text-xs font-bold text-slate-500 ml-1">ml</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'aura' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <ImageEditor />
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#020617]/95 backdrop-blur-3xl border-t border-slate-800/40 px-8 py-7 z-50 flex items-center justify-around shadow-[0_-15px_50px_rgba(0,0,0,0.7)]">
        <NavButton active={activeTab === 'today'} icon={<Waves />} label="Breathing" onClick={() => setActiveTab('today')} />
        <NavButton active={activeTab === 'aura'} icon={<Sparkles />} label="Artistry" onClick={() => setActiveTab('aura')} />
        <NavButton active={activeTab === 'trends'} icon={<History />} label="Scrolls" onClick={() => setActiveTab('trends')} />
      </nav>

      <style>{`
        @keyframes slash-1 {
          0% { transform: translateX(-100%) translateY(-100%) rotate(35deg); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateX(100%) translateY(100%) rotate(35deg); opacity: 0; }
        }
        @keyframes slash-2 {
          0% { transform: translateX(100%) translateY(-50%) rotate(-15deg); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateX(-100%) translateY(50%) rotate(-15deg); opacity: 0; }
        }
        @keyframes slash-3 {
          0% { transform: translateX(-50%) translateY(-100%) rotate(55deg); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translateX(50%) translateY(100%) rotate(55deg); opacity: 0; }
        }
        @keyframes form-slide {
          0% { transform: translateX(-100%) skewX(-30deg); opacity: 0; filter: blur(20px); }
          15% { transform: translateX(0) skewX(0deg); opacity: 1; filter: blur(0px); }
          85% { transform: translateX(0) skewX(0deg); opacity: 1; filter: blur(0px); }
          100% { transform: translateX(100%) skewX(30deg); opacity: 0; filter: blur(20px); }
        }
        .animate-slash-1 { animation: slash-1 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slash-2 { animation: slash-2 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slash-3 { animation: slash-3 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-form-slide { animation: form-slide 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
      `}</style>
    </div>
  );
};

const NavButton = ({ active, icon, label, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-2 transition-all duration-500 ${active ? 'text-cyan-400 scale-125 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]' : 'text-slate-600 hover:text-slate-400'}`}>
    <div className={`p-3.5 rounded-2xl transition-all duration-500 ${active ? 'bg-cyan-900/30 ring-2 ring-cyan-500/20' : 'bg-transparent'}`}>{icon}</div>
    <span className="text-[11px] font-black uppercase tracking-[0.25em]">{label}</span>
  </button>
);

export default App;
