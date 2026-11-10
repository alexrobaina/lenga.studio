// Datos estructurados (schema.org, JSON-LD) para buscadores y asistentes de IA.
// Un solo grafo por página: el estudio (servicio profesional local), el equipo, el sitio, la página
// y las fotos con autoría. Todo sale de los mismos textos que se ven en la web.
import { dictionaries, type Lang } from "@/content/dictionaries";
import { site } from "@/content/site";
import { CHALTEN, MENDOZA_COLS } from "@/content/gallery";
import images from "@/content/images.generated.json";

const manifest = images as Record<string, { width: number; height: number; widths: number[] }>;
const photoUrl = (id: string) => `${site.url}/img/${id}-${Math.max(...manifest[id].widths)}.webp`;

const EPGAMT = {
  "@type": "EducationalOrganization",
  name: "Escuela Provincial de Guías de Alta Montaña y Trekking de Mendoza (EPGAMT)",
  address: { "@type": "PostalAddress", addressRegion: "Mendoza", addressCountry: "AR" },
};

export function structuredData(lang: Lang) {
  const t = dictionaries[lang];
  const es = lang === "es";
  const pageUrl = es ? `${site.url}/` : `${site.url}/en/`;
  const studio = `${site.url}/#studio`;
  const website = `${site.url}/#website`;

  const elChalten = {
    "@type": "City",
    name: "El Chaltén",
    containedInPlace: { "@type": "AdministrativeArea", name: "Santa Cruz, Argentina" },
    geo: { "@type": "GeoCoordinates", latitude: -49.3317, longitude: -72.8861 },
  };
  const mendoza = {
    "@type": "City",
    name: "Mendoza",
    containedInPlace: { "@type": "AdministrativeArea", name: "Mendoza, Argentina" },
    geo: { "@type": "GeoCoordinates", latitude: -32.8895, longitude: -68.8458 },
  };

  const offers = [
    ...t.packages.items.map((p) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: p.title,
        description: `${p.for}: ${p.includes.join(", ")}.`,
        audience: { "@type": "BusinessAudience", name: p.for },
        areaServed: elChalten,
        provider: { "@id": studio },
      },
    })),
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: t.expeditions.eyebrow,
        description: t.expeditions.text,
        areaServed: [elChalten, { "@type": "Place", name: es ? "Hielo Continental Patagónico Sur" : "Southern Patagonian Ice Field" }],
        provider: { "@id": studio },
      },
    },
    ...t.services.items.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, description: s.text, provider: { "@id": studio } },
    })),
  ];

  const team = t.about.team.map((m) => ({
    "@type": "Person",
    "@id": `${site.url}/#${m.id}`,
    name: m.name,
    jobTitle: m.role,
    worksFor: { "@id": studio },
    // Estudiantes de primer año (no egresados): afiliación, no "alumniOf".
    affiliation: EPGAMT,
    description: es ? "Estudiante de primer año de la EPGAMT" : "First-year student at EPGAMT",
    knowsLanguage: ["es", "en"],
    ...(manifest[m.id] ? { image: photoUrl(m.id) } : {}),
  }));

  const shots = [
    ...t.expeditions.shots.map((s) => ({ id: s.id, caption: s.caption })),
    ...[...CHALTEN, ...MENDOZA_COLS.flat()].map((id) => ({ id, caption: t.photos[id] })),
  ].filter((s) => manifest[s.id]);

  const photos = shots.map((s) => ({
    "@type": "ImageObject",
    "@id": `${site.url}/#foto-${s.id}`,
    contentUrl: photoUrl(s.id),
    url: photoUrl(s.id),
    width: manifest[s.id].width,
    height: manifest[s.id].height,
    caption: s.caption,
    name: s.caption,
    inLanguage: lang,
    creator: { "@id": studio },
    creditText: site.name,
    copyrightHolder: { "@id": studio },
    copyrightNotice: `© ${site.name}`,
    acquireLicensePage: `${pageUrl}#contacto`,
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": studio,
        name: site.name,
        description: t.meta.description,
        slogan: `${t.hero.line1} ${t.hero.line2}`,
        url: `${site.url}/`,
        logo: { "@type": "ImageObject", url: `${site.url}/icon-512.png`, width: 512, height: 512 },
        image: [`${site.url}/og.jpg`, photoUrl("atardecer-cordon-torre"), photoUrl("carpa-glaciar-2")],
        email: site.email,
        telephone: `+${site.whatsapp}`,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: es ? "consultas y presupuestos" : "enquiries and quotes",
          telephone: `+${site.whatsapp}`,
          email: site.email,
          url: `https://wa.me/${site.whatsapp}`,
          availableLanguage: ["Spanish", "English"],
          areaServed: "AR",
        },
        areaServed: [elChalten, mendoza],
        knowsLanguage: ["es", "en"],
        knowsAbout: es
          ? ["Fotografía de montaña", "Fotografía gastronómica", "Fotografía de alojamientos", "Diseño web", "Diseño gráfico", "Redes sociales", "Cobertura fotográfica de expediciones", "Trekking", "Glaciares", "Patagonia"]
          : ["Mountain photography", "Food photography", "Hospitality photography", "Web design", "Graphic design", "Social media", "Expedition photography", "Trekking", "Glaciers", "Patagonia"],
        founder: team.map((p) => ({ "@id": p["@id"] })),
        employee: team.map((p) => ({ "@id": p["@id"] })),
        hasOfferCatalog: { "@type": "OfferCatalog", name: t.packages.eyebrow, itemListElement: offers },
      },
      ...team,
      {
        "@type": "WebSite",
        "@id": website,
        url: `${site.url}/`,
        name: site.name,
        description: t.meta.description,
        inLanguage: ["es", "en"],
        publisher: { "@id": studio },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: t.meta.title,
        description: t.meta.description,
        inLanguage: lang,
        isPartOf: { "@id": website },
        about: { "@id": studio },
        primaryImageOfPage: { "@type": "ImageObject", url: `${site.url}/og.jpg`, width: 1200, height: 630 },
        image: photos.map((p) => ({ "@id": p["@id"] })),
      },
      ...photos,
    ],
  };
}
