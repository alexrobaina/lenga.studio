"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import type { Dict } from "@/content/dictionaries";
import DottedPath from "./DottedPath";
import { Reveal, Title } from "./Reveal";

type Geo = { w: number; h: number; d: string; stops: { x: number; y: number }[] };

// Sendero que se dibuja mientras bajás y marca cada etapa al pasar.
export default function Process({ t }: { t: Dict }) {
  const box = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const reduce = useReducedMotion();
  const [geo, setGeo] = useState<Geo | null>(null);
  const [reached, setReached] = useState(-1);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const build = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const wide = w >= 760;
      const cx = wide ? w / 2 : 22;
      const amp = wide ? 70 : 10;
      const stops = stepRefs.current.map((s, i) => {
        const r = s?.getBoundingClientRect();
        const top = el.getBoundingClientRect().top;
        const y = r ? r.top - top + 34 : (h / 5) * (i + 1);
        return { x: cx + (wide ? (i % 2 === 0 ? -amp * 0.4 : amp * 0.4) : 0), y };
      });
      const pts = [{ x: cx, y: 0 }, ...stops, { x: cx, y: h }];
      let d = `M${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const my = (a.y + b.y) / 2;
        const side = i % 2 === 0 ? 1 : -1;
        d += ` C${a.x + side * amp} ${my} ${b.x - side * amp} ${my} ${b.x} ${b.y}`;
      }
      setGeo({ w, h, d, stops });
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: box, offset: ["start 0.6", "end 0.6"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const hx = useMotionValue(0);
  const hy = useMotionValue(0);

  useMotionValueEvent(progress, "change", (p) => {
    const path = pathRef.current;
    if (!path || !geo) return;
    const pt = path.getPointAtLength(Math.min(1, Math.max(0, p)) * path.getTotalLength());
    hx.set(pt.x);
    hy.set(pt.y);
    let r = -1;
    geo.stops.forEach((s, i) => {
      if (pt.y >= s.y - 4) r = i;
    });
    setReached(r);
  });

  return (
    <section className="process" aria-labelledby="process-title">
      <svg className="paper-edge paper-edge--top" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true">
        <path filter="url(#torn)" d="M0 0 H1440 V14 L1330 24 L1210 12 L1090 26 L960 14 L840 28 L720 16 L600 27 L470 13 L350 25 L230 15 L110 26 L0 16 Z" fill="var(--crema)" />
      </svg>
      <div className="wrap">
        <Title id="process-title" eyebrow={t.process.eyebrow} line1={t.process.line1} line2={t.process.line2} center />
        <div ref={box} className="process-box">
          {geo && (
            <svg className="process-trail" viewBox={`0 0 ${geo.w} ${geo.h}`} width={geo.w} height={geo.h} aria-hidden="true">
              <path ref={pathRef} d={geo.d} fill="none" stroke="none" />
              <path d={geo.d} fill="none" stroke="var(--line)" strokeWidth="2" strokeDasharray="1 9" strokeLinecap="round" />
              <DottedPath d={geo.d} progress={reduce ? undefined : progress} width={3.5} gap={12} />
              {geo.stops.map((s, i) => (
                <g key={i} transform={`translate(${s.x} ${s.y})`}>
                  <circle r="15" fill="var(--crema)" stroke={reached >= i || reduce ? "var(--lenga)" : "var(--line)"} strokeWidth="2" />
                  <motion.circle
                    r="7"
                    fill="var(--lenga)"
                    initial={false}
                    animate={{ scale: reached >= i || reduce ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 16 }}
                  />
                </g>
              ))}
            </svg>
          )}
          <ol className="process-steps">
            {t.process.steps.map((s, i) => (
              <li key={i} ref={(el) => { stepRefs.current[i] = el; }} className={`process-step ${i % 2 ? "is-right" : "is-left"} ${reached >= i ? "is-reached" : ""}`}>
                <Reveal y={20}>
                  <span className="process-num">0{i + 1}</span>
                  <h3 className="process-title">{s.title}</h3>
                  <p className="process-text">{s.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <svg className="paper-edge paper-edge--bottom" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true">
        <path filter="url(#torn)" d="M0 40 H1440 V24 L1320 14 L1200 27 L1080 15 L950 28 L830 13 L700 25 L580 14 L450 27 L330 15 L200 26 L90 14 L0 24 Z" fill="var(--crema)" />
      </svg>
    </section>
  );
}
