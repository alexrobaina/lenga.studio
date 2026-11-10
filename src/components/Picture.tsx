import images from "@/content/images.generated.json";

type Manifest = Record<string, { width: number; height: number; widths: number[]; blur: string }>;
const manifest = images as Manifest;

type Props = {
  id: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  style?: React.CSSProperties;
};

// <picture> con AVIF + WebP en varios anchos (generados por scripts/optimize-images.mjs)
// y un placeholder difuso de fondo mientras carga.
export default function Picture({ id, alt, sizes = "100vw", className, priority, style }: Props) {
  const m = manifest[id];
  if (!m) throw new Error(`Foto no encontrada en el manifiesto: ${id}`);
  const set = (ext: string) => m.widths.map((w) => `/img/${id}-${w}.${ext} ${w}w`).join(", ");
  const fallback = m.widths.includes(1200) ? 1200 : m.widths[m.widths.length - 1];
  return (
    <picture>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={`/img/${id}-${fallback}.webp`}
        alt={alt}
        width={m.width}
        height={m.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        className={className}
        style={{ backgroundImage: `url(${m.blur})`, backgroundSize: "cover", ...style }}
      />
    </picture>
  );
}

export function photoRatio(id: string) {
  const m = manifest[id];
  return m.width / m.height;
}

export function hasPhoto(id: string) {
  return id in manifest;
}
