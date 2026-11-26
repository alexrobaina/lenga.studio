import type { Dict } from "@/content/dictionaries";
import { site } from "@/content/site";
import { ROUTES, otherLang, type Page } from "@/content/routes";
import { LogoMark } from "./Logo";

export default function Footer({ t, page }: { t: Dict; page: Page }) {
  const other = otherLang(t.lang);
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <LogoMark className="footer-mark" stroke="#F3EEE4" moon="#F2C2A6" strokeWidth={5} reflection />
          <div>
            <p className="footer-word">Lenga Studio</p>
            <p className="footer-place">{t.footer.place}</p>
          </div>
        </div>
        <nav className="footer-links" aria-label="Footer">
          {site.people.map((p) => (
            <a key={p.id} href={`https://wa.me/${p.whatsapp}`} aria-label={`WhatsApp ${p.name}, ${p.whatsappDisplay}`}>
              WhatsApp {p.name}: {p.whatsappDisplay}
            </a>
          ))}
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={site.instagram.url} target="_blank" rel="noopener me">
            Instagram: @{site.instagram.handle}
          </a>
          {page === "home" ? (
            <a href={ROUTES[t.lang].expeditions}>{t.nav.expeditions}</a>
          ) : (
            <a href={ROUTES[t.lang].home}>{t.nav.business}</a>
          )}
          <a href={ROUTES[other][page]} hrefLang={other}>
            {t.nav.switchLabel}
          </a>
          <a href={page === "home" ? "#inicio" : "#expediciones"}>{t.footer.top} ↑</a>
        </nav>
      </div>
      <div className="wrap footer-base">
        <span>© 2026 {t.footer.rights}</span>
        <span>{t.footer.honest}</span>
      </div>
    </footer>
  );
}
