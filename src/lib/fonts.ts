import { Schibsted_Grotesk } from "next/font/google";
import localFont from "next/font/local";

// Fraunces: titulares. Tamaño óptico (opsz) por nivel en globals.css y SOFT 50 (la Fraunces "domada").
// Va local y recortada (scripts/instance-fonts.py): SOFT fijo en 50, peso 400–600 y opsz 18–72.
// El mismo dibujo que la de Google, en 50 KB la normal y 62 KB la itálica en lugar de 117 y 145:
// en celular eran los archivos que hacían esperar a la ilustración del hero (LCP).
// La itálica se precarga: la segunda línea del titular del hero (inicio y expediciones) está arriba
// del pliegue y sin precarga se vería el salto de fuente.
export const serif = localFont({
  src: [
    { path: "./fonts/fraunces-latin.woff2", weight: "400 600", style: "normal" },
    { path: "./fonts/fraunces-latin-italic.woff2", weight: "400 600", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

// Schibsted Grotesk: textos e interfaz (26/11/2026, reemplaza a Figtree).
// Más firme y editorial: da contraste con Fraunces y separa a Lenga de Cordada, que usa Figtree.
export const sans = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
