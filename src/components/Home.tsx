import { dictionaries, type Lang } from "@/content/dictionaries";
import { site } from "@/content/site";
import WatercolorDefs from "./WatercolorDefs";
import Header from "./Header";
import Opening from "./Opening";
import Services from "./Services";
import Works from "./Works";
import Process from "./Process";
import Expeditions from "./Expeditions";
import About from "./About";
import Contact from "./Contact";
import Footer from "./Footer";
import FloatingWhatsApp from "./FloatingWhatsApp";

export default function Home({ lang }: { lang: Lang }) {
  const t = dictionaries[lang];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    description: t.meta.description,
    url: site.url,
    image: `${site.url}/og.jpg`,
    email: site.email,
    areaServed: ["El Chaltén, Santa Cruz, Argentina", "Mendoza, Argentina"],
    telephone: `+${site.whatsapp}`,
  };
  return (
    <>
      <WatercolorDefs />
      <Header t={t} />
      <main id="contenido">
        <Opening t={t} />
        <Services t={t} />
        <Works t={t} />
        <Process t={t} />
        <Expeditions t={t} />
        <About t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
      <FloatingWhatsApp label="WhatsApp" message={t.contact.whatsappMessage} />
      <div className="grain" aria-hidden="true" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
