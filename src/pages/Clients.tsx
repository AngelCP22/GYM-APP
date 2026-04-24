import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, ChevronRight, User } from 'lucide-react';
import { useStore } from '../store';
import type { User as UserType } from '../types';

export default function Clients() {
  const currentUser = useStore((s) => s.currentUser)!;
  const users = useStore((s) => s.users);
  const profiles = useStore((s) => s.profiles);
  const measurements = useStore((s) => s.measurements);
  const createUser = useStore((s) => s.createUser);
  const upsertProfile = useStore((s) => s.upsertProfile);

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const clients = users.filter((u) => {
    if (u.role !== 'client') return false;
    if (currentUser.role === 'trainer' && u.trainerId !== currentUser.id) return false;
    return true;
  });

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">
            {currentUser.role === 'admin' ? 'Todos los clientes' : 'Mis clientes'}
          </h1>
          <p className="text-ink-500 mt-1">{clients.length} clientes registrados</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-5 h-5" /> <span className="hidden sm:inline">Nuevo cliente</span>
        </button>
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            className="input pl-9"
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => {
          const profile = profiles.find((p) => p.userId === c.id);
          const trainer = users.find((u) => u.id === c.trainerId);
          const clientMeasurements = measurements
            .filter((m) => m.clientId === c.id)
            .sort((a, b) => b.date.localeCompare(a.date));
          const last = clientMeasurements[0];

          return (
            <Link
              key={c.id}
              to={`/clientes/${c.id}`}
              className="card p-5 hover:shadow-lg transition group"
            >
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl bg-brand text-ink-900 flex items-center justify-center font-bold text-xl">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-ink-900 truncate">{c.name}</div>
                  <div className="text-xs text-ink-500 truncate">{c.email}</div>
                  {trainer && (
                    <div className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                      <User className="w-3 h-3" /> {trainer.name}
                    </div>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-ink-500 group-hover:text-brand-600 transition" />
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-100 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-xs text-ink-500">Edad</div>
                  <div className="font-semibold">{profile?.age ?? '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-ink-500">Peso</div>
                  <div className="font-semibold">{last?.weight ? `${last.weight}kg` : '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-ink-500">Sesiones</div>
                  <div className="font-semibold">{clientMeasurements.length}</div>
                </div>
              </div>
              {profile?.objective && (
                <div className="mt-3 text-xs bg-brand-50 text-ink-700 px-3 py-1.5 rounded-lg truncate">
                  🎯 {profile.objective}
                </div>
              )}
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full card p-12 text-center text-ink-500">
            No hay clientes para mostrar.
          </div>
        )}
      </div>

      {showModal && (
        <NewClientModal
          currentUser={currentUser}
          trainers={users.filter((u) => u.role === 'trainer')}
          onClose={() => setShowModal(false)}
          onSave={(userData, profileData) => {
            const newUser = createUser(userData);
            upsertProfile({ ...profileData, userId: newUser.id });
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

function NewClientModal({
  currentUser,
  trainers,
  onClose,
  onSave,
}: {
  currentUser: UserType;
  trainers: UserType[];
  onClose: () => void;
  onSave: (user: any, profile: any) => void;
}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: 'cliente123',
    phone: '',
    trainerId: currentUser.role === 'trainer' ? currentUser.id : '',
    age: '',
    gender: 'M',
    objective: '',
    frequency: '',
    duration: '',
    scheduleTime: '',
    medicalHistory: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: 'client' as const,
      phone: form.phone || undefined,
      trainerId: form.trainerId || undefined,
    };
    const profileData = {
      age: form.age ? Number(form.age) : undefined,
      gender: form.gender as 'M' | 'F' | 'otro',
      objective: form.objective || undefined,
      frequency: form.frequency || undefined,
      duration: form.duration || undefined,
      scheduleTime: form.scheduleTime || undefined,
      medicalHistory: form.medicalHistory || undefined,
      startDate: new Date().toISOString().slice(0, 10),
    };
    onSave(userData, profileData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-neutral-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold">Nuevo cliente</h2>
          <button onClick={onClose} className="btn-ghost p-2">✕</button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Nombre completo" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Correo electrónico" type="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Field label="Contraseña" required value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
            <Field label="Teléfono" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <Field label="Edad" type="number" value={form.age} onChange={(v) => setForm({ ...form, age: v })} />
            <div>
              <label className="label">Género</label>
              <select className="input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            {currentUser.role === 'admin' && (
              <div className="md:col-span-2">
                <label className="label">Entrenador asignado</label>
                <select
                  className="input"
                  value={form.trainerId}
                  onChange={(e) => setForm({ ...form, trainerId: e.target.value })}
                >
                  <option value="">Sin asignar</option>
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            )}
            <Field label="Objetivo" value={form.objective} onChange={(v) => setForm({ ...form, objective: v })} />
            <Field label="Frecuencia" value={form.frequency} onChange={(v) => setForm({ ...form, frequency: v })} placeholder="Ej: 3x semana" />
            <Field label="Duración sesión" value={form.duration} onChange={(v) => setForm({ ...form, duration: v })} placeholder="Ej: 60 min" />
            <Field label="Horario" value={form.scheduleTime} onChange={(v) => setForm({ ...form, scheduleTime: v })} placeholder="Ej: 18:00" />
          </div>
          <div>
            <label className="label">Antecedentes médicos</label>
            <textarea
              className="input min-h-[80px]"
              value={form.medicalHistory}
              onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
            <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
            <button type="submit" className="btn-primary">Crear cliente</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="label">{label}{required && ' *'}</label>
      <input
        type={type}
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}
