
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
  Flame
} from 'lucide-react';
import { UserProfile, IntakeLog, DailySummary } from './types';
import { STORAGE_KEYS, INTAKE_PRESETS, OTHER_DRINKS } from './constants';
import { getTodayKey, formatVolume, calculateStreaks } from './utils/calculations';
import SetupForm from './components/SetupForm';
import WaterWave from './components/WaterWave';
import AICoachCard from './components/AICoachCard';
import HistoryChart from './components/HistoryChart';
import StreakBadge from './components/StreakBadge';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<IntakeLog[]>([]);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [activeTab, setActiveTab] = useState<'today' | 'trends'>('today');

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
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
        <SetupForm onComplete={handleProfileComplete} initialProfile={profile} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">HydrateMe</h1>
              <p className="text-xs text-slate-400 font-medium">Hello, {profile.name}!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StreakBadge count={streakStats.currentStreak} />
            <button 
              onClick={() => setIsSettingUp(true)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Settings className="w-6 h-6 text-slate-500" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-8 space-y-8">
        {activeTab === 'today' ? (
          <>
            {/* Main Circle Display */}
            <div className="flex flex-col items-center justify-center space-y-6">
              <WaterWave percentage={progressPercentage} />
              <div className="text-center">
                <div className={`text-4xl font-black transition-colors ${isGoalMetToday ? 'text-blue-600' : 'text-slate-800'}`}>
                  {formatVolume(todayTotal)}
                </div>
                <div className="text-slate-400 font-medium">
                  of {formatVolume(profile.dailyGoal)} goal
                </div>
                {isGoalMetToday && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase tracking-wider animate-bounce">
                    <Award className="w-3.5 h-3.5" />
                    Goal Reached!
                  </div>
                )}
              </div>
            </div>

            {/* AI Coach Card */}
            <AICoachCard profile={profile} currentIntake={todayTotal} />

            {/* Quick Logging */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 px-1">Log Water</h3>
              <div className="grid grid-cols-2 gap-3">
                {INTAKE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => addLog(preset.amount)}
                    className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all active:scale-95 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 text-blue-600 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {preset.icon}
                      </div>
                      <span className="font-semibold text-slate-700">{preset.amount}ml</span>
                    </div>
                    <Plus className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
                  </button>
                ))}
              </div>
              
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Other Beverages</h4>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {OTHER_DRINKS.map((drink, idx) => (
                    <button
                      key={idx}
                      onClick={() => addLog(Math.round(drink.amount * drink.hydratingFactor), drink.label)}
                      className="flex-shrink-0 flex flex-col items-center gap-2 group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all border border-transparent group-hover:border-blue-100">
                        {drink.icon}
                      </div>
                      <span className="text-xs font-bold text-slate-600">{drink.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Recent Logs List */}
            <section className="space-y-4 pb-8">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-lg font-bold text-slate-800">Today's History</h3>
                <span className="text-sm font-medium text-blue-600">{todayLogs.length} entries</span>
              </div>
              <div className="space-y-3">
                {todayLogs.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <Droplets className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm font-medium">No water logged yet today.</p>
                  </div>
                ) : (
                  todayLogs.map(log => (
                    <div key={log.id} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-slate-50 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                          <DropletIconByType type={log.type} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-700">+{log.amount}ml</div>
                          <div className="text-xs font-medium text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {log.type}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteLog(log.id)}
                        className="p-2 text-slate-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        ) : (
          /* Trends Tab Content */
          <div className="space-y-6 pb-8">
            <HistoryChart data={historyData} />
            
            {/* Streak Summary */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <StreakBadge count={streakStats.currentStreak} size="lg" />
              <div className="mt-6 grid grid-cols-2 w-full gap-4 border-t border-slate-50 pt-6">
                <div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Current</div>
                  <div className="text-2xl font-black text-slate-800">{streakStats.currentStreak} Days</div>
                </div>
                <div className="border-l border-slate-100">
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Best Ever</div>
                  <div className="text-2xl font-black text-orange-500">{streakStats.bestStreak} Days</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="text-blue-500 mb-2">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {Math.round(historyData.reduce((acc, curr) => acc + curr.total, 0) / 7)}ml
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Avg Daily</div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="text-green-500 mb-2">
                  <Award className="w-6 h-6" />
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {historyData.filter(d => d.total >= d.goal).length} / 7
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Goals Met</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">Milestones</h3>
              <div className="space-y-4">
                <Milestone 
                  icon={<Flame className="w-4 h-4" />} 
                  label="Streak Starter" 
                  desc="Hit your goal 3 days in a row" 
                  done={streakStats.currentStreak >= 3} 
                />
                <Milestone 
                  icon={<Droplets className="w-4 h-4" />} 
                  label="Gallon Chugger" 
                  desc="Drink over 3.8L in one day" 
                  done={todayTotal > 3800} 
                />
                <Milestone 
                  icon={<Award className="w-4 h-4" />} 
                  label="Water Legend" 
                  desc="Hit a 7-day streak" 
                  done={streakStats.bestStreak >= 7} 
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Persistent Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-4 z-40">
        <div className="max-w-xl mx-auto flex items-center justify-around">
          <button 
            onClick={() => setActiveTab('today')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'today' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <Droplets className={`w-6 h-6 ${activeTab === 'today' ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Today</span>
          </button>
          <button 
            onClick={() => setActiveTab('trends')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'trends' ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <History className={`w-6 h-6 ${activeTab === 'trends' ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest">History</span>
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
    default: return <Plus className="w-5 h-5" />;
  }
};

const Milestone = ({ icon, label, desc, done }: { icon: React.ReactNode, label: string, desc: string, done: boolean }) => (
  <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${done ? 'bg-blue-50 border-blue-100 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
      {icon}
    </div>
    <div className="flex-1">
      <div className={`text-sm font-bold ${done ? 'text-blue-900' : 'text-slate-600'}`}>{label}</div>
      <div className="text-xs text-slate-400">{desc}</div>
    </div>
    {done && <ChevronRight className="w-4 h-4 text-blue-400" />}
  </div>
);

export default App;
