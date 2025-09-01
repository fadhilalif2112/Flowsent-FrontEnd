# Trash

## Deskripsi

Folder `trash` (deleted) untuk email yang dihapus (moved to Trash).

## Fungsionalitas

- Daftar email yang dihapus.
- Buka detail email.

## Komponen React yang Terlibat

- `src/pages/TrashPage.jsx`
- `src/components/layout/EmailLayout.jsx`
- `src/components/email/EmailList.jsx`
- `src/components/email/EmailItem.jsx`

## State / Context yang Digunakan

- `EmailContext` dan state lokal `EmailLayout`.

## API Terkait

- `GET /api/emails/all` (untuk memuat folder `deleted` atau `trash`).

## Status

- [x] **Belum selesai** — aksi toolbar ke backend belum di implementasi

## Screenshot

> _Sama Seperti Inbox_
