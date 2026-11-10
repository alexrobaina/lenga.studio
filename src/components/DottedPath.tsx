"use client";

import { useId } from "react";
import { motion, type MotionValue } from "motion/react";

// Sendero punteado que se "dibuja": el punteado real queda fijo y una máscara sólida lo va descubriendo.
export default function DottedPath({
  d,
  progress,
  color = "var(--lenga)",
  width = 3,
  gap = 11,
}: {
  d: string;
  progress?: MotionValue<number>;
  color?: string;
  width?: number;
  gap?: number;
}) {
  const id = "m" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse">
          <motion.path
            d={d}
            stroke="#fff"
            strokeWidth={width * 6}
            strokeLinecap="round"
            fill="none"
            style={progress ? { pathLength: progress } : undefined}
          />
        </mask>
      </defs>
      <path
        d={d}
        stroke={color}
        strokeWidth={width}
        strokeDasharray={`1 ${gap}`}
        strokeLinecap="round"
        fill="none"
        mask={progress ? `url(#${id})` : undefined}
      />
    </>
  );
}
