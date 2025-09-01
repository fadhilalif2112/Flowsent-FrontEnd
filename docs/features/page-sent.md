# Sent (Terkirim)

## Deskripsi

Folder untuk menampilkan email yang dikirim pengguna (`sent`). Struktur dan komponen sama dengan Inbox — menggunakan `EmailLayout` dengan `folderName="sent"`.

## Fungsionalitas

- Menampilkan daftar email yang dikirim.
- Klik item membuka detail (`/sent/:uid`).
- Seleksi multi-item dan toolbar sama seperti Inbox.

## Alur Pengguna

1. Buka route `/sent`.
2. Daftar email terkirim diambil dan ditampilkan.
3. Pengguna bisa membuka detail atau melakukan aksi massal.

## Komponen React yang Terlibat

- `src/pages/SentPage.jsx`
- `src/components/layout/EmailLayout.jsx`
- `src/components/email/EmailList.jsx`
- `src/components/email/EmailItem.jsx`

## State / Context yang Digunakan

- `EmailContext` (sumber data)
- Local state untuk seleksi di `EmailLayout`.

## API Terkait (jika ada)

- Data berasal dari `GET /api/emails/all` dan dikelompokkan ke `sent` di `EmailContext`.

## Validasi & Error

- Sama seperti Inbox: handle token 401, loading, error.

## Status

- [x] **Belum selesai** — aksi toolbar ke backend belum di implementasi

## Screenshot

> _Sama Seperti Inbox_
