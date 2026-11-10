"use client";

import type { Dict } from "@/content/dictionaries";
import { whatsappHref } from "@/content/site";
import { Reveal, Title } from "./Reveal";

// Íconos de trazo 1,75 px, puntas redondeadas (sistema de marca).
const ICONS: Record<string, string[]> = {
  photo: ["M4 8h3l2-3h6l2 3h3v11H4z", "M15.5 13a3.5 3.5 0 1 1-7 0a3.5 3.5 0 1 1 7 0"],
  video: ["M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z", "M10 9.5v5l4.5-2.5z"],
  design: ["M4 20l4-1 11-11-3-3L5 16z", "M14 7l3 3"],
  web: ["M9.5 3h5a2.5 2.5 0 0 1 2.5 2.5v13a2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 7 18.5v-13A2.5 2.5 0 0 1 9.5 3", "M11 18h2"],
  social: ["M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5", "M16 12a4 4 0 1 1-8 0a4 4 0 1 1 8 0", "M17.2 6.8h.01"],
  expedition: ["M3 19l6-10 4 6 2-3 6 7z", "M9 9V4l4 1.5L9 7"],
};

// Paquetes por objetivo del dueño (no por servicio): cada uno abre WhatsApp con el mensaje ya escrito.
export default function Services({ t }: { t: Dict }) {
  const p = t.packages;
  return (
    <section id="paquetes" className="packages" aria-labelledby="packages-title">
      <div className="wrap">
        <Title id="packages-title" eyebrow={p.eyebrow} line1={p.line1} line2={p.line2} />
        <div className="packages-grid">
          {p.items.map((it, i) => (
            <Reveal key={it.key} delay={(i % 2) * 0.08} className="package-card" as="article">
              <span className="package-num" aria-hidden="true">
                0{i + 1}
              </span>
              <p className="package-for">
                <span>{p.forLabel}</span> {it.for}
              </p>
              <h3 className="package-title">{it.title}</h3>
              <ul className="package-list">
                {it.includes.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <a className="package-cta" href={whatsappHref(it.message)}>
                {p.cta}
                <svg width="30" height="12" viewBox="0 0 38 12" aria-hidden="true">
                  <path d="M1 6 H35 M30 1 L36 6 L30 11" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal className="packages-foot">
          <p className="packages-note">{p.note}</p>
          <ul id="servicios" className="services-strip" aria-label={t.services.eyebrow}>
            {t.services.items.map((s, i) => (
              <li key={s.key} title={s.text}>
                <span className="services-chip" style={{ backgroundImage: `url(/art/blot-${i}.webp)` }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {ICONS[s.key].map((d, k) => (
                      <path key={k} d={d} />
                    ))}
                  </svg>
                </span>
                {s.title}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
