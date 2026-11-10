// Pájaros de dos trazos que cruzan el cielo (CSS puro, se apagan con prefers-reduced-motion).
const BIRDS = [
  { top: 18, delay: 0, dur: 38, s: 1 },
  { top: 21, delay: 1.4, dur: 38, s: 0.8 },
  { top: 16, delay: 2.2, dur: 38, s: 0.65 },
  { top: 30, delay: 17, dur: 46, s: 0.7 },
  { top: 32, delay: 18.2, dur: 46, s: 0.55 },
];

export default function Birds() {
  return (
    <div className="birds" aria-hidden="true">
      {BIRDS.map((b, i) => (
        <span
          key={i}
          className="bird"
          style={{
            top: `${b.top}%`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.dur}s`,
            ["--s" as string]: b.s,
          }}
        >
          <svg viewBox="0 0 40 14" width={40 * b.s} height={14 * b.s}>
            <path className="wing" d="M2 10 Q11 1 20 9 Q29 1 38 10" stroke="#1E2A23" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          </svg>
        </span>
      ))}
    </div>
  );
}
