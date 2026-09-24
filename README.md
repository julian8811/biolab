# BioLab Escolar

Miniweb educativa para estudiantes de grados 10.º y 11.º orientada al aprendizaje experimental de ciencia de alimentos.

## Versión actual

**v0.8 — piloto funcional administrable**

- Ruta Láctea y Ruta Fermentación.
- Pretest y postest.
- Misión guiada en seis etapas.
- Registro de pH, temperatura, °Brix y observaciones.
- Reto científico y pitch final.
- Progreso, XP y badges.
- Sincronización con Supabase.
- Panel docente multi-equipo.
- Exportación CSV.
- Enlace y QR de acceso a cada sesión.
- Gestión de sesiones desde la miniweb.
- Activación/desactivación de sesiones.
- Cambio de PIN docente.
- Protección contra intentos repetidos en el panel docente.
- Navegación móvil y PWA con soporte offline.
- Iconografía SVG profesional, sin emojis en la interfaz.

## Seguridad del piloto

Las claves administrativas y PIN docentes no se guardan en el repositorio. Supabase conserva únicamente hashes.

La miniweb evita recopilar nombres individuales, correos electrónicos o documentos de identidad de estudiantes.

## Producción

Sitio: https://biolab-xi.vercel.app/

Cada push a `main` activa un deployment automático en Vercel.
