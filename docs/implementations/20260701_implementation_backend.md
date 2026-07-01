# Rencana Implementasi: Backend (NestJS + Prisma + MySQL)

Mengacu ke `docs/PRD_HabitShaper.md`. Dikerjakan bertahap, tiap task diikuti local testing sebelum lanjut.

### Task 1.1: Inisialisasi Proyek + Docker Compose Skeleton
- **Arahan:** `nest new backend` (TypeScript), setup `compose.yml` di root dengan 3 service (mysql, backend, frontend placeholder), `.env.example`. Backend belum perlu logic apa pun, cukup healthcheck endpoint (`GET /health`).
- **Testing:** `docker compose up --build` berhasil, `mysql` sehat, `backend` bisa diakses di `GET /health`.

### Task 1.2: Setup Prisma + Schema + Auto-Migration
- **Arahan:** Install Prisma, tulis `schema.prisma` sesuai PRD (User, Habit, HabitEntry, enum). Buat migration awal. Konfigurasi startup command backend supaya `prisma migrate deploy` jalan otomatis sebelum server start (lihat PRD bagian 2.2).
- **Testing:** `docker compose up` dari kondisi database kosong → tabel otomatis terbentuk tanpa perintah manual tambahan. Cek dengan `docker compose exec mysql mysql -u... -e "SHOW TABLES;"`.

### Task 1.3: Modul Autentikasi (Register/Login)
- **Arahan:** `AuthModule` — `POST /auth/register`, `POST /auth/login`, `GET /auth/me`. Hash password dengan bcrypt, JWT via `@nestjs/jwt` + `passport-jwt`. Guard `JwtAuthGuard` untuk endpoint protected.
- **Testing:** Register user baru → login dapat token → `GET /auth/me` dengan token berhasil, tanpa token 401.

### Task 1.4: Modul Habits — CRUD
- **Arahan:** `HabitsModule` — `GET/POST /habits`, `PATCH/DELETE /habits/:id`. Semua scoped ke `req.user.id`. Validasi input pakai `class-validator` (DTO).
- **Testing:** Create habit BUILD & BREAK, list hanya menampilkan milik user yang login, coba akses habit user lain → 403/404.

### Task 1.5: Modul Habits — Tracking Logic (Complete/Relapse + Streak)
- **Arahan:** `POST /habits/:id/complete`, `POST /habits/:id/relapse`, `GET /habits/:id/stats`. Implementasikan logika streak & weekly completion rate persis sesuai formula di PRD bagian 3.1. Validasi tipe (complete hanya untuk BUILD, relapse hanya untuk BREAK → 400 jika salah).
- **Testing:** Tandai completed 3 hari berturut → streak = 3. Skip 1 hari → streak reset ke 0 di hari berikutnya. Untuk BREAK: relapse hari ini → clean streak = 0, besok jadi 1.

### Task 1.6: Error Handling, Validation Pipe, CORS
- **Arahan:** Global `ValidationPipe`, exception filter supaya response error konsisten (format JSON seragam), aktifkan CORS untuk origin frontend (`VITE_API_URL` / `FRONTEND_URL` dari env).
- **Testing:** Request dengan body invalid → 400 dengan pesan jelas. Request dari frontend (browser) tidak kena CORS block.

<!--
  Task lanjutan (integrasi penuh dengan frontend, seed data contoh, dll)
  ditambahkan di sini sebagai roadmap jika perlu, detail eksekusinya
  tetap di docs/tasks/ terpisah.
-->
