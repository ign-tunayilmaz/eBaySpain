# eBay Community Moderation Tool — España

Guía de referencia rápida para moderadores de la comunidad eBay España, con plantillas en español listas para usar, temporizador de turno y notas de administración.

## Características

- **Plantillas**: Eliminar mensaje, editar mensaje, cerrar/redirigir hilos, redirección a Atención al Cliente, fragmentos de normas (GG01–GG05, SG00–SG12)
- **Plantillas de baneo**: Período, motivo, usuario, email, IP, URL de spam, fecha de inicio — copiar motivo interno y público
- **Notas de administración**: Generadores de notas para mensaje editado y mensaje eliminado con enlace, incumplimiento y copiar
- **Temporizador de turno**: Iniciar/pausar/reanudar con indicadores visuales de 45 min / 60 min
- **Notas del turno**: Bloc de notas persistente (localStorage)
- **Modo oscuro**: Alternar y preferencia guardada
- **Plantillas personalizadas**: Editar cualquier plantilla y restaurar por defecto

## Configuración

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages (evitar pantalla en blanco)

**Importante:** En **Settings → Pages** del repositorio, el **Source** debe ser **"GitHub Actions"**, no "Deploy from a branch". Si está en "Deploy from a branch", verás pantalla en blanco y 404 para `main.tsx`. Tras cambiarlo a GitHub Actions, la URL será: `https://<usuario>.github.io/eBaySpain/`. Ver [DEPLOYMENT.md](DEPLOYMENT.md) para más detalles.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- lucide-react
