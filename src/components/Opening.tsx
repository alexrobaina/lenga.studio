"use client";

import { useEffect, useState } from "react";
import type { Dict } from "@/content/dictionaries";
import Hero from "./Hero";

// Sin pantalla de entrada: la página se puede usar desde el primer momento
// y el paisaje se arma en menos de un segundo.
export default function Opening({ t }: { t: Dict }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return <Hero t={t} ready={ready} />;
}
