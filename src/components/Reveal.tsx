"use client";

import { motion, useReducedMotion } from "motion/react";

// Aparición suave al entrar en pantalla.
export function Reveal({
  children,
  delay = 0,
  className,
  y = 28,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  as?: "div" | "li" | "article";
}) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  );
}

// Titular de marca en dos líneas: la segunda en itálica color lenga. Cada línea sube desde una máscara.
// La animación se dispara desde el bloque (no desde cada línea): una línea escondida dentro de su
// máscara nunca "entra en pantalla" para el IntersectionObserver.
const lineVariants = {
  hidden: { y: "105%" },
  show: (i: number) => ({ y: "0%", transition: { duration: 1.25, delay: 0.08 + i * 0.14, ease: [0.16, 1, 0.3, 1] as const } }),
};

export function Title({
  id,
  eyebrow,
  line1,
  line2,
  light = false,
  center = false,
  as: H = "h2",
}: {
  id?: string;
  eyebrow?: string;
  line1: string;
  line2: string;
  light?: boolean;
  center?: boolean;
  as?: "h2" | "h3";
}) {
  const reduce = useReducedMotion();
  const line = (text: string, i: number, cls?: string) => (
    <span className={`line ${cls ?? ""}`}>
      <motion.span style={{ display: "inline-block" }} variants={lineVariants} custom={i}>
        {text}
      </motion.span>
    </span>
  );
  return (
    <motion.div
      className={`title-block ${light ? "is-light" : ""} ${center ? "is-center" : ""}`}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {eyebrow && (
        <motion.p
          className="eyebrow"
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
        >
          {eyebrow}
        </motion.p>
      )}
      <H id={id} className="display h2">
        {line(line1, 0)}
        {line(line2, 1, "accent")}
      </H>
    </motion.div>
  );
}
