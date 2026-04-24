# GymFit Pro — Sistema de Gestión de Gimnasio

App web responsiva para gestión de gimnasios con 3 roles: **Administrador**, **Entrenador** y **Cliente**.

Basado en la hoja de evaluación física "Programa de Entrenamiento / Mide tu avance" — digitaliza el flujo completo: ficha de cliente, evaluación, rutinas por categoría (calentamiento, core, tren inferior, empuje, tracción) y seguimiento de medidas corporales con histórico.

## Cuentas demo

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@gym.com` | `admin123` |
| Entrenador | `entrenador@gym.com` | `trainer123` |
| Cliente | `cliente@gym.com` | `client123` |

## Funcionalidades

- **Administrador**: ve todo — gestiona usuarios, entrenadores, clientes, programas; branding personalizable; export/import de datos.
- **Entrenador**: solo sus clientes asignados, crea y edita sus programas y mediciones.
- **Cliente**: su perfil, progreso corporal con gráfico de evolución, y rutina asignada.

Incluye: asignación cliente ↔ entrenador, registro de medidas corporales (peso, pecho, cintura, cadera, brazos, muslos, % grasa), editor de rutinas con series/reps/peso/descanso, evaluación física (resistencia/fuerza/flexibilidad), imprimir programa.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS 3
- React Router, Zustand, Lucide
- **Backend actual**: `localStorage` (vía adapter en `src/storage.ts`). Para migrar a Supabase basta reemplazar ese archivo.

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # genera /dist
npm run preview   # sirve el build localmente
```

## Despliegue

El build (`dist/`) es estático — se puede subir a Vercel, Netlify, GitHub Pages o cualquier hosting.

## Personalización

Todo el branding (nombre del gimnasio, color principal, logo) se edita desde **Ajustes** sin tocar código.
