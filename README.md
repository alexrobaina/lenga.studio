# Lenga Studio — sitio web

Next.js 16 (App Router) exportado como sitio **100 % estático**. Bilingüe: español en `/` e inglés en `/en/`.

Concepto: **"Un día en El Chaltén"**. El scroll recorre un día de montaña en acuarela. Arranca con el amanecer sobre el Fitz Roy y termina con la noche en el glaciar y el refugio al atardecer. Las ilustraciones son SVG con filtros de acuarela. Las fotos son siempre reales y se presentan como tales.

## Uso

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # genera out/ (antes optimiza las fotos)
npm run illustrations  # vuelve a "hornear" las acuarelas (solo si cambiás src/components/scenes/*; necesita Chrome)
npx serve out -l 3001   # para ver la versión real (rápida). `npm run dev` es mucho más lento: no sirve para juzgar velocidad
```

Para publicar, subí la carpeta `out/` a cualquier hosting estático: Netlify, Vercel, Cloudflare Pages o un FTP. No necesita servidor.

## Antes de publicar (pendientes)

Todo está en `src/content/site.ts`:

- **WhatsApp**: definir `NEXT_PUBLIC_WHATSAPP` (por ejemplo `5492962XXXXXX`) en `.env.local` o en el hosting. Mientras no esté definido, los botones de WhatsApp llevan a la sección de contacto.
- **Dominio** (`url`), **Instagram** (`instagram`) y **mail** (`email`): hoy tienen valores provisorios (`lengastudio.com`, `@lengastudio`, `hola@lengastudio.com`). También hay que cambiar el dominio en `public/robots.txt`.
- **Nosotros**: hoy muestra una ilustración. Al dejar `alex.jpg` y `agostina.jpg` en `../04-fotos/todas/equipo/` y correr `npm run images`, se reemplaza sola por los dos retratos. Los roles que aparecen debajo de cada retrato se editan en `dictionaries.ts` → `about.team`.
- **Permisos**: las fotos con personas necesitan su autorización. La cumbre del CAM quedó afuera hasta tener permiso.
- **Foto del hero acuarela → foto**: el original disponible mide 1200 px. Para pantallas grandes conviene exportar una versión de 2400 px.

## Estructura

```
src/content/dictionaries.ts   Todos los textos ES / EN
src/content/site.ts           Contacto y datos del estudio
src/components/               Una sección por archivo (Hero, PaintReveal, Works, Process…)
src/components/scenes/        Ilustraciones SVG fuente (fitzroy, torre, night, ridge, refugio, blots)
scripts/render-illustrations  Las renderiza una vez con Chrome → public/art/*.avif|webp (+ recorte para celular)
src/components/WatercolorDefs Filtros de acuarela compartidos (wc-1…6, wc-round, cloud, torn)
scripts/optimize-images.mjs   Fotos → AVIF + WebP en 480/800/1200/1600 px + placeholder + og.jpg
```

### Agregar o cambiar fotos

1. Copiar la foto a `../04-fotos/todas/<serie>/`.
2. Sumarla a la lista `PHOTOS` de `scripts/optimize-images.mjs` y correr `npm run images`.
3. Usarla en `Works.tsx` (`CHALTEN` o `MENDOZA_COLS`) y agregar su descripción en `dictionaries.ts` → `photos`, en los dos idiomas.

## Estructura de la página

Paisaje inicial → acuarela que pasa a foto → **paquetes por objetivo** (cada uno abre WhatsApp con el mensaje escrito) → trabajos (El Chaltén, salidas en Mendoza) → franja "tu negocio puede ser el próximo" → cómo trabajamos → expediciones → nosotros → contacto. Hay un botón flotante de WhatsApp desde que termina el paisaje inicial hasta Contacto.

## Movimiento

- **Sin intro**: el paisaje se arma en un segundo y la página se puede usar desde el principio. El scroll es el nativo del navegador, sin inercia.
- **Paisaje inicial**: capas de acuarela con parallax de scroll y de mouse, el cielo pasa del amanecer al día, nube en la cumbre y algunas hojas de lenga. Sin personas.
- **Acuarela → foto**: pinceladas que descubren la foto real del cordón del Torre.
- **Fotos**: aparecen "sangrando" como acuarela húmeda.
- **Trabajos**: galería horizontal fija en escritorio, carrusel en celular, visor de fotos con teclado.
- **Cómo trabajamos**: sendero punteado que se dibuja con el scroll, sobre papel rasgado.
- **Expediciones**: noche en el glaciar con estrellas, estrella fugaz y carpa encendida.
- **Contacto**: refugio con humo, ventana encendida y nieve.

Todo respeta `prefers-reduced-motion`.

## Por qué las acuarelas son imágenes

Los filtros de acuarela (turbulencia, desplazamiento y bordes) son muy caros para el navegador. Calculados en vivo, trababan las animaciones. Ahora se calculan una sola vez al hornear y el sitio solo mueve imágenes, siempre a 60 cuadros por segundo. Cada capa tiene un recorte vertical para celular. El hero completo pesa unos 180 KB en computadora y unos 90 KB en celular (AVIF).

## Peso

- Ilustraciones: van en el HTML como SVG (unos 34 KB comprimido).
- Fotos: carga diferida, en AVIF o WebP según el navegador.
- JavaScript: unos 250 KB comprimido (React, Next, Motion y Lenis).
