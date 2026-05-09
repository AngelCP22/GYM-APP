# Modelo funcional de GymFit Pro

La app debe funcionar con una sola base de codigo, un solo login y roles internos.

## Roles

Admin del gimnasio:
- Gestiona usuarios, clientes, entrenadores, rutinas, mediciones y ajustes.

Entrenador:
- Gestiona sus clientes asignados, sus rutinas y sus mediciones.

Cliente:
- Ve su perfil, objetivo, rutina, progreso y entrenador.

## Multi-gimnasio

No se debe duplicar la app por cada gimnasio. Cada gimnasio debe tener un identificador propio llamado gymId.

Todas las entidades importantes deben tener gymId:

- Usuarios
- Clientes
- Entrenadores
- Programas
- Mediciones
- Membresias
- Pagos
- Asistencia

Cuando un usuario inicia sesion, el sistema detecta su gymId y carga solo los datos de su gimnasio.

## Acceso

Primera version recomendada:

- Una sola URL publica para todos.
- El sistema identifica el gimnasio por el usuario autenticado.

Version futura:

- URL por gimnasio.
- Subdominio por gimnasio.

## Estado actual

La app ya tiene roles, usuarios, clientes, entrenadores, programas, mediciones y branding.

Tambien se agrego la base tecnica para trabajar con gymId usando localStorage como almacenamiento temporal.

## Produccion real

Para produccion se debe migrar a Supabase o PostgreSQL con autenticacion real, reglas de acceso y separacion segura por gimnasio.
