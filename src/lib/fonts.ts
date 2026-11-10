import { Figtree, Fraunces } from "next/font/google";

export const serif = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
  variable: "--font-serif",
  display: "swap",
});

export const sans = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
