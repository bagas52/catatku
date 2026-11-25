# CatatKu — Design System MASTER

> Global source of truth untuk identitas visual CatatKu.
> Aplikasi: Notebook Kuliah Mahasiswa (note-taking + deadline tracking + alarm).
> Stack: React 18 + TypeScript + Vite + Tailwind CSS (dark mode via class).

---

## 1. Prinsip & Arah Visual

- **Identitas**: Warm-minimal + paper-first. Latar krem hangat, permukaan putih, teks tinta cokelat. Terasa seperti notebook/materi kuliah.
- **Aksen**: Sage green (hijau zaitun lembut) sebagai warna utama interaksi. Hangat, tenang, akademik, tidak mencolok.
- **Tipografi**: Sora (heading/sans, modern clean) + Lora (body serif, nyaman dibaca jangka panjang).
- **Mode terang & gelap** didukung penuh via CSS variables (`--bg`, `--surface`, dst.), ditoggle lewat class `.dark`.
- Gaya rujukan (ui-ux-pro-max): **Swiss Modernism** (grid berguna, hierarki rasional, matematis, bersih) dipadukan sentuhan **Editorial akademik**.

### Anti-pattern (hindari)
- Low contrast text (kontras < 4.5:1 untuk teks normal)
- Visual clutter / terlalu banyak aksen sekaligus
- Motion-heavy chrome (app ini produktivitas; jaga animasi subtle)
- Emoji sebagai ikon struktural (pakai Lucide SVG)
- Hardcode warna hex di komponen (wajib lewat token/module)

---

## 2. Color Tokens

Semua warna semantik didefinisikan di `src/index.css` sebagai CSS variables.

| Role | Light | Dark | Kontras teks |
|------|-------|------|--------------|
| `--bg` (latar) | `#FAFAF7` | `#16181A` | — |
| `--surface` (kartu/modal) | `#FFFFFF` | `#1F2225` | — |
| `--ink` (teks utama) | `#1C1B1A` | `#EDEDEA` | 16.4:1 / 13.6:1 ✅ |
| `--muted` (teks sekunder) | `#6B6862` | `#9A968E` | 5.3:1 / 5.4:1 ✅ |
| `--accent` (aksi) | `#3E5C4F` | `#7FA98C` | 7.4:1 / 6.1:1 ✅ |
| `--warn` (peringatan) | `#B85C38` | `#E08A5C` | 4.5:1 / 6.1:1 ✅ |

### Kategori warna (border kiri catatan)
Single source: `src/tokens/categoryColors.ts` — tersinkron dengan `tailwind.config.js`.

| Kategori | Hex | Kontras pada permukaan terang |
|----------|-----|-------------------------------|
| Kuliah | `#3B6978` | 6.0:1 ✅ |
| Tugas | `#8A5A2B` | ≥4.5:1 ✅ (dikoreksi dari `#A26D3F` yang 4.38:1) |
| Pribadi | `#735A77` | 6.1:1 ✅ |

Mapped ke Tailwind: `kuliah`, `tugas`, `pribadi`.

---

## 3. Typography

| Role | Font | Penggunaan |
|------|------|-----------|
| Heading | **Sora** (sans) | Judul, nama app, tombol utama |
| Body | **Lora** (serif) | Isi catatan (`.font-note-body`, line-height 1.6) |
| Sans default | **Sora** | UI umum, label, meta |

- `font-family`: `heading`, `body`, `sans` di Tailwind.
- Body: `line-height 1.6`, `max-w-[70ch]` untuk ukuran paragraf nyaman.
- Hindari teks < `11px`. Micro-text (`12px`/`13px`) untuk meta, jangan untuk konten utama.

### Ukuran
- Judul catatan: `15px` → `16px` (sm+)
- Meta/deskripsi: `12px` → `13px`
- Micro/label: `11px` (badge deadline, tag)

---

## 4. Spacing

Gunakan **8px rhythm** (`4/8px` scale) berbasis Tailwind default.
- Gap/paddings umum: `1` (4px), `1.5` (6px), `2` (8px), `2.5` (10px), `3` (12px), `4` (16px), `5` (20px), `6` (24px)
- Pembagian antar-seksi utama: 16/24/32px (Tailwind `4`/`6`/`8`)
- Konsisten; hindari nilai spasial acak tanpa pola.

---

## 5. Radius & Elevation

### Radius scale (`borderRadius` tokens di tailwind.config)
| Token | Nilai | Pemakaian |
|-------|-------|-----------|
| `radius-xs` | 4px | Kartu/list item (default `rounded`) |
| `radius-sm` | 6px | Tombol kecil, chip |
| `radius-md` | 8px | Modal, kartu (default `rounded-lg`) |
| `radius-lg` | 12px | Elemen aksen besar |
| `radius-xl` | 16px | Container hero |
| `radius-full` | 9999px | FAB, avatar, pill |

Konvensi saat ini: **modal** = `rounded-lg` (8px), **list item** = `rounded` (4px), **FAB** = `rounded-full`.

### Elevation (`boxShadow` tokens)
| Token | Nilai | Pemakaian |
|-------|-------|-----------|
| `shadow-xs` | subtle | List container |
| `shadow-sm` | — | Kartu ringan |
| `shadow-md` | — | Dropdown/context menu |
| `shadow-lg` | — | Elevated card |
| `shadow-xl` | raised | Modal (semua modal pakai ini) |

Modal FAB juga memakai `bg-accent text-white shadow-lg`.

---

## 6. Icon Policy

- **Family**: Lucide (`lucide-react`) — konsisten. Ikuti semantik, bukan hanya bentuk.
- **Ukuran**: ikon UI umum `w-4 h-4`; ikon kecil `w-3.5 h-3.5`; ikon aksi besar `w-5 h-5`.
- **Stroke**: konsisten (default Lucide 2px-ish); jangan campur tipis-tebal dalam satu hierarki.
- **Tidak memakai emoji** sebagai ikon struktural.
- Ikon dekoratif samping teks → `aria-hidden` di pikiran; kontrol ikon → beri label aksesibel (`aria-label`).
- Ikon yang sudah dipakai: `Star` (pin), `MoreVertical` (opsi), `Edit3` (ubah), `Trash2` (hapus), `Sun/Moon` (tema), `Plus` (tambah), `Download` (backup), `BellRing` (uji alarm), `Settings` (pengaturan alarm), `X` (tutup), `CheckCircle2/Circle` (selesai), `Upload/RotateCcw` (backup), `Volume2/Upload/Trash2` (pengaturan alarm).

---

## 7. Logo

Marka logo CatatKu: **notebook terbuka + tanda centang** (unsur "mencatat" & "selesai"), **bukan** huruf "C".

| Aset | Lokasi | Keterangan |
|------|--------|-----------|
| Logo mark (SVG) | `design-system/catatku/logos/catatku-logo-mark.svg` | Varian 1 (direkomendasikan) — notebook terbuka + centang |
| Alternatif (SVG) | `design-system/catatku/logos/catatku-logo-check.svg` | Varian 2 — kertas + garis tulis + centang |
| Dipakai app | `public/logo.svg` | Sumber favicon & header |
| Favicon PNG | `public/favicon*.png`, `site.webmanifest` | 32/180/192/512 |
| Preview galeri | `design-system/catatku/logos/preview.html` | Perbandingan varian ⟶ `logo-options.png` |

**Palet marka** (ikuti token §2):
- Kertas/surface: `#FDFCF8` / `#F7F4EB` (krem paper)
- Sage hijau: `#3E5C4F` (sampul) & `#5F8A71`/`#7FA98C` (centang)
- Garis tulis: `#B9C4B8`; margin merah: `#D9A48A` (aksen hangat)

**Aturan pakai:**
- Header app & favicon memakai marka 32px (kesetaraan optis dengan teks adjacent).
- Jangan mengganti marka dengan teks "C" atau emoji.
- Marka transparan → hapus `role/aria-label` pada inline SVG di dalam komponen ber-`aria-label` orang lain.

---

## 8. Komponen Kunci

| Komponen | File | Karakteristik |
|----------|------|---------------|
| Header | `Header.tsx` | Sticky, blur `backdrop-blur-sm`, border bawah `muted/20` |
| List catatan | `NoteList.tsx` | Container `rounded border shadow-xs`, `divide-y`, border kiri kategori 3px |
| Kartu catatan | `NoteItem.tsx` | `border-l-[3px]` warna kategori, hover `bg-muted/5`, badge deadline `bg-warn text-white` |
| Modal | `*Modal.tsx` | Overlay `bg-ink/50 backdrop-blur-xs`, panel `rounded-lg shadow-xl border-muted/20`, `rounded-lg` |
| Tombol utama | — | `bg-accent text-white hover:opacity-90` |
| FAB mobile | `MobileFab.tsx` | `rounded-full shadow-lg active:scale-95`, tampil < sm |

## 9. Interaksi & State Standar

### Focus ring (aksesibilitas keyboard)
Gunakan `focus-visible` (hanya tampil saat navigasi keyboard), bukan `focus`.

- **Interactive / tombol / ikon**:
  ```
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50
  ```
- **Tombol primer (solid accent)**:
  ```
  focus-visible:ring-2 focus-visible:ring-accent/70
  ```
- **Aksi destruktif (merah)**:
  ```
  focus-visible:ring-2 focus-visible:ring-red-400/70
  ```

### Focus input (form)
Semua input/textarea/select konsisten dengan SearchBar (referensi terlengkap):
```
focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent
```
Berlaku di: SearchBar, NoteFormModal (title, deadline, content).

### Chip / tab aktif
Standar untuk semua chip/tab pill yang memilih opsi (kategori, preset, gelombang, durasi, mode):
```
bg-accent/10 border-accent text-accent   (aktif)
bg-bg/50 border-muted/20 text-muted hover:text-ink   (non-aktif)
```

### Tombol primer
Style konsisten (padding seragam):
```
bg-accent text-white hover:opacity-90 px-3.5 py-1.5 rounded
```
→ berlaku pada "Tambah Catatan", "Simpan", "Uji Bunyi Alarm", "Matikan Alarm", dll. Jangan ubah padding per-komponen.

### Hover
Semua elemen interaktif punya feedback hover halus (`transition-colors` / `transition-opacity`, 150–300ms). Icon button: `hover:bg-muted/10 hover:text-ink`.

---

## 10. Aksesibilitas & Responsive

- Kontras teks ≥ 4.5:1 di kedua mode (lihat §2 — semua lolos setelah koreksi Tugas).
- Ikon/kontrol non-teks kontras ≥ 3:1.
- `prefers-reduced-motion` dihormati; animasi transisi smooth (transition `0.25s ease` untuk tema).
- Fokus keyboard terlihat (`hover:bg-muted/10`, `focus` states).
- Responsive breakpoints: 375px (phone), 768px, 1024px, 1440px.
- Viewport `index.html` **tanpa** `maximum-scale/user-scalable=no` — izinkan pinch-zoom (WCAG reflow/resize).
- Logo header diberi `shrink-0` + teks judul `truncate`/`min-w-0` agar marka tetap persegi 32×32 tanpa mengecil meski di lebar 320px.
- Konten tidak tersembunyi di balik header sticky / FAB (padding bawah main `pb-24 sm:pb-12`).
- Touch target ≥ 44px di mobile untuk kontrol ikon kecil (beri padding tombol).
- Screenshot verifikasi mobile tersimpan di `design-system/catatku/mobile-check/` (iPhone 12/SE, Pixel 5, 320px, iPad).
- **PWA offline-ready**: `vite-plugin-pwa` (Workbox) auto-generate `sw.js` + `manifest.webmanifest` saat `npm run build`. Pre-cache mencakup semua bundle JS/CSS, HTML shell, ikon, dan logo. Konfigurasi di `vite.config.ts` (section `VitePWA`).
- **Push Notification**: Backend Vercel serverless (`api/`) + Vercel KV. Cron job setiap 5 menit via Vercel Cron. Kirim push ke lock screen HP: 1 hari / 1 jam / 30 menit sebelum deadline (jendela waktu terpisah agar tidak double-notify). Service worker hasil Workbox meng-import `public/push-handler.js` untuk event `push` dan `notificationclick`. Toggle per-catatan (ikon 🔔/🔕 di NoteItem, toggle di NoteFormModal). Tombol 🔔 di Header untuk global enable/disable (disable juga uninstall subscription & menghapus data KV). Syarat: PWA ter-install ke Home Screen + izin notifikasi + iOS 16.4+.
- Pengguna dapat menginstall ke Home Screen iPhone/Android: buka di browser → Share/Menu → "Add to Home Screen". PWA terbuka fullscreen seperti native app.

---

## 11. Checklist Pre-Delivery

- [ ] Tidak ada emoji sebagai ikon
- [ ] Semua ikon family Lucide konsisten
- [ ] Token semantic dipakai (tanpa hex hardcode inline di komponen)
- [ ] Kontras teks ≥4.5:1 di light & dark
- [ ] Hover/focus states halus (150–300ms)
- [ ] `prefers-reduced-motion` dihormati
- [ ] Bisa dipakai di 375px–1440px tanpa layout rusak
- [ ] Modal scrim cukup untuk isolasi foreground
