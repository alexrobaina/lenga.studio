// Noche en el glaciar: agujas del Torre, la luna y una carpa encendida. Capas para parallax.
import { rng, round } from "@/lib/rng";

const svgProps = {
  viewBox: "0 0 1600 900",
  preserveAspectRatio: "xMidYMax slice",
  "aria-hidden": true,
  focusable: "false",
} as const;

const r = rng(5);
export const STARS = Array.from({ length: 90 }, () => ({
  x: round(r() * 100, 2),
  y: round(r() * 55, 2),
  s: round(1 + r() * 2.2),
  d: round(r() * 5, 2),
  t: round(2.5 + r() * 4, 2),
}));

export function NightSky() {
  return (
    <svg {...svgProps}>
      <defs>
        <linearGradient id="night-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141C29" />
          <stop offset="0.5" stopColor="#24324A" />
          <stop offset="0.85" stopColor="#40506D" />
          <stop offset="1" stopColor="#56607A" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#night-sky)" />
      <path d="M-40 300 C300 220 700 160 1000 200 C1300 240 1500 160 1700 120" stroke="#E6ECF5" strokeWidth="140" opacity="0.045" filter="url(#soft)" fill="none" />
    </svg>
  );
}

export function Moon() {
  return (
    <svg {...svgProps}>
      <circle cx="1240" cy="190" r="150" fill="#F2C2A6" opacity="0.12" filter="url(#soft)" />
      <circle cx="1240" cy="190" r="70" fill="#F2C2A6" opacity="0.18" />
      <circle cx="1240" cy="190" r="40" fill="#F6E4D4" filter="url(#wc-round)" />
      <circle cx="1228" cy="180" r="9" fill="#E9D2C0" opacity="0.6" />
      <circle cx="1254" cy="204" r="6" fill="#E9D2C0" opacity="0.5" />
    </svg>
  );
}

export function NightSpires() {
  return (
    <svg {...svgProps}>
      <g filter="url(#wc-2)">
        <path
          d="M-20 640 L120 600 L240 610 L330 560 L380 480 L404 410 L420 470 L440 360 L456 300 L470 350 L486 290 L500 380 L520 330 L540 420 L580 470 L640 500 L720 470 L800 430 L840 380 L880 400 L940 350 L1000 380 L1080 440 L1180 470 L1300 520 L1420 540 L1620 560 L1620 900 L-20 900 Z"
          fill="#2F3D54"
        />
      </g>
      <g filter="url(#wc-3)">
        <path d="M-20 700 L160 660 L300 668 L420 640 L560 650 L700 610 L860 630 L1000 600 L1160 640 L1320 620 L1480 650 L1620 640 L1620 900 L-20 900 Z" fill="#26324A" />
      </g>
      <g fill="#8FA2C0" opacity="0.5">
        <path d="M456 300 L470 350 L466 372 L458 340 Z" />
        <path d="M440 360 L446 400 L438 420 Z" />
        <path d="M486 290 L492 330 L488 350 Z" />
        <path d="M404 410 L412 450 L404 470 Z" />
      </g>
      <g stroke="#C9D4E6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.45" strokeWidth="2">
        <path d="M330 560 L380 480 L404 410 L420 470 L440 360 L456 300 L470 350 L486 290 L500 380" />
        <path d="M800 430 L840 380 L880 400 L940 350 L1000 380" />
      </g>
    </svg>
  );
}

// Glaciar a la luz de la luna: lavado suave (sin manchas), ondulaciones de nieve en sombra azul
// y algunas grietas finas cerca del horizonte.
export function Glacier() {
  return (
    <svg {...svgProps}>
      <defs>
        <linearGradient id="night-ice" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7D8FAE" />
          <stop offset="0.35" stopColor="#9DAEC8" />
          <stop offset="1" stopColor="#BFCBDD" />
        </linearGradient>
      </defs>
      <g filter="url(#wc-soft)">
        <path d="M-20 690 C200 664 420 670 640 678 C880 686 1100 654 1340 662 C1460 666 1540 672 1620 670 L1620 900 L-20 900 Z" fill="url(#night-ice)" />
      </g>
      {/* Reflejo de la luna sobre el hielo */}
      <ellipse cx="1180" cy="712" rx="320" ry="26" fill="#E6ECF5" opacity="0.28" filter="url(#soft)" />
      {/* Ondulaciones de nieve (sastrugi) en sombra */}
      <g filter="url(#wc-soft)" fill="#6E81A3">
        <path d="M-20 742 C260 724 520 734 820 728 C1100 722 1360 736 1620 728 L1620 740 C1340 750 1080 738 820 746 C540 754 260 744 -20 760 Z" opacity="0.22" />
        <path d="M-20 806 C300 786 600 800 940 790 C1220 782 1420 796 1620 788 L1620 806 C1400 816 1200 802 940 812 C620 824 300 812 -20 830 Z" opacity="0.18" />
      </g>
      <g stroke="#5E7194" strokeLinecap="round" fill="none" opacity="0.45">
        <path d="M232 700 C262 696 290 698 318 694" strokeWidth="1.6" />
        <path d="M402 712 C440 707 470 709 506 704" strokeWidth="1.8" />
        <path d="M1010 696 C1040 692 1068 694 1092 690" strokeWidth="1.5" />
        <path d="M1236 724 C1280 718 1316 720 1356 714" strokeWidth="2" />
        <path d="M560 736 C604 730 640 732 684 726" strokeWidth="2" />
      </g>
    </svg>
  );
}

export function Tent() {
  return (
    <svg {...svgProps}>
      <defs>
        <radialGradient id="tent-glow">
          <stop offset="0" stopColor="#F6D9A8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#F6D9A8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform="translate(760 742)">
        <ellipse className="tent-glow" cx="0" cy="-14" rx="190" ry="90" fill="url(#tent-glow)" />
        <path d="M-58 0 C-50 -40 -20 -62 0 -66 C20 -62 50 -40 58 0 Z" fill="#C9A063" />
        <path className="tent-light" d="M-40 0 C-34 -30 -14 -48 0 -52 C14 -48 34 -30 40 0 Z" fill="#F6D9A8" />
        <path d="M0 -66 L0 0" stroke="#8E6E3C" strokeWidth="2" />
        <path d="M-10 0 L0 -26 L10 0 Z" fill="#B4482C" opacity="0.85" />
        <ellipse cx="0" cy="2" rx="80" ry="8" fill="#2B3446" opacity="0.35" />
      </g>
    </svg>
  );
}

// Borde de bosque de lengas en primer plano, en sombra de noche: enmarca la carpa y termina en un
// verde oscuro parejo (NIGHT_FOREST) que continúa en la sección siguiente, sin franjas.
export const NIGHT_FOREST = "#1F2B27";
const BASE = NIGHT_FOREST;
type Blob = { x: number; y: number; rx: number; ry: number; c: string; r: number };
function canopy(seed: number, n: number, x0: number, x1: number, top: (x: number) => number, size: [number, number]) {
  const r = rng(seed);
  const out: Blob[] = [];
  const tones = ["#1F2B27", "#24332D", "#2A3A33", "#2F4036", "#24332D", "#3E2A26"];
  for (let i = 0; i < n; i++) {
    const x = x0 + r() * (x1 - x0);
    const ry = size[0] + r() * (size[1] - size[0]);
    out.push({
      x: round(x),
      y: round(top(x) + ry * 0.7),
      rx: round(ry * (0.7 + r() * 0.3)),
      ry: round(ry),
      c: tones[Math.floor(r() * tones.length)],
      r: round(-10 + r() * 20),
    });
  }
  return out.sort((a, b) => a.y - b.y);
}
// Más alto en los costados (enmarca), más bajo en el centro (deja ver la carpa).
const edge = (x: number) => 856 - 120 * Math.pow(Math.abs(x - 800) / 820, 1.6);
const FRONT = canopy(61, 96, -60, 1660, edge, [26, 58]);

export function NightFront() {
  return (
    <svg {...svgProps}>
      <g filter="url(#wc-5)">
        <path d={`M-20 900 L-20 ${edge(-20) + 40} ` + Array.from({ length: 34 }, (_, i) => `L${i * 50} ${round(edge(i * 50) + 16)}`).join(" ") + " L1620 900 Z"} fill={BASE} />
        {FRONT.map((b, i) => (
          <ellipse key={i} cx={b.x} cy={b.y} rx={b.rx} ry={b.ry} fill={b.c} transform={`rotate(${b.r} ${b.x} ${b.y})`} />
        ))}
      </g>
      <g filter="url(#wc-3)" fill="#7F93AE" opacity="0.14">
        {FRONT.filter((b) => b.y < edge(b.x) + 30).map((b, i) => (
          <ellipse key={i} cx={b.x + b.rx * 0.2} cy={b.y - b.ry * 0.55} rx={b.rx * 0.7} ry={b.ry * 0.28} />
        ))}
      </g>
      {/* Las copas se oscurecen hacia abajo hasta el verde de noche: sin línea de corte con la sección. */}
      <defs>
        <linearGradient id="night-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={BASE} stopOpacity="0" />
          <stop offset="1" stopColor={BASE} stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect x="-20" y="800" width="1640" height="92" fill="url(#night-fade)" />
      <rect x="-20" y="890" width="1640" height="12" fill={BASE} />
    </svg>
  );
}
