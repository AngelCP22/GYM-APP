import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Plus,
  Target,
  Calendar,
  UserCog,
  TrendingUp,
  Phone,
  Mail,
  ClipboardList,
  Trash2,
} from 'lucide-react';
import { useStore } from '../store';
import type { Measurement } from '../types';

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const currentUser = useStore((s) => s.currentUser)!;
  const users = useStore((s) => s.users);
  const profiles = useStore((s) => s.profiles);
  const measurements = useStore((s) => s.measurements);
  const programs = useStore((s) => s.programs);
  const upsertProfile = useStore((s) => s.upsertProfile);
  const addMeasurement = useStore((s) => s.addMeasurement);
  const deleteMeasurement = useStore((s) => s.deleteMeasurement);

  const [tab, setTab] = useState<'info' | 'progress' | 'programs'>('info');
  const [editingProfile, setEditingProfile] = useState(false);
  const [addingMeasurement, setAddingMeasurement] = useState(false);

  const client = users.find((u) => u.id === id);
  if (!client) return <Navigate to="/clientes" replace />;

  if (currentUser.role === 'client' && currentUser.id !== client.id) {
    return <Navigate to="/" replace />;
  }
  if (currentUser.role === 'trainer' && client.trainerId !== currentUser.id) {
    return <Navigate to="/clientes" replace />;
  }

  const profile = profiles.find((p) => p.userId === client.id);
  const trainer = users.find((u) => u.id === client.trainerId);
  const clientMeasurements = measurements
    .filter((m) => m.clientId === client.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const clientPrograms = programs.filter((p) => p.clientId === client.id);
  const canEdit = currentUser.role !== 'client';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to={currentUser.role === 'client' ? '/' : '/clientes'} className="btn-ghost p-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold">{client.name}</h1>
      </div>

      <div className="card p-6 bg-gradient-to-r from-ink-900 to-ink-800 text-white">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-20 h-20 rounded-xl bg-brand text-ink-900 flex items-center justify-center font-bold text-4xl">
            {client.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-bold">{client.name}</h2>
              <span className="badge badge-client">Cliente</span>
            </div>
            <div className="mt-2 space-y-1 text-sm text-neutral-300">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {client.email}</div>
              {client.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {client.phone}</div>}
              {trainer && <div className="flex items-center gap-2"><UserCog className="w-4 h-4" /> Entrenador: {trainer.name}</div>}
            </div>
          </div>
          {profile?.objective && (
            <div className="p-4 bg-brand text-ink-900 rounded-xl max-w-sm">
              <div className="text-xs uppercase tracking-wider font-bold">Objetivo</div>
              <div className="font-bold mt-1">{profile.objective}</div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 border-b border-neutral-200 overflow-x-auto">
        <TabBtn active={tab === 'info'} onClick={() => setTab('info')} icon={Target}>Información</TabBtn>
        <TabBtn active={tab === 'progress'} onClick={() => setTab('progress')} icon={TrendingUp}>Mide tu avance</TabBtn>
        <TabBtn active={tab === 'programs'} onClick={() => setTab('programs')} icon={ClipboardList}>Programas</TabBtn>
      </div>

      {tab === 'info' && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Datos del cliente</h3>
            {canEdit && (
              <button onClick={() => setEditingProfile(true)} className="btn-ghost">
                <Edit2 className="w-4 h-4" /> Editar
              </button>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <InfoField label="Edad" value={profile?.age} />
            <InfoField label="Género" value={profile?.gender === 'M' ? 'Masculino' : profile?.gender === 'F' ? 'Femenino' : profile?.gender} />
            <InfoField label="Objetivo" value={profile?.objective} />
            <InfoField label="Frecuencia" value={profile?.frequency} />
            <InfoField label="Duración sesión" value={profile?.duration} />
            <InfoField label="Horario" value={profile?.scheduleTime} />
            <InfoField label="Fecha inicio" value={profile?.startDate} />
            <InfoField label="Entrenador" value={trainer?.name} />
          </div>
          {profile?.medicalHistory && (
            <div className="mt-6 pt-6 border-t border-neutral-100">
              <div className="label">Antecedentes médicos</div>
              <p className="text-ink-700">{profile.medicalHistory}</p>
            </div>
          )}
        </div>
      )}

      {tab === 'progress' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Registro de mediciones</h3>
            {canEdit && (
              <button onClick={() => setAddingMeasurement(true)} className="btn-primary">
                <Plus className="w-5 h-5" /> Nueva medición
              </button>
            )}
          </div>

          {clientMeasurements.length > 1 && (
            <ProgressChart measurements={clientMeasurements} />
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {clientMeasurements.map((m, idx) => {
              const prev = clientMeasurements[idx + 1];
              return (
                <div key={m.id} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-brand-600" />
                        <span className="font-bold">{m.date}</span>
                      </div>
                      {idx === 0 && <span className="badge bg-brand text-ink-900 text-xs">Más reciente</span>}
                    </div>
                    {canEdit && (
                      <button
                        onClick={() => confirm('¿Eliminar esta medición?') && deleteMeasurement(m.id)}
                        className="btn-danger p-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <MRow label="Peso" value={m.weight} prev={prev?.weight} unit="kg" inverse />
                    <MRow label="Altura" value={m.height} unit="cm" />
                    <MRow label="Pecho" value={m.chest} prev={prev?.chest} unit="cm" />
                    <MRow label="Cintura" value={m.waist} prev={prev?.waist} unit="cm" inverse />
                    <MRow label="Cadera" value={m.hip} prev={prev?.hip} unit="cm" />
                    <MRow label="Brazo izq." value={m.leftArm} prev={prev?.leftArm} unit="cm" />
                    <MRow label="Brazo der." value={m.rightArm} prev={prev?.rightArm} unit="cm" />
                    <MRow label="Muslo izq." value={m.leftThigh} prev={prev?.leftThigh} unit="cm" />
                    <MRow label="Muslo der." value={m.rightThigh} prev={prev?.rightThigh} unit="cm" />
                    <MRow label="% Grasa" value={m.bodyFat} prev={prev?.bodyFat} unit="%" inverse />
                  </div>
                  {m.notes && <p className="text-xs text-ink-500 mt-3 pt-3 border-t border-neutral-100">{m.notes}</p>}
                </div>
              );
            })}
            {clientMeasurements.length === 0 && (
              <div className="col-span-full card p-12 text-center text-ink-500">
                Aún no hay mediciones registradas.
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'programs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Programas de entrenamiento</h3>
            {canEdit && (
              <Link to="/programas/nuevo" state={{ clientId: client.id }} className="btn-primary">
                <Plus className="w-5 h-5" /> Nuevo programa
              </Link>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {clientPrograms.map((p) => (
              <Link key={p.id} to={`/programas/${p.id}`} className="card p-5 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold">{p.name}</h4>
                  <span className="badge bg-purple-100 text-purple-700">{p.exercises.length} ejercicios</span>
                </div>
                <div className="text-sm text-ink-500 space-y-1">
                  <div>Inicio: {p.startDate}</div>
                  {p.frequency && <div>Frecuencia: {p.frequency}</div>}
                  {p.objective && <div>🎯 {p.objective}</div>}
                </div>
              </Link>
            ))}
            {clientPrograms.length === 0 && (
              <div className="col-span-full card p-12 text-center text-ink-500">
                Sin programas asignados.
              </div>
            )}
          </div>
        </div>
      )}

      {editingProfile && (
        <ProfileModal
          profile={profile}
          onClose={() => setEditingProfile(false)}
          onSave={(data) => {
            upsertProfile({ ...data, userId: client.id });
            setEditingProfile(false);
          }}
        />
      )}
      {addingMeasurement && (
        <MeasurementModal
          clientId={client.id}
          onClose={() => setAddingMeasurement(false)}
          onSave={(data) => {
            addMeasurement(data);
            setAddingMeasurement(false);
          }}
        />
      )}
    </div>
  );
}

function TabBtn({ active, onClick, icon: Icon, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
        active ? 'border-brand text-ink-900' : 'border-transparent text-ink-500 hover:text-ink-700'
      }`}
    >
      <Icon className="w-4 h-4" /> {children}
    </button>
  );
}

function InfoField({ label, value }: { label: string; value?: string | number }) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className="text-ink-900">{value || '—'}</div>
    </div>
  );
}

function MRow({ label, value, prev, unit, inverse }: any) {
  const delta = value != null && prev != null ? value - prev : null;
  const positive = delta != null && (inverse ? delta < 0 : delta > 0);
  return (
    <div className="flex justify-between">
      <span className="text-ink-500">{label}:</span>
      <span className="font-semibold">
        {value ?? '—'}{value != null && ` ${unit}`}
        {delta != null && delta !== 0 && (
          <span className={`ml-1 text-xs ${positive ? 'text-green-600' : 'text-red-600'}`}>
            ({delta > 0 ? '+' : ''}{delta.toFixed(1)})
          </span>
        )}
      </span>
    </div>
  );
}

function ProgressChart({ measurements }: { measurements: Measurement[] }) {
  const sorted = [...measurements].sort((a, b) => a.date.localeCompare(b.date));
  const weights = sorted.map((m) => m.weight).filter((w): w is number => w != null);
  if (weights.length < 2) return null;

  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = max - min || 1;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold">Evolución del peso</h4>
        <div className="text-sm">
          <span className="text-ink-500">Actual: </span>
          <span className="font-bold text-brand-700">{weights[weights.length - 1]} kg</span>
        </div>
      </div>
      <div className="relative h-40 flex items-end gap-1 bg-neutral-50 rounded-lg p-3">
        {sorted.map((m, i) => {
          if (m.weight == null) return <div key={m.id} className="flex-1" />;
          const height = ((m.weight - min) / range) * 100;
          return (
            <div key={m.id} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-[10px] text-ink-600 font-semibold">{m.weight}</div>
              <div
                className="w-full bg-brand rounded-t transition-all hover:brightness-110"
                style={{ height: `${Math.max(height, 8)}%` }}
                title={`${m.date}: ${m.weight} kg`}
              />
              <div className="text-[9px] text-ink-500 mt-1">{m.date.slice(5)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfileModal({ profile, onClose, onSave }: any) {
  const [form, setForm] = useState({
    age: profile?.age?.toString() ?? '',
    gender: profile?.gender ?? 'M',
    objective: profile?.objective ?? '',
    frequency: profile?.frequency ?? '',
    duration: profile?.duration ?? '',
    scheduleTime: profile?.scheduleTime ?? '',
    startDate: profile?.startDate ?? '',
    medicalHistory: profile?.medicalHistory ?? '',
  });

  return (
    <Modal title="Editar datos" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            ...form,
            age: form.age ? Number(form.age) : undefined,
          });
        }}
        className="space-y-4"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <F label="Edad" type="number" value={form.age} onChange={(v) => setForm({ ...form, age: v })} />
          <div>
            <label className="label">Género</label>
            <select className="input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as any })}>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <F label="Objetivo" value={form.objective} onChange={(v) => setForm({ ...form, objective: v })} />
          <F label="Frecuencia" value={form.frequency} onChange={(v) => setForm({ ...form, frequency: v })} />
          <F label="Duración" value={form.duration} onChange={(v) => setForm({ ...form, duration: v })} />
          <F label="Horario" value={form.scheduleTime} onChange={(v) => setForm({ ...form, scheduleTime: v })} />
          <F label="Fecha inicio" type="date" value={form.startDate} onChange={(v) => setForm({ ...form, startDate: v })} />
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
          <button type="submit" className="btn-primary">Guardar</button>
        </div>
      </form>
    </Modal>
  );
}

function MeasurementModal({ clientId, onClose, onSave }: any) {
  const [form, setForm] = useState<Record<string, string>>({
    date: new Date().toISOString().slice(0, 10),
    weight: '', height: '', chest: '', waist: '', hip: '',
    leftArm: '', rightArm: '', leftThigh: '', rightThigh: '',
    leftCalf: '', rightCalf: '', bodyFat: '', notes: '',
  });

  const num = (v: string) => (v ? Number(v) : undefined);

  return (
    <Modal title="Nueva medición" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            clientId,
            date: form.date,
            weight: num(form.weight),
            height: num(form.height),
            chest: num(form.chest),
            waist: num(form.waist),
            hip: num(form.hip),
            leftArm: num(form.leftArm),
            rightArm: num(form.rightArm),
            leftThigh: num(form.leftThigh),
            rightThigh: num(form.rightThigh),
            leftCalf: num(form.leftCalf),
            rightCalf: num(form.rightCalf),
            bodyFat: num(form.bodyFat),
            notes: form.notes || undefined,
          });
        }}
        className="space-y-4"
      >
        <F label="Fecha" type="date" required value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <F label="Peso (kg)" type="number" value={form.weight} onChange={(v) => setForm({ ...form, weight: v })} />
          <F label="Altura (cm)" type="number" value={form.height} onChange={(v) => setForm({ ...form, height: v })} />
          <F label="% Grasa" type="number" value={form.bodyFat} onChange={(v) => setForm({ ...form, bodyFat: v })} />
          <F label="Pecho (cm)" type="number" value={form.chest} onChange={(v) => setForm({ ...form, chest: v })} />
          <F label="Cintura (cm)" type="number" value={form.waist} onChange={(v) => setForm({ ...form, waist: v })} />
          <F label="Cadera (cm)" type="number" value={form.hip} onChange={(v) => setForm({ ...form, hip: v })} />
          <F label="Brazo izq." type="number" value={form.leftArm} onChange={(v) => setForm({ ...form, leftArm: v })} />
          <F label="Brazo der." type="number" value={form.rightArm} onChange={(v) => setForm({ ...form, rightArm: v })} />
          <F label="Muslo izq." type="number" value={form.leftThigh} onChange={(v) => setForm({ ...form, leftThigh: v })} />
          <F label="Muslo der." type="number" value={form.rightThigh} onChange={(v) => setForm({ ...form, rightThigh: v })} />
          <F label="Pantorrilla izq." type="number" value={form.leftCalf} onChange={(v) => setForm({ ...form, leftCalf: v })} />
          <F label="Pantorrilla der." type="number" value={form.rightCalf} onChange={(v) => setForm({ ...form, rightCalf: v })} />
        </div>
        <div>
          <label className="label">Notas</label>
          <textarea
            className="input min-h-[70px]"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
          <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
          <button type="submit" className="btn-primary">Guardar medición</button>
        </div>
      </form>
    </Modal>
  );
}

function Modal({ title, children, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-neutral-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="btn-ghost p-2">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function F({ label, value, onChange, type = 'text', required }: any) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        step={type === 'number' ? 'any' : undefined}
      />
    </div>
  );
}
