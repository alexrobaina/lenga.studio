// Loma frente al Fitz Roy, a la tarde. (Se reemplaza por los retratos reales de Alex y Agostina cuando estén.)
export function RidgeScene() {
  return (
    <svg viewBox="0 0 800 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ridge-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A9CCD6" />
          <stop offset="0.6" stopColor="#F2D3BC" />
          <stop offset="1" stopColor="#EDB596" />
        </linearGradient>
      </defs>
      <rect width="800" height="640" fill="url(#ridge-sky)" />
      <circle cx="600" cy="300" r="110" fill="#F6D6BF" opacity="0.5" filter="url(#soft)" />
      <circle cx="600" cy="300" r="40" fill="#EDB596" filter="url(#wc-round)" />
      <g filter="url(#wc-1)">
        <path d="M-10 400 L80 370 L150 380 L210 330 L248 270 L262 220 L274 262 L290 180 L304 160 L318 176 L332 230 L346 205 L362 250 L400 300 L470 330 L560 350 L660 360 L810 380 L810 640 L-10 640 Z" fill="#7FA9C2" />
        <path d="M290 180 L304 160 L318 176 L312 190 L298 190 Z" fill="#EEF3F4" />
        <path d="M200 360 L262 300 L300 320 L340 300 L380 330 L330 350 L260 356 Z" fill="#EEF3F4" opacity="0.85" />
      </g>
      <g filter="url(#wc-3)">
        <path d="M-10 450 C120 420 240 430 360 440 C500 452 620 420 810 430 L810 640 L-10 640 Z" fill="#93B0A0" />
      </g>
      <g filter="url(#wc-4)">
        <path d="M-10 520 C140 500 260 480 400 470 C520 462 600 480 700 500 C760 512 790 520 810 524 L810 640 L-10 640 Z" fill="#A6AD72" />
        <ellipse cx="190" cy="548" rx="40" ry="54" fill="#B4482C" />
        <ellipse cx="246" cy="562" rx="30" ry="40" fill="#C9A063" />
        <ellipse cx="620" cy="566" rx="44" ry="58" fill="#4F6847" />
        <ellipse cx="574" cy="584" rx="30" ry="40" fill="#B4482C" />
      </g>
      <g stroke="#1E2A23" strokeWidth="2" fill="none" strokeLinecap="round">
        <path className="bird-static" d="M470 210 q8 -8 16 0 q8 -8 16 0" />
        <path className="bird-static" d="M520 240 q6 -6 12 0 q6 -6 12 0" />
      </g>
    </svg>
  );
}
