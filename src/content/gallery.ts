// Fotos de la sección Trabajos de cada página (compartido entre las galerías, el sitemap y los datos estructurados).
import type { Page } from "./routes";

// Inicio (negocios): el pueblo y su montaña, lo que también le sirve a un alojamiento.
export const CHALTEN = ["torre-bn-nubes", "refugio-mates-cartas", "nevada-refugio-bn"];
// Expediciones (agencias): lo que vive el grupo en el glaciar.
export const GLACIER = ["carpa-glaciar-2", "cruce-cuerda-rio", "esquiadora-valle-laguna", "tormenta-bn-brazos"];
// Gastronomía (Buenos Aires): la serie que más le habla a restaurantes y cafés.
export const FOOD_COLS = [
  ["caraotas-queso-hoja"],
  ["tajadas-queso-hoja", "tequenos-plato"],
  ["arepa-carne", "ensalada-cuencos"],
];
// Salidas grupales en Mendoza. Selección corta: menos fotos, más fuertes.
export const MENDOZA_COLS = [
  ["grupo-cresta-amanecer", "travesia-bn-nieve"],
  ["retrato-bn-cuerda", "luna-cerro-nevado"],
  ["tres-ladera-nevada", "valle-atardecer-rosa"],
];

// Galería horizontal y serie en columnas de cada página.
export const GALLERY: Record<Page, { strip: string[]; series: { id: string; cols: string[][] } }> = {
  home: { strip: CHALTEN, series: { id: "gastronomia", cols: FOOD_COLS } },
  expeditions: { strip: GLACIER, series: { id: "mendoza", cols: MENDOZA_COLS } },
};

export const galleryPhotos = (page: Page) => [...GALLERY[page].strip, ...GALLERY[page].series.cols.flat()];
