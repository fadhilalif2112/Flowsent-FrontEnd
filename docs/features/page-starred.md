# Starred (Bintang)

## Deskripsi

Folder yang menampilkan email yang diberi bintang / penting.

## Fungsionalitas

- Daftar email yang bertanda bintang.
- Toggle bintang pada tiap `EmailItem`.
- Buka detail email ber-stared.

## Alur Pengguna

1. Buka route `/starred`.
2. Daftar email bintang ditampilkan.
3. Klik bintang pada item mengubah status starred (state lokal di `EmailItem`).

## Komponen React yang Terlibat

- `src/pages/StarredPage.jsx`
- `src/components/layout/EmailLayout.jsx`
- `src/components/email/EmailList.jsx`
- `src/components/email/EmailItem.jsx`

## State / Context yang Digunakan

- `StarredPage` nantinya mengambil data dari `EmailContext`

## API Terkait

- Bisa di-handle oleh `GET /api/emails/all` (jika backend menandai flag `flagged` / `starred`)

## Status

- [x] **Belum selesai** — logika pengambilan data email belum diterapkan

## Screenshot

> _Belum Selesai_
