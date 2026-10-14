# BioLab FermentArt · Colmayor

Experiencia web didáctica para estudiantes de 10.º y 11.º sobre fundamentos de fermentación y transformaciones de alimentos.

## Recorrido

- Fundamentos: metabolismo microbiano, fermentación alcohólica y láctica, kéfir como comunidad mixta, variables y límites de calidad.
- Experiencias guiadas de mora, kéfir, lectura de instrumentos y coagulación enzimática.
- Cuatro módulos con ilustraciones SVG explorables, predicciones con retroalimentación y preguntas para explicar lo observado.
- Cuatro simuladores con reproducción desde cero, pausa, reinicio, velocidad y comparación con una referencia guardada en memoria.
- CSV con parámetros, unidades y curvas completas de ambos escenarios. Instrumentos exporta lecturas e interpretación.
- Lectura crítica de cifras y unidades inconsistentes en el material FermentArt.
- Identidad visual Colmayor, fuente Montserrat, escudo y favicon institucionales.

## Alcance y seguridad

Los valores de los simuladores son estimaciones educativas, no mediciones ni predicciones de un alimento real. El sitio no entrega recetas ni instrucciones de elaboración y no invita a manipular o consumir muestras. Las prácticas físicas, si existen fuera de esta página, requieren supervisión y protocolos de bioseguridad institucionales.

La experiencia se ejecuta en el navegador; los resultados exportados son CSV locales. No solicita ni transmite datos personales.

## Desarrollo local

Sirve la carpeta raíz con un servidor estático, por ejemplo:

```sh
python -m http.server 4173
```

Abre `http://localhost:4173/`. Los modelos tienen pruebas automatizadas con Node.js:

```sh
node --test tests/simulation-models.test.cjs
```

Para las pruebas de navegador, instala Playwright y axe-core como herramientas locales (no son dependencias del sitio):

```sh
npm install --no-save --package-lock=false playwright axe-core
npx playwright install chromium
node tests/browser.cjs
```

El servidor debe seguir activo en el puerto 4173. `BIOLAB_URL` permite usar otra dirección; `BIOLAB_ARTIFACTS` cambia el directorio de capturas y resultados; `BIOLAB_AXE` admite una ruta a `axe.min.js` si está instalado fuera del proyecto. Las pruebas comprueban 1365, 390 y 360 px, cuatro actividades, cuatro simuladores, validación de entradas, CSV, teclado, axe A/AA, movimiento reducido y funcionamiento sin conexión después de cargar el sitio.

## Modelos y recursos visuales

La portada es una ilustración generada con la herramienta integrada de imágenes y se identifica como tal. Las versiones WebP de 1536 y 768 px pesan aproximadamente 175 y 60 KB. Los cuatro diagramas educativos son SVG generados por `assets/learning.js`; sus botones y explicaciones también funcionan con teclado.

Los supuestos y referencias están en [docs/MODELS.md](docs/MODELS.md). La identidad usa Montserrat local, escudo SVG y la paleta del manual: verde principal `#195855`, turquesa `#108181`, tinta `#172139` y acentos `#FBBB28`/`#E9901E`. El pie utiliza verde institucional con texto blanco.

Los resultados y las respuestas se conservan solo durante la sesión. Cambiar de módulo conserva las respuestas; volver a abrir un simulador inicia un escenario nuevo. El servicio de caché permite explorar sin conexión tras la primera carga completa.

## Publicación

El repositorio mantiene su configuración existente de Vercel. Esta actualización queda en la rama `feat/colmayor-realistic-simulations`; el sitio de producción no se ha desplegado.
