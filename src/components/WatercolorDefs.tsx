// Filtros SVG compartidos por todas las ilustraciones (se definen una sola vez en la página).
// - wc-N: acuarela. Borde irregular (displacement), variación de pigmento (noise) y borde más oscuro
//   donde el agua deposita pigmento (erode + out). Cada N usa otra semilla para que las capas no se repitan.
// - torn: papel rasgado, solo borde irregular.
// - soft: lavado difuso para nieblas y halos.

const SEEDS = [3, 11, 23, 37, 51, 68];

export default function WatercolorDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute", width: 0, height: 0 }}>
      <defs>
        {SEEDS.map((seed, i) => (
          <filter
            key={seed}
            id={`wc-${i + 1}`}
            x="-6%"
            y="-12%"
            width="112%"
            height="124%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.024" numOctaves={4} seed={seed} result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale={20} xChannelSelector="R" yChannelSelector="G" result="shape" />
            <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves={2} seed={seed + 5} result="pig" />
            <feColorMatrix in="pig" type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" result="pigGray" />
            <feComposite in="shape" in2="pigGray" operator="arithmetic" k1={0.3} k2={0.86} k3={0} k4={0} result="wash" />
            <feMorphology in="shape" operator="erode" radius={2.2} result="inner" />
            <feComposite in="shape" in2="inner" operator="out" result="rim" />
            <feColorMatrix in="rim" type="matrix" values="0.72 0 0 0 0  0 0.72 0 0 0  0 0 0.72 0 0  0 0 0 0.5 0" result="rimDark" />
            <feMerge>
              <feMergeNode in="wash" />
              <feMergeNode in="rimDark" />
            </feMerge>
          </filter>
        ))}
        {/* Lavado suave para superficies grandes (hielo, cielo): borde de acuarela pero pigmento parejo. */}
        <filter id="wc-soft" x="-4%" y="-10%" width="108%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.03" numOctaves={3} seed={29} result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale={14} xChannelSelector="R" yChannelSelector="G" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.02" numOctaves={2} seed={31} result="pig" />
          <feColorMatrix in="pig" type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" result="pigGray" />
          <feComposite in="shape" in2="pigGray" operator="arithmetic" k1={0.12} k2={0.95} k3={0} k4={0} result="wash" />
          <feMorphology in="shape" operator="erode" radius={1.6} result="inner" />
          <feComposite in="shape" in2="inner" operator="out" result="rim" />
          <feColorMatrix in="rim" type="matrix" values="0.8 0 0 0 0  0 0.8 0 0 0  0 0 0.8 0 0  0 0 0 0.4 0" result="rimDark" />
          <feMerge>
            <feMergeNode in="wash" />
            <feMergeNode in="rimDark" />
          </feMerge>
        </filter>
        {/* Acuarela para piezas chicas (el refugio): borde apenas irregular, pigmento con variación y borde más oscuro. */}
        <filter id="wc-fine" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={3} seed={17} result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale={4} xChannelSelector="R" yChannelSelector="G" result="shape" />
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={19} result="pig" />
          <feColorMatrix in="pig" type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" result="pigGray" />
          <feComposite in="shape" in2="pigGray" operator="arithmetic" k1={0.32} k2={0.84} k3={0} k4={0} result="wash" />
          <feMorphology in="shape" operator="erode" radius={1.1} result="inner" />
          <feComposite in="shape" in2="inner" operator="out" result="rim" />
          <feColorMatrix in="rim" type="matrix" values="0.7 0 0 0 0  0 0.7 0 0 0  0 0 0.7 0 0  0 0 0 0.55 0" result="rimDark" />
          <feMerge>
            <feMergeNode in="wash" />
            <feMergeNode in="rimDark" />
          </feMerge>
        </filter>
        <filter id="wc-round" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={9} result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale={5} xChannelSelector="R" yChannelSelector="G" result="shape" />
          <feMorphology in="shape" operator="erode" radius={1.5} result="inner" />
          <feComposite in="shape" in2="inner" operator="out" result="rim" />
          <feColorMatrix in="rim" type="matrix" values="0.8 0 0 0 0  0 0.8 0 0 0  0 0 0.8 0 0  0 0 0 0.45 0" result="rimDark" />
          <feMerge>
            <feMergeNode in="shape" />
            <feMergeNode in="rimDark" />
          </feMerge>
        </filter>
        <filter id="cloud" x="-20%" y="-60%" width="140%" height="220%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.06" numOctaves={3} seed={13} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={18} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="3.5" />
        </filter>
        <filter id="torn" x="-2%" y="-20%" width="104%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={3} seed={4} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={10} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
    </svg>
  );
}
