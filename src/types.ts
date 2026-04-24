export type Role = 'admin' | 'trainer' | 'client';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  trainerId?: string;
  phone?: string;
  createdAt: string;
  avatar?: string;
}

export interface ClientProfile {
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

export type ExerciseCategory =
  | 'warmup'
  | 'core'
  | 'lower'
  | 'push'
  | 'pull'
  | 'cardio'
  | 'stretch';

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
  gymName: string;
  primaryColor: string;
  logoUrl?: string;
  welcomeMessage?: string;
}
