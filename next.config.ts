import type { NextConfig } from "next";

// Dirección pública del sitio, fijada en el build para que servidor y navegador usen la misma:
// NEXT_PUBLIC_SITE_URL (dominio propio) → dominio de producción de Vercel → dominio previsto.
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  "https://lengastudio.com"
).replace(/\/+$/, "");

// Sitio 100 % estático: `npm run build` genera la carpeta `out/`,
// que se puede subir a cualquier hosting (Netlify, Vercel, Cloudflare Pages, un FTP).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_SITE_URL: siteUrl },
};

export default nextConfig;
