// Manchas de acuarela detrás de los íconos de servicios.
export const TINTS = ["#F2C2A6", "#A9CCD6", "#A6AD72", "#EDB596", "#93B0A0", "#C9A063"];
const BLOBS = [
  "M60 8 C88 6 112 26 110 56 C108 88 84 112 54 108 C24 104 6 82 10 52 C14 24 34 10 60 8 Z",
  "M56 6 C90 10 114 34 108 64 C102 96 72 114 44 104 C16 94 4 66 12 40 C20 16 34 4 56 6 Z",
  "M64 10 C94 16 110 44 102 72 C94 100 64 112 38 102 C12 92 6 60 16 36 C26 14 42 6 64 10 Z",
];

export function Blot({ i }: { i: number }) {
  return (
    <svg viewBox="-10 -10 140 140" aria-hidden="true">
      <path d={BLOBS[i % BLOBS.length]} fill={TINTS[i]} opacity="0.92" filter={`url(#wc-${(i % 6) + 1})`} />
    </svg>
  );
}
