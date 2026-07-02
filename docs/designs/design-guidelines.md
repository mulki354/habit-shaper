# Anti-Slop Frontend Design Guidelines

Diambil dari standard design-taste-frontend untuk memastikan kualitas visual dan kegunaan antarmuka pengguna (UI/UX) premium pada Habit Shaper.

## 1. Konfigurasi Awal (Design Dials)
Untuk Habit Shaper (Aplikasi Manajemen Kebiasaan Personal):
* **`DESIGN_VARIANCE: 6`** - Menengah (Tata letak bersih, sedikit asimetris agar terasa personal dan hidup).
* **`MOTION_INTENSITY: 5`** - Menengah (Animasi mikro, scroll reveal, dan transisi modal yang halus, tidak mengganggu).
* **`VISUAL_DENSITY: 4`** - Menengah (Data kebiasaan bernapas dengan lega, ruang putih cukup, visualisasi statistik terfokus).

---

## 2. Pilihan Warna & Tipografi

### A. Tipografi
* **Display / Headlines:** Menggunakan font modern (seperti *Geist*, *Outfit*, atau *Satoshi*).
* **Body / Paragraphs:** Keterbacaan tinggi, warna kontras yang aman (misal: `text-zinc-600` di light mode, `text-zinc-400` di dark mode), `max-w-[65ch]`.
* **SANS DISPLAY DEFAULT:** Menghindari *Inter* sebagai default utama agar tidak terlihat seperti template standar AI. Kita gunakan font yang lebih berkarakter.
* **ITALIC DESCENDER CLEARANCE:** Bila menggunakan font miring (*italic*) pada teks display yang memiliki huruf berekor (`y g j p q`), pastikan line-height minimal `leading-[1.1]` agar tidak terpotong.

### B. Palet Warna (Color Calibration)
* **Monochrome Base:** Menggunakan basis warna netral yang konsisten (seperti *Zinc* atau *Slate*). Tidak mencampur warna abu-abu hangat (*Stone*) dengan abu-abu dingin (*Slate*).
* **Accents:** 
  * **BUILD Habit:** Emerald / Teal (`text-emerald-500` / `bg-emerald-500`).
  * **BREAK Habit:** Rose / Brick Red (`text-rose-500` / `bg-rose-500`).
* **ANTI LILA-GLOW:** Menolak tren AI-Purple glow / neon gradients tanpa arah yang jelas.
* **COLOR CONSISTENCY LOCK:** Satu warna aksen utama yang telah ditentukan dipakai di seluruh halaman, tidak ada inkonsistensi.

---

## 3. Disiplin Layout & Interaktivitas

### A. Layout
* **Hero Section:** Harus muat di dalam viewport awal (*initial viewport*). Judul maksimal 2 baris, deskripsi maksimal 20 kata. Navigasi maksimal setinggi 80px dan berbaris satu baris di layar desktop.
* **Bento Grid:** Jika digunakan untuk menampilkan statistik atau cards, harus seimbang dan tidak memiliki kotak kosong/placeholders. Setiap kotak harus memiliki keragaman latar belakang (warna, teks, visual).
* **ZIGZAG ALTERNATION CAP:** Tidak menggunakan pola zigzag (gambar-kiri teks-kanan, lalu gambar-kanan teks-kiri) lebih dari 2 kali berturut-turut.

### B. Materialitas & Kerapian UI
* **SHAPE CONSISTENCY LOCK:** Menentukan satu skala border-radius yang sama untuk semua elemen (misalnya: cards radius 16px `rounded-2xl`, tombol-tombol radius 8px `rounded-lg`). Jangan mencampur tombol bulat penuh dengan card kotak bersudut tajam secara acak.
* **BUTTON CONTRAST CHECK:** Pastikan teks tombol sangat kontras dengan latar belakangnya (memenuhi standar WCAG AA 4.5:1).
* **CTA BUTTON WRAP BAN:** Teks pada tombol utama tidak boleh terlipat menjadi 2 baris pada desktop.
* **NO DUPLICATE CTA INTENT:** Jangan menaruh dua tombol dengan maksud yang sama persis tapi label berbeda pada satu halaman (misal: "Start Tracking" dan "Get Started"). Gunakan satu label yang konsisten.

### C. Responsivitas & Stabilitas
* **Viewport Stability:** Menggunakan `min-h-[100dvh]` untuk bagian penuh layar, jangan gunakan `h-screen` agar tidak terpotong atau meloncat di browser mobile (Safari/Chrome iOS).
* **Grid over Flex-Math:** Menggunakan CSS Grid (`grid grid-cols-...`) untuk kolom daripada hitungan manual persentase flexbox.

---

## 4. Keadaan UI Lengkap (Complete UI States)
* **Loading States:** Gunakan skeleton loaders yang bentuknya persis dengan card atau elemen asli yang sedang dimuat, bukan spinner lingkaran berputar biasa.
* **Empty States:** Rancang halaman kosong yang indah dengan teks yang jelas, ikon yang relevan, dan tombol ajakan bertindak (CTA) untuk membuat habit/goal pertama.
* **Error States:** Pesan kesalahan harus manusiawi, diletakkan secara inline di bawah input form, atau berupa toast notification untuk pesan sementara.
* **Tactile Feedback:** Tombol ketika ditekan (`:active`) harus memberikan efek fisik kecil (misal: `active:scale-[0.98]` atau `active:translate-y-[1px]`).

---

## 5. Larangan Keras (Banned List)
* **ZERO em-dashes (`—`):** Dilarang keras menggunakan simbol em-dash di judul, deskripsi, kutipan, maupun tombol. Gunakan pemisah atau tanda baca lain yang rapi.
* **No Center Bias:** Jangan membuat semua layout rata tengah jika desainnya asimetris.
* **No Fake/Div Screenshots:** Jangan membuat screenshot buatan menggunakan div-div kosong yang digambar. Lebih baik gunakan preview komponen asli atau kosongkan sama sekali dengan keterangan yang jelas.
* **No Duplicate Intent:** Menghindari pengulangan aksi/CTA yang tidak perlu.
