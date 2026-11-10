import { rng, round } from "@/lib/rng";

// Hojas de lenga que caen (otoño en El Chaltén). Animación CSS: livianas y sin JavaScript.
const COLORS = ["#B4482C", "#CF6B3C", "#C9A063", "#9C3B24"];
const r = rng(91);
const LEAVES = Array.from({ length: 14 }, () => ({
  left: round(r() * 100),
  delay: round(r() * 14),
  dur: round(11 + r() * 9),
  size: round(10 + r() * 10),
  sway: round(30 + r() * 70),
  color: COLORS[Math.floor(r() * COLORS.length)],
}));

export default function Leaves({ className = "" }: { className?: string }) {
  return (
    <div className={`leaves ${className}`} aria-hidden="true">
      {LEAVES.map((l, i) => (
        <span
          key={i}
          className="leaf"
          style={{
            left: `${l.left}%`,
            animationDelay: `${l.delay}s`,
            animationDuration: `${l.dur}s`,
            ["--sway" as string]: `${l.sway}px`,
          }}
        >
          <svg viewBox="0 0 20 24" width={l.size} height={l.size * 1.2}>
            <path
              d="M10 1 C14 5 18 9 17 14 C16 19 12 22 10 23 C8 22 4 19 3 14 C2 9 6 5 10 1 Z"
              fill={l.color}
            />
            <path d="M10 4 V22" stroke="#00000033" strokeWidth="0.8" />
          </svg>
        </span>
      ))}
    </div>
  );
}
