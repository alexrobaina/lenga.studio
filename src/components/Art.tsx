import art from "@/content/art.generated.json";

type Entry = { w: number; h: number; m?: { w: number; h: number } };
const manifest = art as Record<string, Entry>;

// Ilustración de acuarela "horneada" (scripts/render-illustrations.tsx).
// Se comporta como el SVG original con preserveAspectRatio="xMidYMax slice":
// cubre el contenedor y se apoya abajo. En pantallas verticales usa el recorte para celular.
export default function Art({
  id,
  className,
  position = "50% 100%",
  priority,
}: {
  id: string;
  className?: string;
  position?: string;
  priority?: boolean;
}) {
  const e = manifest[id];
  if (!e) throw new Error(`Ilustración no encontrada: ${id} (correr npm run illustrations)`);
  const mq = "(max-aspect-ratio: 4/5)";
  return (
    <picture className={className}>
      {e.m && <source media={mq} type="image/avif" srcSet={`/art/${id}-m.avif`} />}
      {e.m && <source media={mq} type="image/webp" srcSet={`/art/${id}-m.webp`} />}
      <source type="image/avif" srcSet={`/art/${id}.avif`} />
      <img
        src={`/art/${id}.webp`}
        alt=""
        aria-hidden="true"
        width={e.w}
        height={e.h}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        draggable={false}
        style={{ objectPosition: position }}
      />
    </picture>
  );
}
