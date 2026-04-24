import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, LogIn } from 'lucide-react';
import { useStore } from '../store';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useStore((s) => s.login);
  const branding = useStore((s) => s.branding);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = login(email, password);
    if (!res.ok) setError(res.error ?? 'Error');
    else navigate('/');
  };

  const fill = (em: string, pw: string) => {
    setEmail(em);
    setPassword(pw);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:flex flex-1 bg-ink-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 20%, #FACC15 0%, transparent 50%), radial-gradient(circle at 80% 80%, #FACC15 0%, transparent 50%)',
          }}
        />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center">
            <Dumbbell className="w-7 h-7 text-ink-900" />
          </div>
          <div>
            <div className="font-display text-3xl tracking-wider">{branding.gymName}</div>
            <div className="text-xs text-neutral-400 uppercase tracking-widest">Gym Management</div>
          </div>
        </div>
        <div className="relative z-10">
          <h1 className="font-display text-6xl leading-tight tracking-wider">
            TU <span className="text-brand">TRANSFORMACIÓN</span><br />EMPIEZA AQUÍ
          </h1>
          <p className="mt-6 text-neutral-300 max-w-md">
            Sistema integral para gestión de clientes, entrenadores, rutinas personalizadas
            y seguimiento de progreso corporal.
          </p>
        </div>
        <div className="relative z-10 text-sm text-neutral-400">
          © {new Date().getFullYear()} {branding.gymName}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center">
              <Dumbbell className="w-7 h-7 text-ink-900" />
            </div>
            <div className="font-display text-3xl tracking-wider">{branding.gymName}</div>
          </div>

          <h2 className="text-3xl font-bold text-ink-900 mb-2">Iniciar sesión</h2>
          <p className="text-ink-500 mb-8">Ingresa tus credenciales para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Correo electrónico</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="label">Contraseña</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <button type="submit" className="btn-primary w-full">
              <LogIn className="w-5 h-5" />
              Entrar
            </button>
          </form>

          <div className="mt-8 p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
            <div className="text-xs font-semibold text-ink-700 uppercase tracking-wider mb-2">
              Cuentas demo — click para usar
            </div>
            <div className="space-y-1.5 text-sm">
              <button
                onClick={() => fill('admin@gym.com', 'admin123')}
                className="w-full text-left p-2 rounded hover:bg-white border border-transparent hover:border-neutral-200 transition"
              >
                <span className="badge badge-admin mr-2">ADMIN</span>
                admin@gym.com / admin123
              </button>
              <button
                onClick={() => fill('entrenador@gym.com', 'trainer123')}
                className="w-full text-left p-2 rounded hover:bg-white border border-transparent hover:border-neutral-200 transition"
              >
                <span className="badge badge-trainer mr-2">TRAINER</span>
                entrenador@gym.com / trainer123
              </button>
              <button
                onClick={() => fill('cliente@gym.com', 'client123')}
                className="w-full text-left p-2 rounded hover:bg-white border border-transparent hover:border-neutral-200 transition"
              >
                <span className="badge badge-client mr-2">CLIENT</span>
                cliente@gym.com / client123
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
