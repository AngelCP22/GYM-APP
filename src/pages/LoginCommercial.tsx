import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, CheckCircle2, Dumbbell, LogIn, ShieldCheck, Smartphone, Users } from 'lucide-react';
import { useStore } from '../store';

export default function LoginCommercial() {
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

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:flex flex-1 bg-ink-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #FACC15 0%, transparent 50%), radial-gradient(circle at 80% 80%, #FACC15 0%, transparent 50%)' }} />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center"><Dumbbell className="w-7 h-7 text-ink-900" /></div>
          <div>
            <div className="font-display text-3xl tracking-wider">{branding.gymName}</div>
            <div className="text-xs text-neutral-400 uppercase tracking-widest">Demo comercial para gimnasios</div>
          </div>
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 border border-brand/30 px-4 py-2 text-brand text-sm font-bold mb-6">
            <CheckCircle2 className="w-4 h-4" /> Fase 1 lista para presentar
          </div>
          <h1 className="font-display text-6xl leading-tight tracking-wider">GESTIONA <span className="text-brand">CLIENTES</span><br />RUTINAS Y PROGRESO</h1>
          <p className="mt-6 text-neutral-300 max-w-md">Sistema para administrar clientes, entrenadores, rutinas personalizadas y seguimiento de medidas corporales desde una sola app.</p>
          <div className="grid grid-cols-3 gap-3 mt-8 max-w-xl">
            <Feature icon={Users} title="Clientes" />
            <Feature icon={BarChart3} title="Progreso" />
            <Feature icon={Smartphone} title="Responsive" />
          </div>
        </div>
        <div className="relative z-10 text-sm text-neutral-400">© {new Date().getFullYear()} {branding.gymName}</div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center"><Dumbbell className="w-7 h-7 text-ink-900" /></div>
            <div className="font-display text-3xl tracking-wider">{branding.gymName}</div>
          </div>

          <div className="mb-6 p-4 rounded-2xl bg-brand-50 border border-brand-200 text-sm text-ink-700">
            <div className="font-bold text-ink-900 flex items-center gap-2 mb-1"><ShieldCheck className="w-4 h-4 text-brand-700" /> Modo demo</div>
            Usa las cuentas demo del README para mostrar el flujo de administrador, entrenador o cliente.
          </div>

          <h2 className="text-3xl font-bold text-ink-900 mb-2">Entrar a GymFit Pro</h2>
          <p className="text-ink-500 mb-8">Presenta la app en menos de 2 minutos.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="label">Correo electrónico</label><input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo demo" required autoFocus /></div>
            <div><label className="label">Contraseña</label><input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="contraseña demo" required /></div>
            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
            <button type="submit" className="btn-primary w-full"><LogIn className="w-5 h-5" /> Entrar a la demo</button>
          </form>

          <div className="mt-8 grid gap-3">
            <DemoRole badge="ADMIN" cls="badge-admin" title="Dueño / administrador" desc="Panel general, usuarios, entrenadores y branding." />
            <DemoRole badge="TRAINER" cls="badge-trainer" title="Entrenador" desc="Clientes asignados, medidas y programas." />
            <DemoRole badge="CLIENT" cls="badge-client" title="Cliente" desc="Progreso, objetivo y rutina asignada." />
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title }: { icon: any; title: string }) {
  return <div className="rounded-2xl bg-white/5 border border-white/10 p-4"><Icon className="w-5 h-5 text-brand mb-2" /><div className="font-bold text-sm">{title}</div></div>;
}

function DemoRole({ badge, cls, title, desc }: { badge: string; cls: string; title: string; desc: string }) {
  return <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200"><span className={`badge ${cls} mr-2`}>{badge}</span><span className="font-bold">{title}</span><div className="text-sm text-ink-500 mt-1">{desc}</div></div>;
}
