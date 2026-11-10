import type { Metadata, Viewport } from "next";
import { dictionaries, type Lang } from "@/content/dictionaries";
import { site } from "@/content/site";

export function buildMetadata(lang: Lang): Metadata {
  const t = dictionaries[lang];
  const path = lang === "es" ? "/" : "/en/";
  return {
    metadataBase: new URL(site.url),
    title: t.meta.title,
    description: t.meta.description,
    alternates: { canonical: path, languages: { es: "/", en: "/en/" } },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      url: path,
      siteName: site.name,
      locale: lang === "es" ? "es_AR" : "en_US",
      type: "website",
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Lenga Studio · El Chaltén" }],
    },
    twitter: { card: "summary_large_image", images: ["/og.jpg"] },
    icons: { icon: "/favicon.svg", apple: "/apple-touch-icon.png" },
  };
}

export const viewport: Viewport = {
  themeColor: "#F3EEE4",
  width: "device-width",
  initialScale: 1,
};
