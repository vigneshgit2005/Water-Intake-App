
import { UserProfile, Gender, ActivityLevel, IntakeLog } from '../types';

export const calculateHydrationGoal = (
  weight: number,
  height: number,
  gender: Gender,
  activityLevel: ActivityLevel
): number => {
  let goal = weight * 35;
  if (height > 180) goal += 200;
  if (gender === Gender.MALE) goal += 300;

  switch (activityLevel) {
    case ActivityLevel.LIGHT: goal += 300; break;
    case ActivityLevel.MODERATE: goal += 600; break;
    case ActivityLevel.ACTIVE: goal += 1000; break;
  }

  return Math.round(goal);
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

export const calculateStreaks = (logs: IntakeLog[], dailyGoal: number): StreakStats => {
  if (logs.length === 0) return { currentStreak: 0, bestStreak: 0 };

  // Group logs by date
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

  // Calculate best streak (all time)
  // We need to iterate through all possible dates from the first log to today
  if (sortedDates.length > 0) {
    const firstDate = new Date(sortedDates[sortedDates.length - 1]);
    const lastDate = new Date();
    const iterDate = new Date(firstDate);
    
    while (iterDate <= lastDate) {
      const key = iterDate.toISOString().split('T')[0];
      const total = dailyTotals.get(key) || 0;
      
      if (total >= dailyGoal) {
        tempStreak++;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
      } else {
        // If it's today and goal not met, don't break the streak yet for "current" calculation
        // but for "best" calculation it breaks.
        if (key !== today) {
           tempStreak = 0;
        }
      }
      iterDate.setDate(iterDate.getDate() + 1);
    }
  }

  // Calculate current streak specifically (looking backwards from today/yesterday)
  let checkDate = new Date();
  // If today's goal is met, start from today. 
  // If not, but yesterday was met, the streak is still alive (it's the count up to yesterday).
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
