"use client";

import { Fragment, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import type { Dict } from "@/content/dictionaries";
import { whatsappHref } from "@/content/site";
import Art from "./Art";
import { useMedia } from "@/lib/useMedia";
import Birds from "./Birds";
import Leaves from "./Leaves";

type LayerProps = {
  progress: MotionValue<number>;
  px: MotionValue<number>;
  py: MotionValue<number>;
  depth: number; // cuánto sube con el scroll (vh)
  drop: number; // cuánto arranca más abajo (vh), para dejarle cielo al título
  pointer: number; // cuánto se mueve con el mouse (px)
  delay: number;
  still: boolean;
  ready: boolean;
  className?: string;
  children: React.ReactNode;
  extend?: string; // color que continúa la capa hacia abajo
};

function Layer({ progress, px, py, depth, drop, pointer, delay, still, ready, className, children, extend }: LayerProps) {
  const y = useTransform(progress, (v) => `${-depth * v}vh`);
  const x = useTransform(px, (v) => v * pointer);
  const yp = useTransform(py, (v) => v * pointer * 0.4);
  return (
    <motion.div
      className={`hero-layer hero-land ${className ?? ""}`}
      style={{ ["--drop" as string]: drop, ...(still ? {} : { y }) }}
    >
      <motion.div
        className="hero-layer-inner"
        // Solo sube (sin desvanecer): la capa se ve desde el primer cuadro, aun antes de que cargue el JS.
        // Así el navegador (y Google) la cuentan como contenido visible enseguida (mejor LCP en celular).
        initial={still ? false : { y: 40 + depth * 2 }}
        animate={ready || still ? { y: 0 } : undefined}
        transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div className="hero-layer-inner" style={still ? undefined : { x, y: yp }}>
          {children}
        </motion.div>
        {extend && <div className="hero-layer-extend" style={{ background: extend }} />}
      </motion.div>
    </motion.div>
  );
}

export default function Hero({ t, ready }: { t: Dict; ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Suaviza el scroll (sobre todo en celular y trackpads): las capas "flotan" en vez de saltar.
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.5 });
  const mobile = useMedia("(max-width: 760px)");
  // En celular el movimiento es más calmo.
  const calm = mobile ? 0.7 : 1;
  const progress = useTransform(smooth, (v) => v * calm);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 40, damping: 18, mass: 0.6 });
  const py = useSpring(my, { stiffness: 40, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (reduce || window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, reduce]);

  const dayOpacity = useTransform(smooth, [0, 0.75], [0, 1]);
  const sunY = useTransform(smooth, [0, 1], ["18vh", "-6vh"]);
  const titleY = useTransform(smooth, [0, 1], ["0vh", "10vh"]);
  const titleOpacity = useTransform(smooth, [0.06, 0.42], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const d = 0;
  const on = ready || reduce;
  const common = { progress, px, py, still: reduce, ready };
  const words1 = t.hero.line1.split(" ");
  const words2 = t.hero.line2.split(" ");

  return (
    <section ref={ref} id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="hero-sticky">
        <div className="hero-scene" role="img" aria-label={t.hero.illustrationLabel}>
          <div className="hero-layer">
            <Art id="hero-sky-dawn" priority />
          </div>
          <motion.div className="hero-layer" style={reduce ? undefined : { opacity: dayOpacity }}>
            <Art id="hero-sky-day" />
          </motion.div>
          <motion.div className="hero-layer" style={reduce ? undefined : { y: sunY }}>
            <motion.div
              className="hero-layer-inner"
              initial={reduce ? false : { y: 80 }}
              animate={on ? { y: 0 } : undefined}
              transition={{ duration: 1.4, delay: d, ease: [0.22, 1, 0.36, 1] }}
            >
              <Art id="hero-sun" priority />
            </motion.div>
          </motion.div>
          <Birds />
          <Layer {...common} depth={6} drop={20} pointer={6} delay={d + 0.04} extend="#A3C3D0">
            <Art id="hero-far" priority />
          </Layer>
          <Layer {...common} depth={10} drop={23} pointer={12} delay={d + 0.08} extend="#7FA9C2" className="hero-massif">
            <Art id="hero-massif" priority />
          </Layer>
          <Layer {...common} depth={12} drop={23} pointer={16} delay={d + 0.2} className="hero-cloud">
            <Art id="hero-cloud" priority />
          </Layer>

          <motion.div
            className="hero-copy"
            style={reduce ? undefined : { y: titleY, opacity: titleOpacity }}
          >
            <motion.p
              className="eyebrow eyebrow--warm"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={on ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.9, delay: d + 0.1 }}
            >
              {t.hero.eyebrow}
            </motion.p>
            <h1 id="hero-title" className="display hero-title">
              <span className="line">
                {words1.map((w, i) => (
                  <Fragment key={i}>
                    <span className="word">
                      <motion.span
                        initial={reduce ? false : { y: "110%" }}
                        animate={on ? { y: "0%" } : undefined}
                        transition={{ duration: 1, delay: d + 0.14 + i * 0.036, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {w}
                      </motion.span>
                    </span>{" "}
                  </Fragment>
                ))}
              </span>
              <span className="line accent">
                {words2.map((w, i) => (
                  <Fragment key={i}>
                    <span className="word">
                      <motion.span
                        initial={reduce ? false : { y: "110%" }}
                        animate={on ? { y: "0%" } : undefined}
                        transition={{ duration: 1, delay: d + 0.24 + i * 0.027, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {w}
                      </motion.span>
                    </span>{" "}
                  </Fragment>
                ))}
              </span>
            </h1>
            <motion.div
              className="hero-actions"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={on ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.9, delay: d + 0.45 }}
            >
              <a className="btn btn--primary" href={whatsappHref(t.contact.whatsappMessage)}>
                {t.hero.primary}
              </a>
              <a className="btn btn--ghost" href="#paquetes">
                {t.hero.secondary}
              </a>
            </motion.div>
          </motion.div>

          <Layer {...common} depth={14} drop={18} pointer={18} delay={d + 0.14}>
            <Art id="hero-mist" priority />
          </Layer>
          <Layer {...common} depth={12} drop={6} pointer={22} delay={d + 0.12} extend="#84A391">
            <Art id="hero-hills" priority />
          </Layer>
          <Layer {...common} depth={18} drop={6} pointer={30} delay={d + 0.16} extend="#A6AD72">
            <Art id="hero-forest" priority />
          </Layer>
          <Layer {...common} depth={24} drop={6} pointer={42} delay={d + 0.2} extend="#7D8A50">
            <Art id="hero-meadow" priority />
          </Layer>
          <Leaves />
          <Layer {...common} depth={30} drop={6} pointer={60} delay={d + 0.24} extend="#F3EEE4" className="hero-fg">
            <Art id="hero-fg" priority />
          </Layer>

          <motion.a
            href="#paquetes"
            className="scroll-cue"
            aria-label={t.hero.scroll}
            style={reduce ? undefined : { opacity: cueOpacity }}
            initial={reduce ? false : { opacity: 0 }}
            animate={on ? { opacity: 1 } : undefined}
            transition={{ delay: d + 0.7 }}
          >
            <span>{t.hero.scroll}</span>
            <svg width="14" height="34" viewBox="0 0 14 34" aria-hidden="true">
              <path d="M7 2 V30 M2 25 L7 31 L12 25" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
