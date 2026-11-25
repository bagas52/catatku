/** @type {import('tailwindcss').Config} */

// Kategori warna — single source tersinkron dengan src/tokens/categoryColors.ts
const CATEGORY_COLORS = {
  Kuliah: '#3B6978',
  Tugas: '#8A5A2B', // dikoreksi agar kontras teks >=4.5:1 pada permukaan terang
  Pribadi: '#735A77',
};

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        warn: 'var(--warn)',
        // Category left border accents
        kuliah: CATEGORY_COLORS.Kuliah,
        tugas: CATEGORY_COLORS.Tugas,
        pribadi: CATEGORY_COLORS.Pribadi,
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['Lora', 'Georgia', 'serif'],
        sans: ['Sora', 'system-ui', 'sans-serif'],
      },
      // Elevation tokens — konsisten gunakan ini untuk depth
      boxShadow: {
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.10), 0 4px 6px -4px rgb(0 0 0 / 0.06)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.12), 0 8px 10px -6px rgb(0 0 0 / 0.06)',
      },
      // Radius scale — pakai token ini, jangan nilai bebas ad-hoc
      borderRadius: {
        'radius-xs': '4px',
        'radius-sm': '6px',
        'radius-md': '8px',
        'radius-lg': '12px',
        'radius-xl': '16px',
        'radius-full': '9999px',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
