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
- 🔔 **Push notification** — notifikasi ke lock screen HP saat deadline mendekati (1 hari / 1 jam / 30 menit), backend Vercel serverless + Vercel KV

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
├─ api/               # Vercel serverless functions (push notification backend)
│  ├─ _lib/           # Shared: webpush.ts (kirim push), kv.ts (Vercel KV client)
│  ├─ subscribe.ts    # Simpan push subscription + deadline
│  ├─ unsubscribe.ts  # Hapus subscription/note
│  └─ cron/           # Cron job (setiap 5 menit)
│     └─ check-deadlines.ts  # Cek deadline → kirim push ke HP
├─ public/            # Aset statis (ikon PWA, favicon, logo, handler push)
│  ├─ favicon-180.png
│  ├─ favicon-192.png
│  ├─ favicon-512.png
│  ├─ favicon.png
│  ├─ logo.svg
│  └─ push-handler.js # Event push/notificationclick untuk service worker
├─ src/
│  ├─ components/     # Komponen UI (Header, NoteList, NoteItem, SearchBar, modal, dll)
│  ├─ context/        # NoteContext
│  ├─ hooks/          # useNotes, useAlarm, useAlarmSettings, useTheme
│  ├─ tokens/         # Kategori warna (single source)
│  ├─ types/          # Definisi tipe Note
│  ├─ utils/          # storage, alarmDb (IndexedDB), audioAlarm (Web Audio/MP3), dateUtils, pushManager (push notifications)
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ index.css       # Tokens warna (light/dark), tipografi, scrollbar
├─ index.html
├─ tailwind.config.js
├─ vite.config.ts     # Konfigurasi Vite + vite-plugin-pwa (Workbox)
└─ design-system/     # Dokumentasi & aset identitas visual
   └─ catatku/MASTER.md
```

> **PWA (offline-ready):** `vite-plugin-pwa` + Workbox otomatis meng-generate `sw.js`, `workbox-*.js`, dan `manifest.webmanifest` ke `dist/` saat `npm run build`. Aset yang di-pre-cache: semua bundle JS/CSS, HTML shell, ikon, dan logo. Service worker di-generate dari konfigurasi `vite.config.ts`, lalu meng-import `public/push-handler.js` untuk menampilkan notifikasi push.

> **Push Notification:** Vercel serverless functions (`api/`) mengirim push notification ke lock screen HP saat deadline mendekati. Cron job berjalan setiap 5 menit via Vercel Cron. Pengingat dikirim sekali per jendela waktu: 1 hari (≤24 jam), 1 jam (≤60 menit), dan 30 menit (≤30 menit) sebelum tenggat. Butuh VAPID keys + Vercel KV database.

## Penyimpanan Data

- **localStorage** — catatan, preferensi tema, dan pengaturan alarm.
- **IndexedDB** — file audio MP3 untuk alarm (tetap tersimpan walau browser ditutup).
- Semua data tersimpan **lokal di perangkat**; gunakan fitur **Backup** (`Ekspor`) untuk mencadangkan ke file JSON.

## Design System

Spesifikasi lengkap (warna, tipografi, spacing, logo, aksesibilitas) ada di
[`design-system/catatku/MASTER.md`](design-system/catatku/MASTER.md).

## Push Notification Setup

Push notification **hanya aktif setelah aplikasi di-deploy ke Vercel** (endpoint `/api/*` dan cron tidak tersedia di `npm run dev`). Alarm in-app tetap berjalan di browser selama tab terbuka.

1. **Generate VAPID Keys:**
   ```bash
   npx web-push generate-vapid-keys
   ```

2. **Aktifkan Vercel KV:**
   - Vercel Dashboard → Storage → Create Database → KV → Connect to project

3. **Set Environment Variables di Vercel** (Project → Settings → Environment Variables):
   - `VITE_VAPID_PUBLIC_KEY` = public key (dibutuhkan saat build, untuk browser)
   - `VAPID_PUBLIC_KEY` = public key (dipakai server saat kirim push)
   - `VAPID_PRIVATE_KEY` = private key — **jangan pernah commit**
   - `CRON_SECRET` = string acak (verifikasi request cron)

4. **Deploy:**
   ```bash
   git push  # Vercel auto-deploy + cron job aktif
   ```

5. **Aktifkan di perangkat:**
   - Android/Chrome: buka aplikasi → klik 🔔 di Header → izinkan notifikasi
   - iPhone: Safari → Share → **Add to Home Screen** → buka PWA → klik 🔔 → izinkan notifikasi (iOS 16.4+)
   - Centang 🔔 pada tugas yang ingin diingatkan, atau aktifkan di form saat membuat/edit tugas

6. **Coba cepat:** buat tugas dengan tenggat ±32 menit lagi. Notifikasi "1 Jam Lagi" akan sampai dalam maksimal 5 menit, lalu "30 Menit Lagi" saat waktunya tiba.

> Matikan 🔔 di Header untuk berhenti mengirim notifikasi sekaligus menghapus data subscription di server. Menandai tugas selesai atau menghapus tugas juga menghentikan pengingatnya.

## Lisensi

[MIT](LICENSE)
