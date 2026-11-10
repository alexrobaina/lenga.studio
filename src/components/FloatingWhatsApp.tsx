"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { whatsappHref } from "@/content/site";

// Botón de WhatsApp siempre a mano: aparece después del paisaje inicial
// y se esconde al llegar a Contacto (ahí ya está el botón grande).
export default function FloatingWhatsApp({ label, message }: { label: string; message: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const contact = document.getElementById("contacto");
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.9;
      const atContact = contact ? contact.getBoundingClientRect().top < window.innerHeight * 0.7 : false;
      setShow(past && !atContact);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
