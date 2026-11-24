// Datos de contacto del estudio.
// WhatsApp en formato internacional sin "+" ni espacios: 54 9 + código de área sin 0 + número sin 15.
// El primero de `people` es el número principal: el que usan los botones generales (header, paquetes, flotante).
const people = [
  {
    id: "alex",
    name: "Alex",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "5491138997032",
    whatsappDisplay: "+54 9 11 3899-7032",
    // Recorte del retrato para el avatar de Contacto: centro de la cara (en % de la foto) y zoom.
    face: { x: 53, y: 73, zoom: 4 },
  },
  {
    id: "agostina",
    name: "Agostina",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_AGOSTINA ?? "5492615636880",
    whatsappDisplay: "+54 9 261 563-6880",
    face: { x: 25, y: 40, zoom: 3.8 },
  },
].filter((p) => p.whatsapp);

export type Person = (typeof people)[number];

export const site = {
  name: "Lenga Studio",
  // Dirección pública (canonical, sitemap, Open Graph, datos estructurados). Se resuelve en next.config.ts:
  // NEXT_PUBLIC_SITE_URL (dominio propio) → dominio de producción de Vercel → dominio previsto.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://lengastudio.com",
  people,
  whatsapp: people[0]?.whatsapp ?? "",
  email: "info.lengastudio@gmail.com",
  instagram: { handle: "lengastudio.chalten", url: "https://www.instagram.com/lengastudio.chalten/" },
  location: "Mendoza y El Chaltén, Argentina",
};

export function whatsappHref(message: string, number: string = site.whatsapp) {
  if (!number) return "#contacto";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
