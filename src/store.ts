import { create } from 'zustand';
import { storage, uid } from './storage';
import type {
  User,
  ClientProfile,
  Measurement,
  TrainingProgram,
  Branding,
} from './types';

interface State {
  currentUser: User | null;
  users: User[];
  profiles: ClientProfile[];
  measurements: Measurement[];
  programs: TrainingProgram[];
  branding: Branding;

  init: () => void;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;

  createUser: (u: Omit<User, 'id' | 'createdAt'>) => User;
  updateUser: (id: string, u: Partial<User>) => void;
  deleteUser: (id: string) => void;

  upsertProfile: (p: ClientProfile) => void;

  addMeasurement: (m: Omit<Measurement, 'id'>) => Measurement;
  updateMeasurement: (id: string, m: Partial<Measurement>) => void;
  deleteMeasurement: (id: string) => void;

  upsertProgram: (p: Omit<TrainingProgram, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => TrainingProgram;
  deleteProgram: (id: string) => void;

  updateBranding: (b: Branding) => void;
}

export const useStore = create<State>((set, get) => ({
  currentUser: null,
  users: [],
  profiles: [],
  measurements: [],
  programs: [],
  branding: storage.getBranding(),

  init: () => {
    const users = storage.getUsers();
    const profiles = storage.getProfiles();
    const measurements = storage.getMeasurements();
    const programs = storage.getPrograms();
    const branding = storage.getBranding();
    const sessionId = storage.getSession();
    const currentUser = sessionId ? users.find((u) => u.id === sessionId) ?? null : null;
    set({ users, profiles, measurements, programs, branding, currentUser });
    document.documentElement.style.setProperty('--brand-color', branding.primaryColor);
  },

  login: (email, password) => {
    const user = get().users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return { ok: false, error: 'Correo o contraseña incorrectos' };
    storage.setSession(user.id);
    set({ currentUser: user });
    return { ok: true };
  },

  logout: () => {
    storage.setSession(null);
    set({ currentUser: null });
  },

  createUser: (u) => {
    const newUser: User = { ...u, id: uid('u'), createdAt: new Date().toISOString() };
    const users = [...get().users, newUser];
    storage.setUsers(users);
    set({ users });
    return newUser;
  },

  updateUser: (id, patch) => {
    const users = get().users.map((u) => (u.id === id ? { ...u, ...patch } : u));
    storage.setUsers(users);
    set({ users });
    if (get().currentUser?.id === id) {
      set({ currentUser: users.find((u) => u.id === id) ?? null });
    }
  },

  deleteUser: (id) => {
    const users = get().users.filter((u) => u.id !== id);
    const profiles = get().profiles.filter((p) => p.userId !== id);
    const measurements = get().measurements.filter((m) => m.clientId !== id);
    const programs = get().programs.filter((p) => p.clientId !== id);
    storage.setUsers(users);
    storage.setProfiles(profiles);
    storage.setMeasurements(measurements);
    storage.setPrograms(programs);
    set({ users, profiles, measurements, programs });
  },

  upsertProfile: (p) => {
    const existing = get().profiles.find((x) => x.userId === p.userId);
    const profiles = existing
      ? get().profiles.map((x) => (x.userId === p.userId ? { ...x, ...p } : x))
      : [...get().profiles, p];
    storage.setProfiles(profiles);
    set({ profiles });
  },

  addMeasurement: (m) => {
    const newM: Measurement = { ...m, id: uid('m') };
    const measurements = [...get().measurements, newM];
    storage.setMeasurements(measurements);
    set({ measurements });
    return newM;
  },

  updateMeasurement: (id, patch) => {
    const measurements = get().measurements.map((m) => (m.id === id ? { ...m, ...patch } : m));
    storage.setMeasurements(measurements);
    set({ measurements });
  },

  deleteMeasurement: (id) => {
    const measurements = get().measurements.filter((m) => m.id !== id);
    storage.setMeasurements(measurements);
    set({ measurements });
  },

  upsertProgram: (p) => {
    const now = new Date().toISOString();
    if (p.id) {
      const existing = get().programs.find((x) => x.id === p.id);
      if (existing) {
        const updated: TrainingProgram = { ...existing, ...p, id: p.id, updatedAt: now };
        const programs = get().programs.map((x) => (x.id === p.id ? updated : x));
        storage.setPrograms(programs);
        set({ programs });
        return updated;
      }
    }
    const created: TrainingProgram = {
      ...p,
      id: p.id ?? uid('p'),
      createdAt: now,
      updatedAt: now,
    } as TrainingProgram;
    const programs = [...get().programs, created];
    storage.setPrograms(programs);
    set({ programs });
    return created;
  },

  deleteProgram: (id) => {
    const programs = get().programs.filter((p) => p.id !== id);
    storage.setPrograms(programs);
    set({ programs });
  },

  updateBranding: (b) => {
    storage.setBranding(b);
    set({ branding: b });
    document.documentElement.style.setProperty('--brand-color', b.primaryColor);
  },
}));
