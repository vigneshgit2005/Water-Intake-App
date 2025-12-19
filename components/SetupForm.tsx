
import React, { useState } from 'react';
import { UserProfile, Gender, ActivityLevel, Climate, WeightUnit } from '../types';
import { calculateHydrationGoal } from '../utils/calculations';
import { User, Activity, Ruler, Weight, CloudSun, Coffee, Timer, Calendar, HeartPulse, Info, Cloud } from 'lucide-react';

interface SetupFormProps {
  onComplete: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
}

const SetupForm: React.FC<SetupFormProps> = ({ onComplete, initialProfile }) => {
  const [formData, setFormData] = useState<Omit<UserProfile, 'dailyGoal'>>({
    name: initialProfile?.name || '',
    age: initialProfile?.age || 25,
    weight: initialProfile?.weight || 70,
    weightUnit: initialProfile?.weightUnit || WeightUnit.KG,
    height: initialProfile?.height || 170,
    gender: initialProfile?.gender || Gender.MALE,
    activityLevel: initialProfile?.activityLevel || ActivityLevel.LIGHT,
    exerciseMinutesPerSession: initialProfile?.exerciseMinutesPerSession || 45,
    exerciseDaysPerWeek: initialProfile?.exerciseDaysPerWeek || 3,
    climate: initialProfile?.climate || Climate.MODERATE,
    caffeineCups: initialProfile?.caffeineCups || 1,
    hasMedicalCondition: initialProfile?.hasMedicalCondition || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dailyGoal = calculateHydrationGoal(formData);
    onComplete({ ...formData, dailyGoal });
  };

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto bg-slate-900 border border-sky-900/30 rounded-[3rem] shadow-2xl overflow-hidden p-8 md:p-12 mb-20 backdrop-blur-xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-sky-500/10 rounded-3xl mb-4 border border-sky-500/20">
            <Cloud className="w-8 h-8 text-sky-400" />
        </div>
        <h2 className="text-4xl font-black text-white italic tracking-tighter">Your Sky Profile</h2>
        <p className="text-sky-700 font-bold uppercase tracking-widest text-[10px] mt-4">Precision calibration for atmospheric hydration</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        <section className="space-y-8">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500 flex items-center gap-3 pb-3 border-b border-sky-900/20">
            <User className="w-4 h-4" /> 01. Personal Identity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-sky-700 ml-1">Name</label>
              <input
                type="text"
                required
                className="w-full px-6 py-4 bg-sky-950/50 border border-sky-900/50 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:bg-sky-900/30 outline-none transition-all font-black text-white placeholder-sky-900"
                placeholder="Identity Label"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-sky-700 ml-1">Age</label>
                <input
                  type="number"
                  className="w-full px-6 py-4 bg-sky-950/50 border border-sky-900/50 rounded-2xl font-black text-white outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                  value={formData.age}
                  onChange={(e) => updateField('age', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-sky-700 ml-1">Gender</label>
                <select
                  className="w-full px-6 py-4 bg-sky-950/50 border border-sky-900/50 rounded-2xl font-black text-white outline-none appearance-none"
                  value={formData.gender}
                  onChange={(e) => updateField('gender', e.target.value as Gender)}
                >
                  <option value={Gender.MALE}>Male</option>
                  <option value={Gender.FEMALE}>Female</option>
                  <option value={Gender.OTHER}>Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-sky-700 ml-1">Current Weight</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  className="flex-1 px-6 py-4 bg-sky-950/50 border border-sky-900/50 rounded-2xl font-black text-white outline-none"
                  value={formData.weight}
                  onChange={(e) => updateField('weight', parseInt(e.target.value))}
                />
                <select
                  className="w-24 px-4 py-4 bg-sky-950/50 border border-sky-900/50 rounded-2xl font-black text-sky-400 outline-none appearance-none text-center"
                  value={formData.weightUnit}
                  onChange={(e) => updateField('weightUnit', e.target.value as WeightUnit)}
                >
                  <option value={WeightUnit.KG}>kg</option>
                  <option value={WeightUnit.LBS}>lbs</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-sky-700 ml-1">Height (cm)</label>
              <div className="relative">
                <Ruler className="absolute right-5 top-1/2 -translate-y-1/2 text-sky-800 w-5 h-5" />
                <input
                  type="number"
                  className="w-full px-6 py-4 bg-sky-950/50 border border-sky-900/50 rounded-2xl font-black text-white outline-none"
                  value={formData.height}
                  onChange={(e) => updateField('height', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500 flex items-center gap-3 pb-3 border-b border-sky-900/20">
            <Activity className="w-4 h-4" /> 02. Lifestyle Biometrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 p-7 bg-sky-950/20 border border-sky-900/30 rounded-[2.5rem]">
              <label className="text-[10px] font-black text-sky-600 uppercase flex items-center gap-3 tracking-widest">
                <Calendar className="w-4 h-4" /> Exercise Frequency
              </label>
              <div className="flex justify-between items-center gap-6">
                <input
                  type="range"
                  min="0"
                  max="7"
                  className="w-full h-2 bg-sky-900 rounded-full appearance-none cursor-pointer accent-sky-400"
                  value={formData.exerciseDaysPerWeek}
                  onChange={(e) => updateField('exerciseDaysPerWeek', parseInt(e.target.value))}
                />
                <span className="text-2xl font-black text-sky-400 w-12 text-right">{formData.exerciseDaysPerWeek}d</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-sky-700 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Timer className="w-3 h-3" /> Session Duration (Min)
              </label>
              <input
                type="number"
                className="w-full px-6 py-4 bg-sky-950/50 border border-sky-900/50 rounded-2xl font-black text-white outline-none focus:ring-2 focus:ring-sky-500"
                value={formData.exerciseMinutesPerSession}
                onChange={(e) => updateField('exerciseMinutesPerSession', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-sky-700 uppercase tracking-widest ml-1 flex items-center gap-2">
                <CloudSun className="w-3 h-3" /> Average Climate
              </label>
              <select
                className="w-full px-6 py-4 bg-sky-950/50 border border-sky-900/50 rounded-2xl font-black text-white outline-none appearance-none"
                value={formData.climate}
                onChange={(e) => updateField('climate', e.target.value as Climate)}
              >
                {Object.values(Climate).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-sky-700 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Coffee className="w-3 h-3" /> Caffeine Consumption
              </label>
              <input
                type="number"
                className="w-full px-6 py-4 bg-sky-950/50 border border-sky-900/50 rounded-2xl font-black text-white outline-none"
                value={formData.caffeineCups}
                onChange={(e) => updateField('caffeineCups', parseInt(e.target.value))}
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500 flex items-center gap-3 pb-3 border-b border-sky-900/20">
            <HeartPulse className="w-4 h-4" /> 03. Medical Overlay
          </h3>
          <div className="bg-sky-950/40 border border-sky-800/50 rounded-[2.5rem] p-7 space-y-5">
            <div className="flex items-start gap-5">
              <div className="mt-1">
                <input
                  type="checkbox"
                  id="medCondition"
                  className="w-6 h-6 rounded-lg border-sky-800 bg-sky-950 text-sky-500 focus:ring-sky-500 cursor-pointer"
                  checked={formData.hasMedicalCondition}
                  onChange={(e) => updateField('hasMedicalCondition', e.target.checked)}
                />
              </div>
              <label htmlFor="medCondition" className="flex-1 cursor-pointer">
                <div className="text-sm font-black text-white italic">Active health conditions?</div>
                <div className="text-[10px] font-bold text-sky-800 uppercase tracking-widest mt-1">
                  (Includes medications affecting hydration levels)
                </div>
              </label>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-sky-900/20 rounded-2xl border border-sky-800/30">
              <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <p className="text-[9px] font-bold text-sky-800 leading-normal uppercase tracking-tighter">
                System Recommendation: Always align with professional medical oversight.
              </p>
            </div>
          </div>
        </section>

        <div className="pt-8">
          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-400 text-white font-black py-7 rounded-[2.5rem] shadow-2xl shadow-sky-500/20 transition-all transform hover:scale-[1.01] active:scale-95 text-lg uppercase tracking-[0.3em] italic"
          >
            {initialProfile ? 'Update Trajectory' : 'Calibrate Horizon'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetupForm;
