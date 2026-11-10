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

**Vercel**: el proyecto es la carpeta `web/` (Root Directory = `web` si el repositorio incluye todo `lenga-studio`). Los originales de `../04-fotos` no se suben: el build usa las fotos ya generadas en `public/img` y `src/content/images.generated.json`, así que esos archivos tienen que estar en el repositorio. Cada vez que cambies fotos, corré `npm run images` en tu máquina y subí los archivos nuevos.

## Antes de publicar (pendientes)

Todo está en `src/content/site.ts`:

- **WhatsApp**: `5491138997032` (Alex). Se puede pisar con `NEXT_PUBLIC_WHATSAPP` en `.env.local` o en el hosting. `whatsappDisplay` es cómo se muestra en el footer.
- **Mail**: `alexrobainaph@gmail.com`. No hay redes sociales en la web hasta que existan.
- **Dominio** (`url`): provisorio `lengastudio.com`. También hay que cambiarlo en `public/robots.txt`.
- **Nosotros**: muestra los retratos de `../04-fotos/todas/equipo/alex.jpg` y `agostina.jpg`. Para cambiarlos, reemplazar los archivos y correr `npm run images`. Los roles que aparecen debajo de cada retrato se editan en `dictionaries.ts` → `about.team`.
- **Permisos**: las fotos con personas necesitan su autorización. La cumbre del CAM quedó afuera hasta tener permiso.

## SEO

- **Dirección del sitio**: se resuelve sola en `next.config.ts`. Usa `NEXT_PUBLIC_SITE_URL` si está definida; si no, en Vercel toma el dominio de producción del proyecto. Cuando tengan dominio propio, conectarlo en Vercel (o definir `NEXT_PUBLIC_SITE_URL=https://dominio`) y volver a publicar.
- **Metadatos** (`src/lib/metadata.ts`): título y descripción por idioma, canonical, hreflang `es` / `en` / `x-default`, Open Graph y X con imagen, permiso para mostrar imágenes grandes en Google.
- **Datos estructurados** (`src/lib/structuredData.ts`): el estudio como servicio profesional en El Chaltén y Mendoza, con sus paquetes y servicios, el equipo (estudiantes de primer año de la EPGAMT), el sitio, la página y cada foto con autoría (Google Imágenes).
- **Archivos para buscadores** (se generan en el build): `/sitemap.xml` con las dos versiones y todas las fotos, `/robots.txt`, `/manifest.webmanifest` y `/llms.txt` (resumen para asistentes de IA).
- **Google Search Console**: verificar el sitio con `NEXT_PUBLIC_GSC_VERIFICATION=<código>` (método "etiqueta HTML") y enviar `/sitemap.xml`.
- **Caché**: `vercel.json` le da 30 días de caché a `/art` y `/img`. Si se reemplaza una foto con el mismo nombre, puede tardar en verse: mejor usar un nombre nuevo.
- Los textos que ven los buscadores son los de `dictionaries.ts`: si cambia el título del inicio o la descripción, conviene mantener "El Chaltén" y "fotógrafos / fotografía".

## Estructura

```
src/content/dictionaries.ts   Todos los textos ES / EN
src/content/site.ts           Contacto y datos del estudio
src/components/               Una sección por archivo (Hero, Services, Works, Process…)
src/components/scenes/        Ilustraciones SVG fuente (fitzroy, night, ridge, refugio, blots)
scripts/render-illustrations  Las renderiza una vez con Chrome → public/art/*.avif|webp (+ recorte para celular)
src/components/WatercolorDefs Filtros de acuarela compartidos (wc-1…6, wc-soft, wc-fine, wc-round, cloud, torn)
scripts/optimize-images.mjs   Fotos → AVIF + WebP en 480/800/1200/1600 px + placeholder + og.jpg
```

### Agregar o cambiar fotos

1. Copiar la foto a `../04-fotos/todas/<serie>/`.
2. Sumarla a la lista `PHOTOS` de `scripts/optimize-images.mjs` y correr `npm run images`.
3. Usarla en `Works.tsx` (`CHALTEN` o `MENDOZA_COLS`) y agregar su descripción en `dictionaries.ts` → `photos`, en los dos idiomas.

## Estructura de la página

Paisaje inicial → **paquetes por objetivo** (cada uno abre WhatsApp con el mensaje escrito) → trabajos (El Chaltén, salidas en Mendoza) → franja "tu negocio puede ser el próximo" → cómo trabajamos → expediciones → nosotros → contacto. Hay un botón flotante de WhatsApp desde que termina el paisaje inicial hasta Contacto.

## Movimiento

- **Sin intro**: el paisaje se arma en un segundo y la página se puede usar desde el principio. El scroll es el nativo del navegador, sin inercia.
- **Paisaje inicial**: capas de acuarela con parallax de scroll y de mouse, el cielo pasa del amanecer al día, nube en la cumbre y algunas hojas de lenga. Sin personas.
- **Fotos**: aparecen "sangrando" como acuarela húmeda.
- **Trabajos**: galería horizontal fija en escritorio, carrusel en celular, visor de fotos con teclado.
- **Cómo trabajamos**: sendero punteado que se dibuja con el scroll, sobre papel rasgado.
- **Expediciones**: noche en el glaciar con estrellas, estrella fugaz y carpa encendida; abajo, un borde de bosque de lengas que se funde con la sección siguiente.
- **Contacto**: refugio de madera pintado en acuarela al pie del Fitz Roy, entre lengas; humo, ventana encendida y nieve.

Todo respeta `prefers-reduced-motion`.

## Por qué las acuarelas son imágenes

Los filtros de acuarela (turbulencia, desplazamiento y bordes) son muy caros para el navegador. Calculados en vivo, trababan las animaciones. Ahora se calculan una sola vez al hornear y el sitio solo mueve imágenes, siempre a 60 cuadros por segundo. Cada capa tiene un recorte vertical para celular. El hero completo pesa unos 180 KB en computadora y unos 90 KB en celular (AVIF).

## Peso

- Ilustraciones: van en el HTML como SVG (unos 34 KB comprimido).
- Fotos: carga diferida, en AVIF o WebP según el navegador.
- JavaScript: unos 250 KB comprimido (React, Next y Motion).
