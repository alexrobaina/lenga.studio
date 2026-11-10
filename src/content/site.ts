// Datos de contacto del estudio.
// WhatsApp en formato internacional sin "+" ni espacios: 54 9 + código de área sin 0 + número sin 15.
export const site = {
  name: "Lenga Studio",
  // Dirección pública (canonical, sitemap, Open Graph, datos estructurados). Se resuelve en next.config.ts:
  // NEXT_PUBLIC_SITE_URL (dominio propio) → dominio de producción de Vercel → dominio previsto.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://lengastudio.com",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "5491138997032",
  whatsappDisplay: "+54 9 11 3899-7032",
  email: "alexrobainaph@gmail.com",
  location: "Mendoza y El Chaltén, Argentina",
};

export function whatsappHref(message: string) {
  if (!site.whatsapp) return "#contacto";
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
