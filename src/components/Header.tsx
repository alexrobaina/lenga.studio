"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import type { Dict } from "@/content/dictionaries";
import { whatsappHref } from "@/content/site";
import { LogoMark } from "./Logo";

export default function Header({ t }: { t: Dict }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 240 && !open);
    setSolid(y > window.innerHeight * 0.9);
  });

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [
    { href: "#paquetes", label: t.nav.services },
    { href: "#trabajos", label: t.nav.work },
    { href: "#expediciones", label: t.nav.expeditions },
    { href: "#nosotros", label: t.nav.about },
  ];

  return (
    <>
      <a className="skip" href="#contenido">
        {t.nav.skip}
      </a>
      <motion.header
        className={`site-header ${solid ? "is-solid" : ""}`}
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="header-inner">
          <a href="#inicio" className="brand" aria-label="Lenga Studio, inicio">
            <LogoMark className="brand-mark" strokeWidth={7} />
            <span className="brand-word">Lenga Studio</span>
          </a>
          <nav aria-label="Principal" className="nav-desktop">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="nav-link">
                {l.label}
              </a>
            ))}
            <a href={t.nav.switchHref} className="nav-lang" hrefLang={t.lang === "es" ? "en" : "es"} aria-label={`${t.nav.switchShort} · ${t.nav.switchLabel}`}>
              {t.nav.switchShort}
            </a>
            <a href={whatsappHref(t.contact.whatsappMessage)} className="btn btn--primary btn--sm">
              {t.nav.cta}
            </a>
          </nav>
          <button
            className="menu-btn"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? t.nav.close : t.nav.menu}</span>
            <span className={`burger ${open ? "is-open" : ""}`} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            className="menu-mobile"
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 36px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 36px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 36px)" }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          >
            <nav aria-label="Menú" className="menu-mobile-nav">
              {links.concat({ href: "#contacto", label: t.nav.cta }).map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.6 }}
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.a
                href={t.nav.switchHref}
                className="menu-mobile-lang"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {t.nav.switchLabel}
              </motion.a>
            </nav>
            <svg className="menu-mobile-art" viewBox="0 0 400 140" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
              <g filter="url(#wc-2)">
                <path d="M0 110 L60 92 L110 100 L150 70 L170 40 L180 62 L196 24 L210 64 L224 46 L240 80 L290 96 L340 88 L400 100 L400 140 L0 140 Z" fill="#7FA9C2" />
                <path d="M0 124 C80 108 160 112 240 118 C300 122 360 112 400 116 L400 140 L0 140 Z" fill="#93B0A0" />
              </g>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
