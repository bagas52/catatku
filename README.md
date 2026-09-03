# CatatKu — Notebook Kuliah Mahasiswa

Aplikasi pencatat (note-taking) untuk mahasiswa: mencatat materi kuliah, melacak tenggat tugas, dan diingatkan lewat alarm. Dibangun dengan **React + TypeScript + Vite + Tailwind CSS**, berjalan penuh di browser dengan penyimpanan lokal.

## Fitur

- 📝 **Catat materi kuliah** — tulis catatan dengan fokus pada isi (tipografi Lora nyaman dibaca)
- 🗂️ **Kategori** — `Kuliah`, `Tugas`, `Pribadi` dengan aksen warna pada border kiri
- 🔍 **Pencarian & filter** — cari judul dan saring per kategori
- ⏰ **Tenggat & alarm** — atur deadline, aplikasi membunyikan alarm saat mendekati batas
  - 🔔 **Suara alarm kustom** — nada sintetis (Web Audio) **atau** file MP3/audio sendiri (disimpan di IndexedDB)
- ✅ **Tandai selesai** & ⭐ **pin** catatan penting
- 🌗 **Dark mode** penuh (toggle, tersimpan)
- 💾 **Backup/restore** — ekspor & impor data ke file JSON
- 📲 **PWA** — installable ke Home Screen (iPhone/Android), offline-ready via Workbox service worker (auto-update)

## Teknologi

- [React](https://react.dev) 18 • [TypeScript](https://www.typescriptlang.org) 5.5 • [Vite](https://vitejs.dev) 5.4
- [Tailwind CSS](https://tailwindcss.com) 3.4 • [lucide-react](https://lucide.dev) (ikon)
- [vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa) — Workbox-based service worker + manifest (auto-update)
- Font: **Sora** (heading) & **Lora** (konten)
- Penyimpanan: `localStorage` (catatan, tema, pengaturan) + `IndexedDB` (file audio MP3 alarm)

## Prasyarat

- [Node.js](https://nodejs.org) 18+ (direkomendasikan LTS)
- npm (sudah termasuk Node.js)

## Memulai

```bash
# 1. Install dependensi
npm install

# 2. Jalankan dev server
npm run dev
```

Dev server berjalan di **http://localhost:3000** (port dikonfigurasi di `vite.config.ts`).

### Skrip lainnya

| Skrip | Keterangan |
|-------|-----------|
| `npm run dev` | Jalankan dev server (hot-reload) |
| `npm run build` | Build produksi ke folder `dist/` (tsc + vite) |
| `npm run preview` | Pratinjau hasil build produksi |

## Struktur Proyek

```
catatku/
├─ public/            # Aset statis (ikon PWA, favicon, logo)
│  ├─ favicon-180.png
│  ├─ favicon-192.png
│  ├─ favicon-512.png
│  ├─ favicon.png
│  └─ logo.svg
├─ src/
│  ├─ components/     # Komponen UI (Header, NoteList, NoteItem, SearchBar, modal, dll)
│  ├─ context/        # NoteContext
│  ├─ hooks/          # useNotes, useAlarm, useAlarmSettings, useTheme
│  ├─ tokens/         # Kategori warna (single source)
│  ├─ types/          # Definisi tipe Note
│  ├─ utils/          # storage, alarmDb (IndexedDB), audioAlarm (Web Audio/MP3), dateUtils
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ index.css       # Tokens warna (light/dark), tipografi, scrollbar
├─ index.html
├─ tailwind.config.js
├─ vite.config.ts     # Konfigurasi Vite + vite-plugin-pwa (Workbox)
└─ design-system/     # Dokumentasi & aset identitas visual
   └─ catatku/MASTER.md
```

> **PWA (offline-ready):** `vite-plugin-pwa` + Workbox otomatis meng-generate `sw.js`, `workbox-*.js`, dan `manifest.webmanifest` ke `dist/` saat `npm run build`. Aset yang di-pre-cache: semua bundle JS/CSS, HTML shell, ikon, dan logo. Service worker tidak ada di `public/` — seluruhnya di-generate otomatis dari konfigurasi di `vite.config.ts`.

## Penyimpanan Data

- **localStorage** — catatan, preferensi tema, dan pengaturan alarm.
- **IndexedDB** — file audio MP3 untuk alarm (tetap tersimpan walau browser ditutup).
- Semua data tersimpan **lokal di perangkat**; gunakan fitur **Backup** (`Ekspor`) untuk mencadangkan ke file JSON.

## Design System

Spesifikasi lengkap (warna, tipografi, spacing, logo, aksesibilitas) ada di
[`design-system/catatku/MASTER.md`](design-system/catatku/MASTER.md).

## Lisensi

[MIT](LICENSE)
