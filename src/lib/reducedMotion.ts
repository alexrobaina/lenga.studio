"use client";

import { useSyncExternalStore } from "react";

// prefers-reduced-motion sin romper la hidratación: el servidor no conoce la preferencia,
// así que durante la hidratación se usa "sin preferencia" (igual que el HTML del servidor)
// y enseguida React vuelve a renderizar con el valor real del navegador.
// (useReducedMotion de Motion devuelve el valor real ya en la hidratación, y React no corrige
// los atributos distintos: con movimiento reducido quedaban títulos y botones ocultos.)
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function useReduceMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
