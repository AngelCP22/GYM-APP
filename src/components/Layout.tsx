import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users as UsersIcon,
  UserCog,
  Dumbbell,
  ClipboardList,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  User as UserIcon,
} from 'lucide-react';
import { useStore } from '../store';

export default function Layout() {
  const user = useStore((s) => s.currentUser)!;
  const branding = useStore((s) => s.branding);
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: '/', label: 'Inicio', icon: LayoutDashboard, roles: ['admin', 'trainer', 'client'] },
    { to: '/usuarios', label: 'Usuarios', icon: UserCog, roles: ['admin'] },
    { to: '/entrenadores', label: 'Entrenadores', icon: UsersIcon, roles: ['admin'] },
    { to: '/clientes', label: 'Clientes', icon: UsersIcon, roles: ['admin', 'trainer'] },
    { to: '/programas', label: 'Programas', icon: ClipboardList, roles: ['admin', 'trainer', 'client'] },
    { to: '/mi-perfil', label: 'Mi Perfil', icon: UserIcon, roles: ['admin', 'trainer', 'client'] },
    { to: '/ajustes', label: 'Ajustes', icon: SettingsIcon, roles: ['admin'] },
  ].filter((l) => l.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = { admin: 'Administrador', trainer: 'Entrenador', client: 'Cliente' }[user.role];

  return (
    <div className="min-h-screen flex bg-neutral-100">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-ink-900 text-white flex flex-col transition-transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-ink-700">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-ink-900" />
            </div>
            <div>
              <div className="font-display text-lg tracking-wider leading-none">
                {branding.gymName}
              </div>
              <div className="text-[10px] text-neutral-400 uppercase tracking-widest">Gym System</div>
            </div>
          </div>
          <button className="lg:hidden text-neutral-400" onClick={() => setMobileOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
            >
              <l.icon className="w-5 h-5" />
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-ink-700">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 rounded-full bg-brand text-ink-900 flex items-center justify-center font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{user.name}</div>
              <div className="text-xs text-neutral-400">{roleLabel}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-link w-full mt-2 text-red-400 hover:bg-red-900/30 hover:text-red-300"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center px-4 lg:px-6 gap-4 lg:hidden">
          <button onClick={() => setMobileOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="font-display text-xl tracking-wider">{branding.gymName}</div>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
