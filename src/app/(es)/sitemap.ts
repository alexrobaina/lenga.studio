import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, alternates: { languages: { en: `${site.url}/en/` } } },
    { url: `${site.url}/en/`, alternates: { languages: { es: `${site.url}/` } } },
  ];
}
