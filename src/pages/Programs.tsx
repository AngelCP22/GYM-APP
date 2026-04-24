import { Link } from 'react-router-dom';
import { Plus, Dumbbell, Calendar, Target, User } from 'lucide-react';
import { useStore } from '../store';

export default function Programs() {
  const currentUser = useStore((s) => s.currentUser)!;
  const programs = useStore((s) => s.programs);
  const users = useStore((s) => s.users);

  const myPrograms = programs.filter((p) => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'trainer') return p.trainerId === currentUser.id;
    return p.clientId === currentUser.id;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">
            {currentUser.role === 'client' ? 'Mis rutinas' : 'Programas de entrenamiento'}
          </h1>
          <p className="text-ink-500 mt-1">{myPrograms.length} programas</p>
        </div>
        {currentUser.role !== 'client' && (
          <Link to="/programas/nuevo" className="btn-primary">
            <Plus className="w-5 h-5" /> <span className="hidden sm:inline">Nuevo programa</span>
          </Link>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myPrograms.map((p) => {
          const client = users.find((u) => u.id === p.clientId);
          const trainer = users.find((u) => u.id === p.trainerId);
          const categories = [...new Set(p.exercises.map((e) => e.category))];

          return (
            <Link key={p.id} to={`/programas/${p.id}`} className="card p-5 hover:shadow-lg transition group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-brand-700" />
                </div>
                <span className="badge bg-purple-100 text-purple-700">
                  {p.exercises.length} ejer.
                </span>
              </div>
              <h3 className="font-bold text-ink-900 mb-2 group-hover:text-brand-700 transition">
                {p.name}
              </h3>
              <div className="space-y-1.5 text-sm text-ink-500">
                {client && currentUser.role !== 'client' && (
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> {client.name}
                  </div>
                )}
                {trainer && currentUser.role === 'client' && (
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> {trainer.name}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Desde {p.startDate}
                </div>
                {p.objective && (
                  <div className="flex items-center gap-1.5 truncate">
                    <Target className="w-3.5 h-3.5 flex-shrink-0" /> {p.objective}
                  </div>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-neutral-100 flex flex-wrap gap-1">
                {categories.map((c) => (
                  <span key={c} className="badge bg-neutral-100 text-ink-600 text-[10px]">
                    {categoryLabel(c)}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
        {myPrograms.length === 0 && (
          <div className="col-span-full card p-12 text-center text-ink-500">
            No hay programas creados aún.
          </div>
        )}
      </div>
    </div>
  );
}

function categoryLabel(c: string) {
  return {
    warmup: 'Calentamiento',
    core: 'Core',
    lower: 'Tren Inferior',
    push: 'Empuje',
    pull: 'Tracción',
    cardio: 'Cardio',
    stretch: 'Estiramiento',
  }[c] ?? c;
}
