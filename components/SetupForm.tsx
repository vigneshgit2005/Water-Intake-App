
import React, { useState } from 'react';
import { UserProfile, Gender, ActivityLevel, Climate, WeightUnit } from '../types';
import { calculateHydrationGoal } from '../utils/calculations';
import { User, Activity, Ruler, Weight, CloudSun, Coffee, Timer, Calendar, HeartPulse, Info } from 'lucide-react';

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
    <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-12 mb-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">Your Hydration Profile</h2>
        <p className="text-slate-400 font-medium mt-3">We need a few details to calculate your precision daily goal.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2 pb-2 border-b border-slate-50">
            <User className="w-4 h-4" /> 1. Personal Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:bg-white outline-none transition-all font-bold"
                placeholder="How should we call you?"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Age</label>
                <input
                  type="number"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                  value={formData.age}
                  onChange={(e) => updateField('age', parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Gender</label>
                <select
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none appearance-none"
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
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1">Weight</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none"
                  value={formData.weight}
                  onChange={(e) => updateField('weight', parseInt(e.target.value))}
                />
                <select
                  className="w-24 px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none appearance-none text-center"
                  value={formData.weightUnit}
                  onChange={(e) => updateField('weightUnit', e.target.value as WeightUnit)}
                >
                  <option value={WeightUnit.KG}>kg</option>
                  <option value={WeightUnit.LBS}>lbs</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1">Height (cm)</label>
              <div className="relative">
                <Ruler className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                <input
                  type="number"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none"
                  value={formData.height}
                  onChange={(e) => updateField('height', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2 pb-2 border-b border-slate-50">
            <Activity className="w-4 h-4" /> 2. Exercise & Lifestyle
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3 p-6 bg-slate-50 rounded-3xl">
              <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Exercise Frequency
              </label>
              <div className="flex justify-between items-center">
                <input
                  type="range"
                  min="0"
                  max="7"
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mr-4"
                  value={formData.exerciseDaysPerWeek}
                  onChange={(e) => updateField('exerciseDaysPerWeek', parseInt(e.target.value))}
                />
                <span className="text-xl font-black text-blue-600 w-12 text-right">{formData.exerciseDaysPerWeek}d</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">How many days per week do you workout?</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-1.5">
                <Timer className="w-3 h-3" /> Duration (Minutes per session)
              </label>
              <input
                type="number"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.exerciseMinutesPerSession}
                onChange={(e) => updateField('exerciseMinutesPerSession', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-1.5">
                <CloudSun className="w-3 h-3" /> Typical Climate
              </label>
              <select
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none appearance-none"
                value={formData.climate}
                onChange={(e) => updateField('climate', e.target.value as Climate)}
              >
                {Object.values(Climate).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-1.5">
                <Coffee className="w-3 h-3" /> Daily Caffeine (Cups)
              </label>
              <input
                type="number"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none"
                value={formData.caffeineCups}
                onChange={(e) => updateField('caffeineCups', parseInt(e.target.value))}
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2 pb-2 border-b border-slate-50">
            <HeartPulse className="w-4 h-4" /> 3. Health Status
          </h3>
          <div className="bg-orange-50/50 border border-orange-100 rounded-3xl p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <input
                  type="checkbox"
                  id="medCondition"
                  className="w-5 h-5 rounded-md border-orange-200 text-orange-500 focus:ring-orange-500 cursor-pointer"
                  checked={formData.hasMedicalCondition}
                  onChange={(e) => updateField('hasMedicalCondition', e.target.checked)}
                />
              </div>
              <label htmlFor="medCondition" className="flex-1 cursor-pointer">
                <div className="text-sm font-black text-slate-800">Existing health conditions?</div>
                <div className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">
                  (e.g., Kidney issues, active infections, or medications that affect hydration).
                </div>
              </label>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-orange-50">
              <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold text-slate-400 leading-normal">
                Note: Our algorithm adjusts intake for health states, but if you have a specific medical condition, please follow your physician's advice.
              </p>
            </div>
          </div>
        </section>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-blue-100 transition-all transform hover:scale-[1.02] active:scale-95 text-lg uppercase tracking-[0.2em]"
          >
            {initialProfile ? 'Update My Plan' : 'Calculate My Goal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetupForm;
