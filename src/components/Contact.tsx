"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Dict } from "@/content/dictionaries";
import { site, whatsappHref } from "@/content/site";
import { rng, round } from "@/lib/rng";
import { Reveal, Title } from "./Reveal";
import Art from "./Art";
import Picture, { hasPhoto } from "./Picture";
import { CHIMNEY, WINDOW } from "./scenes/refugio";

const r = rng(77);
const FLAKES = Array.from({ length: 36 }, () => ({
  left: round(r() * 100),
  size: round(2 + r() * 4),
  delay: round(r() * 12),
  dur: round(9 + r() * 10),
  drift: round(-30 + r() * 60),
}));

type ContactCopy = { line1: string; line2: string; text: string };

export default function Contact({ t, copy = t.contact, message }: { t: Dict; copy?: ContactCopy; message: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const yBack = useTransform(scrollYProgress, [0, 1], ["18%", "0%"]);
  const yMid = useTransform(scrollYProgress, [0, 1], ["30%", "0%"]);

  return (
    <section id="contacto" className="contact" aria-labelledby="contact-title">
      <div className="wrap contact-copy">
        <Title id="contact-title" eyebrow={t.contact.eyebrow} line1={copy.line1} line2={copy.line2} center />
        <Reveal>
          <p className="lead center">{copy.text}</p>
        </Reveal>
        <Reveal className="contact-actions">
          {site.people.map((p) => (
            <a
              key={p.id}
              className="btn btn--primary btn--lg btn--wa"
              href={whatsappHref(message, p.whatsapp)}
              aria-label={`${t.contact.whatsappTo} ${p.name} · WhatsApp ${p.whatsappDisplay}`}
            >
              {/* La cara de quien responde genera más confianza que un ícono; el ícono de WhatsApp queda como insignia. */}
              <span className="btn-wa-avatar" aria-hidden="true">
                {hasPhoto(p.id) && (
                  <span
                    className="btn-wa-face"
                    style={{ ["--fx" as string]: `${p.face.x}%`, ["--fy" as string]: `${p.face.y}%`, ["--zoom" as string]: p.face.zoom }}
                  >
                    <Picture id={p.id} alt="" sizes="200px" className="btn-wa-photo" />
                  </span>
                )}
                <svg className="btn-wa-badge" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
                  <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1c-1-.4-2-1.4-2.4-2.4l1-1-1-2z" />
                </svg>
              </span>
              <span className="btn-wa-text">
                <span>
                  {t.contact.whatsappTo} {p.name}
                </span>
                <small>{p.whatsappDisplay}</small>
              </span>
            </a>
          ))}
        </Reveal>
        <Reveal className="contact-mail">
          <a className="btn btn--text" href={`mailto:${site.email}`}>
            {t.contact.email}: {site.email}
          </a>
          <a className="btn btn--text" href={site.instagram.url} target="_blank" rel="noopener me">
            {t.contact.instagram}: @{site.instagram.handle}
          </a>
        </Reveal>
      </div>

      <div ref={ref} className="refugio" role="img" aria-label={t.contact.illustrationLabel}>
        <div className="snow" aria-hidden="true">
          {FLAKES.map((f, i) => (
            <span
              key={i}
              style={{
                left: `${f.left}%`,
                width: f.size,
                height: f.size,
                animationDelay: `${f.delay}s`,
                animationDuration: `${f.dur}s`,
                ["--drift" as string]: `${f.drift}px`,
              }}
            />
          ))}
        </div>
        <motion.div className="refugio-layer" style={reduce ? undefined : { y: yBack }}>
          <Art id="refugio-back" />
        </motion.div>
        <motion.div className="refugio-layer" style={reduce ? undefined : { y: yMid }}>
          <Art id="refugio-mid" />
          {/* Humo y luz de la ventana: lo único vivo, alineado con el refugio pintado. */}
          <svg className="refugio-live" viewBox="0 0 1440 360" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
            <defs>
              <radialGradient id="window-glow">
                <stop offset="0" stopColor="#F6C27A" stopOpacity="0.55" />
                <stop offset="1" stopColor="#F6C27A" stopOpacity="0" />
              </radialGradient>
            </defs>
            <ellipse className="window-glow" cx={WINDOW.x} cy={WINDOW.y} rx="60" ry="34" fill="url(#window-glow)" />
            <g className="smoke">
              <circle cx={CHIMNEY.x} cy={CHIMNEY.y} r="7" />
              <circle cx={CHIMNEY.x} cy={CHIMNEY.y} r="7" />
              <circle cx={CHIMNEY.x} cy={CHIMNEY.y} r="7" />
            </g>
          </svg>
        </motion.div>
        <div className="refugio-layer">
          <Art id="refugio-front" />
        </div>
      </div>
    </section>
  );
}
