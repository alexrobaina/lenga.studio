"use client";

import { useEffect, useLayoutEffect, useState } from "react";

const useIsoLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function useMedia(query: string) {
  const [match, setMatch] = useState(false);
  useIsoLayout(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}
