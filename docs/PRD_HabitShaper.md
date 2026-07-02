# Product Requirements Document (PRD) & Technical Architecture

**Project:** Habit Shaper
**Version:** 1.0.0
**Konteks:** Engineering Coding Test — Datasaur.ai
**Stack:** NestJS (TypeScript) + Prisma + MySQL 8 | React + Tailwind CSS | Docker Compose

---

## 1. Business Overview

Habit Shaper adalah aplikasi web ringan untuk membangun kebiasaan positif (*build*) dan menghentikan kebiasaan negatif (*break*) lewat pelacakan harian dan sistem streak. Target pengguna: individu yang ingin melacak progres personal (meditasi, olahraga, belajar bahasa, berhenti merokok, dll). Tidak ada monetisasi — ini scope evaluasi teknis, fokus ke kebenaran logika dan kerapian implementasi, bukan fitur bisnis.

### 1.1. Fitur Utama (Core Features)

**A. Habit Building**
* Buat habit bertipe "build" (misal: meditasi, olahraga).
* Tandai selesai (*completed*) untuk hari ini.
* Streak = jumlah hari berturut-turut tanpa putus dengan status completed.
* Weekly completion rate = berapa hari terpenuhi vs berapa hari terlewat dalam 7 hari terakhir.

**B. Habit Breaking**
* Buat habit bertipe "break" (misal: merokok, doomscrolling).
* Streak "bersih" (*clean streak*) = jumlah hari berturut-turut tanpa relapse, dimulai dari hari habit dibuat.
* User bisa menandai "relapse" pada hari tertentu → streak reset, hitungan mulai lagi dari hari itu (Day 1).

**C. Goal Management**
* CRUD goal (tambah, edit nama, hapus).
* Setiap goal terikat ke satu habit dengan tipe `build` atau `break` (tipe ditentukan saat create, tidak bisa diubah setelahnya — ubah tipe berarti hapus & buat goal baru, supaya histori streak tidak ambigu).

### 1.2. Fitur Tambahan / Rencana Masa Depan (Opsional — di luar scope 3 hari)

* Refresh token & httpOnly cookie untuk auth (versi sekarang pakai Bearer token demi kesederhanaan sesuai spek "lightweight").
* Notifikasi/reminder harian.
* Grafik histori streak jangka panjang.

---

## 2. Technical Infrastructure

### 2.1. Stack Teknologi

* **Backend:** NestJS (TypeScript), modular (AuthModule, HabitsModule, PrismaModule)
* **ORM:** Prisma — schema di `backend/prisma/schema.prisma`, migration otomatis jalan saat container start
* **Database:** MySQL 8
* **Frontend:** React (Vite) + Tailwind CSS
* **Auth:** Email + password, hash dengan bcrypt, JWT (Bearer token di header `Authorization`), tanpa verifikasi email sesuai spek
* **Containerization:** Docker Compose — 3 service (`mysql`, `backend`, `frontend`), satu perintah `docker compose up` dari root

### 2.2. Arsitektur

```
[Browser] → [frontend: React SPA, port 3000]
                    │  (REST, fetch ke VITE_API_URL)
                    ▼
            [backend: NestJS API, port 4000]
                    │  (Prisma Client)
                    ▼
            [mysql: MySQL 8, port 3306 internal]
```

* `frontend` di-serve lewat Vite preview / static server di dalam container (tidak perlu Nginx terpisah demi kesederhanaan).
* `backend` menjalankan `npx prisma migrate deploy` otomatis sebagai bagian dari container startup command, sebelum `node dist/main.js` — ini yang memenuhi syarat "schema bootstrap must run automatically on first boot".
* `mysql` pakai named volume untuk persistensi data + healthcheck, `backend` punya `depends_on: mysql (condition: service_healthy)` supaya tidak race condition saat migrate.

### 2.3. Environment Variables (untuk `.env.example`)

```
# Database
MYSQL_ROOT_PASSWORD=changeme
MYSQL_DATABASE=habit_shaper
MYSQL_USER=habit_shaper
MYSQL_PASSWORD=changeme
DATABASE_URL=mysql://habit_shaper:changeme@mysql:3306/habit_shaper

# Backend
JWT_SECRET=changeme_supersecret
PORT=4000

# Frontend
VITE_API_URL=http://localhost:4000
```

---

## 3. Database Schema (Prisma)

```prisma
model User {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  habits       Habit[]
}

enum HabitType {
  BUILD
  BREAK
}

model Habit {
  id        Int           @id @default(autoincrement())
  userId    Int
  user      User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  name      String
  type      HabitType
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
  entries   HabitEntry[]
}

enum EntryKind {
  COMPLETED   // untuk habit tipe BUILD
  RELAPSED    // untuk habit tipe BREAK
}

model HabitEntry {
  id        Int       @id @default(autoincrement())
  habitId   Int
  habit     Habit     @relation(fields: [habitId], references: [id], onDelete: Cascade)
  date      DateTime  @db.Date
  kind      EntryKind
  createdAt DateTime  @default(now())

  @@unique([habitId, date])
}
```

### 3.1. Logika Perhitungan (dicatat di sini supaya konsisten dipakai backend & tidak diinterpretasi ulang oleh AI di sesi berbeda)

* **BUILD — current streak:** hitung mundur dari hari ini (atau kemarin jika hari ini belum ditandai), selama ada `HabitEntry` berkind `COMPLETED` di tanggal berurutan tanpa jeda. Berhenti di jeda pertama.
* **BUILD — weekly completion rate:** dalam periode 7 hari terakhir (termasuk hari ini), `jumlah entry COMPLETED / 7`. Missed days = `7 - jumlah entry COMPLETED`.
* **BREAK — clean streak:** `jumlah hari antara MAX(tanggal relapse terakhir, createdAt habit) dan hari ini`. Kalau belum pernah relapse, streak dihitung sejak `createdAt`.
* **BREAK — relapse:** insert `HabitEntry` berkind `RELAPSED` di tanggal yang ditandai (default: hari ini). Baseline streak otomatis bergeser ke tanggal relapse tersebut pada perhitungan berikutnya — tidak perlu ada kolom terpisah untuk "reset".

---

## 4. API Routes

### A. Auth
* `POST /auth/register` | Body: `{ email, password }` | Return: `{ user: { id, email }, accessToken }`
* `POST /auth/login` | Body: `{ email, password }` | Return: `{ accessToken }`
* `GET /auth/me` | Header: `Authorization: Bearer <token>` | Return: `{ id, email }`

### B. Habits (semua protected, scoped ke user dari token)
* `GET /habits` | Return: list habit + stats terkomputasi (`currentStreak`, dan `weeklyCompletionRate` untuk BUILD atau `cleanStreak` untuk BREAK)
* `POST /habits` | Body: `{ name, type: "BUILD" \| "BREAK" }` | Return: habit baru
* `PATCH /habits/:id` | Body: `{ name }` | Return: habit terupdate (tipe tidak bisa diubah lewat endpoint ini)
* `DELETE /habits/:id` | Return: 204
* `POST /habits/:id/complete` | Body: `{ date? }` (default hari ini) | Hanya valid untuk tipe BUILD, 400 jika bukan | Return: entry baru + streak terbaru
* `POST /habits/:id/relapse` | Body: `{ date? }` (default hari ini) | Hanya valid untuk tipe BREAK, 400 jika bukan | Return: entry baru + streak terbaru (ter-reset)
* `GET /habits/:id/stats` | Return: detail histori entry + breakdown mingguan (untuk keperluan tampilan grafik/kalender sederhana di frontend)

---

## 5. UI/UX Notes & Design Taste

Seluruh antarmuka pengguna wajib mengikuti panduan di [design-guidelines.md](file:///d:/Asbud%20Jaya%20Tech/habit-shaper/docs/designs/design-guidelines.md) untuk menjaga kualitas visual premium dan menghindari pola desain template/cliché (anti-slop).

* **Tema & Konsistensi Warna:** Menggunakan basis warna netral (seperti *Zinc* atau *Slate*) yang konsisten di semua halaman. Warna aksen dikunci:
  * **BUILD Habit:** Emerald / Teal (`text-emerald-500` / `bg-emerald-500`) untuk melambangkan pertumbuhan/keberhasilan.
  * **BREAK Habit:** Rose / Brick Red (`text-rose-500` / `bg-rose-500`) untuk melambangkan pantangan/relapse.
* **Layout & Struktur:**
  * Halaman mencakup: `Login`/`Register` yang bersih dan minimalis, serta `Dashboard` (daftar habit dengan visualisasi streak dan progress mingguan).
  * Menggunakan bento-style layout atau clean grid asimetris untuk menampilkan statistik kebiasaan agar data memiliki ruang bernapas (*visual density* optimal).
  * Aksi harian cepat disediakan langsung pada card masing-masing habit: "Mark Done Today" (BUILD) dan "I Relapsed" (BREAK, dengan modal konfirmasi agar tidak sengaja terpencet).
* **Dark Mode & Responsivitas:**
  * Mendukung visualisasi yang konsisten dalam satu tema (Light/Dark) secara menyeluruh. Tata letak harus responsif dan stabil di browser mobile menggunakan `min-h-[100dvh]` untuk mengantisipasi address bar di iOS.
* **Kelengkapan State:**
  * Wajib mengimplementasikan loading state menggunakan skeleton loaders yang presisi, empty state yang ramah dan memiliki tombol ajakan bertindak (CTA) yang jelas, serta inline error handling pada form login/register dan tambah goal.
* **Standard Larangan:**
  * Tidak menggunakan em-dash (`—`), tidak ada teks CTA yang terlipat menjadi 2 baris pada desktop, dan menerapkan *shape consistency lock* (border-radius yang konsisten di seluruh elemen).

---

## 6. Acceptance Criteria / Definition of Done

* `docker compose up` dari root, tanpa setup manual lain, menghasilkan aplikasi yang bisa diakses di browser (frontend) dan API yang bisa dipanggil (backend).
* Migration Prisma jalan otomatis di first boot — tabel `User`, `Habit`, `HabitEntry` sudah ada tanpa perintah manual.
* User bisa register, login, dapat token, dan mengakses data miliknya saja (tidak bisa lihat/ubah habit user lain).
* Build habit: tandai selesai hari ini → streak bertambah, weekly completion rate ter-update benar.
* Break habit: tandai relapse → streak reset ke 0/Day 1, mulai terhitung ulang dari tanggal relapse.
* Goal (habit) bisa ditambah, diedit nama, dihapus.
* `.env.example` lengkap dengan semua variabel di atas, tidak ada secret asli ter-commit.
* `README.md` berisi command persis untuk menjalankan (`docker compose up --build`) dan daftar env var yang dibutuhkan.
