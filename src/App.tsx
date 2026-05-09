import { Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useStore } from './store';
import LoginCommercial from './pages/LoginCommercial';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import Trainers from './pages/Trainers';
import TrainerDetail from './pages/TrainerDetail';
import Programs from './pages/Programs';
import ProgramEditor from './pages/ProgramEditor';
import Settings from './pages/Settings';
import MyProfile from './pages/MyProfile';
import type { Role } from './types';

function Protected({ roles, children }: { roles?: Role[]; children: ReactNode }) {
  const user = useStore((s) => s.currentUser);
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  const user = useStore((s) => s.currentUser);

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginCommercial />} />
      <Route
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route index element={<Dashboard />} />
        <Route
          path="usuarios"
          element={
            <Protected roles={['admin']}>
              <Users />
            </Protected>
          }
        />
        <Route
          path="entrenadores"
          element={
            <Protected roles={['admin']}>
              <Trainers />
            </Protected>
          }
        />
        <Route
          path="entrenadores/:id"
          element={
            <Protected roles={['admin']}>
              <TrainerDetail />
            </Protected>
          }
        />
        <Route
          path="clientes"
          element={
            <Protected roles={['admin', 'trainer']}>
              <Clients />
            </Protected>
          }
        />
        <Route path="clientes/:id" element={<ClientDetail />} />
        <Route path="programas" element={<Programs />} />
        <Route path="programas/nuevo" element={<ProgramEditor />} />
        <Route path="programas/:id" element={<ProgramEditor />} />
        <Route path="mi-perfil" element={<MyProfile />} />
        <Route
          path="ajustes"
          element={
            <Protected roles={['admin']}>
              <Settings />
            </Protected>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
