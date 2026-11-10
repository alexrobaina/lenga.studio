// Logo C2.1 "Agujas" (refinado de C2): horizonte que sube en dos agujas, reflejo en el agua y luna.
export const LOGO_PATH =
  "M8 84 H78 C89 84 95 80 99 73 L113 41 L121.5 14 L129.5 45 L138.5 27 L146 55 L152 62 L157 71 L168 84 H232";
export const LOGO_REFLECTION = "M60 97 H146 M156 97 H184";

type Props = {
  className?: string;
  stroke?: string;
  moon?: string;
  strokeWidth?: number;
  reflection?: boolean;
  title?: string;
};

export function LogoMark({
  className,
  stroke = "currentColor",
  moon = "var(--lenga)",
  strokeWidth = 6,
  reflection = false,
  title,
}: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 110"
      fill="none"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d={LOGO_PATH} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      {reflection && (
        <path d={LOGO_REFLECTION} stroke={stroke} strokeWidth={strokeWidth * 0.44} strokeLinecap="round" opacity={0.65} />
      )}
      <circle cx="198" cy="30" r={strokeWidth > 4 ? 9 : 5.5} fill={moon} />
    </svg>
  );
}
