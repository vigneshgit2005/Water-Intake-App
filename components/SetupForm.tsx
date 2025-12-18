
import React, { useState } from 'react';
import { UserProfile, Gender, ActivityLevel } from '../types';
import { calculateHydrationGoal } from '../utils/calculations';
import { User, Activity, Ruler, Weight } from 'lucide-react';

interface SetupFormProps {
  onComplete: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
}

const SetupForm: React.FC<SetupFormProps> = ({ onComplete, initialProfile }) => {
  const [formData, setFormData] = useState({
    name: initialProfile?.name || '',
    age: initialProfile?.age || 25,
    weight: initialProfile?.weight || 70,
    height: initialProfile?.height || 170,
    gender: initialProfile?.gender || Gender.MALE,
    activityLevel: initialProfile?.activityLevel || ActivityLevel.LIGHT,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dailyGoal = calculateHydrationGoal(
      formData.weight,
      formData.height,
      formData.gender,
      formData.activityLevel
    );
    onComplete({ ...formData, dailyGoal });
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Welcome to HydrateMe</h2>
        <p className="text-slate-500 mt-2">Let's calculate your personalized daily goal.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              required
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all outline-none"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
            <input
              type="number"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
            <select
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none appearance-none"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
            >
              <option value={Gender.MALE}>Male</option>
              <option value={Gender.FEMALE}>Female</option>
              <option value={Gender.OTHER}>Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
            <div className="relative">
              <Weight className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="number"
                required
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="number"
                required
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Activity Level</label>
          <div className="relative">
            <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <select
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none appearance-none"
              value={formData.activityLevel}
              onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as ActivityLevel })}
            >
              <option value={ActivityLevel.SEDENTARY}>Sedentary (Rarely active)</option>
              <option value={ActivityLevel.LIGHT}>Lightly Active (1-3 days/week)</option>
              <option value={ActivityLevel.MODERATE}>Moderately Active (3-5 days/week)</option>
              <option value={ActivityLevel.ACTIVE}>Very Active (Daily exercise)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all transform hover:scale-[1.02] active:scale-95"
        >
          {initialProfile ? 'Update Goal' : 'Start Hydrating'}
        </button>
      </form>
    </div>
  );
};

export default SetupForm;
