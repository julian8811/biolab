# BioLab Escolar

Miniweb educativa para estudiantes de grados 10.º y 11.º orientada al aprendizaje experimental de ciencia de alimentos.

## Versión actual

**v1.0 — imágenes HD y demostraciones interactivas**

- Ruta Láctea y Ruta Fermentación.
- Demostraciones interactivas paso a paso para pH, elaboración de queso, fermentación y análisis de resultados.
- Imágenes WebP HD servidas como recursos estáticos desde Vercel.
- Pretest y postest.
- Misión guiada en seis etapas.
- Registro de pH, temperatura, °Brix y observaciones.
- Reto científico y pitch final.
- Progreso, XP y badges.
- Sincronización con Supabase.
- Panel docente multi-equipo y exportación CSV.
- Gestión de sesiones, activación/desactivación y cambio de PIN.
- Protección contra intentos repetidos en el acceso docente.
- QR de sesión generado dentro de la infraestructura BioLab.
- Navegación móvil y soporte para áreas seguras.
- Confirmaciones y validaciones integradas en la interfaz.
- PWA con soporte offline.
- Iconografía SVG profesional, sin emojis en la interfaz.

## Validación

La prueba multiusuario v0.9 creó dos equipos en una sesión temporal, consolidó ambos en el panel docente, verificó el cierre de una sesión inactiva y eliminó todos los datos QA al finalizar.

## Seguridad del piloto

Las claves administrativas y PIN docentes no se guardan en el repositorio. Supabase conserva únicamente hashes.

La miniweb evita recopilar nombres individuales, correos electrónicos o documentos de identidad de estudiantes.

## Producción

Sitio: https://biolab-xi.vercel.app/

Cada push a `main` activa un deployment automático en Vercel.
