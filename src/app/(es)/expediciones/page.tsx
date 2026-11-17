import Home from "@/components/Home";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata("es", "expeditions");

export default function Page() {
  return <Home lang="es" page="expeditions" />;
}
