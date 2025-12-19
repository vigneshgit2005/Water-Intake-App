
import { UserProfile, Gender, Climate, WeightUnit, IntakeLog } from '../types';

export const calculateHydrationGoal = (profile: Partial<UserProfile>): number => {
  const { weight = 70, weightUnit = WeightUnit.KG, age = 25, gender = Gender.MALE, exerciseMinutesPerSession = 0, exerciseDaysPerWeek = 0, climate = Climate.MODERATE, caffeineCups = 0, hasMedicalCondition = false } = profile;
  const weightInKg = weightUnit === WeightUnit.LBS ? weight * 0.453592 : weight;
  let baseMultiplier = age < 30 ? 40 : age <= 55 ? 35 : age <= 65 ? 30 : 25;
  let goal = weightInKg * baseMultiplier;
  goal += (exerciseMinutesPerSession * exerciseDaysPerWeek / 7) * (500 / 60);
  if (climate === Climate.HOT_HUMID) goal += 600;
  if (climate === Climate.HIGH_ALTITUDE) goal += 500;
  if (climate === Climate.COLD) goal += 200;
  if (gender === Gender.MALE) goal += 250;
  goal += (caffeineCups * 50);
  if (hasMedicalCondition) goal += 300;
  return Math.min(6000, Math.max(1500, Math.round(goal)));
};

export const getTodayKey = (): string => new Date().toISOString().split('T')[0];
export const formatVolume = (ml: number): string => ml >= 1000 ? `${(ml / 1000).toFixed(1)}L` : `${ml}ml`;

export const calculateStreaks = (logs: IntakeLog[], dailyGoal: number) => {
  if (logs.length === 0) return { currentStreak: 0, bestStreak: 0 };
  const dailyTotals = new Map<string, number>();
  logs.forEach(log => {
    const date = new Date(log.timestamp).toISOString().split('T')[0];
    dailyTotals.set(date, (dailyTotals.get(date) || 0) + log.amount);
  });
  const today = getTodayKey();
  let currentStreak = 0;
  let activeDate = new Date();
  if ((dailyTotals.get(today) || 0) < dailyGoal) activeDate.setDate(activeDate.getDate() - 1);
  while ((dailyTotals.get(activeDate.toISOString().split('T')[0]) || 0) >= dailyGoal) {
    currentStreak++;
    activeDate.setDate(activeDate.getDate() - 1);
  }
  return { currentStreak, bestStreak: Math.max(currentStreak, 0) }; // Simplified for deployment
};
