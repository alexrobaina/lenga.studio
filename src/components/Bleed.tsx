"use client";

import { useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

// Las fotos aparecen "sangrando" como acuarela húmeda: una mancha de bordes irregulares
// se expande y descubre la imagen. Al terminar se quita la máscara (sin costo extra).
export default function Bleed({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const [done, setDone] = useState(false);
  const state = reduce || done ? "" : inView ? "bleed is-in" : "bleed";
  return (
    <div ref={ref} className={`${state} ${className}`} onTransitionEnd={(e) => e.propertyName.includes("mask") && setDone(true)}>
      {children}
    </div>
  );
}
