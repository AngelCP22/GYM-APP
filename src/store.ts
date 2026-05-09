import { create } from 'zustand';
import { storage, uid } from './storage';
import type {
  User,
  ClientProfile,
  Measurement,
  TrainingProgram,
  Branding,
  Gym,
} from './types';

interface State {
  currentUser: User | null;
  currentGym: Gym | null;
  gyms: Gym[];
  users: User[];
  profiles: ClientProfile[];
  measurements: Measurement[];
  programs: TrainingProgram[];
  branding: Branding;

  init: () => void;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;

  createUser: (u: Omit<User, 'id' | 'createdAt' | 'gymId'> & { gymId?: string }) => User;
  updateUser: (id: string, u: Partial<User>) => void;
  deleteUser: (id: string) => void;

  upsertProfile: (p: ClientProfile) => void;

  addMeasurement: (m: Omit<Measurement, 'id' | 'gymId'> & { gymId?: string }) => Measurement;
  updateMeasurement: (id: string, m: Partial<Measurement>) => void;
  deleteMeasurement: (id: string) => void;

  upsertProgram: (p: Omit<TrainingProgram, 'id' | 'createdAt' | 'updatedAt' | 'gymId'> & { id?: string; gymId?: string }) => TrainingProgram;
  deleteProgram: (id: string) => void;

  updateBranding: (b: Branding) => void;
}

function scoped<T extends { gymId: string }>(items: T[], gymId?: string) {
  return gymId ? items.filter((item) => item.gymId === gymId) : items;
}

function getActiveGymId(get: () => State) {
  return get().currentUser?.gymId ?? storage.defaultGymId;
}

export const useStore = create<State>((set, get) => ({
  currentUser: null,
  currentGym: null,
  gyms: [],
  users: [],
  profiles: [],
  measurements: [],
  programs: [],
  branding: storage.getBranding(),

  init: () => {
    const gyms = storage.getGyms();
    const allUsers = storage.getUsers();
    const allProfiles = storage.getProfiles();
    const allMeasurements = storage.getMeasurements();
    const allPrograms = storage.getPrograms();
    const branding = storage.getBranding();
    const sessionId = storage.getSession();
    const currentUser = sessionId ? allUsers.find((u) => u.id === sessionId) ?? null : null;
    const gymId = currentUser?.gymId ?? storage.defaultGymId;
    const currentGym = gyms.find((g) => g.id === gymId) ?? gyms[0] ?? null;

    set({
      gyms,
      currentGym,
      currentUser,
      users: scoped(allUsers, gymId),
      profiles: scoped(allProfiles, gymId),
      measurements: scoped(allMeasurements, gymId),
      programs: scoped(allPrograms, gymId),
      branding: branding.gymId === gymId ? branding : { ...branding, gymId },
    });
    document.documentElement.style.setProperty('--brand-color', branding.primaryColor);
  },

  login: (email, password) => {
    const allUsers = storage.getUsers();
    const user = allUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return { ok: false, error: 'Correo o contraseña incorrectos' };

    const gymId = user.gymId;
    const gyms = storage.getGyms();
    const currentGym = gyms.find((g) => g.id === gymId) ?? null;
    if (currentGym && !currentGym.active) return { ok: false, error: 'El gimnasio está inactivo' };

    storage.setSession(user.id);
    set({
      currentUser: user,
      currentGym,
      users: scoped(allUsers, gymId),
      profiles: scoped(storage.getProfiles(), gymId),
      measurements: scoped(storage.getMeasurements(), gymId),
      programs: scoped(storage.getPrograms(), gymId),
    });
    return { ok: true };
  },

  logout: () => {
    storage.setSession(null);
    set({ currentUser: null, currentGym: null });
  },

  createUser: (u) => {
    const gymId = u.gymId ?? getActiveGymId(get);
    const newUser: User = { ...u, gymId, id: uid('u'), createdAt: new Date().toISOString() };
    const allUsers = [...storage.getUsers(), newUser];
    storage.setUsers(allUsers);
    set({ users: scoped(allUsers, gymId) });
    return newUser;
  },

  updateUser: (id, patch) => {
    const gymId = getActiveGymId(get);
    const allUsers = storage.getUsers().map((u) => (u.id === id ? { ...u, ...patch } : u));
    storage.setUsers(allUsers);
    const users = scoped(allUsers, gymId);
    set({ users });
    if (get().currentUser?.id === id) {
      set({ currentUser: allUsers.find((u) => u.id === id) ?? null });
    }
  },

  deleteUser: (id) => {
    const gymId = getActiveGymId(get);
    const allUsers = storage.getUsers().filter((u) => u.id !== id);
    const allProfiles = storage.getProfiles().filter((p) => p.userId !== id);
    const allMeasurements = storage.getMeasurements().filter((m) => m.clientId !== id);
    const allPrograms = storage.getPrograms().filter((p) => p.clientId !== id && p.trainerId !== id);
    storage.setUsers(allUsers);
    storage.setProfiles(allProfiles);
    storage.setMeasurements(allMeasurements);
    storage.setPrograms(allPrograms);
    set({
      users: scoped(allUsers, gymId),
      profiles: scoped(allProfiles, gymId),
      measurements: scoped(allMeasurements, gymId),
      programs: scoped(allPrograms, gymId),
    });
  },

  upsertProfile: (p) => {
    const gymId = p.gymId ?? getActiveGymId(get);
    const allProfiles = storage.getProfiles();
    const existing = allProfiles.find((x) => x.userId === p.userId && x.gymId === gymId);
    const nextProfile = { ...p, gymId };
    const profiles = existing
      ? allProfiles.map((x) => (x.userId === p.userId && x.gymId === gymId ? { ...x, ...nextProfile } : x))
      : [...allProfiles, nextProfile];
    storage.setProfiles(profiles);
    set({ profiles: scoped(profiles, gymId) });
  },

  addMeasurement: (m) => {
    const gymId = m.gymId ?? getActiveGymId(get);
    const newM: Measurement = { ...m, gymId, id: uid('m') };
    const allMeasurements = [...storage.getMeasurements(), newM];
    storage.setMeasurements(allMeasurements);
    set({ measurements: scoped(allMeasurements, gymId) });
    return newM;
  },

  updateMeasurement: (id, patch) => {
    const gymId = getActiveGymId(get);
    const allMeasurements = storage.getMeasurements().map((m) => (m.id === id ? { ...m, ...patch } : m));
    storage.setMeasurements(allMeasurements);
    set({ measurements: scoped(allMeasurements, gymId) });
  },

  deleteMeasurement: (id) => {
    const gymId = getActiveGymId(get);
    const allMeasurements = storage.getMeasurements().filter((m) => m.id !== id);
    storage.setMeasurements(allMeasurements);
    set({ measurements: scoped(allMeasurements, gymId) });
  },

  upsertProgram: (p) => {
    const gymId = p.gymId ?? getActiveGymId(get);
    const now = new Date().toISOString();
    const allPrograms = storage.getPrograms();
    if (p.id) {
      const existing = allPrograms.find((x) => x.id === p.id && x.gymId === gymId);
      if (existing) {
        const updated: TrainingProgram = { ...existing, ...p, gymId, id: p.id, updatedAt: now };
        const programs = allPrograms.map((x) => (x.id === p.id ? updated : x));
        storage.setPrograms(programs);
        set({ programs: scoped(programs, gymId) });
        return updated;
      }
    }
    const created: TrainingProgram = {
      ...p,
      gymId,
      id: p.id ?? uid('p'),
      createdAt: now,
      updatedAt: now,
    } as TrainingProgram;
    const programs = [...allPrograms, created];
    storage.setPrograms(programs);
    set({ programs: scoped(programs, gymId) });
    return created;
  },

  deleteProgram: (id) => {
    const gymId = getActiveGymId(get);
    const allPrograms = storage.getPrograms().filter((p) => p.id !== id);
    storage.setPrograms(allPrograms);
    set({ programs: scoped(allPrograms, gymId) });
  },

  updateBranding: (b) => {
    const gymId = b.gymId ?? getActiveGymId(get);
    const next = { ...b, gymId };
    storage.setBranding(next);
    set({ branding: next });
    document.documentElement.style.setProperty('--brand-color', next.primaryColor);
  },
}));
