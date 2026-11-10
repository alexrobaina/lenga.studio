import "../globals.css";
import { sans, serif } from "@/lib/fonts";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata("es");
export { viewport } from "@/lib/metadata";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
