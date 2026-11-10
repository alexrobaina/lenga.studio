"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import type { Dict } from "@/content/dictionaries";
import { whatsappHref } from "@/content/site";
import { useMedia } from "@/lib/useMedia";
import Picture, { photoRatio } from "./Picture";
import { Reveal, Title } from "./Reveal";
import Bleed from "./Bleed";
import { CHALTEN, MENDOZA_COLS } from "@/content/gallery";

const ALL = [...CHALTEN, ...MENDOZA_COLS.flat()];

const useIsoLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;

function HCard({ id, i, progress, label, onOpen }: { id: string; i: number; progress: MotionValue<number>; label: string; onOpen: () => void }) {
  const shift = useTransform(progress, [0, 1], ["-5%", "5%"]);
  return (
    <figure className={`h-card h-card--${i % 3}`} style={{ aspectRatio: String(photoRatio(id)) }}>
      <button className="photo-btn" onClick={onOpen} aria-label={label}>
        <Bleed className="bleed-fill">
          <motion.div className="h-card-img" style={{ x: shift }}>
            <Picture id={id} alt={label} sizes="(min-width: 900px) 60vw, 85vw" />
          </motion.div>
        </Bleed>
      </button>
      <figcaption>
        <span className="h-card-num">{String(i + 1).padStart(2, "0")}</span> {label}
      </figcaption>
    </figure>
  );
}

function Chalten({ t, open }: { t: Dict; open: (id: string) => void }) {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const desktop = useMedia("(min-width: 900px)");
  const pinned = desktop && !reduce;
  const [dist, setDist] = useState(0);

  useIsoLayout(() => {
    if (!pinned || !track.current) return;
    const el = track.current;
    const measure = () => setDist(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const intro = (cls: string) => (
    <div className={cls}>
      <Title id="chalten-title" eyebrow={t.work.eyebrow} line1={t.work.chalten.line1} line2={t.work.chalten.line2} />
      <p className="lead">{t.work.chalten.text}</p>
      {pinned && (
        <p className="chalten-hint">
          <svg width="38" height="12" viewBox="0 0 38 12" aria-hidden="true">
            <path d="M1 6 H35 M30 1 L36 6 L30 11" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t.work.chalten.drag}
        </p>
      )}
    </div>
  );
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={ref}
      className={`chalten ${pinned ? "is-pinned" : ""}`}
      style={pinned ? { height: `calc(100vh + ${Math.round(dist * 0.55)}px)` } : undefined}
      aria-labelledby="chalten-title"
    >
      <div className="chalten-sticky">
        {!pinned && intro("chalten-intro chalten-intro--stacked")}
        <motion.div ref={track} className="chalten-track" style={pinned ? { x } : undefined}>
          {pinned && intro("chalten-intro")}
          {CHALTEN.map((id, i) => (
            <HCard key={id} id={id} i={i} progress={scrollYProgress} label={t.photos[id]} onOpen={() => open(id)} />
          ))}
          <div className="chalten-end" aria-hidden="true">
            <svg viewBox="0 0 240 110" fill="none">
              <path d="M8 84 H78 C89 84 95 80 99 73 L113 41 L121.5 14 L129.5 45 L138.5 27 L146 55 L152 62 L157 71 L168 84 H232" stroke="var(--bosque)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="198" cy="30" r="5.5" fill="var(--lenga)" />
            </svg>
          </div>
        </motion.div>
        {pinned && (
          <div className="chalten-progress" aria-hidden="true">
            <motion.span style={{ width: bar }} />
          </div>
        )}
      </div>
    </section>
  );
}

function Column({ ids, progress, speed, t, open, offset }: { ids: string[]; progress: MotionValue<number>; speed: number; t: Dict; open: (id: string) => void; offset: number }) {
  const y = useTransform(progress, [0, 1], [offset, offset - speed]);
  const reduce = useReducedMotion();
  return (
    <motion.div className="m-col" style={reduce ? undefined : { y }}>
      {ids.map((id) => (
        <Reveal key={id} className="m-card">
          <button className="photo-btn" onClick={() => open(id)} aria-label={`${t.work.open}: ${t.photos[id]}`}>
            <Bleed>
              <Picture id={id} alt={t.photos[id]} sizes="(min-width: 900px) 30vw, 50vw" />
            </Bleed>
          </button>
          <p className="m-cap">{t.photos[id]}</p>
        </Reveal>
      ))}
    </motion.div>
  );
}

function Mendoza({ t, open }: { t: Dict; open: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const desktop = useMedia("(min-width: 900px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const speeds = desktop ? [120, 260, 60] : [0, 0, 0];
  const offsets = desktop ? [0, 140, 40] : [0, 0, 0];
  return (
    <div className="mendoza wrap">
      <div className="mendoza-head">
        <Title as="h3" line1={t.work.mendoza.line1} line2={t.work.mendoza.line2} />
        <Reveal>
          <p className="lead">{t.work.mendoza.text}</p>
        </Reveal>
      </div>
      <div ref={ref} className="mendoza-grid">
        {MENDOZA_COLS.map((ids, i) => (
          <Column key={i} ids={ids} progress={scrollYProgress} speed={speeds[i]} offset={offsets[i]} t={t} open={open} />
        ))}
      </div>
    </div>
  );
}

// Franja de cierre: un solo llamado a la acción.
function Soon({ t }: { t: Dict }) {
  return (
    <div className="soon wrap">
      <Reveal className="soon-band">
        <div>
          <p className="soon-title">
            {t.work.soon.line1} <span className="accent">{t.work.soon.line2}</span>
          </p>
          <p className="soon-text">{t.work.soon.text}</p>
        </div>
        <a href={whatsappHref(t.contact.whatsappMessage)} className="btn btn--cream btn--lg">
          {t.work.soon.cta}
        </a>
      </Reveal>
    </div>
  );
}

function Lightbox({ t, index, setIndex }: { t: Dict; index: number | null; setIndex: (i: number | null) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const go = useCallback(
    (dir: number) => setIndex(index === null ? null : (index + dir + ALL.length) % ALL.length),
    [index, setIndex]
  );
  useEffect(() => {
    if (index === null) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.documentElement.classList.add("menu-open"); // bloquea el scroll de fondo
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("menu-open");
      prev?.focus();
    };
  }, [index, go, setIndex]);

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t.photos[ALL[index]]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && setIndex(null)}
        >
          <AnimatePresence mode="wait">
            <motion.figure
              key={ALL[index]}
              className="lightbox-figure"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
            >
              <Picture id={ALL[index]} alt={t.photos[ALL[index]]} sizes="92vw" className="lightbox-img" />
              <figcaption>
                {t.photos[ALL[index]]} <span>· {index + 1}/{ALL.length}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
          <button ref={closeRef} className="lb-btn lb-close" onClick={() => setIndex(null)} aria-label={t.work.close}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>
          </button>
          <button className="lb-btn lb-prev" onClick={() => go(-1)} aria-label={t.work.prev}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button className="lb-btn lb-next" onClick={() => go(1)} aria-label={t.work.next}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Works({ t }: { t: Dict }) {
  const [index, setIndex] = useState<number | null>(null);
  const open = (id: string) => setIndex(ALL.indexOf(id));
  return (
    <div id="trabajos" className="works">
      <Chalten t={t} open={open} />
      <Mendoza t={t} open={open} />
      <Soon t={t} />
      <Lightbox t={t} index={index} setIndex={setIndex} />
    </div>
  );
}
