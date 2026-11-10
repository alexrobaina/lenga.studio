// /llms.txt: resumen del estudio en texto plano para asistentes de IA (ChatGPT, Perplexity, etc.).
import { dictionaries } from "@/content/dictionaries";
import { site } from "@/content/site";

export const dynamic = "force-static";

export function GET() {
  const t = dictionaries.es;
  const en = dictionaries.en;
  const body = `# ${site.name}

> ${t.meta.description}

${t.about.text}

## Paquetes para negocios de El Chaltén
${t.packages.items.map((p) => `- ${p.title} (${p.for}): ${p.includes.join("; ")}.`).join("\n")}

## Servicios
${t.services.items.map((s) => `- ${s.title}: ${s.text}`).join("\n")}

## ${t.expeditions.eyebrow}
${t.expeditions.text}
${t.expeditions.models.map((m) => `- ${m.title}: ${m.text}`).join("\n")}

## Contacto
- WhatsApp: ${site.whatsappDisplay} (https://wa.me/${site.whatsapp})
- Email: ${site.email}
- Zona: El Chaltén (Santa Cruz) y Mendoza, Argentina. Atención en español e inglés.

## Páginas
- [Sitio en español](${site.url}/)
- [Site in English](${site.url}/en/): ${en.meta.description}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
