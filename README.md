# BioLab Escolar

Miniweb educativa para estudiantes de grados 10.º y 11.º orientada al aprendizaje experimental de ciencia de alimentos.

## Versión actual

**v0.9 — piloto funcional validado**

Incluye:

- Ruta Láctea y Ruta Fermentación.
- Pretest y postest.
- Misión guiada en seis etapas.
- Registro de pH, temperatura, °Brix y observaciones.
- Validación básica de rangos de medición.
- Tendencias visuales de pH y °Brix.
- Interpretación científica orientativa de la evidencia.
- Corrección/eliminación de mediciones.
- Descarga CSV de evidencia del equipo.
- Reto científico y pitch final.
- Resumen final con aprendizaje, métricas, interpretación y badges.
- Progreso, XP y navegación móvil.
- Sincronización Supabase multi-equipo.
- Panel docente con métricas y exportación CSV.
- Creación, activación y administración de sesiones.
- Cambio de PIN docente.
- Protección contra intentos repetidos.
- PWA con funcionamiento offline básico.
- Iconografía SVG profesional.

## Seguridad

Las credenciales docentes y administrativas se almacenan como hashes en Supabase. No se guardan en GitHub.

La miniweb evita recopilar nombres individuales, correos electrónicos o documentos de identidad de estudiantes.

## Producción

https://biolab-xi.vercel.app/

El branch `main` despliega automáticamente a Vercel.
