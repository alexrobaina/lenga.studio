// Captura de pantalla para revisión visual: los agentes miran lo que diseñaron antes de entregarlo.
//
// Uso (desde web/):
//   node scripts/snap.mjs <archivo.html | URL> [--size ig,story,mobile,desktop] [--full] [--out carpeta]
//                         [--selector ".pieza"] [--wait 800] [--dark] [--reduced-motion]
//
// Ejemplos:
//   node scripts/snap.mjs ../08-diseno/instagram/index.html --size ig --selector ".slide"
//   node scripts/snap.mjs http://localhost:3000 --size mobile,desktop --full
//
// Con --selector se captura cada elemento que coincida (útil para carruseles: una imagen por slide).
// Salida por defecto: carpeta _capturas/ junto al archivo (o en el directorio actual si es una URL).
// Imprime la ruta de cada PNG para que el agente la abra con Read y la critique.
// Necesita Google Chrome instalado (o CHROME_PATH apuntando al ejecutable).
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const SIZES = {
  ig: { width: 1080, height: 1350 }, // post y carrusel 4:5
  square: { width: 1080, height: 1080 }, // destacados
  story: { width: 1080, height: 1920 }, // historia y reel
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  small: { width: 360, height: 740, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  tablet: { width: 820, height: 1180, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  desktop: { width: 1440, height: 900 },
  wide: { width: 1920, height: 1080 },
  a4: { width: 794, height: 1123, deviceScaleFactor: 2 },
  og: { width: 1200, height: 630 },
};

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

function parseArgs(argv) {
  const opts = { sizes: ["desktop"], full: false, wait: 600, dark: false, reducedMotion: false };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--size") opts.sizes = argv[++i].split(",").map((s) => s.trim());
    else if (a === "--full") opts.full = true;
    else if (a === "--out") opts.out = argv[++i];
    else if (a === "--selector") opts.selector = argv[++i];
    else if (a === "--wait") opts.wait = Number(argv[++i]);
    else if (a === "--dark") opts.dark = true;
    else if (a === "--reduced-motion") opts.reducedMotion = true;
    else rest.push(a);
  }
  opts.target = rest[0];
  return opts;
}

const opts = parseArgs(process.argv.slice(2));
if (!opts.target) {
  console.error("Falta el archivo o la URL. Uso: node scripts/snap.mjs <archivo.html | URL> [--size ig,mobile] [--full]");
  process.exit(1);
}
for (const s of opts.sizes) {
  if (!SIZES[s]) {
    console.error(`Tamaño desconocido "${s}". Opciones: ${Object.keys(SIZES).join(", ")}`);
    process.exit(1);
  }
}

const isUrl = /^https?:\/\//.test(opts.target);
const url = isUrl ? opts.target : pathToFileURL(path.resolve(opts.target)).href;
const base = isUrl
  ? new URL(opts.target).hostname.replace(/[^a-z0-9]+/gi, "-") + new URL(opts.target).pathname.replace(/[^a-z0-9]+/gi, "-")
  : path.basename(opts.target, path.extname(opts.target));
const outDir = path.resolve(opts.out ?? (isUrl ? "_capturas" : path.join(path.dirname(path.resolve(opts.target)), "_capturas")));
fs.mkdirSync(outDir, { recursive: true });

const executablePath = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
if (!executablePath) {
  console.error("No encontré Chrome. Instalalo o definí CHROME_PATH.");
  process.exit(1);
}

const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--hide-scrollbars", "--font-render-hinting=none", "--allow-file-access-from-files"] });
const written = [];
try {
  for (const size of opts.sizes) {
    const page = await browser.newPage();
    await page.setViewport({ deviceScaleFactor: 1, ...SIZES[size] });
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: opts.dark ? "dark" : "light" },
      { name: "prefers-reduced-motion", value: opts.reducedMotion ? "reduce" : "no-preference" },
    ]);
    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);

    // Recorre la página para disparar animaciones de entrada y carga diferida, y vuelve arriba.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await new Promise((r) => setTimeout(r, opts.wait));

    const suffix = `${size}${opts.dark ? "-dark" : ""}`;
    if (opts.selector) {
      const els = await page.$$(opts.selector);
      if (els.length === 0) console.error(`Aviso: "${opts.selector}" no coincide con ningún elemento en ${size}.`);
      for (const [i, el] of els.entries()) {
        const file = path.join(outDir, `${base}-${suffix}-${String(i + 1).padStart(2, "0")}.png`);
        await el.screenshot({ path: file });
        written.push(file);
      }
    } else {
      const file = path.join(outDir, `${base}-${suffix}${opts.full ? "-full" : ""}.png`);
      await page.screenshot({ path: file, fullPage: opts.full });
      written.push(file);
    }

    // Problemas que se ven mal y el ojo a veces no detecta en una captura chica.
    const issues = await page.evaluate(() => {
      const out = [];
      const vw = document.documentElement.clientWidth;
      if (document.documentElement.scrollWidth > vw + 1) out.push(`scroll horizontal: el contenido mide ${document.documentElement.scrollWidth}px y la ventana ${vw}px`);
      for (const img of document.images) {
        if (img.complete && img.naturalWidth === 0) out.push(`imagen rota: ${img.getAttribute("src")}`);
      }
      const fams = new Set();
      for (const el of document.querySelectorAll("body *")) {
        const cs = getComputedStyle(el);
        if (el.childNodes.length && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) {
          fams.add(cs.fontFamily.split(",")[0].replace(/["']/g, "").trim());
          const fs = parseFloat(cs.fontSize);
          if (fs < 12 && cs.display !== "none" && cs.visibility !== "hidden") out.push(`texto de ${fs}px: "${el.textContent.trim().slice(0, 40)}"`);
        }
      }
      const loaded = [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/["']/g, ""));
      for (const f of fams) {
        if (!loaded.includes(f) && !/^(system-ui|sans-serif|serif|monospace|-apple-system)$/i.test(f)) out.push(`fuente sin cargar (cae a la del sistema): ${f}`);
      }
      return [...new Set(out)].slice(0, 15);
    });
    if (issues.length) console.log(`\n[${size}] revisar:\n  - ${issues.join("\n  - ")}`);
    await page.close();
  }
} finally {
  await browser.close();
}
console.log("\nCapturas:");
for (const f of written) console.log(f);
