import type {
  User,
  ClientProfile,
  Measurement,
  TrainingProgram,
  Branding,
} from './types';

const KEYS = {
  users: 'gym.users',
  profiles: 'gym.profiles',
  measurements: 'gym.measurements',
  programs: 'gym.programs',
  session: 'gym.session',
  branding: 'gym.branding',
  seeded: 'gym.seeded',
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getUsers: () => read<User[]>(KEYS.users, []),
  setUsers: (u: User[]) => write(KEYS.users, u),

  getProfiles: () => read<ClientProfile[]>(KEYS.profiles, []),
  setProfiles: (p: ClientProfile[]) => write(KEYS.profiles, p),

  getMeasurements: () => read<Measurement[]>(KEYS.measurements, []),
  setMeasurements: (m: Measurement[]) => write(KEYS.measurements, m),

  getPrograms: () => read<TrainingProgram[]>(KEYS.programs, []),
  setPrograms: (p: TrainingProgram[]) => write(KEYS.programs, p),

  getSession: () => read<string | null>(KEYS.session, null),
  setSession: (id: string | null) => write(KEYS.session, id),

  getBranding: () =>
    read<Branding>(KEYS.branding, {
      gymName: 'GymFit Pro',
      primaryColor: '#FACC15',
      welcomeMessage: 'Tu transformación empieza aquí',
    }),
  setBranding: (b: Branding) => write(KEYS.branding, b),

  isSeeded: () => read<boolean>(KEYS.seeded, false),
  markSeeded: () => write(KEYS.seeded, true),

  reset: () => {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },
};

export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}
