# Revisión de FermentArt interactivo

## Entrega

Rama local: `feat/colmayor-realistic-simulations`. Sin despliegue ni cambios de producción. El repositorio es una aplicación estática; no se añadió API, base de datos, autenticación ni transmisión de respuestas.

## Unidades de cambio

1. **Modelos educativos:** modelos de los cuatro fenómenos, curva temporal de coagulación, factor de calcio corregido, pruebas y supuestos. Límite de reversión: `assets/simulation-models.js`, sus pruebas y `docs/MODELS.md`. La interfaz nueva depende de la función temporal, por lo que no se debe revertir ese contrato aisladamente una vez aplicada la segunda unidad.
2. **Experiencia integrada:** portada, identidad, diagramas, actividades, simuladores y CSV, accesibilidad, caché y documentación. Reversión: restaurar juntos la entrada HTML, controladores, CSS, recursos, manifest y service worker al estado anterior; no hay migraciones de datos.

El cambio acumulado supera 400 líneas; se entrega como rama con unidades de trabajo, no como un PR monolítico ni como una publicación automática.

## Evidencia ejecutada

| Comprobación | Resultado |
|---|---|
| `node --test tests/simulation-models.test.cjs` | 9/9 pruebas aprobadas |
| Sintaxis de los controladores con `node --check` | Sin errores |
| `node tests/browser.cjs`, Playwright/Chromium | 1365, 390 y 360 px; cuatro módulos y cuatro simuladores por tamaño |
| Predicciones y puntos explorables | Respuestas correctas e incorrectas con explicación; tres estados por módulo |
| Tiempo | Inicio en cero, avance, pausa, reinicio, cambio de velocidad y fin del kéfir |
| Parámetros | Vacíos, fuera de rango y límites numéricos; sin NaN/Infinity en salidas |
| Comparación | Referencia conservada, dos curvas y advertencia de variables múltiples |
| Exportación | 12 CSV descargados; parámetros, unidades, referencia y datos presentes |
| Accesibilidad automatizada | Sin infracciones axe detectadas en etiquetas WCAG 2 A/AA y 2.1 AA en los estados revisados |
| Teclado | Pestañas, diálogo, ciclo de foco, Escape y retorno al disparador |
| Visual | Capturas de escritorio y móvil; pie verde y blanco, logo, favicon y ausencia de desbordamiento horizontal |
| Movimiento | Burbujas ligadas al estado; posición fija cuando se solicita movimiento reducido |
| Caché | Recarga sin conexión tras primera carga, imágenes y simuladores disponibles |
| Consola | Sin errores en las tres sesiones completas |

Entorno: Windows, Node 24, servidor estático Python en 127.0.0.1:4173. Axe y Playwright son herramientas de validación, no recursos enviados a los estudiantes. La comprobación automatizada no equivale a certificar toda WCAG; no se probó con lectores de pantalla físicos ni en Safari/Firefox.

## Flujo observado

Selección de módulo → exploración y predicción → apertura de simulador → validación de controles → cálculo local → representación visual → comparación → descarga CSV local. No existe frontera de API o servidor de datos en este flujo.

## Correcciones durante la revisión

- Retención explícita del foco al recorrer el diálogo en sentido inverso.
- Acumulador de tiempo independiente del redondeo, para que el kéfir avance a velocidad 1×.
- Altura adaptable de la portada y controles de tiempo antes de la gráfica.
- Pie institucional con texto blanco; eliminación de los estilos anteriores.
- División realista entre imagen editorial generada y diagramas científicos esquemáticos.
