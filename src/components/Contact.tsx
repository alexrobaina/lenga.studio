"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Dict } from "@/content/dictionaries";
import { site, whatsappHref } from "@/content/site";
import { rng, round } from "@/lib/rng";
import { Reveal, Title } from "./Reveal";
import Art from "./Art";
import { CHIMNEY, WINDOW } from "./scenes/refugio";

const r = rng(77);
const FLAKES = Array.from({ length: 36 }, () => ({
  left: round(r() * 100),
  size: round(2 + r() * 4),
  delay: round(r() * 12),
  dur: round(9 + r() * 10),
  drift: round(-30 + r() * 60),
}));

export default function Contact({ t }: { t: Dict }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const yBack = useTransform(scrollYProgress, [0, 1], ["18%", "0%"]);
  const yMid = useTransform(scrollYProgress, [0, 1], ["30%", "0%"]);

  return (
    <section id="contacto" className="contact" aria-labelledby="contact-title">
      <div className="wrap contact-copy">
        <Title id="contact-title" eyebrow={t.contact.eyebrow} line1={t.contact.line1} line2={t.contact.line2} center />
        <Reveal>
          <p className="lead center">{t.contact.text}</p>
        </Reveal>
        <Reveal className="contact-actions">
          <a className="btn btn--primary btn--lg" href={whatsappHref(t.contact.whatsappMessage)}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
              <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1c-1-.4-2-1.4-2.4-2.4l1-1-1-2z" />
            </svg>
            {t.contact.whatsapp}
          </a>
          <a className="btn btn--text" href={`mailto:${site.email}`}>
            {t.contact.email}: {site.email}
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
