// Escena del hero: el macizo del Fitz Roy al amanecer, en capas de acuarela.
// Cada capa es un SVG independiente (mismo viewBox) para poder moverla con parallax
// sin volver a calcular los filtros en cada cuadro.
import { rng, round } from "@/lib/rng";

export const VB = "0 0 1600 1000";
const svgProps = {
  viewBox: VB,
  preserveAspectRatio: "xMidYMax slice",
  "aria-hidden": true,
  focusable: "false",
} as const;

// Línea de una ladera como función, para que los árboles se apoyen sobre ella.
const slope = (x: number) => 812 + 14 * Math.sin(x / 170 + 1) + 7 * Math.sin(x / 63);
const meadow = (x: number) => 892 + 16 * Math.sin(x / 230 + 2.2) + 6 * Math.sin(x / 81);

function polyFrom(fn: (x: number) => number, step = 32, bottom = 1000) {
  let d = `M0 ${round(fn(0))}`;
  for (let x = step; x <= 1600 + step; x += step) d += ` L${x} ${round(fn(x))}`;
  return `${d} L1632 ${bottom} L0 ${bottom} Z`;
}

const LENGA = ["#B4482C", "#B4482C", "#CF6B3C", "#C9A063", "#C9A063", "#4F6847", "#5E6B46", "#9C3B24"];

type Tree = { x: number; y: number; rx: number; ry: number; c: string; r: number };
function trees(seed: number, n: number, base: (x: number) => number, size: [number, number], xr: [number, number] = [-20, 1620]) {
  const r = rng(seed);
  const out: Tree[] = [];
  for (let i = 0; i < n; i++) {
    const x = xr[0] + r() * (xr[1] - xr[0]);
    const ry = size[0] + r() * (size[1] - size[0]);
    out.push({
      x: round(x),
      y: round(base(x) - ry * 0.55),
      rx: round(ry * (0.62 + r() * 0.25)),
      ry: round(ry),
      c: LENGA[Math.floor(r() * LENGA.length)],
      r: round(-8 + r() * 16),
    });
  }
  return out.sort((a, b) => a.y + a.ry - (b.y + b.ry));
}

const forest = trees(7, 78, slope, [18, 38]);
const meadowTrees = trees(19, 14, meadow, [34, 60], [-40, 380]).concat(trees(29, 14, meadow, [34, 60], [1220, 1640]));

function TreeBlob({ t }: { t: Tree }) {
  return (
    <g transform={`rotate(${t.r} ${t.x} ${t.y})`}>
      <ellipse cx={t.x} cy={t.y} rx={t.rx} ry={t.ry} fill={t.c} />
    </g>
  );
}

export function SkyDawn() {
  return (
    <svg {...svgProps}>
      <defs>
        <linearGradient id="sky-dawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8EA7C0" />
          <stop offset="0.42" stopColor="#D9C3C2" />
          <stop offset="0.72" stopColor="#F2C2A6" />
          <stop offset="1" stopColor="#F6D9C4" />
        </linearGradient>
      </defs>
      <rect width="1600" height="1000" fill="url(#sky-dawn)" />
    </svg>
  );
}

export function SkyDay() {
  return (
    <svg {...svgProps}>
      <defs>
        <linearGradient id="sky-day" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A9CCD6" />
          <stop offset="0.55" stopColor="#DCE7E3" />
          <stop offset="1" stopColor="#F4E3D0" />
        </linearGradient>
      </defs>
      <rect width="1600" height="1000" fill="url(#sky-day)" />
    </svg>
  );
}

export function Sun() {
  return (
    <svg {...svgProps}>
      <circle cx="1190" cy="520" r="190" fill="#F6D6BF" opacity="0.45" filter="url(#soft)" />
      <circle cx="1190" cy="520" r="110" fill="#F6D6BF" opacity="0.55" />
      <circle cx="1190" cy="520" r="56" fill="#EDB596" filter="url(#wc-round)" />
    </svg>
  );
}

export function FarRange() {
  return (
    <svg {...svgProps}>
      <g filter="url(#wc-1)" opacity="0.92">
        <path
          d="M-20 650 L80 612 L150 626 L214 590 L248 548 L262 512 L270 540 L282 468 L292 536 L304 500 L318 552 L352 588 L420 600 L486 572 L560 594 L640 584 L760 600 L900 590 L1040 596 L1120 566 L1186 540 L1240 556 L1300 516 L1352 548 L1420 528 L1490 556 L1560 540 L1620 552 L1620 1000 L-20 1000 Z"
          fill="#A3C3D0"
        />
        <path d="M262 512 L270 540 L282 468 L292 536 L304 500 L310 524 L296 552 L282 540 L272 556 Z" fill="#E9F0F2" opacity="0.8" />
      </g>
    </svg>
  );
}

export function Massif() {
  return (
    <svg {...svgProps}>
      <g filter="url(#wc-2)">
        <path
          d="M-20 842 L160 806 L300 784 L384 760 L470 704 L540 670 L590 642 L622 592 L640 522 L652 468 L664 528 L684 562 L700 540 L722 470 L748 410 L770 372 L790 348 L806 338 L820 345 L836 372 L852 420 L866 470 L886 500 L902 470 L914 436 L926 476 L940 506 L958 488 L972 460 L986 498 L1004 530 L1050 570 L1110 602 L1180 630 L1260 662 L1340 700 L1420 740 L1620 800 L1620 1000 L-20 1000 Z"
          fill="#7FA9C2"
        />
      </g>
      <g filter="url(#wc-3)" opacity="0.6">
        <path d="M806 338 L820 345 L836 372 L852 420 L866 470 L846 530 L820 480 L814 410 Z" fill="#577E9C" />
        <path d="M652 468 L664 528 L654 548 L656 500 Z" fill="#577E9C" />
        <path d="M914 436 L926 476 L940 506 L922 524 L918 474 Z" fill="#577E9C" />
        <path d="M972 460 L986 498 L1004 530 L986 546 L978 494 Z" fill="#577E9C" />
      </g>
      <g filter="url(#wc-4)">
        <path
          d="M520 690 L590 650 L640 660 L700 646 L756 616 L800 646 L858 614 L920 644 L996 606 L1050 576 L1110 604 L1060 642 L984 664 L904 684 L824 674 L744 694 L664 694 L584 706 Z"
          fill="#EEF3F4"
          opacity="0.92"
        />
        <path d="M790 348 L806 338 L820 345 L814 358 L800 356 Z" fill="#F4F7F7" />
        <path d="M748 410 L770 372 L776 392 L758 430 Z" fill="#E6EEF1" opacity="0.85" />
      </g>
      <g stroke="#F4F7F7" strokeLinecap="round" opacity="0.7" fill="none">
        <path d="M760 398 L742 462" strokeWidth="3" />
        <path d="M786 362 L776 440" strokeWidth="2.4" />
        <path d="M646 492 L638 548" strokeWidth="2" />
        <path d="M908 452 L896 510" strokeWidth="2" />
      </g>
    </svg>
  );
}

// Nube lenticular sobre la cumbre: "Chaltén" significa montaña que humea.
export function SummitCloud() {
  return (
    <svg {...svgProps}>
      <g filter="url(#cloud)" fill="#FBF8F2">
        <ellipse cx="846" cy="322" rx="160" ry="17" opacity="0.9" />
        <ellipse cx="884" cy="304" rx="112" ry="12" opacity="0.75" />
        <ellipse cx="806" cy="338" rx="96" ry="9" opacity="0.6" />
        <ellipse cx="930" cy="316" rx="70" ry="8" fill="#F6D9C4" opacity="0.7" />
      </g>
    </svg>
  );
}

export function Mist() {
  return (
    <svg {...svgProps}>
      <g filter="url(#soft)" fill="#FBF8F2">
        <ellipse cx="420" cy="735" rx="380" ry="34" opacity="0.6" />
        <ellipse cx="1180" cy="720" rx="420" ry="30" opacity="0.55" />
      </g>
    </svg>
  );
}

export function Hills() {
  return (
    <svg {...svgProps}>
      <g filter="url(#wc-3)">
        <path
          d="M-20 762 C140 730 260 720 380 736 C520 754 600 706 740 700 C880 694 960 736 1100 728 C1240 720 1340 700 1460 712 C1530 718 1570 722 1620 720 L1620 1000 L-20 1000 Z"
          fill="#93B0A0"
        />
        <path
          d="M-20 790 C200 770 320 778 520 784 C700 790 860 760 1040 770 C1200 778 1380 770 1620 760 L1620 1000 L-20 1000 Z"
          fill="#84A391"
          opacity="0.7"
        />
      </g>
    </svg>
  );
}

export function Forest() {
  return (
    <svg {...svgProps}>
      <g filter="url(#wc-4)">
        <path d={polyFrom(slope)} fill="#A6AD72" />
      </g>
      <g filter="url(#wc-1)">
        {forest.map((t, i) => (
          <TreeBlob key={i} t={t} />
        ))}
      </g>
    </svg>
  );
}

export function Meadow() {
  return (
    <svg {...svgProps}>
      <g filter="url(#wc-5)">
        <path d={polyFrom(meadow)} fill="#8E9A5C" />
        <path d={polyFrom((x) => meadow(x) + 40)} fill="#7D8A50" opacity="0.6" />
      </g>
      <g filter="url(#wc-2)">
        {meadowTrees.map((t, i) => (
          <TreeBlob key={i} t={t} />
        ))}
      </g>
    </svg>
  );
}

const fg = trees(41, 9, (x) => 990 - Math.abs(x - 800) * 0.12, [70, 130], [-60, 230]).concat(
  trees(43, 9, (x) => 990 - Math.abs(x - 800) * 0.12, [70, 130], [1370, 1660])
);

export function Foreground() {
  return (
    <svg {...svgProps}>
      <g filter="url(#wc-6)">
        {fg.map((t, i) => (
          <ellipse
            key={i}
            cx={t.x}
            cy={t.y}
            rx={t.rx}
            ry={t.ry}
            fill={i % 3 === 0 ? "#1E2A23" : i % 3 === 1 ? "#3D5338" : "#4F6847"}
            transform={`rotate(${t.r} ${t.x} ${t.y})`}
          />
        ))}
        <path d="M-20 968 C300 950 600 972 900 960 C1150 950 1350 966 1620 956 L1620 1000 L-20 1000 Z" fill="#3D5338" />
      </g>
      <path
        filter="url(#torn)"
        d="M-20 1040 L-20 984 L90 978 L200 986 L330 976 L460 984 L600 974 L740 986 L880 976 L1020 984 L1160 974 L1300 986 L1440 978 L1620 984 L1620 1040 Z"
        fill="#F3EEE4"
      />
      {/* Base sólida: el borde rasgado nunca deja ver el verde en la última fila de píxeles. */}
      <rect x="-20" y="990" width="1640" height="12" fill="#F3EEE4" />
    </svg>
  );
}
