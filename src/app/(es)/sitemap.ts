import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import images from "@/content/images.generated.json";
import { dictionaries } from "@/content/dictionaries";
import { galleryPhotos } from "@/content/gallery";
import { ROUTES, type Page } from "@/content/routes";

export const dynamic = "force-static";

// Las dos páginas en sus dos idiomas, enlazadas entre sí (hreflang), cada una con sus fotos para Google Imágenes.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const manifest = images as Record<string, { widths: number[] }>;
  const team = dictionaries.es.about.team.map((m) => m.id);
  const photosOf = (page: Page) =>
    [...(page === "expeditions" ? dictionaries.es.expeditions.shots.map((s) => s.id) : []), ...galleryPhotos(page), ...team]
      .filter((id) => manifest[id])
      .map((id) => `${site.url}/img/${id}-${Math.max(...manifest[id].widths)}.webp`);
  const pages: { page: Page; priority: number }[] = [
    { page: "home", priority: 1 },
    { page: "expeditions", priority: 0.8 },
  ];
  return pages.flatMap(({ page, priority }) => {
    const languages = { es: `${site.url}${ROUTES.es[page]}`, en: `${site.url}${ROUTES.en[page]}`, "x-default": `${site.url}${ROUTES.es[page]}` };
    const images = photosOf(page);
    return [
      { url: languages.es, lastModified, changeFrequency: "monthly", priority, alternates: { languages }, images },
      { url: languages.en, lastModified, changeFrequency: "monthly", priority: priority * 0.8, alternates: { languages }, images },
    ];
  });
}
