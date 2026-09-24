# BioLab Escolar

Miniweb educativa para estudiantes de grados 10.º y 11.º orientada al aprendizaje experimental de ciencia de alimentos.

## Versión estable

**v1.0 — piloto funcional conectado**

Funciones principales:

- Ruta Láctea y Ruta Fermentación.
- Pretest y postest.
- Misión guiada: Descubre → Formula → Transforma → Mide → Resuelve → Presenta.
- Registro de pH, temperatura, °Brix y observaciones.
- Validación básica de mediciones y tendencias de pH/°Brix.
- Interpretación científica orientativa.
- Corrección y eliminación de datos experimentales.
- Descarga CSV de evidencia del equipo.
- Reto científico, pitch y resumen final.
- XP, badges y progreso persistente.
- Navegación móvil y PWA.
- Enlaces/QR de sesión.
- Validación de sesión antes de iniciar.
- Manejo correcto de sesiones recibidas mediante `?session=`.
- Sincronización multi-equipo con Supabase.
- Panel docente con métricas y exportación CSV.
- Creación, activación y administración de sesiones.
- Cambio de PIN docente.
- Protección contra intentos repetidos.

## Privacidad y seguridad

La miniweb evita recopilar nombres individuales, correos electrónicos o documentos de identidad de estudiantes.

Los secretos docentes y administrativos se almacenan como hashes en Supabase y no se guardan en GitHub.

## Producción

https://biolab-xi.vercel.app/

El branch `main` despliega automáticamente a Vercel.
