# Overview — flow-sent (React Webmail Client)

## Deskripsi Proyek

**flow-sent** adalah aplikasi **webmail client** berbasis React.  
Aplikasi ini dirancang untuk memberikan pengalaman mirip layanan email populer, dengan kemampuan login, melihat dan mengelola email berdasarkan folder (Inbox, Sent, Drafts, Starred, Archive, Trash), serta menampilkan detail email dan lampiran.

## Fitur Utama yang sudah dibuat

- **Authentication**

  - Login user dengan email & password (`/api/login`).
  - Logout user (`/api/logout`).
  - Proteksi route (hanya bisa diakses dengan token).

- **Inbox**

  - Menampilkan daftar email masuk.

- **Sent**

  - Daftar email terkirim.

- **Drafts**

  - Daftar email yang disimpan sebagai draft.

- **Starred**

  - Daftar email berbintang (penting).

- **Archive**

  - Daftar email terarsip.

- **Trash**

  - Daftar email yang dihapus (deleted).

- **Email Detail**

  - Tampilan penuh isi email.
  - Header (From, To, Date, Subject).
  - Body text/HTML.
  - Lampiran dengan ikon berdasarkan file type.
  - Toolbar aksi (Reply, Forward, Archive, Delete, Download, Star) masih sebatas UI.

- **Bulk Actions**

  - Seleksi beberapa email sekaligus.
  - Toolbar mass-action (archive, delete, refresh).

- **Routing & Auth Guards**
  - `GuestRoute` untuk halaman login.
  - `ProtectedRoute` untuk halaman utama.

---

## Arsitektur Aplikasi saat ini

- **Frontend**: React + Vite.
- **State Management**: Context API (`EmailContext`).
- **Routing**: React Router DOM.
- **UI**: Tailwind.
- **API Communication**: `fetch` dengan token Bearer (dari `localStorage`).

---

## Alur Pengguna Secara Umum

1. User membuka aplikasi → diarahkan ke `/login` jika belum login.
2. User login dengan email & password.
3. Jika berhasil:
   - Token disimpan di `localStorage`.
   - Redirect ke halaman utama (`/inbox`).
4. User dapat menavigasi folder: Inbox, Sent, Drafts, Starred, Archive, Trash.
5. Klik sebuah email → halaman detail email.
6. User dapat melakukan aksi:
   - Memberi bintang.
   - Archive / Delete email.
   - Bulk action dengan multi-select.
7. User logout → token dihapus, redirect ke `/login`.

---

## Integrasi API saat ini

- **POST `/api/login`** — autentikasi user.
- **POST `/api/logout`** — logout user.
- **GET `/api/emails/all`** — mengambil seluruh email (kemudian dipecah ke folder oleh `EmailContext`).

> Catatan: beberapa aksi (star/unstar, archive, mass delete) saat ini belum terhubung ke backend — masih sebatas UI state.

---
