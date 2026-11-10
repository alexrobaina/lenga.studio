// Escena del contacto, en acuarela: el Fitz Roy de fondo, lomas con bosque de lengas y un refugio
// de madera con la ventana encendida. Tres capas para el parallax:
//   back  → cordón y macizo (se mueve poco)
//   mid   → lomas, bosque, refugio y lengas (se mueve más)
//   front → el suelo, fijo, que se funde con el verde del footer (#3D5338)
import { rng, round } from "@/lib/rng";

const svgProps = { viewBox: "0 0 1440 360", preserveAspectRatio: "xMidYMax slice", "aria-hidden": true, focusable: "false" } as const;

export const GROUND = "#3D5338";
// Coordenadas que comparte la capa animada (humo y brillo de la ventana) en Contact.tsx.
export const CHIMNEY = { x: 836, y: 186 };
export const WINDOW = { x: 812, y: 276 };

const hills = (x: number) => 244 + 9 * Math.sin(x / 210 + 1) + 5 * Math.sin(x / 73);
const ground = (x: number) => 302 + 5 * Math.sin(x / 130 + 0.5) + 3 * Math.sin(x / 47);

function line(fn: (x: number) => number, step = 24, x0 = -20, x1 = 1460) {
  let d = `M${x0} ${round(fn(x0))}`;
  for (let x = x0 + step; x <= x1 + step; x += step) d += ` L${x} ${round(fn(x))}`;
  return d;
}

const LENGA = ["#B4482C", "#CF6B3C", "#C9A063", "#4F6847", "#9C3B24", "#5E6B46", "#C9A063", "#B4482C"];

type Blob = { x: number; y: number; rx: number; ry: number; c: string; r: number };
function band(seed: number, n: number, base: (x: number) => number, size: [number, number], xr: [number, number]) {
  const r = rng(seed);
  const out: Blob[] = [];
  for (let i = 0; i < n; i++) {
    const x = xr[0] + r() * (xr[1] - xr[0]);
    const ry = size[0] + r() * (size[1] - size[0]);
    out.push({
      x: round(x),
      y: round(base(x) - ry * 0.5),
      rx: round(ry * (0.65 + r() * 0.25)),
      ry: round(ry),
      c: LENGA[Math.floor(r() * LENGA.length)],
      r: round(-8 + r() * 16),
    });
  }
  return out.sort((a, b) => a.y + a.ry - (b.y + b.ry));
}

// Una lenga pintada con tres manchas superpuestas del mismo tono (copa con volumen) y el tronco.
type Tree = { x: number; base: number; h: number; c: string; seed: number };
function Lenga({ t }: { t: Tree }) {
  const r = rng(t.seed);
  const w = t.h * 0.62;
  const cy = t.base - t.h * 0.62;
  return (
    <g>
      <path d={`M${t.x} ${t.base + 4} L${t.x + (r() - 0.5) * 4} ${cy}`} stroke="#4A3A2C" strokeWidth={Math.max(2.5, t.h * 0.05)} strokeLinecap="round" />
      <ellipse cx={t.x} cy={cy} rx={w * 0.5} ry={t.h * 0.42} fill={t.c} />
      <ellipse cx={round(t.x - w * 0.28)} cy={round(cy + t.h * 0.1)} rx={round(w * 0.32)} ry={round(t.h * 0.26)} fill={t.c} />
      <ellipse cx={round(t.x + w * 0.26)} cy={round(cy - t.h * 0.12)} rx={round(w * 0.3)} ry={round(t.h * 0.24)} fill={t.c} />
    </g>
  );
}

const forest = band(23, 90, hills, [7, 15], [-20, 1460]);

const T = (x: number, h: number, c: string, seed: number): Tree => ({ x, base: round(ground(x) + 2), h, c, seed });
const nearTrees: Tree[] = [
  T(140, 78, "#4F6847", 1),
  T(196, 64, "#B4482C", 2),
  T(470, 70, "#C9A063", 3),
  T(536, 92, "#B4482C", 4),
  T(600, 66, "#4F6847", 5),
  T(938, 96, "#4F6847", 6),
  T(1004, 72, "#CF6B3C", 7),
  T(1062, 60, "#C9A063", 8),
  T(1262, 84, "#9C3B24", 9),
  T(1330, 66, "#4F6847", 10),
];

// Macizo del Fitz Roy (mismo perfil que el hero, a escala).
const MASSIF =
  "M-20 842 L160 806 L300 784 L384 760 L470 704 L540 670 L590 642 L622 592 L640 522 L652 468 L664 528 L684 562 L700 540 L722 470 L748 410 L770 372 L790 348 L806 338 L820 345 L836 372 L852 420 L866 470 L886 500 L902 470 L914 436 L926 476 L940 506 L958 488 L972 460 L986 498 L1004 530 L1050 570 L1110 602 L1180 630 L1260 662 L1340 700 L1420 740 L1620 800 L1620 1000 L-20 1000 Z";
const MASSIF_SNOW =
  "M520 690 L590 650 L640 660 L700 646 L756 616 L800 646 L858 614 L920 644 L996 606 L1050 576 L1110 604 L1060 642 L984 664 L904 684 L824 674 L744 694 L664 694 L584 706 Z";

export function RefugioBack() {
  return (
    <svg {...svgProps}>
      <g filter="url(#wc-1)">
        <path
          d="M-20 214 L120 196 L230 204 L320 186 L420 196 L700 192 L860 200 L980 168 L1060 182 L1180 160 L1300 190 L1460 182 L1460 360 L-20 360 Z"
          fill="#C6D7DF"
        />
      </g>
      <g filter="url(#wc-2)">
        <g transform="translate(150 -94) scale(0.5)">
          <path d={MASSIF} fill="#9DBACB" />
        </g>
      </g>
      <g filter="url(#wc-3)" opacity="0.55">
        <g transform="translate(150 -94) scale(0.5)">
          <path d="M806 338 L820 345 L836 372 L852 420 L866 470 L846 530 L820 480 L814 410 Z" fill="#6F92AE" />
          <path d="M914 436 L926 476 L940 506 L922 524 L918 474 Z" fill="#6F92AE" />
          <path d="M972 460 L986 498 L1004 530 L986 546 L978 494 Z" fill="#6F92AE" />
        </g>
      </g>
      <g filter="url(#wc-4)">
        <g transform="translate(150 -94) scale(0.5)">
          <path d={MASSIF_SNOW} fill="#F1F5F6" opacity="0.92" />
          <path d="M790 348 L806 338 L820 345 L814 358 L800 356 Z" fill="#F4F7F7" />
        </g>
      </g>
    </svg>
  );
}

export function RefugioMid() {
  return (
    <svg {...svgProps}>
      <g filter="url(#wc-3)">
        <path d={`${line(hills)} L1460 360 L-20 360 Z`} fill="#93B0A0" />
        <path d={`${line((x) => hills(x) + 26)} L1460 360 L-20 360 Z`} fill="#84A391" opacity="0.75" />
      </g>
      <g filter="url(#wc-1)">
        {forest.map((b, i) => (
          <ellipse key={i} cx={b.x} cy={b.y} rx={b.rx} ry={b.ry} fill={b.c} opacity="0.9" transform={`rotate(${b.r} ${b.x} ${b.y})`} />
        ))}
      </g>
      {/* Lengas detrás del refugio */}
      <g filter="url(#wc-4)">
        {nearTrees.filter((t) => t.h >= 78).map((t) => (
          <Lenga key={t.seed} t={t} />
        ))}
      </g>
      <Refugio />
      <g filter="url(#wc-2)">
        {nearTrees.filter((t) => t.h < 78).map((t) => (
          <Lenga key={t.seed} t={t} />
        ))}
      </g>
    </svg>
  );
}

// El refugio: cabaña de madera a dos aguas, frente iluminado y costado en sombra, techo de chapa roja.
function Refugio() {
  return (
    <g>
      <ellipse cx="760" cy="306" rx="130" ry="9" fill="#2C3D31" opacity="0.35" filter="url(#soft)" />
      <g filter="url(#wc-fine)">
        {/* costado en sombra */}
        <path d="M770 252 L862 248 L862 312 L770 314 Z" fill="#9A7044" />
        {/* frente a dos aguas, madera al sol */}
        <path d="M666 314 L666 254 L718 214 L770 254 L770 314 Z" fill="#CFA066" />
        {/* techo: faldón lateral */}
        <path d="M716 204 L818 200 L878 252 L772 258 Z" fill="#A9432A" />
        {/* chimenea de piedra */}
        <path d="M826 194 L846 194 L846 230 L826 232 Z" fill="#77706A" />
        <path d="M822 190 L850 190 L850 197 L822 197 Z" fill="#5C5650" />
        {/* puerta y ventanas */}
        <path d="M705 314 L705 274 C705 266 731 266 731 274 L731 314 Z" fill="#5A3A28" />
        <circle cx="718" cy="240" r="7.5" fill="#F2B866" />
        <path d="M796 266 L828 265 L828 288 L796 289 Z" fill="#F2B866" />
      </g>
      {/* tablas, marcos y el borde del techo: trazo fino de pincel */}
      <g fill="none" strokeLinecap="round" filter="url(#wc-round)">
        <path d="M658 260 L718 206 L780 260" stroke="#7E2E1C" strokeWidth="7" strokeLinejoin="round" />
        <g stroke="#A87A45" strokeWidth="1.4" opacity="0.55">
          <path d="M684 242 L684 312" />
          <path d="M700 230 L700 312" />
          <path d="M738 230 L738 312" />
          <path d="M754 242 L754 312" />
          <path d="M770 272 L862 268" />
          <path d="M770 292 L862 290" />
        </g>
        <g stroke="#7A5530" strokeWidth="1.6">
          <path d="M812 266 L812 288 M796 277 L828 276" />
          <path d="M710.5 240 L725.5 240 M718 232.5 L718 247.5" opacity="0.7" />
        </g>
      </g>
      {/* leña apilada al costado */}
      <g filter="url(#wc-round)">
        <path d="M866 300 L904 300 L904 314 L866 314 Z" fill="#8A6A48" />
        <g fill="#C9A063">
          <circle cx="872" cy="304" r="3.2" />
          <circle cx="881" cy="304" r="3.2" />
          <circle cx="890" cy="304" r="3.2" />
          <circle cx="899" cy="304" r="3.2" />
          <circle cx="876" cy="311" r="3.2" />
          <circle cx="885" cy="311" r="3.2" />
          <circle cx="894" cy="311" r="3.2" />
        </g>
      </g>
    </g>
  );
}

const tufts = (() => {
  const r = rng(91);
  return Array.from({ length: 70 }, () => {
    const x = round(-20 + r() * 1480);
    return { x, y: round(ground(x) + 10 + r() * 40), h: round(5 + r() * 9), l: r() > 0.5 };
  });
})();

export function RefugioFront() {
  return (
    <svg {...svgProps}>
      <g filter="url(#wc-5)">
        <path d={`${line(ground)} L1460 380 L-20 380 Z`} fill={GROUND} />
        <path d={`${line((x) => ground(x) + 18, 30)} L1460 380 L-20 380 Z`} fill="#33472F" opacity="0.5" />
      </g>
      <g stroke="#2C3D31" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.6">
        {tufts.map((t, i) => (
          <path key={i} d={`M${t.x} ${t.y} l${t.l ? -3 : 3} ${-t.h} M${t.x + 3} ${t.y} l0 ${-t.h * 1.2} M${t.x + 6} ${t.y} l${t.l ? 3 : -3} ${-t.h * 0.9}`} />
        ))}
      </g>
      {/* Sendero hasta la puerta */}
      <path filter="url(#wc-round)" d="M712 312 C716 324 700 336 680 348 C664 356 650 362 640 370 L612 370 C628 356 660 340 690 326 C702 320 704 316 704 312 Z" fill="#8E9A5C" opacity="0.55" />
      {/* Base sólida: se continúa sin corte con el footer. */}
      <rect x="-20" y="346" width="1480" height="16" fill={GROUND} />
    </svg>
  );
}
