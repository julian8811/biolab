# Modelos educativos y procedencia

## Qué representan

Los modelos permiten comparar tendencias. No son gemelos digitales, mediciones de un alimento ni validaciones de inocuidad. Todos los tiempos están acelerados durante la reproducción; las unidades de los ejes son tiempo simulado.

| Modelo | Parámetros y resultado | Límite principal |
|---|---|---|
| Mora | Temperatura, sólidos iniciales, pH fijo y oxígeno; 0–336 h, azúcar equivalente, etanol y CO₂ | Rendimientos y crecimiento simplificados. °Brix equivalente no es lectura refractométrica posfermentación. |
| Kéfir | Temperatura, lactosa, cantidad de gránulos y pH inicial; 0–24 h, pH y lactosa | Comunidad agregada. La curva exponencial y su extrapolación no están validadas para otros cultivos. |
| Coagulación | Temperatura, dosis relativa, pH, calcio y corte modelado; 0–240 min | Firmeza y sinéresis son índices relativos. La curva temporal es una interpolación didáctica. |
| Instrumentos | pH y °Brix sintéticos, calibración, presencia de etanol | Sin incertidumbre ni ruido. Cambiar la interpretación no estima una corrección por etanol. |

Los controles validan rangos, pasos, valores vacíos y no finitos antes de calcular. Durante una entrada inválida se conserva la última vista válida y se bloquean reproducción, referencia y exportación.

## Coagulación temporal

El tiempo de floculación procede del modelo previo. Antes de ese tiempo, la firmeza es cero. Después se aproxima al índice final mediante `1 − exp(−tiempo_transcurrido / max(10, tiempo_floculación))`. Si no hay respuesta o la floculación queda fuera de los 240 min, no se fuerza la aparición de una red. El factor de calcio es 1.06 en el denominador del tiempo: favorece una espera menor dentro de este supuesto simplificado. No cuantifica una concentración de calcio ni una pauta de elaboración.

## Referencias y decisiones editoriales

- **FermentArt vf 2026**, presentación aportada: selección de temas, mora y kéfir. La tabla de mora aporta el valor inicial educativo de 9 °Brix. Las discrepancias con 14 °Brix/maracuyá y las unidades ambiguas se tratan como lectura crítica, no como receta.
- [OpenStax, Microbiology 8.4](https://openstax.org/books/microbiology/pages/8-4-fermentation): glucólisis, regeneración de NAD⁺ y rutas fermentativas.
- [Quantification of Major Bacteria and Yeast Species in Kefir Consortia](https://www.frontiersin.org/journals/microbiology/articles/10.3389/fmicb.2020.01291/full): composición microbiana estudiada en consorcios de kéfir; no se extrapolan beneficios clínicos.
- [From Milk Kefir to Water Kefir](https://www.mdpi.com/2311-5637/8/3/135): referencias de pH final usadas por el modelo de kéfir (4.94 a 20 °C y 4.67 a 25 °C). No establece la validez de la interpolación implementada.
- [Effects of pH, calcium chloride, and chymosin concentration on coagulation properties](https://pubmed.ncbi.nlm.nih.gov/3934240/): relación entre condiciones y coagulación. Los índices y factores numéricos de esta aplicación son didácticos.
- **Manual de comunicaciones y mercadeo V7**, pp. 23 y 33: colores institucionales y Montserrat. Escudo limpio procedente de CEITTO.

## Recursos visuales

Herramienta: generación integrada de imágenes, sin API externa propia. Archivos del sitio: `assets/fermentart-hero.webp` y `assets/fermentart-hero-small.webp`. Se conserva el original generado fuera del repositorio; las versiones del sitio solo cambian formato y resolución.

Prompt utilizado:

> Use case: scientific-educational. Create one premium realistic editorial still-life illustration for a Colombian educational fermentation website, landscape 3:2. A shallow ceramic dish of deep purple fresh blackberries with subtle dew, a small glass vessel of blackberry juice, a clear glass of milk kefir with ivory cauliflower-like kefir grains in a small dish, a plausible laboratory pH meter probe and optical handheld refractometer arranged on an off-white lab bench. Background soft pale sage, accents deep botanical teal and warm golden ochre, natural window lighting, realistic glass and fruit textures. Carefully arranged spacious composition, objects clear at mobile scale, no people, no labels, no text, no logos, no exaggerated bubbling, no implication of an actual experiment. This will be captioned as AI-generated educational illustration in the website.

Los cuatro diagramas SVG (levadura, comunidad de kéfir, micelas y equipos) se construyen en código para permitir estados interactivos. Son esquemas sin escala ni pretensión de micrografía.
