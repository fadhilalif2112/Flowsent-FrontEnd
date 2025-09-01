# Archive

## Deskripsi

Folder `archive` berisi email yang diarsipkan. Fungsionalitas serupa folder lainnya (list + detail).

## Fungsionalitas

- Menampilkan daftar email terarsip.
- Aksi archive/unarchive lewat toolbar atau item.
- Buka detail email.

## Komponen React yang Terlibat

- `src/pages/ArchivePage.jsx`
- `src/components/layout/EmailLayout.jsx`
- `src/components/email/EmailList.jsx`
- `src/components/email/EmailItem.jsx`

## State / Context yang Digunakan

### EmailContext

- `EmailContext` (`src/context/EmailContext.jsx`) menyediakan `emails`, `loading`, `error`, dan `refreshEmails`

## API Terkait

- `GET /api/emails/all` → group `archive` di `EmailContext`.

## Status

- **Belum selesai**: Folder archive pada server saat ini belum ada

## Screenshot

> _Belum Selesai_
