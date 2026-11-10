// Genera las fotos del sitio en AVIF + WebP en varios anchos, más un placeholder difuso.
// Uso: npm run images   (lee de ../04-fotos/todas, escribe en public/img y src/content/images.generated.json)
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = path.resolve("../04-fotos/todas");
const OUT = path.resolve("public/img");
const JSON_OUT = path.resolve("src/content/images.generated.json");
const WIDTHS = [480, 800, 1200, 1600];

// Solo fotos con uso aprobado. Retiradas a pedido: pareja-laguna-de-los-tres, retrato-bn-guia.
// Pendiente de permiso del CAM: cumbre-grupal-cam.
const PHOTOS = [
  "chalten/atardecer-cordon-torre",
  "chalten/carpa-glaciar-1",
  "chalten/carpa-glaciar-2",
  "chalten/refugio-mates-cartas",
  "chalten/nevada-refugio-bn",
  "chalten/torre-bn-nubes",
  "chalten/cruce-cuerda-rio",
  "chalten/esquiadora-valle-laguna",
  "chalten/carpa-hielo-atardecer",
  "chalten/preparando-equipo-morena",
  "chalten/tormenta-bn-brazos",
  "mendoza/mapa-brujula",
  "mendoza/retrato-bn-cuerda",
  "mendoza/retrato-bn-buff",
  "mendoza/subida-grupo-pastizal",
  "mendoza/grupo-cresta-amanecer",
  "mendoza/grupo-pared-roca",
  "mendoza/tres-ladera-nevada",
  "mendoza/travesia-bn-nieve",
  "mendoza/luna-cerro-nevado",
  "mendoza/valle-atardecer-rosa",
  "mendoza/mochila-mirando-valle",
  "mendoza/panoramica-cordillera",
];

// Retratos del equipo (opcionales): 04-fotos/todas/equipo/alex.jpg y agostina.jpg (también .jpeg, .png, .webp).
// Si están, "Nosotros" muestra las fotos en lugar de la ilustración.
const EXTS = [".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG"];
const findSource = (p) => EXTS.map((e) => path.join(SRC, `${p}${e}`)).find((f) => fs.existsSync(f));
for (const who of ["alex", "agostina"]) if (findSource(`equipo/${who}`)) PHOTOS.push(`equipo/${who}`);

fs.mkdirSync(OUT, { recursive: true });
const manifest = {};

for (const p of PHOTOS) {
  const file = findSource(p);
  const id = path.basename(p);
  const img = sharp(file).rotate();
  const { width, height } = await img.metadata();
  const widths = WIDTHS.filter((w) => w < width).concat(width).filter((v, i, a) => a.indexOf(v) === i);
  for (const w of widths) {
    const base = path.join(OUT, `${id}-${w}`);
    // Reducción + enfoque leve (recupera nitidez perdida al achicar) y codificación eficiente.
    const resized = () => sharp(file).rotate().resize(w).sharpen({ sigma: w < 1000 ? 0.6 : 0.4 });
    if (!fs.existsSync(`${base}.avif`)) await resized().avif({ quality: 50, effort: 8, chromaSubsampling: "4:2:0" }).toFile(`${base}.avif`);
    if (!fs.existsSync(`${base}.webp`)) await resized().webp({ quality: 72, smartSubsample: true, effort: 6 }).toFile(`${base}.webp`);
  }
  const blur = await sharp(file).rotate().resize(24).blur(1.2).webp({ quality: 40 }).toBuffer();
  manifest[id] = {
    width,
    height,
    widths,
    blur: `data:image/webp;base64,${blur.toString("base64")}`,
  };
  console.log(`✓ ${id} (${width}×${height}) → ${widths.join(", ")}`);
}

fs.mkdirSync(path.dirname(JSON_OUT), { recursive: true });
fs.writeFileSync(JSON_OUT, JSON.stringify(manifest, null, 2));

// Imagen para compartir en redes (Open Graph), 1200 × 630.
const ogLogo = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0.35" stop-color="#121a16" stop-opacity="0"/><stop offset="1" stop-color="#121a16" stop-opacity="0.85"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <g transform="translate(64 452) scale(0.75)"><path d="M8 84 H74 C86 84 93 79 98 71 L113 41 L121 16 L128 44 L137 27 L145 55 C149 64 155 73 165 79 C171 83 176 84 184 84 H232" fill="none" stroke="#F3EEE4" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="198" cy="30" r="8" fill="#F2C2A6"/></g>
  <text x="260" y="530" font-family="Georgia, serif" font-size="56" fill="#F3EEE4">Lenga Studio</text>
  <text x="262" y="566" font-family="Arial, sans-serif" font-size="18" letter-spacing="5" fill="#F2C2A6">FOTOGRAFÍA · DISEÑO · WEB · REDES — EL CHALTÉN</text>
</svg>`);
await sharp(path.join(SRC, "chalten/atardecer-cordon-torre.jpg"))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .composite([{ input: ogLogo }])
  .jpeg({ quality: 82 })
  .toFile(path.resolve("public/og.jpg"));
console.log("✓ og.jpg");
