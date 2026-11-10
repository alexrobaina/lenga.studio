import type { NextConfig } from "next";

// Sitio 100 % estático: `npm run build` genera la carpeta `out/`,
// que se puede subir a cualquier hosting (Netlify, Vercel, Cloudflare Pages, un FTP).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
