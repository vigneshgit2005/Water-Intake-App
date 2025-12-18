
import { UserProfile, Gender, Climate, WeightUnit, IntakeLog } from '../types';

export const calculateHydrationGoal = (
  profile: Partial<UserProfile>
): number => {
  const { 
    weight = 70, 
    weightUnit = WeightUnit.KG,
    age = 25, 
    gender = Gender.MALE, 
    exerciseMinutesPerSession = 0, 
    exerciseDaysPerWeek = 0,
    climate = Climate.MODERATE,
    caffeineCups = 0,
    hasMedicalCondition = false
  } = profile;

  // Convert weight to kg for internal calculation
  const weightInKg = weightUnit === WeightUnit.LBS ? weight * 0.453592 : weight;

  // 1. Base Multiplier by Age
  // Under 30: 40 mL/kg
  // 30–55: 35 mL/kg
  // 55–65: 30 mL/kg
  // Over 65: 25 mL/kg
  let baseMultiplier = 35;
  if (age < 30) baseMultiplier = 40;
  else if (age <= 55) baseMultiplier = 35;
  else if (age <= 65) baseMultiplier = 30;
  else baseMultiplier = 25;

  let goal = weightInKg * baseMultiplier;

  // 2. Exercise Adjustment
  // Adding ~500ml per hour of moderate exercise
  const weeklyExerciseMinutes = exerciseMinutesPerSession * exerciseDaysPerWeek;
  const dailyExerciseAdjustment = (weeklyExerciseMinutes / 7) * (500 / 60);
  goal += dailyExerciseAdjustment;

  // 3. Climate Adjustment
  if (climate === Climate.HOT_HUMID) goal += 600; // Significant sweat loss
  if (climate === Climate.HIGH_ALTITUDE) goal += 500; // Dry air and faster breathing
  if (climate === Climate.COLD) goal += 200; // Increased fluid loss through respiratory moisture

  // 4. Gender Adjustment
  if (gender === Gender.MALE) goal += 250; // Typically higher muscle mass

  // 5. Caffeine Consumption
  // Offset diuretic effects by adding 50ml per cup of caffeine
  goal += (caffeineCups * 50);

  // 6. Medical Condition Adjustment
  // Generic +300ml buffer if self-reported condition, but with a warning in UI
  if (hasMedicalCondition) goal += 300;

  // Minimum safety floor and maximum cap
  return Math.min(6000, Math.max(1500, Math.round(goal)));
};

export const getTodayKey = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const formatVolume = (ml: number): string => {
  if (ml >= 1000) {
    return `${(ml / 1000).toFixed(1)}L`;
  }
  return `${ml}ml`;
};

export interface StreakStats {
  currentStreak: number;
  bestStreak: number;
}

// Added IntakeLog to imports above to fix line 77 error
export const calculateStreaks = (logs: IntakeLog[], dailyGoal: number): StreakStats => {
  if (logs.length === 0) return { currentStreak: 0, bestStreak: 0 };

  const dailyTotals = new Map<string, number>();
  logs.forEach(log => {
    const date = new Date(log.timestamp).toISOString().split('T')[0];
    dailyTotals.set(date, (dailyTotals.get(date) || 0) + log.amount);
  });

  const sortedDates = Array.from(dailyTotals.keys()).sort().reverse();
  const today = getTodayKey();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().split('T')[0];

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  if (sortedDates.length > 0) {
    const firstDateStr = sortedDates[sortedDates.length - 1];
    const firstDate = new Date(firstDateStr);
    const lastDate = new Date();
    const iterDate = new Date(firstDate);
    
    while (iterDate <= lastDate) {
      const key = iterDate.toISOString().split('T')[0];
      const total = dailyTotals.get(key) || 0;
      
      if (total >= dailyGoal) {
        tempStreak++;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
      } else {
        if (key !== today) {
           tempStreak = 0;
        }
      }
      iterDate.setDate(iterDate.getDate() + 1);
    }
  }

  const todayTotal = dailyTotals.get(today) || 0;
  const yesterdayTotal = dailyTotals.get(yesterdayKey) || 0;

  if (todayTotal < dailyGoal && yesterdayTotal < dailyGoal) {
    currentStreak = 0;
  } else {
    let activeDate = todayTotal >= dailyGoal ? new Date() : yesterday;
    while (true) {
      const key = activeDate.toISOString().split('T')[0];
      if ((dailyTotals.get(key) || 0) >= dailyGoal) {
        currentStreak++;
        activeDate.setDate(activeDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  return { currentStreak, bestStreak };
};
