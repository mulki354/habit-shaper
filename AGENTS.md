# Aturan Eksekusi Proyek (Sangat Penting)

Aturan ini berlaku secara menyeluruh untuk ekosistem proyek **Habit Shaper** di dalam *workspace* utama (`habit-shaper`). Proyek ini berupa **satu repository** dengan folder `backend/` (NestJS) dan `frontend/` (React) di dalamnya.

Dibaca otomatis oleh AI Agent yang mendukungnya (Claude Code via import di `CLAUDE.md`, Antigravity secara native).

---

## Konteks Proyek (Coding Test)

- Ini adalah **technical test** untuk proses rekrutmen di Datasaur.ai, dikerjakan solo dalam **3 hari**.
- Evaluator menilai 4 aspek: **Agentic Development** (cara AI agent dipakai), **Code Quality**, **Completeness**, **Git History** (commit yang bercerita).
- **Konsekuensi langsung buat AI Agent:** dokumentasi di `docs/` dan disiplin commit per-task BUKAN formalitas — ini bagian yang dinilai. Jangan lewati langkah update PRD/Implementation demi "cepat selesai".

---

## Hierarki Dokumen Proyek

| Level | File | Fungsi |
|---|---|---|
| 0 (Meta) | `AGENTS.md` (file ini) | Aturan Main. Dibaca otomatis di setiap sesi. |
| 1 (Tertinggi) | `docs/PRD_HabitShaper.md` | Arsitektur utama, data model, API routes. Semua keputusan teknis mengacu ke sini. |
| 2 | `docs/implementations/[YYYYMMDD]_implementation_[modul].md` | Rencana implementasi per modul (backend/frontend). |
| 3 | `docs/tasks/[YYYYMMDD]_tasks_[tipe]_[nama]/` | Batch eksekusi — penanda waktu satu fase pekerjaan. |
| 4 (Terendah) | `[YYYYMMDD]_task_[nomor]_[nama].md` | Detail task: instruksi, changelog, bukti verifikasi. |

---

## Aturan Kerja

1. **Mulki** yang menulis/mengetik kode utama. AI Agent hanya memberikan arahan, potongan kode, dan instruksi detail di mana file tersebut harus disimpan.
2. AI Agent **DILARANG KERAS** mengeksekusi tool untuk mengubah kode secara langsung, **KECUALI** Mulki secara eksplisit memerintahkan "tolong ubah/perbaiki kodenya".
3. Perubahan kode dilakukan **sekali jalan** per instruksi (pakai sistem Confirmation/Accept Diff di IDE), bukan berjalan terus tanpa henti.
4. Pengerjaan **bertahap per-Task**. Setiap task kecil selesai → *local testing* dulu → baru lanjut.
5. **Ceklis, Changelog, dan BUKTI (wajib).** Task dinyatakan selesai HANYA jika ada:
   - Status ceklis diperbarui di file task.
   - Changelog file yang berubah.
   - Bukti verifikasi (output test, hasil `docker compose up`, atau screenshot). Tidak ada status "Selesai" tanpa bukti.
6. **Commit setiap task selesai**, dengan pesan yang jelas dan menyebut nomor task, contoh: `feat(backend): task 1.3 - modul autentikasi (register/login)`. Commit kecil dan sering — ini yang dinilai sebagai "Git History".
7. **Struktur folder `docs/`:**
   - `docs/implementations/` — roadmap per modul, awalan tanggal, living document.
   - `docs/designs/` — referensi UI (opsional untuk proyek se-simple ini, boleh cuma catatan warna/layout singkat).
   - `docs/tasks/` — folder batch eksekusi, terkunci setelah selesai (JANGAN dimodifikasi task lama).
8. **Hierarki Update:** setiap ada penambahan/perubahan scope → `PRD (Level 1) → Implementation (Level 2) → Task Batch Baru (Level 3) → Detail Task (Level 4)`. Jangan buat task tanpa update Implementation & PRD dulu.
9. **Jangan Auto-Import Dokumen yang Bertumbuh.** `PRD`, `implementations/`, `tasks/` TIDAK di-`@import` ke `AGENTS.md`/`CLAUDE.md` — dibaca manual sesuai kebutuhan supaya context tetap ringkas.
10. **Docker Compose adalah kontrak, bukan opsional.** Setiap task yang menyentuh env var, port, atau service baru WAJIB sinkron dengan `compose.yml` dan `.env.example` di root — jangan sampai di akhir baru ketahuan tidak nyambung.
