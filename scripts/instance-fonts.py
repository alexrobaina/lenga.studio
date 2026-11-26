"""Fraunces recortada para la web (26/11/2026).

Next descarga Fraunces variable completa: peso 100–900, tamaño óptico 9–144 y SOFT 0–100
(117 KB la normal y 145 KB la itálica, subset latin). El sitio usa peso 400–600, tamaño óptico
alrededor de 36–60 y SOFT 50 fijo (la Fraunces "domada" de la marca). Este script fija SOFT en 50
y limita peso y tamaño óptico: el mismo dibujo en ~50 KB y ~62 KB, que en celular dejan llegar antes
la ilustración del hero (LCP).

Uso (necesita fonttools y brotli: `pip install fonttools brotli`):
  python3 scripts/instance-fonts.py <fraunces-latin.woff2> <fraunces-latin-italic.woff2>

Las fuentes de origen son el subset "latin" de Google Fonts (las que bajaba next/font/google).
Escribe src/lib/fonts/fraunces-latin.woff2 y src/lib/fonts/fraunces-latin-italic.woff2.
"""
import sys
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

LIMITS = {"SOFT": 50, "wght": (400, 600), "opsz": (18, 72)}
OUT = Path(__file__).resolve().parent.parent / "src" / "lib" / "fonts"


def instance(src: str, name: str) -> None:
    font = instancer.instantiateVariableFont(TTFont(src), LIMITS)
    font.flavor = "woff2"
    dest = OUT / name
    font.save(dest)
    print(f"✓ {dest.name}: {dest.stat().st_size // 1024} KB")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    OUT.mkdir(parents=True, exist_ok=True)
    instance(sys.argv[1], "fraunces-latin.woff2")
    instance(sys.argv[2], "fraunces-latin-italic.woff2")
