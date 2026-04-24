import { useState } from 'react';
import { Save, User as UserIcon } from 'lucide-react';
import { useStore } from '../store';

export default function MyProfile() {
  const user = useStore((s) => s.currentUser)!;
  const updateUser = useStore((s) => s.updateUser);
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone ?? '',
    password: user.password,
  });
  const [saved, setSaved] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(user.id, {
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      password: form.password,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Mi Perfil</h1>
        <p className="text-ink-500 mt-1">Edita tus datos personales</p>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-100">
          <div className="w-20 h-20 rounded-xl bg-brand text-ink-900 flex items-center justify-center font-bold text-4xl">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-lg">{user.name}</div>
            <div className="text-sm text-ink-500">{user.email}</div>
            <span className={`badge badge-${user.role === 'admin' ? 'admin' : user.role === 'trainer' ? 'trainer' : 'client'} mt-2`}>
              {user.role === 'admin' ? 'Administrador' : user.role === 'trainer' ? 'Entrenador' : 'Cliente'}
            </span>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Nombre</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Correo</label>
            <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="label">Teléfono</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            {saved && <span className="text-sm text-green-600 font-semibold">✓ Guardado</span>}
            <button type="submit" className="btn-primary">
              <Save className="w-4 h-4" /> Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
