# Fase 1 — Demo comercial de GymFit Pro

Objetivo: dejar la app lista para mostrar a gimnasios pequeños, entrenadores y centros de entrenamiento como una demo funcional.

## Estado actual

La app ya tiene:

- Login con roles: administrador, entrenador y cliente.
- Dashboard por rol.
- Clientes y entrenadores.
- Programas de entrenamiento.
- Registro de medidas corporales.
- Branding editable del gimnasio.
- Datos demo precargados.

## Cuentas demo

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@gym.com | admin123 |
| Entrenador | entrenador@gym.com | trainer123 |
| Cliente | cliente@gym.com | client123 |

## Cómo vender la demo

Mensaje corto:

Sistema para gimnasios que organiza clientes, entrenadores, rutinas y progreso físico en una sola plataforma.

Beneficios:

- Menos desorden en cuadernos, Excel y WhatsApp.
- Seguimiento profesional de cada cliente.
- Rutinas y medidas organizadas.
- Imagen más moderna para el gimnasio.
- Puede empezar como sistema local y luego crecer a nube.

## Cómo correr localmente

```bash
npm install
npm run dev
```

## Cómo desplegar demo en Vercel

- Framework: Vite
- Build command: npm run build
- Output directory: dist

## Nota técnica importante

Esta fase usa localStorage. Sirve para demo, preventa o instalación local simple. Para producción multiusuario se debe migrar a base de datos real y autenticación segura.
