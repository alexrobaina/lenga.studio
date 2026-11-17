"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { whatsappHref } from "@/content/site";

// Botón de WhatsApp siempre a mano: aparece después del paisaje inicial
// y se esconde al llegar a Contacto (ahí ya está el botón grande).
// Mientras se baja leyendo se corre para no tapar texto; vuelve al subir o al frenar.
const IDLE_MS = 700;

export default function FloatingWhatsApp({ label, message }: { label: string; message: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const contact = document.getElementById("contacto");
    let lastY = window.scrollY;
    let idle: ReturnType<typeof setTimeout> | undefined;
    const inRange = () => {
      const past = window.scrollY > window.innerHeight * 0.9;
      const atContact = contact ? contact.getBoundingClientRect().top < window.innerHeight * 0.7 : false;
      return past && !atContact;
    };
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY + 2;
      lastY = y;
      clearTimeout(idle);
      if (!inRange()) return setShow(false);
      if (goingDown) {
        setShow(false);
        idle = setTimeout(() => setShow(inRange()), IDLE_MS);
      } else {
        setShow(true);
      }
    };
    // Estado inicial (por ejemplo, al recargar a mitad de página) en el primer frame.
    const raf = requestAnimationFrame(() => setShow(inRange()));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(idle);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.a
          className="wa-float"
          href={whatsappHref(message)}
          aria-label={label}
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
            <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1c-1-.4-2-1.4-2.4-2.4l1-1-1-2z" />
          </svg>
          <span>{label}</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
