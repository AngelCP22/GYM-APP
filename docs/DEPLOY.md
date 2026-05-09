# Deploy de GymFit Pro

## Vercel recomendado

1. Importar el repositorio en Vercel.
2. Seleccionar framework Vite.
3. Usar estos valores:

```bash
Build command: npm run build
Output directory: dist
```

4. Hacer deploy.

## GitHub Pages

La app usa HashRouter para que las rutas funcionen en hosting estático.

Comando de build:

```bash
npm run build
```

Publicar el contenido de la carpeta:

```bash
dist/
```

## Demo local

```bash
npm install
npm run dev
```

## Build local

```bash
npm run build
npm run preview
```
