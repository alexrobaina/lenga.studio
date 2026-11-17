import type { Dict } from "@/content/dictionaries";
import { ROUTES } from "@/content/routes";
import Bleed from "./Bleed";
import Picture from "./Picture";
import { Reveal } from "./Reveal";

// En el inicio, para negocios: una sola franja que lleva a las agencias y guías a su página.
export default function ExpeditionsTeaser({ t }: { t: Dict }) {
  const c = t.expPage.teaser;
  const shot = t.expeditions.shots[0];
  return (
    <section className="exp-teaser wrap" aria-labelledby="exp-teaser-title">
      <Reveal className="exp-teaser-band">
        <Bleed className="exp-teaser-img">
          <Picture id={shot.id} alt={shot.caption} sizes="(min-width: 900px) 40vw, 100vw" />
        </Bleed>
        <div className="exp-teaser-copy">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 id="exp-teaser-title" className="exp-teaser-title">
            {c.title}
          </h2>
          <p className="exp-teaser-text">{c.text}</p>
          <a className="btn btn--cream" href={ROUTES[t.lang].expeditions}>
            {c.cta}
            <svg width="30" height="12" viewBox="0 0 38 12" aria-hidden="true">
              <path d="M1 6 H35 M30 1 L36 6 L30 11" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
