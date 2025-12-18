
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

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<IntakeLog[]>([]);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [activeTab, setActiveTab] = useState<'today' | 'trends' | 'aura'>('today');

  // Load data on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    const savedLogs = localStorage.getItem(STORAGE_KEYS.INTAKE_LOGS);
    
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      setIsSettingUp(true);
    }

    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  // Save logs whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INTAKE_LOGS, JSON.stringify(logs));
  }, [logs]);

  const handleProfileComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(newProfile));
    setIsSettingUp(false);
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
    return logs.filter(log => {
      const d = new Date(log.timestamp);
      return d.toISOString().split('T')[0] === todayKey;
    });
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
      if (map.has(dateKey)) {
        map.set(dateKey, map.get(dateKey)! + log.amount);
      }
    });

    return Array.from(map.entries()).map(([date, total]) => ({
      date,
      total,
      goal: profile.dailyGoal
    }));
  }, [logs, profile]);

  if (isSettingUp || !profile) {
    return (
      <div className="min-h-screen bg-slate-950 py-12 px-4 flex items-center justify-center">
        <SetupForm onComplete={handleProfileComplete} initialProfile={profile} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] pb-24 text-slate-200">
      {/* Header */}
      <header className="bg-[#020617]/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-900/50">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-100 tracking-tight">Hashira Hydration</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Welcome, {profile.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StreakBadge count={streakStats.currentStreak} />
            <button 
              onClick={() => setIsSettingUp(true)}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-cyan-400"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-8 space-y-10">
        {activeTab === 'today' && (
          <>
            {/* Progress Visualization - Giyu 11th Form Theme */}
            <div className="flex flex-col items-center justify-center space-y-12 py-8">
              <WaterWave percentage={progressPercentage} />
              
              <div className="text-center">
                <div className={`text-6xl font-black transition-all duration-500 ${isGoalMetToday ? 'text-cyan-400 scale-110 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]' : 'text-slate-100'}`}>
                  {formatVolume(todayTotal)}
                </div>
                <div className="text-slate-500 font-bold uppercase tracking-widest text-[11px] mt-2">
                  Daily Goal: {formatVolume(profile.dailyGoal)}
                </div>
                {isGoalMetToday && (
                  <div className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-cyan-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-cyan-900/40 animate-pulse">
                    <Award className="w-4 h-4" />
                    Technique Mastered
                  </div>
                )}
              </div>
            </div>

            {/* AI Coaching Section */}
            <AICoachCard profile={profile} currentIntake={todayTotal} />

            {/* Manual Intake Section */}
            <section className="space-y-5">
              <div className="flex items-center gap-2 px-1">
                <Droplets className="w-5 h-5 text-cyan-500" />
                <h3 className="text-lg font-black text-slate-100 tracking-tight">Swift Replenishment</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {INTAKE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => addLog(preset.amount)}
                    className="flex items-center justify-between p-6 bg-slate-900/50 border border-slate-800 rounded-3xl hover:border-cyan-500 hover:bg-slate-800/80 transition-all active:scale-95 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-800 text-cyan-400 p-3 rounded-2xl group-hover:bg-cyan-500 group-hover:text-white transition-all">
                        {preset.icon}
                      </div>
                      <span className="font-black text-slate-200">{preset.amount}ml</span>
                    </div>
                    <Plus className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 group-hover:scale-125 transition-all" />
                  </button>
                ))}
              </div>
            </section>

            {/* List of Logs */}
            <section className="space-y-4 pb-12">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-lg font-black text-slate-100 tracking-tight">Training Log</h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-900/30 px-3 py-1 rounded-full border border-cyan-800/50">
                  {todayLogs.length} Entries
                </span>
              </div>
              <div className="space-y-3">
                {todayLogs.length === 0 ? (
                  <div className="text-center py-20 bg-slate-900/20 rounded-[2.5rem] border-2 border-dashed border-slate-800">
                    <Waves className="w-10 h-10 text-slate-800 mx-auto mb-4 animate-pulse" />
                    <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Awaiting First Drop</p>
                  </div>
                ) : (
                  todayLogs.map(log => (
                    <div key={log.id} className="bg-slate-900/50 p-5 rounded-3xl flex items-center justify-between border border-slate-800 hover:bg-slate-800/50 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                          <DropletIconByType type={log.type} />
                        </div>
                        <div>
                          <div className="font-black text-slate-100 text-lg">+{log.amount}ml</div>
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {log.type}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteLog(log.id)}
                        className="p-3 text-slate-700 hover:text-red-400 transition-all hover:bg-red-900/20 rounded-2xl"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-8 pb-12">
            <HistoryChart data={historyData} />
            <div className="bg-slate-900/50 rounded-[2.5rem] p-10 border border-slate-800 flex flex-col items-center text-center">
              <StreakBadge count={streakStats.currentStreak} size="lg" />
              <div className="mt-8 grid grid-cols-2 w-full gap-8 border-t border-slate-800 pt-8">
                <div>
                  <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Current</div>
                  <div className="text-3xl font-black text-slate-100">{streakStats.currentStreak} <span className="text-sm font-bold text-slate-500">Days</span></div>
                </div>
                <div className="border-l border-slate-800">
                  <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Best</div>
                  <div className="text-3xl font-black text-orange-500">{streakStats.bestStreak} <span className="text-sm font-bold text-slate-500">Days</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'aura' && (
          <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ImageEditor />
            <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 text-center">
              <Sparkles className="w-6 h-6 text-cyan-500 mx-auto mb-3" />
              <p className="text-xs font-medium text-slate-400 leading-relaxed">
                Use your Aura to represent your technique. Upload an image and ask for filters, styles, or specific Hashira effects.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Persistent Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#020617]/90 backdrop-blur-xl border-t border-slate-800 px-8 py-5 z-40">
        <div className="max-w-xl mx-auto flex items-center justify-around">
          <button 
            onClick={() => setActiveTab('today')}
            className={`flex flex-col items-center gap-2 transition-all duration-300 ${activeTab === 'today' ? 'text-cyan-400 scale-110' : 'text-slate-600 hover:text-slate-400'}`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${activeTab === 'today' ? 'bg-cyan-900/20' : 'bg-transparent'}`}>
              <Waves className={`w-6 h-6 ${activeTab === 'today' ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Tracker</span>
          </button>
          <button 
            onClick={() => setActiveTab('aura')}
            className={`flex flex-col items-center gap-2 transition-all duration-300 ${activeTab === 'aura' ? 'text-cyan-400 scale-110' : 'text-slate-600 hover:text-slate-400'}`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${activeTab === 'aura' ? 'bg-cyan-900/20' : 'bg-transparent'}`}>
              <Sparkles className={`w-6 h-6 ${activeTab === 'aura' ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Artistry</span>
          </button>
          <button 
            onClick={() => setActiveTab('trends')}
            className={`flex flex-col items-center gap-2 transition-all duration-300 ${activeTab === 'trends' ? 'text-cyan-400 scale-110' : 'text-slate-600 hover:text-slate-400'}`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${activeTab === 'trends' ? 'bg-cyan-900/20' : 'bg-transparent'}`}>
              <History className={`w-6 h-6 ${activeTab === 'trends' ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Analytics</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

const DropletIconByType = ({ type }: { type: string }) => {
  switch (type) {
    case 'Coffee': return <Plus className="w-5 h-5 rotate-45" />;
    case 'Tea': return <Plus className="w-5 h-5 rotate-12" />;
    default: return <Droplets className="w-5 h-5" />;
  }
};

const Milestone = ({ icon, label, desc, done }: { icon: React.ReactNode, label: string, desc: string, done: boolean }) => (
  <div className={`flex items-center gap-5 p-6 rounded-[2rem] border transition-all duration-500 ${done ? 'bg-cyan-900/10 border-cyan-800/50 shadow-sm' : 'bg-slate-900/30 border-transparent opacity-40'}`}>
    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 ${done ? 'bg-cyan-600 text-white scale-110 rotate-3 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'bg-slate-800 text-slate-600'}`}>
      {icon}
    </div>
    <div className="flex-1">
      <div className={`text-[11px] font-black uppercase tracking-wider ${done ? 'text-cyan-100' : 'text-slate-500'}`}>{label}</div>
      <div className="text-[10px] font-bold text-slate-600 mt-1">{desc}</div>
    </div>
    {done && <div className="w-6 h-6 bg-cyan-900/30 rounded-full flex items-center justify-center border border-cyan-800/50"><ChevronRight className="w-3 h-3 text-cyan-400" /></div>}
  </div>
);

export default App;
