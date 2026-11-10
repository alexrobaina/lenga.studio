"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Dict } from "@/content/dictionaries";
import Art from "./Art";
import Bleed from "./Bleed";
import Picture, { hasPhoto } from "./Picture";
import { Reveal, Title } from "./Reveal";

export default function About({ t }: { t: Dict }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-2.5, 1.5]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["16%", "-14%"]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [3, -1]);
  // Cuando estén los dos retratos (04-fotos/todas/equipo/), reemplazan a la ilustración.
  const withPortraits = t.about.team.every((m) => hasPhoto(m.id));

  return (
    <section id="nosotros" className="about" aria-labelledby="about-title">
      <div className="wrap about-grid">
        <div className="about-copy">
          <Title id="about-title" eyebrow={t.about.eyebrow} line1={t.about.line1} line2={t.about.line2} />
          <Reveal>
            <p className="about-text">{t.about.text}</p>
          </Reveal>
          <Reveal>
            <p className="about-en">{t.about.en}</p>
          </Reveal>
        </div>
        <div ref={ref} className="about-art-wrap">
          {withPortraits ? (
            <div className="portraits">
              {t.about.team.map((m, i) => (
                <motion.figure
                  key={m.id}
                  className={`portrait portrait--${i}`}
                  style={reduce ? undefined : i === 0 ? { y, rotate } : { y: y2, rotate: rotate2 }}
                >
                  <Bleed className="portrait-img">
                    <Picture id={m.id} alt={m.alt} sizes="(min-width: 900px) 28vw, 60vw" />
                  </Bleed>
                  <figcaption>
                    <span className="portrait-name">{m.name}</span>
                    <span className="portrait-role">{m.role}</span>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          ) : (
            <motion.div
              className="about-art"
              role="img"
              aria-label={t.about.illustrationLabel}
              style={reduce ? undefined : { y, rotate }}
            >
              <Art id="ridge" position="50% 50%" />
            </motion.div>
          )}
          <svg className="about-stamp" viewBox="0 0 240 240" aria-hidden="true">
            <defs>
              <path id="stamp-circle" d="M120 120 m-92 0 a92 92 0 1 1 184 0 a92 92 0 1 1 -184 0" />
            </defs>
            <circle cx="120" cy="120" r="112" fill="var(--crema)" stroke="var(--bosque)" strokeWidth="2" />
            <g transform="translate(64 92) scale(0.47)">
              <path d="M8 84 H78 C89 84 95 80 99 73 L113 41 L121.5 14 L129.5 45 L138.5 27 L146 55 L152 62 L157 71 L168 84 H232" stroke="var(--bosque)" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="198" cy="30" r="10" fill="var(--lenga)" />
            </g>
            <g className="ring">
              <text fontFamily="var(--font-sans)" fontSize="13" fontWeight="600" letterSpacing="5.4" fill="var(--bosque)">
                <textPath href="#stamp-circle">LENGA STUDIO · EL CHALTÉN · PATAGONIA ·</textPath>
              </text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
