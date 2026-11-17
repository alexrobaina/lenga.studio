import { dictionaries, type Lang } from "@/content/dictionaries";
import type { Page } from "@/content/routes";
import { structuredData } from "@/lib/structuredData";
import WatercolorDefs from "./WatercolorDefs";
import Header from "./Header";
import Opening from "./Opening";
import Services from "./Services";
import Works from "./Works";
import Process from "./Process";
import Expeditions from "./Expeditions";
import ExpeditionsTeaser from "./ExpeditionsTeaser";
import About from "./About";
import Contact from "./Contact";
import Footer from "./Footer";
import FloatingWhatsApp from "./FloatingWhatsApp";

// Una misma estructura para las dos páginas del sitio:
// inicio (negocios del pueblo) y expediciones (agencias y guías).
export default function Home({ lang, page = "home" }: { lang: Lang; page?: Page }) {
  const t = dictionaries[lang];
  const jsonLd = structuredData(lang, page);
  const home = page === "home";
  const message = home ? t.contact.whatsappMessage : t.expPage.whatsappMessage;
  return (
    <>
      <WatercolorDefs />
      <Header t={t} page={page} message={message} />
      <main id="contenido">
        {home ? (
          <>
            <Opening t={t} />
            <Services t={t} />
            <Works t={t} page={page} />
            <Process t={t} />
            <ExpeditionsTeaser t={t} />
            <About t={t} />
            <Contact t={t} message={message} />
          </>
        ) : (
          <>
            <Expeditions t={t} />
            <Works t={t} page={page} />
            <About t={t} text={t.expPage.aboutText} />
            <Contact t={t} copy={t.expPage.contact} message={message} />
          </>
        )}
      </main>
      <Footer t={t} page={page} />
      <FloatingWhatsApp label="WhatsApp" message={message} />
      <div className="grain" aria-hidden="true" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
