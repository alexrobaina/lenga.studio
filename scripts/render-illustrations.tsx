// "Hornea" las ilustraciones SVG de acuarela a imágenes AVIF + WebP con transparencia.
// Los filtros de acuarela (turbulencia, desplazamiento, bordes) son muy caros para el navegador;
// renderizados una vez acá, el sitio solo mueve imágenes y las animaciones quedan fluidas.
//
// Uso: npm run illustrations   (necesita Google Chrome instalado)
// Fuente de verdad: src/components/scenes/*.tsx  ·  Salida: public/art/*  +  src/content/art.generated.json
import fs from "node:fs";
import path from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import puppeteer from "puppeteer-core";
import sharp from "sharp";
import WatercolorDefs from "../src/components/WatercolorDefs";
import * as fitz from "../src/components/scenes/fitzroy";
import * as night from "../src/components/scenes/night";
import * as refugio from "../src/components/scenes/refugio";
import { RidgeScene } from "../src/components/scenes/ridge";
import { Blot } from "../src/components/scenes/blots";

type Spec = {
  id: string;
  el: React.ReactElement;
  w: number; // viewBox
  h: number;
  scale: number; // escala de render (calidad)
  out: number; // ancho final escritorio
  mobile?: { x: number; w: number; out: number }; // recorte vertical para celular (en unidades del viewBox)
  opaque?: boolean;
};

const HERO = { w: 1600, h: 1000, scale: 1.6, out: 2400, mobile: { x: 410, w: 780, out: 1170 } };
const NIGHT = { w: 1600, h: 900, scale: 1.6, out: 2400, mobile: { x: 450, w: 700, out: 1050 } };
const STRIP = { w: 1440, h: 360, scale: 2, out: 2400 };

const SPECS: Spec[] = [
  { id: "hero-sky-dawn", el: <fitz.SkyDawn />, ...HERO, opaque: true },
  { id: "hero-sky-day", el: <fitz.SkyDay />, ...HERO, opaque: true },
  { id: "hero-sun", el: <fitz.Sun />, ...HERO },
  { id: "hero-far", el: <fitz.FarRange />, ...HERO },
  { id: "hero-massif", el: <fitz.Massif />, ...HERO },
  { id: "hero-cloud", el: <fitz.SummitCloud />, ...HERO },
  { id: "hero-mist", el: <fitz.Mist />, ...HERO },
  { id: "hero-hills", el: <fitz.Hills />, ...HERO },
  { id: "hero-forest", el: <fitz.Forest />, ...HERO },
  { id: "hero-meadow", el: <fitz.Meadow />, ...HERO },
  { id: "hero-fg", el: <fitz.Foreground />, ...HERO },
  { id: "night-sky", el: <night.NightSky />, ...NIGHT, opaque: true },
  { id: "night-moon", el: <night.Moon />, ...NIGHT },
  { id: "night-spires", el: <night.NightSpires />, ...NIGHT },
  { id: "night-glacier", el: <night.Glacier />, ...NIGHT },
  { id: "night-front", el: <night.NightFront />, ...NIGHT },
  { id: "ridge", el: <RidgeScene />, w: 800, h: 640, scale: 2, out: 1600, opaque: true },
  { id: "refugio-back", el: <refugio.RefugioBack />, ...STRIP, mobile: { x: 420, w: 600, out: 1200 } },
  { id: "refugio-mid", el: <refugio.RefugioMid />, ...STRIP, mobile: { x: 420, w: 600, out: 1200 } },
  { id: "refugio-front", el: <refugio.RefugioFront />, ...STRIP, mobile: { x: 420, w: 600, out: 1200 } },
  { id: "bleed", el: <BleedBlot />, w: 600, h: 600, scale: 1, out: 600 },
  ...[0, 1, 2, 3, 4, 5].map((i) => ({ id: `blot-${i}`, el: <Blot i={i} />, w: 140, h: 140, scale: 2, out: 280 })),
];

// Mancha de acuarela blanca (se usa como máscara para que las fotos "sangren" al aparecer).
function BleedBlot() {
  return (
    <svg viewBox="0 0 600 600" aria-hidden="true">
      <g filter="url(#wc-3)" fill="#fff">
        <path d="M300 70 C400 66 510 140 524 250 C540 360 480 470 370 520 C260 560 140 520 92 420 C46 320 70 190 150 120 C200 82 250 72 300 70 Z" />
        <ellipse cx="470" cy="170" rx="46" ry="36" />
        <ellipse cx="120" cy="460" rx="40" ry="30" />
        <ellipse cx="520" cy="430" rx="30" ry="24" />
      </g>
    </svg>
  );
}

const OUT = path.resolve("public/art");
const JSON_OUT = path.resolve("src/content/art.generated.json");
const only = process.argv[2];

fs.mkdirSync(OUT, { recursive: true });
const defs = renderToStaticMarkup(<WatercolorDefs />);
const manifest: Record<string, unknown> = fs.existsSync(JSON_OUT) ? JSON.parse(fs.readFileSync(JSON_OUT, "utf8")) : {};

async function main() {
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
    args: ["--use-angle=metal", "--force-color-profile=srgb"],
  });
  const page = await browser.newPage();

  async function encode(png: Buffer, base: string, width: number, opaque?: boolean) {
    const img = sharp(png).resize(width);
    const a = opaque ? img.clone().removeAlpha() : img.clone();
    await a.avif({ quality: 50, effort: 7, chromaSubsampling: "4:2:0" }).toFile(`${base}.avif`);
    await (opaque ? img.clone().removeAlpha() : img.clone()).webp({ quality: 74, alphaQuality: 80, effort: 6 }).toFile(`${base}.webp`);
    return [fs.statSync(`${base}.avif`).size, fs.statSync(`${base}.webp`).size];
  }

  for (const s of SPECS) {
    if (only && !s.id.startsWith(only)) continue;
    const markup = renderToStaticMarkup(s.el);
    const html = `<!doctype html><html><head><style>html,body{margin:0;background:transparent}#c{width:${s.w}px;height:${s.h}px}#c>svg{display:block;width:100%;height:100%}</style></head><body>${defs}<div id="c">${markup}</div></body></html>`;
    await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: s.scale });
    await page.setContent(html, { waitUntil: "load" });
    const png = Buffer.from(await page.screenshot({ omitBackground: !s.opaque, clip: { x: 0, y: 0, width: s.w, height: s.h }, type: "png" }));
    const [aD, wD] = await encode(png, path.join(OUT, s.id), s.out, s.opaque);
    const entry: Record<string, unknown> = { w: s.out, h: Math.round((s.out * s.h) / s.w) };
    let note = `${(aD / 1024).toFixed(0)} KB avif / ${(wD / 1024).toFixed(0)} KB webp`;
    if (s.mobile) {
      const k = (s.w * s.scale) / s.w;
      const crop = await sharp(png)
        .extract({ left: Math.round(s.mobile.x * k), top: 0, width: Math.round(s.mobile.w * k), height: Math.round(s.h * k) })
        .png()
        .toBuffer();
      const [aM, wM] = await encode(crop, path.join(OUT, `${s.id}-m`), s.mobile.out, s.opaque);
      entry.m = { w: s.mobile.out, h: Math.round((s.mobile.out * s.h) / s.mobile.w) };
      note += ` · celular ${(aM / 1024).toFixed(0)} KB avif / ${(wM / 1024).toFixed(0)} KB webp`;
    }
    manifest[s.id] = entry;
    console.log(`✓ ${s.id.padEnd(14)} ${note}`);
  }
  await browser.close();
  fs.writeFileSync(JSON_OUT, JSON.stringify(manifest, null, 2));

}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
