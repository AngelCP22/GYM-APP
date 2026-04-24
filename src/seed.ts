import { storage, uid } from './storage';
import type { User, ClientProfile, Measurement, TrainingProgram } from './types';

export function seedDemoData() {
  if (storage.isSeeded()) return;

  const adminId = uid('u');
  const trainer1Id = uid('u');
  const trainer2Id = uid('u');
  const c1 = uid('u');
  const c2 = uid('u');
  const c3 = uid('u');
  const c4 = uid('u');

  const users: User[] = [
    {
      id: adminId,
      email: 'admin@gym.com',
      password: 'admin123',
      name: 'Carlos Administrador',
      role: 'admin',
      phone: '555-0100',
      createdAt: new Date().toISOString(),
    },
    {
      id: trainer1Id,
      email: 'entrenador@gym.com',
      password: 'trainer123',
      name: 'María Entrenadora',
      role: 'trainer',
      phone: '555-0201',
      createdAt: new Date().toISOString(),
    },
    {
      id: trainer2Id,
      email: 'jose@gym.com',
      password: 'trainer123',
      name: 'José Pérez',
      role: 'trainer',
      phone: '555-0202',
      createdAt: new Date().toISOString(),
    },
    {
      id: c1,
      email: 'cliente@gym.com',
      password: 'client123',
      name: 'Ana García',
      role: 'client',
      trainerId: trainer1Id,
      phone: '555-0301',
      createdAt: new Date().toISOString(),
    },
    {
      id: c2,
      email: 'luis@gym.com',
      password: 'client123',
      name: 'Luis Ramírez',
      role: 'client',
      trainerId: trainer1Id,
      phone: '555-0302',
      createdAt: new Date().toISOString(),
    },
    {
      id: c3,
      email: 'sofia@gym.com',
      password: 'client123',
      name: 'Sofía Vargas',
      role: 'client',
      trainerId: trainer2Id,
      phone: '555-0303',
      createdAt: new Date().toISOString(),
    },
    {
      id: c4,
      email: 'pedro@gym.com',
      password: 'client123',
      name: 'Pedro Torres',
      role: 'client',
      trainerId: trainer2Id,
      phone: '555-0304',
      createdAt: new Date().toISOString(),
    },
  ];

  const profiles: ClientProfile[] = [
    {
      userId: c1,
      age: 28,
      gender: 'F',
      objective: 'Tonificar y bajar 5 kg',
      frequency: '4x semana',
      duration: '60 min',
      scheduleTime: '18:00',
      startDate: '2026-03-01',
      medicalHistory: 'Ninguna condición relevante',
    },
    {
      userId: c2,
      age: 34,
      gender: 'M',
      objective: 'Ganar masa muscular',
      frequency: '5x semana',
      duration: '75 min',
      scheduleTime: '07:00',
      startDate: '2026-02-15',
    },
    {
      userId: c3,
      age: 25,
      gender: 'F',
      objective: 'Resistencia cardiovascular',
      frequency: '3x semana',
      duration: '45 min',
      scheduleTime: '19:30',
      startDate: '2026-04-01',
    },
    {
      userId: c4,
      age: 42,
      gender: 'M',
      objective: 'Rehabilitación rodilla + fuerza',
      frequency: '3x semana',
      duration: '50 min',
      scheduleTime: '08:30',
      startDate: '2026-01-10',
      medicalHistory: 'Cirugía menisco 2024',
    },
  ];

  const today = new Date();
  const daysAgo = (n: number) =>
    new Date(today.getTime() - n * 86400000).toISOString().slice(0, 10);

  const measurements: Measurement[] = [
    { id: uid('m'), clientId: c1, date: daysAgo(60), weight: 68, height: 165, chest: 92, waist: 78, hip: 98, leftArm: 28, rightArm: 28, leftThigh: 56, rightThigh: 56 },
    { id: uid('m'), clientId: c1, date: daysAgo(30), weight: 66, height: 165, chest: 91, waist: 76, hip: 97, leftArm: 28.5, rightArm: 28.5, leftThigh: 56, rightThigh: 56 },
    { id: uid('m'), clientId: c1, date: daysAgo(1), weight: 64.5, height: 165, chest: 90, waist: 74, hip: 96, leftArm: 29, rightArm: 29, leftThigh: 55, rightThigh: 55 },
    { id: uid('m'), clientId: c2, date: daysAgo(45), weight: 75, height: 178, chest: 100, waist: 85, leftArm: 34, rightArm: 34 },
    { id: uid('m'), clientId: c2, date: daysAgo(15), weight: 77, height: 178, chest: 102, waist: 84, leftArm: 35.5, rightArm: 35.5 },
  ];

  const programs: TrainingProgram[] = [
    {
      id: uid('p'),
      clientId: c1,
      trainerId: trainer1Id,
      name: 'Plan Tonificación - Ana',
      startDate: daysAgo(30),
      frequency: '4x semana',
      objective: 'Tonificar y bajar 5 kg',
      evaluation: {
        resistance: 'Moderada',
        strength: 'Principiante-Intermedio',
        flexibility: 'Buena',
      },
      exercises: [
        { id: uid('e'), name: 'Caminadora', category: 'warmup', sets: [{ reps: '10 min', notes: 'Calentamiento suave' }] },
        { id: uid('e'), name: 'Plancha', category: 'core', sets: [{ reps: '30s', rest: '30s' }, { reps: '30s', rest: '30s' }, { reps: '45s' }] },
        { id: uid('e'), name: 'Sentadilla', category: 'lower', sets: [{ reps: '12', weight: '20 kg' }, { reps: '12', weight: '20 kg' }, { reps: '10', weight: '25 kg' }] },
        { id: uid('e'), name: 'Peso Muerto Rumano', category: 'lower', sets: [{ reps: '10', weight: '30 kg' }, { reps: '10', weight: '30 kg' }, { reps: '8', weight: '35 kg' }] },
        { id: uid('e'), name: 'Press Mancuernas', category: 'push', sets: [{ reps: '12', weight: '6 kg' }, { reps: '12', weight: '6 kg' }, { reps: '10', weight: '8 kg' }] },
        { id: uid('e'), name: 'Remo Sentado', category: 'pull', sets: [{ reps: '12', weight: '15 kg' }, { reps: '12', weight: '15 kg' }, { reps: '10', weight: '18 kg' }] },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uid('p'),
      clientId: c2,
      trainerId: trainer1Id,
      name: 'Hipertrofia - Luis',
      startDate: daysAgo(60),
      frequency: '5x semana',
      objective: 'Ganar masa muscular',
      evaluation: { resistance: 'Alta', strength: 'Intermedio', flexibility: 'Regular' },
      exercises: [
        { id: uid('e'), name: 'Bicicleta', category: 'warmup', sets: [{ reps: '8 min' }] },
        { id: uid('e'), name: 'Press Banca', category: 'push', sets: [{ reps: '10', weight: '60 kg' }, { reps: '8', weight: '70 kg' }, { reps: '6', weight: '75 kg' }, { reps: '6', weight: '75 kg' }] },
        { id: uid('e'), name: 'Sentadilla Barra', category: 'lower', sets: [{ reps: '10', weight: '80 kg' }, { reps: '8', weight: '90 kg' }, { reps: '6', weight: '100 kg' }] },
        { id: uid('e'), name: 'Dominadas', category: 'pull', sets: [{ reps: '8' }, { reps: '7' }, { reps: '6' }] },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  storage.setUsers(users);
  storage.setProfiles(profiles);
  storage.setMeasurements(measurements);
  storage.setPrograms(programs);
  storage.markSeeded();
}
