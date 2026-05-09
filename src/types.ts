export type Role = 'admin' | 'trainer' | 'client';
export type GymPlan = 'local' | 'basic' | 'pro' | 'premium';

export interface Gym {
  id: string;
  name: string;
  slug: string;
  plan: GymPlan;
  active: boolean;
  createdAt: string;
  logoUrl?: string;
  primaryColor?: string;
  welcomeMessage?: string;
}

export interface User {
  id: string;
  gymId?: string;
  email: string;
  name: string;
  role: Role;
  trainerId?: string;
  phone?: string;
  createdAt: string;
  avatar?: string;
  [key: string]: unknown;
}

export interface ClientProfile {
  gymId?: string;
  userId: string;
  age?: number;
  gender?: 'M' | 'F' | 'otro';
  birthDate?: string;
  medicalHistory?: string;
  objective?: string;
  frequency?: string;
  duration?: string;
  scheduleTime?: string;
  startDate?: string;
}

export interface Measurement {
  id: string;
  gymId?: string;
  clientId: string;
  date: string;
  weight?: number;
  height?: number;
  chest?: number;
  waist?: number;
  hip?: number;
  leftArm?: number;
  rightArm?: number;
  leftThigh?: number;
  rightThigh?: number;
  leftCalf?: number;
  rightCalf?: number;
  bodyFat?: number;
  imc?: number;
  notes?: string;
}

export type ExerciseCategory = 'warmup' | 'core' | 'lower' | 'push' | 'pull' | 'cardio' | 'stretch';

export interface ExerciseSet {
  reps?: string;
  weight?: string;
  rest?: string;
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  sets: ExerciseSet[];
  observations?: string;
}

export interface TrainingProgram {
  id: string;
  gymId?: string;
  clientId: string;
  trainerId: string;
  name: string;
  startDate: string;
  endDate?: string;
  frequency?: string;
  objective?: string;
  evaluation?: {
    resistance?: string;
    strength?: string;
    flexibility?: string;
    notes?: string;
  };
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

export interface Branding {
  gymId?: string;
  gymName: string;
  primaryColor: string;
  logoUrl?: string;
  welcomeMessage?: string;
}
