import type { Dict } from "@/content/dictionaries";
import { site } from "@/content/site";
import { LogoMark } from "./Logo";

export default function Footer({ t }: { t: Dict }) {
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
          <a href={`https://wa.me/${site.whatsapp}`}>WhatsApp {site.whatsappDisplay}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={t.nav.switchHref}>{t.nav.switchLabel}</a>
          <a href="#inicio">{t.footer.top} ↑</a>
        </nav>
      </div>
      <div className="wrap footer-base">
        <span>© 2026 {t.footer.rights}</span>
        <span>{t.footer.honest}</span>
      </div>
    </footer>
  );
}
