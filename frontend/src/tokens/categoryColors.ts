// Single source of truth untuk warna aksen kategori.
// Tersinkron dengan tailwind.config.js (CATEGORY_COLORS).
export const CATEGORY_COLORS: Record<string, string> = {
  Kuliah: '#3B6978',
  Tugas: '#8A5A2B',
  Pribadi: '#735A77',
};

export const DEFAULT_CATEGORY_COLOR = CATEGORY_COLORS.Kuliah;
