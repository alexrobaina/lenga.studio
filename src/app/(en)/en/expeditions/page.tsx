import Home from "@/components/Home";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata("en", "expeditions");

export default function Page() {
  return <Home lang="en" page="expeditions" />;
}
