# Rencana Implementasi: Frontend (React + Tailwind)

Mengacu ke `docs/PRD_HabitShaper.md`. Dikerjakan setelah endpoint backend terkait sudah ada (boleh paralel dengan mock data di awal).

### Task 2.1: Inisialisasi Proyek + Tailwind Setup
- **Arahan:** `npm create vite@latest frontend -- --template react-ts`, install & konfigurasi Tailwind CSS. Setup struktur folder dasar (`src/pages`, `src/components`, `src/lib/api.ts`).
- **Testing:** `docker compose up` (service frontend) menampilkan halaman default Vite dengan Tailwind aktif (coba 1 class utility, pastikan ke-styling).

### Task 2.2: Routing + Halaman Login/Register
- **Arahan:** Setup `react-router-dom`. Halaman `/login` dan `/register`, form terhubung ke `POST /auth/login` dan `POST /auth/register`. Simpan `accessToken` (state React + persist ke `localStorage` untuk survive refresh).
- **Testing:** Register user baru dari UI → otomatis login → redirect ke dashboard. Refresh halaman, sesi tetap ada (token masih valid).

### Task 2.3: Dashboard — List Habit
- **Arahan:** Halaman `/dashboard` fetch `GET /habits`, render card per habit (nama, tipe, streak/completion rate). Bedakan visual BUILD vs BREAK (warna aksen sesuai PRD bagian 5).
- **Testing:** Habit yang dibuat lewat backend (atau lewat UI) tampil dengan data streak yang benar.

### Task 2.4: Add / Edit / Delete Goal
- **Arahan:** Modal/form tambah goal (nama + pilih tipe BUILD/BREAK), aksi edit nama, aksi hapus dengan konfirmasi.
- **Testing:** CRUD lengkap dari UI, list ter-update tanpa perlu refresh manual (refetch atau optimistic update).

### Task 2.5: Aksi Harian — Mark Done / Mark Relapse
- **Arahan:** Tombol di tiap card: "Mark Done Today" (BUILD, disabled kalau hari ini sudah ditandai) dan "I Relapsed" (BREAK, dengan konfirmasi karena mereset streak). Panggil endpoint terkait, refresh angka streak setelah aksi.
- **Testing:** Klik mark done → streak & weekly rate berubah sesuai formula PRD. Klik relapse → streak reset ke 0/Day 1, ada state UI yang jelas menunjukkan reset terjadi (bukan cuma angka berubah diam-diam).

### Task 2.6: Polish — Error State, Loading State, Empty State
- **Arahan:** Tampilkan loading spinner saat fetch, pesan error kalau API gagal (misal salah password), empty state kalau user belum punya habit sama sekali ("Belum ada habit, yuk tambah yang pertama").
- **Testing:** Matikan backend sebentar → UI menampilkan error, bukan blank page/crash.

<!--
  Task lanjutan (misal grafik histori, dark mode) hanya ditambahkan
  jika waktu 3 hari masih tersisa setelah semua core feature selesai
  dan sudah lulus acceptance criteria di PRD.
-->
