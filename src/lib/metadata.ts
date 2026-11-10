import type { Metadata, Viewport } from "next";
import { dictionaries, type Lang } from "@/content/dictionaries";
import { site } from "@/content/site";

// Metadatos por idioma: título y descripción con las búsquedas que importan
// ("fotógrafos El Chaltén", "fotografía de montaña Patagonia", "web y redes"),
// canonical + hreflang (es, en, x-default), Open Graph / X y permisos para mostrar imágenes grandes.
export function buildMetadata(lang: Lang): Metadata {
  const t = dictionaries[lang];
  const path = lang === "es" ? "/" : "/en/";
  return {
    metadataBase: new URL(site.url),
    title: t.meta.title,
    description: t.meta.description,
    applicationName: site.name,
    authors: [{ name: "Alex" }, { name: "Agostina" }],
    creator: site.name,
    publisher: site.name,
    category: lang === "es" ? "Fotografía" : "Photography",
    alternates: {
      canonical: path,
      languages: { es: "/", en: "/en/", "x-default": "/" },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      url: path,
      siteName: site.name,
      locale: lang === "es" ? "es_AR" : "en_US",
      alternateLocale: lang === "es" ? ["en_US"] : ["es_AR"],
      type: "website",
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: t.meta.ogAlt, type: "image/jpeg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
      images: [{ url: "/og.jpg", alt: t.meta.ogAlt }],
    },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/manifest.webmanifest",
    formatDetection: { telephone: false, address: false, email: false },
    // Verificación de Google Search Console (opcional): NEXT_PUBLIC_GSC_VERIFICATION=<código>
    ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } } : {}),
  };
}

export const viewport: Viewport = {
  themeColor: "#F3EEE4",
  width: "device-width",
  initialScale: 1,
};
