import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { useStore } from '../store';
import type { Role, User } from '../types';

export default function Users() {
  const users = useStore((s) => s.users);
  const createUser = useStore((s) => s.createUser);
  const updateUser = useStore((s) => s.updateUser);
  const deleteUser = useStore((s) => s.deleteUser);
  const [editing, setEditing] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | Role>('all');

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDelete = (u: User) => {
    if (confirm(`¿Eliminar a ${u.name}? Esta acción borrará sus datos asociados.`)) {
      deleteUser(u.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-ink-500 mt-1">Administra todas las cuentas del sistema</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowModal(true);
          }}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" /> <span className="hidden sm:inline">Nuevo usuario</span>
        </button>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            className="input pl-9"
            placeholder="Buscar por nombre o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input sm:w-48"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as 'all' | Role)}
        >
          <option value="all">Todos los roles</option>
          <option value="admin">Administradores</option>
          <option value="trainer">Entrenadores</option>
          <option value="client">Clientes</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 text-xs uppercase tracking-wider text-ink-600">
              <tr>
                <th className="text-left p-3">Nombre</th>
                <th className="text-left p-3">Correo</th>
                <th className="text-left p-3">Rol</th>
                <th className="text-left p-3 hidden md:table-cell">Teléfono</th>
                <th className="text-right p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3 text-ink-600">{u.email}</td>
                  <td className="p-3">
                    <span className={`badge badge-${u.role === 'admin' ? 'admin' : u.role === 'trainer' ? 'trainer' : 'client'}`}>
                      {u.role === 'admin' ? 'Admin' : u.role === 'trainer' ? 'Entrenador' : 'Cliente'}
                    </span>
                  </td>
                  <td className="p-3 text-ink-600 hidden md:table-cell">{u.phone ?? '—'}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        setEditing(u);
                        setShowModal(true);
                      }}
                      className="btn-ghost p-2"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
                      className="btn-danger p-2"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-ink-500">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <UserModal
          user={editing}
          users={users}
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            if (editing) {
              updateUser(editing.id, data);
            } else {
              createUser(data as Omit<User, 'id' | 'createdAt'>);
            }
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

function UserModal({
  user,
  users,
  onClose,
  onSave,
}: {
  user: User | null;
  users: User[];
  onClose: () => void;
  onSave: (data: Partial<User>) => void;
}) {
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: user?.password ?? '',
    role: (user?.role ?? 'client') as Role,
    phone: user?.phone ?? '',
    trainerId: user?.trainerId ?? '',
  });

  const trainers = users.filter((u) => u.role === 'trainer');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<User> = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      phone: form.phone || undefined,
      trainerId: form.role === 'client' ? form.trainerId || undefined : undefined,
    };
    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-neutral-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold">{user ? 'Editar usuario' : 'Nuevo usuario'}</h2>
          <button onClick={onClose} className="btn-ghost p-2">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div>
            <label className="label">Nombre completo</label>
            <input
              className="input"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Correo electrónico</label>
            <input
              type="email"
              className="input"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input
              className="input"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Teléfono</label>
            <input
              className="input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Rol</label>
            <select
              className="input"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
            >
              <option value="client">Cliente</option>
              <option value="trainer">Entrenador</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          {form.role === 'client' && (
            <div>
              <label className="label">Entrenador asignado</label>
              <select
                className="input"
                value={form.trainerId}
                onChange={(e) => setForm({ ...form, trainerId: e.target.value })}
              >
                <option value="">Sin asignar</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
