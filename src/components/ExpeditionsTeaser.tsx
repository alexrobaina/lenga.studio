"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import type { Dict } from "@/content/dictionaries";
import { ROUTES } from "@/content/routes";
import { RIDGE, RIDGE_MOON, RIDGE_PHOTO } from "@/content/ridge";
import Picture from "./Picture";

// En el inicio, para negocios: una franja de foto a sangre que lleva a las agencias y guías a su página.
// La foto es el atardecer sobre el cordón del Torre; al entrar en pantalla se dibuja sobre la cresta real
// la línea del logo y aparece la luna (animación CSS, apagada con movimiento reducido).
export default function ExpeditionsTeaser({ t }: { t: Dict }) {
  const c = t.expPage.teaser;
  const shot = t.expeditions.shots.find((s) => s.id === RIDGE_PHOTO) ?? t.expeditions.shots[0];
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });
  return (
    <section ref={ref} className={`xt ${inView ? "is-in" : ""}`} aria-labelledby="xt-title">
      {/* Bordes de papel rasgado, como en "Cómo trabajamos": la foto entra y sale del papel crema. */}
      <svg className="paper-edge paper-edge--top" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true">
        <path filter="url(#torn)" d="M0 0 H1440 V14 L1330 24 L1210 12 L1090 26 L960 14 L840 28 L720 16 L600 27 L470 13 L350 25 L230 15 L110 26 L0 16 Z" fill="var(--crema)" />
      </svg>
      <figure className="xt-photo">
        {/* Lienzo con la proporción de la foto: la línea calza con la cresta en cualquier recorte. */}
        <div className="xt-canvas">
          <Picture id={RIDGE_PHOTO} alt={shot.caption} sizes="(max-width: 760px) 1000px, 100vw" className="xt-img" />
          <svg className="xt-ridge" viewBox="0 0 1200 580" aria-hidden="true">
            <path d={RIDGE} pathLength={1} />
            <circle cx={RIDGE_MOON.x} cy={RIDGE_MOON.y} r={7} className="xt-moon" />
          </svg>
        </div>
        <figcaption className="xt-cap">{shot.caption}</figcaption>
      </figure>
      <div className="wrap xt-copy">
        <h2 id="xt-title" className="display h2 xt-title">
          {c.title}
        </h2>
        <p className="xt-text">{c.text}</p>
        <a className="btn btn--cream xt-btn" href={ROUTES[t.lang].expeditions}>
          {c.cta}
        </a>
      </div>
      <svg className="paper-edge paper-edge--bottom" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true">
        <path filter="url(#torn)" d="M0 40 H1440 V24 L1320 14 L1200 27 L1080 15 L950 28 L830 13 L700 25 L580 14 L450 27 L330 15 L200 26 L90 14 L0 24 Z" fill="var(--crema)" />
      </svg>
    </section>
  );
}
