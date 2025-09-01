# Drafts

## Deskripsi

Folder `drafts` menampilkan email yang disimpan sebagai draft. Halaman menggunakan `EmailLayout` dengan `folderName="draft"`.

## Fungsionalitas

- Daftar draft email.
- Membuka detail draft (`/draft/:uid`) — detail page menggunakan `EmailDetail` component.
- Seleksi dan aksi toolbar mirip inbox.

## Komponen React yang Terlibat

- `src/pages/DraftsPage.jsx`
- `src/components/layout/EmailLayout.jsx`
- `src/components/email/EmailList.jsx`
- `src/components/email/EmailItem.jsx`

## State / Context yang Digunakan

- `EmailContext` dan state lokal `EmailLayout`.

## API Terkait

- `GET /api/emails/all` → group `draft` di `EmailContext`.

## Validasi & Error

- Sama seperti Inbox.

## Status

- [x] **Belum selesai** — aksi toolbar ke backend belum di implementasi

## Screenshot

> _Sama Seperti Inbox_
