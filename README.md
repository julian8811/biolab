# BioLab Escolar

Miniweb educativa para grados 10.º y 11.º sobre ciencia de alimentos, transformación láctea y fermentación.

## Arquitectura

- Frontend estático autocontenido y responsive.
- PWA con `manifest.webmanifest` y `service-worker.js`.
- Iconografía SVG profesional.
- Imágenes integradas en el HTML para un despliegue portátil.
- Backend Supabase para sesión de aula, equipos, progreso y panel docente.

## Piloto

- Sesión inicial: `BIO-001`.
- La clave de Supabase incluida es una **publishable key** para cliente; no es una service-role key.
- Cambiar el PIN docente antes de un piloto abierto.

## Vercel

El proyecto no necesita comando de build. Vercel puede publicar la rama `main` como sitio estático.