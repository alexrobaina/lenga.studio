import type { MetadataRoute } from "next";
import { dictionaries } from "@/content/dictionaries";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lenga Studio · El Chaltén",
    short_name: "Lenga Studio",
    description: dictionaries.es.meta.description,
    lang: "es-AR",
    start_url: "/",
    display: "standalone",
    background_color: "#F3EEE4",
    theme_color: "#1E2A23",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-app.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
