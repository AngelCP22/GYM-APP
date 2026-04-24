import { Link } from 'react-router-dom';
import { Users, Mail, Phone } from 'lucide-react';
import { useStore } from '../store';

export default function Trainers() {
  const users = useStore((s) => s.users);
  const trainers = users.filter((u) => u.role === 'trainer');
  const clients = users.filter((u) => u.role === 'client');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Entrenadores</h1>
        <p className="text-ink-500 mt-1">{trainers.length} entrenadores en el sistema</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trainers.map((t) => {
          const tClients = clients.filter((c) => c.trainerId === t.id);
          return (
            <Link key={t.id} to={`/entrenadores/${t.id}`} className="card p-5 hover:shadow-lg transition">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
                  {t.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs text-ink-500 truncate flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3" /> {t.email}
                  </div>
                  {t.phone && (
                    <div className="text-xs text-ink-500 truncate flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {t.phone}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-ink-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-semibold">{tClients.length} clientes</span>
                </div>
                <span className="badge badge-trainer">Entrenador</span>
              </div>
            </Link>
          );
        })}
        {trainers.length === 0 && (
          <div className="col-span-full card p-12 text-center text-ink-500">
            No hay entrenadores. Créalos desde Usuarios.
          </div>
        )}
      </div>
    </div>
  );
}
