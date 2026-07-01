# Habit Shaper — Entry Point Claude Code

@AGENTS.md

## Catatan Khusus untuk Claude Code

- Ini coding test dengan penilaian eksplisit pada Git History — commit di titik logis, jangan menumpuk banyak perubahan jadi satu commit besar.
- Gunakan **Plan Mode** sebelum mulai modul baru (Auth, Habit CRUD, Tracking Logic, dst) — tunjukkan rencana file yang akan dibuat/diubah dulu.
- Baca `docs/PRD_HabitShaper.md` bagian Data Model & API Routes sebelum menulis kode backend — jangan improvisasi skema di luar yang sudah disepakati di PRD.
- Sebelum menandai task "Selesai", jalankan `docker compose up --build` dari root dan pastikan tidak ada error — itu bukti verifikasi minimal yang wajib.
- Kalau pindah dari modul backend ke frontend (atau sebaliknya), simpan progress ke file implementation/task terkait dulu, baru `/clear`.
