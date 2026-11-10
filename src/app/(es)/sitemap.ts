import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import images from "@/content/images.generated.json";
import { dictionaries } from "@/content/dictionaries";
import { CHALTEN, MENDOZA_COLS } from "@/content/gallery";

export const dynamic = "force-static";

// Las dos versiones del sitio, enlazadas entre sí (hreflang), con todas las fotos para Google Imágenes.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  // Solo las fotos que se ven en la página.
  const manifest = images as Record<string, { widths: number[] }>;
  const used = [
    ...dictionaries.es.expeditions.shots.map((s) => s.id),
    ...CHALTEN,
    ...MENDOZA_COLS.flat(),
    ...dictionaries.es.about.team.map((m) => m.id),
  ].filter((id) => manifest[id]);
  const photos = used.map((id) => `${site.url}/img/${id}-${Math.max(...manifest[id].widths)}.webp`);
  const languages = { es: `${site.url}/`, en: `${site.url}/en/`, "x-default": `${site.url}/` };
  return [
    { url: `${site.url}/`, lastModified, changeFrequency: "monthly", priority: 1, alternates: { languages }, images: photos },
    { url: `${site.url}/en/`, lastModified, changeFrequency: "monthly", priority: 0.8, alternates: { languages }, images: photos },
  ];
}
