
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Settings, 
  Trash2, 
  History, 
  Droplets,
  Waves,
  Sparkles,
  GlassWater,
  Droplet,
  Cloud
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

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<IntakeLog[]>([]);
  const [activeTab, setActiveTab] = useState<'today' | 'trends' | 'aura'>('today');

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
    <div className="min-h-screen bg-[#070f2b] pb-32 text-slate-100 overflow-x-hidden relative">
      <header className="bg-[#070f2b]/80 backdrop-blur-md border-b border-sky-900/50 sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500 p-2 rounded-xl shadow-lg shadow-sky-500/20">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-white italic">SKY HYDRATE</h1>
        </div>
        <div className="flex items-center gap-4">
          <StreakBadge count={streakStats.currentStreak} />
          <button onClick={() => setProfile(null)} className="p-2 text-sky-400/60 hover:text-sky-300">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-8 space-y-10">
        {activeTab === 'today' && (
          <>
            <div className="flex flex-col items-center justify-center py-8">
              <WaterWave percentage={progressPercentage} />
              <div className="mt-8 text-center">
                <div className={`text-6xl font-black transition-all ${isGoalMetToday ? 'text-sky-300 drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]' : 'text-slate-100'}`}>
                  {formatVolume(todayTotal)}
                </div>
                <div className="text-sky-500/60 font-bold uppercase tracking-widest text-[11px] mt-2">
                  Target: {formatVolume(profile.dailyGoal)}
                </div>
              </div>
            </div>

            <AICoachCard profile={profile} currentIntake={todayTotal} />

            <section className="space-y-5">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-sky-400" />
                <h3 className="text-lg font-bold tracking-tight uppercase tracking-tighter">Sky Logistics</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {INTAKE_PRESETS.map((preset, idx) => (
                  <button key={idx} onClick={() => addLog(preset.amount)} className="flex items-center gap-4 p-5 bg-sky-900/10 border border-sky-900/40 rounded-3xl hover:border-sky-400 transition-all active:scale-95 group backdrop-blur-sm">
                    <div className="bg-sky-950 p-3 rounded-2xl group-hover:bg-sky-500 text-sky-400 group-hover:text-white transition-all">
                      {preset.icon}
                    </div>
                    <span className="font-black text-slate-200">{preset.amount}ml</span>
                  </button>
                ))}
              </div>
              <div className="bg-sky-950/20 border border-sky-900/30 rounded-[2rem] p-6 flex gap-6 overflow-x-auto scrollbar-hide shadow-inner">
                {OTHER_DRINKS.map((drink, idx) => (
                  <button key={idx} onClick={() => addLog(Math.round(drink.amount * drink.hydratingFactor), drink.label)} className="flex-shrink-0 flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 rounded-2xl bg-sky-900/40 border border-sky-800 flex items-center justify-center group-hover:bg-sky-500 transition-all shadow-lg">
                      {drink.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase text-sky-500/80">{drink.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-bold tracking-tight uppercase tracking-tighter text-sky-200">Activity Log</h3>
              <div className="space-y-3">
                {todayLogs.length === 0 ? (
                  <div className="text-center py-12 bg-sky-950/20 rounded-3xl border-2 border-dashed border-sky-900/30 text-sky-800 font-bold uppercase tracking-widest text-xs">Horizon is Clear</div>
                ) : (
                  todayLogs.map(log => (
                    <div key={log.id} className="bg-sky-950/30 p-4 rounded-2xl flex items-center justify-between border border-sky-900/20 hover:bg-sky-900/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="text-sky-400"><Droplets size={20} /></div>
                        <div>
                          <div className="font-black text-lg text-slate-100">+{log.amount}ml</div>
                          <div className="text-[10px] text-sky-600 uppercase font-black tracking-widest">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {log.type}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => deleteLog(log.id)} className="p-2 text-sky-900 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <HistoryChart data={historyData} />
            <div className="bg-sky-950/30 rounded-[2.5rem] p-10 border border-sky-900/30 flex flex-col items-center text-center backdrop-blur-sm">
              <StreakBadge count={streakStats.currentStreak} size="lg" />
              <div className="mt-8 grid grid-cols-2 w-full gap-8 border-t border-sky-900/40 pt-8">
                <div>
                  <div className="text-[10px] font-black text-sky-600 uppercase mb-1 tracking-widest">Sky High Streak</div>
                  <div className="text-3xl font-black text-slate-100">{streakStats.currentStreak} <span className="text-sm font-bold text-sky-700">Days</span></div>
                </div>
                <div className="border-l border-sky-900/40">
                  <div className="text-[10px] font-black text-sky-600 uppercase mb-1 tracking-widest">Atmospheric Avg</div>
                  <div className="text-3xl font-black text-sky-400">
                    {Math.round(historyData.reduce((acc, curr) => acc + curr.total, 0) / (historyData.length || 7))}<span className="text-xs font-bold text-sky-700 ml-1">ml</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'aura' && <ImageEditor />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#070f2b]/95 backdrop-blur-2xl border-t border-sky-900/40 px-8 py-5 z-50 flex items-center justify-around shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <NavButton active={activeTab === 'today'} icon={<Waves />} label="Horizon" onClick={() => setActiveTab('today')} />
        <NavButton active={activeTab === 'aura'} icon={<Sparkles />} label="Cloud Art" onClick={() => setActiveTab('aura')} />
        <NavButton active={activeTab === 'trends'} icon={<History />} label="Weather" onClick={() => setActiveTab('trends')} />
      </nav>
    </div>
  );
};

const NavButton = ({ active, icon, label, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-sky-300 scale-110 drop-shadow-[0_0_8px_rgba(125,211,252,0.4)]' : 'text-sky-900 hover:text-sky-700'}`}>
    <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-sky-500/10' : ''}`}>{icon}</div>
    <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
  </button>
);

export default App;
