"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Dict } from "@/content/dictionaries";
import { whatsappHref } from "@/content/site";
import { STARS, Tent } from "./scenes/night";
import Art from "./Art";
import Bleed from "./Bleed";
import Picture from "./Picture";
import { Reveal, Title } from "./Reveal";

export default function Expeditions({ t }: { t: Dict }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const ySky = useTransform(p, [0, 1], ["-8%", "8%"]);
  const yMoon = useTransform(p, [0, 1], ["10%", "-14%"]);
  const ySpires = useTransform(p, [0, 1], ["4%", "-4%"]);
  const yIce = useTransform(p, [0, 1], ["8%", "-8%"]);
  const yFront = useTransform(p, [0, 1], ["14%", "-10%"]);
  // Las fotos chicas flotan apenas distinto que la grande (profundidad sutil).
  const body = useRef<HTMLDivElement>(null);
  const { scrollYProgress: pb } = useScroll({ target: body, offset: ["start end", "end start"] });
  const yShotA = useTransform(pb, [0, 1], ["24px", "-24px"]);
  const yShotB = useTransform(pb, [0, 1], ["48px", "-36px"]);
  const s = (v: unknown) => (reduce ? undefined : ({ y: v } as never));

  return (
    <section id="expediciones" className="expeditions" aria-labelledby="exp-title">
      <div ref={ref} className="night" role="img" aria-label={t.expeditions.illustrationLabel}>
        <motion.div className="night-layer night-layer--tall" style={s(ySky)}>
          <Art id="night-sky" />
          <div className="stars" aria-hidden="true">
            {STARS.map((st, i) => (
              <span
                key={i}
                style={{
                  left: `${st.x}%`,
                  top: `${st.y}%`,
                  width: st.s,
                  height: st.s,
                  animationDelay: `${st.d}s`,
                  animationDuration: `${st.t}s`,
                }}
              />
            ))}
            <span className="shooting-star" />
          </div>
        </motion.div>
        <motion.div className="night-layer" style={s(yMoon)}>
          <Art id="night-moon" />
        </motion.div>
        <motion.div className="night-layer" style={s(ySpires)}>
          <Art id="night-spires" />
        </motion.div>
        <motion.div className="night-layer" style={s(yIce)}>
          <Art id="night-glacier" />
          <Tent />
        </motion.div>
        <motion.div className="night-layer night-layer--front" style={s(yFront)}>
          <Art id="night-front" />
          <div className="night-extend" aria-hidden="true" />
        </motion.div>
        <div className="night-copy wrap">
          <Title id="exp-title" eyebrow={t.expeditions.eyebrow} line1={t.expeditions.line1} line2={t.expeditions.line2} light />
        </div>
      </div>
      <div ref={body} className="exp-body">
        <div className="exp-dawn" aria-hidden="true" />
        <div className="wrap exp-layout">
          <div className="exp-intro">
            <Reveal>
              <p className="lead lead--light">{t.expeditions.text}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <ul className="exp-kinds" aria-label={t.expeditions.kindsLabel}>
                {t.expeditions.kinds.map((k) => (
                  <li key={k}>{k}</li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="exp-photos">
            {t.expeditions.shots.map((p, i) => (
              <motion.figure key={p.id} className={`exp-shot exp-shot--${i}`} style={i === 0 || reduce ? undefined : { y: i === 1 ? yShotA : yShotB }}>
                <Bleed className="exp-shot-img">
                  <Picture id={p.id} alt={p.caption} sizes={i === 0 ? "(min-width: 900px) 52vw, 100vw" : "(min-width: 900px) 26vw, 50vw"} />
                </Bleed>
                <figcaption>{p.caption}</figcaption>
              </motion.figure>
            ))}
          </div>

          <div className="exp-models">
            <p className="exp-models-label">{t.expeditions.modelsLabel}</p>
            <ol className="exp-list">
              {t.expeditions.models.map((m, i) => (
                <Reveal key={m.title} delay={i * 0.08} as="li" className="exp-item">
                  <span className="exp-num">0{i + 1}</span>
                  <div>
                    <h3>{m.title}</h3>
                    <p>{m.text}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
            <Reveal className="exp-cta">
              <a href={whatsappHref(t.contact.whatsappMessage + " " + t.nav.expeditions.toLowerCase())} className="btn btn--cream">
                {t.expeditions.cta}
              </a>
              <p>{t.expeditions.ctaNote}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
