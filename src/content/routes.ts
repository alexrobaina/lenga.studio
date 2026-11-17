import type { Lang } from "./dictionaries";

// Dos páginas para dos públicos: negocios del pueblo (inicio) y agencias y guías (expediciones).
// Cada mensaje de venta lleva a la página que le habla a quien lo recibe.
export type Page = "home" | "expeditions";

export const ROUTES: Record<Lang, Record<Page, string>> = {
  es: { home: "/", expeditions: "/expediciones/" },
  en: { home: "/en/", expeditions: "/en/expeditions/" },
};

export const otherLang = (lang: Lang): Lang => (lang === "es" ? "en" : "es");
