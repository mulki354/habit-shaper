# Rencana Implementasi: Frontend (React + Tailwind)

Mengacu ke `docs/PRD_HabitShaper.md` dan `docs/designs/design-guidelines.md`. Dikerjakan setelah endpoint backend terkait sudah ada.

### Task 2.1: Inisialisasi Proyek + Tailwind & Theme Setup
- **Arahan:** `npm create vite@latest frontend -- --template react-ts`, install & konfigurasi Tailwind CSS.
  - Setup font premium (seperti Geist, Satoshi, atau Outfit) dan hindari Inter standar.
  - Konfigurasi variabel tema (neutral bases: Zinc/Slate, accents: Emerald & Rose).
  - Terapkan *shape consistency lock* pada config Tailwind (misal: radius rounded-xl/2xl untuk cards, rounded-lg untuk inputs/buttons).
  - Susun struktur folder dasar (`src/pages`, `src/components`, `src/lib/api.ts`).
- **Testing:** `docker compose up` (service frontend) menampilkan halaman default dengan konfigurasi font dan CSS variabel kustom berjalan baik.

### Task 2.2: Routing + Halaman Auth (Login/Register)
- **Arahan:** Setup `react-router-dom`. Halaman `/login` dan `/register` dibuat dengan desain minimalis, form kontras (memenuhi WCAG AA), helper text inline, tanpa label placeholder (label selalu di atas input). Simpan `accessToken` ke state & `localStorage`.
- **Testing:** Register user baru dari UI → otomatis login → redirect ke dashboard. Refresh halaman, sesi tetap bertahan.

### Task 2.3: Dashboard — List Habit & Bento Layout
- **Arahan:** Halaman `/dashboard` fetch `GET /habits`, render card per habit menggunakan bento-style layout atau grid asimetris yang rapi dengan `VISUAL_DENSITY: 4`.
  - Bedakan aksen BUILD (Emerald) vs BREAK (Rose) secara konsisten.
  - Gunakan `min-h-[100dvh]` untuk kestabilan viewport.
  - Tampilkan ringkasan statistik (streak, weekly completion rate) dengan font display yang besar dan berjarak lega.
- **Testing:** Habit yang dibuat tampil di layout grid/bento dengan status streak yang benar.

### Task 2.4: Add / Edit / Delete Goal (Modal & Dialog)
- **Arahan:** Modal tambah goal (nama + tipe BUILD/BREAK) dan edit nama dengan efek transisi halus. Tombol CTA utama tidak boleh terlipat tulisannya (*CTA Button Wrap Ban*), dan pastikan tidak ada maksud tombol ganda (*No Duplicate CTA Intent*).
- **Testing:** Operasi CRUD lengkap dari UI berjalan lancar, daftar habit langsung ter-update secara reaktif.

### Task 2.5: Aksi Harian & Tactile Feedback
- **Arahan:** Tombol aksi harian: "Mark Done Today" (BUILD) dan "I Relapsed" (BREAK, dengan konfirmasi modal transisi).
  - Terapkan efek *tactile feedback* pada tombol-tombol interaktif (`active:scale-[0.98]` atau `active:translate-y-[0.5px]`).
  - Refresh data streak dan statistik secara dinamis setelah aksi berhasil.
- **Testing:** Klik mark done → streak bertambah. Klik relapse → konfirmasi modal muncul → setelah ok, streak ter-reset dengan indikasi visual transisi yang jelas.

### Task 2.6: Premium Polish & Pre-Flight Check
- **Arahan:** Implementasi state pelengkap berkualitas premium:
  - **Loading:** Skeleton loaders presisi (mengikuti bentuk card asli), bukan spinner putar biasa.
  - **Empty State:** Desain dashboard kosong yang ramah dengan ilustrasi/monogram SVG terintegrasi dan CTA yang menonjol.
  - **Error State:** Pesan kesalahan manusiawi (inline/toast).
  - Jalankan verifikasi *Pre-Flight Check* (tidak ada em-dash `—`, kontras tombol memadai, dll).
- **Testing:** Matikan backend → UI menampilkan fallback error yang anggun. Simulasi loading lambat menunjukkan skeleton ter-render pas.

<!--
  Task lanjutan (seperti grafik histori mingguan) hanya ditambahkan
  jika waktu masih tersisa setelah core feature selesai dan lulus verifikasi.
-->
