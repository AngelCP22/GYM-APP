import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Users, ChevronRight } from 'lucide-react';
import { useStore } from '../store';

export default function TrainerDetail() {
  const { id } = useParams<{ id: string }>();
  const users = useStore((s) => s.users);
  const profiles = useStore((s) => s.profiles);
  const programs = useStore((s) => s.programs);

  const trainer = users.find((u) => u.id === id && u.role === 'trainer');
  if (!trainer) return <Navigate to="/entrenadores" replace />;

  const clients = users.filter((u) => u.role === 'client' && u.trainerId === trainer.id);
  const trainerPrograms = programs.filter((p) => p.trainerId === trainer.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/entrenadores" className="btn-ghost p-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold">{trainer.name}</h1>
      </div>

      <div className="card p-6 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-xl bg-white text-blue-700 flex items-center justify-center font-bold text-4xl">
            {trainer.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{trainer.name}</h2>
            <span className="badge badge-trainer mt-1">Entrenador</span>
            <div className="mt-3 space-y-1 text-sm text-blue-100">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {trainer.email}</div>
              {trainer.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {trainer.phone}</div>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{clients.length}</div>
            <div className="text-sm text-blue-200 uppercase tracking-wider">Clientes</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="text-xs text-ink-500 uppercase tracking-wider">Clientes asignados</div>
          <div className="text-3xl font-bold mt-1">{clients.length}</div>
        </div>
        <div className="card p-5">
          <div className="text-xs text-ink-500 uppercase tracking-wider">Programas creados</div>
          <div className="text-3xl font-bold mt-1">{trainerPrograms.length}</div>
        </div>
        <div className="card p-5">
          <div className="text-xs text-ink-500 uppercase tracking-wider">Antigüedad</div>
          <div className="text-3xl font-bold mt-1">
            {Math.floor((Date.now() - new Date(trainer.createdAt).getTime()) / 86400000)}d
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-brand-600" />
          <h3 className="text-lg font-bold">Clientes asignados</h3>
        </div>
        <div className="space-y-2">
          {clients.map((c) => {
            const profile = profiles.find((p) => p.userId === c.id);
            return (
              <Link
                key={c.id}
                to={`/clientes/${c.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 border border-neutral-100 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-xs text-ink-500">{profile?.objective ?? c.email}</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-ink-400 group-hover:text-brand-600" />
              </Link>
            );
          })}
          {clients.length === 0 && (
            <div className="text-center text-ink-500 py-8">Sin clientes asignados.</div>
          )}
        </div>
      </div>
    </div>
  );
}
