import type {
  User,
  ClientProfile,
  Measurement,
  TrainingProgram,
  Branding,
  Gym,
} from './types';

const DEFAULT_GYM_ID = 'gym_demo';

const KEYS = {
  gyms: 'gym.gyms',
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

function withGymId<T extends { gymId?: string }>(items: T[], gymId = DEFAULT_GYM_ID): (T & { gymId: string })[] {
  return items.map((item) => ({ ...item, gymId: item.gymId ?? gymId }));
}

export const storage = {
  defaultGymId: DEFAULT_GYM_ID,

  getGyms: () =>
    read<Gym[]>(KEYS.gyms, [
      {
        id: DEFAULT_GYM_ID,
        name: 'GymFit Pro Demo',
        slug: 'demo',
        plan: 'local',
        active: true,
        primaryColor: '#FACC15',
        welcomeMessage: 'Tu transformación empieza aquí',
        createdAt: new Date().toISOString(),
      },
    ]),
  setGyms: (g: Gym[]) => write(KEYS.gyms, g),

  getUsers: () => withGymId<User>(read<User[]>(KEYS.users, [])),
  setUsers: (u: User[]) => write(KEYS.users, u),

  getProfiles: () => withGymId<ClientProfile>(read<ClientProfile[]>(KEYS.profiles, [])),
  setProfiles: (p: ClientProfile[]) => write(KEYS.profiles, p),

  getMeasurements: () => withGymId<Measurement>(read<Measurement[]>(KEYS.measurements, [])),
  setMeasurements: (m: Measurement[]) => write(KEYS.measurements, m),

  getPrograms: () => withGymId<TrainingProgram>(read<TrainingProgram[]>(KEYS.programs, [])),
  setPrograms: (p: TrainingProgram[]) => write(KEYS.programs, p),

  getSession: () => read<string | null>(KEYS.session, null),
  setSession: (id: string | null) => write(KEYS.session, id),

  getBranding: () =>
    read<Branding>(KEYS.branding, {
      gymId: DEFAULT_GYM_ID,
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
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
