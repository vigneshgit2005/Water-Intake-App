
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export enum ActivityLevel {
  SEDENTARY = 'Sedentary',
  LIGHT = 'Light',
  MODERATE = 'Moderate',
  ACTIVE = 'Very Active'
}

export interface UserProfile {
  name: string;
  weight: number; // in kg
  height: number; // in cm
  gender: Gender;
  age: number;
  activityLevel: ActivityLevel;
  dailyGoal: number; // in ml
}

export interface IntakeLog {
  id: string;
  amount: number; // in ml
  timestamp: number;
  type: string; // e.g., "Water", "Tea", "Coffee"
}

export interface DailySummary {
  date: string; // YYYY-MM-DD
  total: number;
  goal: number;
}
