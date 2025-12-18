
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

export enum Climate {
  HOT_HUMID = 'Hot/Humid',
  MODERATE = 'Moderate',
  COLD = 'Cold',
  HIGH_ALTITUDE = 'High Altitude'
}

export enum WeightUnit {
  KG = 'kg',
  LBS = 'lbs'
}

export interface UserProfile {
  name: string;
  weight: number; 
  weightUnit: WeightUnit;
  height: number; // in cm
  gender: Gender;
  age: number;
  activityLevel: ActivityLevel;
  exerciseMinutesPerSession: number;
  exerciseDaysPerWeek: number;
  climate: Climate;
  caffeineCups: number;
  hasMedicalCondition: boolean;
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
