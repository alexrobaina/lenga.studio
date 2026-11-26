"use client";

import { MotionConfig } from "motion/react";

// Con movimiento reducido, Motion saltea los desplazamientos y deja solo las apariciones.
export default function MotionRoot({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
