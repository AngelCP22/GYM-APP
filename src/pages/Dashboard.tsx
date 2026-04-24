import { Link } from 'react-router-dom';
import { Users, UserCog, ClipboardList, TrendingUp, Target, Calendar, Dumbbell } from 'lucide-react';
import { useStore } from '../store';

export default function Dashboard() {
  const user = useStore((s) => s.currentUser)!;
  const users = useStore((s) => s.users);
  const profiles = useStore((s) => s.profiles);
  const measurements = useStore((s) => s.measurements);
  const programs = useStore((s) => s.programs);
  const branding = useStore((s) => s.branding);

  if (user.role === 'admin') {
    const admins = users.filter((u) => u.role === 'admin').length;
    const trainers = users.filter((u) => u.role === 'trainer');
    const clients = users.filter((u) => u.role === 'client');
    const unassigned = clients.filter((c) => !c.trainerId).length;

    return (
      <div className="space-y-6">
        <Header title="Panel de Administración" subtitle={`Bienvenido, ${user.name}`} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Clientes" value={clients.length} color="bg-green-100 text-green-700" />
          <StatCard icon={UserCog} label="Entrenadores" value={trainers.length} color="bg-blue-100 text-blue-700" />
          <StatCard icon={ClipboardList} label="Programas" value={programs.length} color="bg-purple-100 text-purple-700" />
          <StatCard icon={TrendingUp} label="Mediciones" value={measurements.length} color="bg-orange-100 text-orange-700" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Entrenadores y sus clientes</h3>
              <Link to="/entrenadores" className="text-sm text-brand-600 hover:underline">Ver todos</Link>
            </div>
            <div className="space-y-3">
              {trainers.map((t) => {
                const tClients = clients.filter((c) => c.trainerId === t.id);
                return (
                  <Link
                    key={t.id}
                    to={`/entrenadores/${t.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 border border-neutral-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{t.name}</div>
                        <div className="text-xs text-ink-500">{t.email}</div>
                      </div>
                    </div>
                    <span className="badge badge-trainer">{tClients.length} clientes</span>
                  </Link>
                );
              })}
              {trainers.length === 0 && <EmptyState text="No hay entrenadores." />}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold mb-4">Resumen rápido</h3>
            <div className="space-y-3">
              <InfoRow label="Administradores" value={admins} />
              <InfoRow label="Clientes sin entrenador" value={unassigned} highlight={unassigned > 0} />
              <InfoRow label="Programas activos" value={programs.length} />
              <InfoRow label="Perfiles completados" value={profiles.length} />
              <InfoRow label="Registros de progreso" value={measurements.length} />
            </div>
            <div className="mt-4 p-3 bg-brand-50 border border-brand-200 rounded-lg text-sm">
              <strong>{branding.gymName}</strong> — personaliza en Ajustes
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user.role === 'trainer') {
    const myClients = users.filter((u) => u.role === 'client' && u.trainerId === user.id);
    const myPrograms = programs.filter((p) => p.trainerId === user.id);
    const myClientIds = myClients.map((c) => c.id);
    const myMeasurements = measurements.filter((m) => myClientIds.includes(m.clientId));

    return (
      <div className="space-y-6">
        <Header title={`Hola, ${user.name.split(' ')[0]}`} subtitle="Tu panel de entrenador" />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={Users} label="Mis clientes" value={myClients.length} color="bg-green-100 text-green-700" />
          <StatCard icon={ClipboardList} label="Mis programas" value={myPrograms.length} color="bg-purple-100 text-purple-700" />
          <StatCard icon={TrendingUp} label="Mediciones totales" value={myMeasurements.length} color="bg-orange-100 text-orange-700" />
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Mis clientes asignados</h3>
            <Link to="/clientes" className="text-sm text-brand-600 hover:underline">Ver todos</Link>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {myClients.map((c) => {
              const lastM = myMeasurements
                .filter((m) => m.clientId === c.id)
                .sort((a, b) => b.date.localeCompare(a.date))[0];
              const profile = profiles.find((p) => p.userId === c.id);
              return (
                <Link
                  key={c.id}
                  to={`/clientes/${c.id}`}
                  className="p-4 rounded-lg hover:bg-neutral-50 border border-neutral-100 flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-lg">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{c.name}</div>
                    <div className="text-xs text-ink-500 truncate">
                      {profile?.objective ?? 'Sin objetivo definido'}
                    </div>
                  </div>
                  {lastM?.weight && (
                    <div className="text-right">
                      <div className="text-xs text-ink-500">Último peso</div>
                      <div className="font-bold text-brand-700">{lastM.weight} kg</div>
                    </div>
                  )}
                </Link>
              );
            })}
            {myClients.length === 0 && <EmptyState text="Aún no tienes clientes asignados." />}
          </div>
        </div>
      </div>
    );
  }

  // Client
  const profile = profiles.find((p) => p.userId === user.id);
  const myMeasurements = measurements
    .filter((m) => m.clientId === user.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const myPrograms = programs.filter((p) => p.clientId === user.id);
  const trainer = users.find((u) => u.id === user.trainerId);
  const latest = myMeasurements[0];
  const previous = myMeasurements[1];

  return (
    <div className="space-y-6">
      <Header
        title={`¡Hola, ${user.name.split(' ')[0]}!`}
        subtitle={profile?.objective ?? 'Define tu objetivo con tu entrenador'}
      />

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-brand-700" />
            </div>
            <div className="text-xs text-ink-500 uppercase tracking-wider">Objetivo</div>
          </div>
          <div className="font-semibold">{profile?.objective ?? 'Por definir'}</div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <UserCog className="w-5 h-5 text-blue-700" />
            </div>
            <div className="text-xs text-ink-500 uppercase tracking-wider">Mi entrenador</div>
          </div>
          <div className="font-semibold">{trainer?.name ?? 'Sin asignar'}</div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-700" />
            </div>
            <div className="text-xs text-ink-500 uppercase tracking-wider">Frecuencia</div>
          </div>
          <div className="font-semibold">{profile?.frequency ?? 'Por definir'}</div>
        </div>
      </div>

      {latest && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Mi progreso</h3>
            <Link to={`/clientes/${user.id}`} className="text-sm text-brand-600 hover:underline">
              Ver histórico →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Metric label="Peso" value={latest.weight} unit="kg" prev={previous?.weight} />
            <Metric label="Cintura" value={latest.waist} unit="cm" prev={previous?.waist} />
            <Metric label="Pecho" value={latest.chest} unit="cm" prev={previous?.chest} />
            <Metric label="Cadera" value={latest.hip} unit="cm" prev={previous?.hip} />
          </div>
        </div>
      )}

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Mi rutina</h3>
          <Link to="/programas" className="text-sm text-brand-600 hover:underline">Ver todas</Link>
        </div>
        {myPrograms.length === 0 ? (
          <EmptyState text="Aún no tienes programas asignados." />
        ) : (
          <div className="space-y-2">
            {myPrograms.map((p) => (
              <Link
                key={p.id}
                to={`/programas/${p.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 border border-neutral-100"
              >
                <div className="flex items-center gap-3">
                  <Dumbbell className="w-5 h-5 text-brand-600" />
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-ink-500">
                      {p.exercises.length} ejercicios • Inicio {p.startDate}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-ink-900">{title}</h1>
      {subtitle && <p className="text-ink-500 mt-1">{subtitle}</p>}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="card p-5">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-xs text-ink-500 uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-bold text-ink-900 mt-1">{value}</div>
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
      <span className="text-ink-600">{label}</span>
      <span className={`font-bold ${highlight ? 'text-red-600' : 'text-ink-900'}`}>{value}</span>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="text-sm text-ink-500 py-6 text-center">{text}</div>;
}

function Metric({ label, value, unit, prev }: { label: string; value?: number; unit: string; prev?: number }) {
  const delta = value != null && prev != null ? value - prev : null;
  return (
    <div className="p-4 rounded-lg bg-neutral-50">
      <div className="text-xs text-ink-500 uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-bold text-ink-900 mt-1">
        {value ?? '—'} <span className="text-sm font-normal text-ink-500">{unit}</span>
      </div>
      {delta != null && (
        <div className={`text-xs mt-1 font-semibold ${delta < 0 ? 'text-green-600' : delta > 0 ? 'text-red-600' : 'text-ink-500'}`}>
          {delta > 0 ? '+' : ''}{delta.toFixed(1)} vs anterior
        </div>
      )}
    </div>
  );
}
