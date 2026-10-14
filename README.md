# BioLab FermentArt 路 Colmayor

Experiencia web did谩ctica para estudiantes de 10.潞 y 11.潞 sobre fundamentos de fermentaci贸n y transformaciones de alimentos.

## Recorrido

- Fundamentos: metabolismo microbiano, fermentaci贸n alcoh贸lica y l谩ctica, k茅fir como comunidad mixta, variables y l铆mites de calidad.
- Experiencias guiadas de mora, k茅fir, lectura de instrumentos y coagulaci贸n enzim谩tica.
- Cuatro m贸dulos con ilustraciones SVG explorables, predicciones con retroalimentaci贸n y preguntas para explicar lo observado.
- Cuatro simuladores con reproducci贸n desde cero, pausa, reinicio, velocidad y comparaci贸n con una referencia guardada en memoria.
- CSV con par谩metros, unidades y curvas completas de ambos escenarios. Instrumentos exporta lecturas e interpretaci贸n.
- Lectura cr铆tica de cifras y unidades inconsistentes en el material FermentArt.
- Identidad visual Colmayor, fuente Montserrat, escudo y favicon institucionales.

## Alcance y seguridad

Los valores de los simuladores son estimaciones educativas, no mediciones ni predicciones de un alimento real. El sitio no entrega recetas ni instrucciones de elaboraci贸n y no invita a manipular o consumir muestras. Las pr谩cticas f铆sicas, si existen fuera de esta p谩gina, requieren supervisi贸n y protocolos de bioseguridad institucionales.

La experiencia se ejecuta en el navegador; los resultados exportados son CSV locales. No solicita ni transmite datos personales.

## Desarrollo local

Sirve la carpeta ra铆z con un servidor est谩tico, por ejemplo:

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

El servidor debe seguir activo en el puerto 4173. `BIOLAB_URL` permite usar otra direcci贸n; `BIOLAB_ARTIFACTS` cambia el directorio de capturas y resultados; `BIOLAB_AXE` admite una ruta a `axe.min.js` si est谩 instalado fuera del proyecto. Las pruebas comprueban 1365, 390 y 360 px, cuatro actividades, cuatro simuladores, validaci贸n de entradas, CSV, teclado, axe A/AA, movimiento reducido y funcionamiento sin conexi贸n despu茅s de cargar el sitio.

## Modelos y recursos visuales

La portada es una ilustraci贸n generada con la herramienta integrada de im谩genes y se identifica como tal. Las versiones WebP de 1536 y 768 px pesan aproximadamente 175 y 60 KB. Los cuatro diagramas educativos son SVG generados por `assets/learning.js`; sus botones y explicaciones tambi茅n funcionan con teclado.

Los supuestos y referencias est谩n en [docs/MODELS.md](docs/MODELS.md). La identidad usa Montserrat local, escudo SVG y la paleta del manual: verde principal `#195855`, turquesa `#108181`, tinta `#172139` y acentos `#FBBB28`/`#E9901E`. El pie utiliza verde institucional con texto blanco.

Los resultados y las respuestas se conservan solo durante la sesi贸n. Cambiar de m贸dulo conserva las respuestas; volver a abrir un simulador inicia un escenario nuevo. El servicio de cach茅 permite explorar sin conexi贸n tras la primera carga completa.

## Publicaci贸n

El repositorio mantiene su configuraci贸n existente de Vercel. Esta actualizaci贸n queda en la rama `feat/colmayor-realistic-simulations`; el sitio de producci贸n no se ha desplegado.

## Actualizaci髇 visual
Veinte ilustraciones generadas, una por c醦sula explicativa. QR tem醫ico con enlace p鷅lico, ampliaci髇 y descarga. Se priorizan im醙enes en lugar de videos. Las ilustraciones moleculares son conceptuales y no micrograf韆s.
