# API Endpoints

Berikut ringkasan endpoint yang digunakan

**Base URL**: `http://127.0.0.1:8000`

## 1. POST /api/login

- **Lokasi panggilan di**: `src/pages/LoginPage.jsx`
- **Deskripsi**: Autentikasi user. Mengirim `{ email, password }` di body JSON.
- **Request**:
  - Method: `POST`
  - Headers: `Content-Type: application/json`, `Accept: application/json`
  - Body: `{"email": "...", "password": "..."}`
- **Respon yang diharapkan**:
  - status 200 + body JSON berisi token / data user.
  - jika gagal: response tidak ok, ada `message` yang ditampilkan pengguna.
- **Client behavior**:
  - Jika login sukses: simpan token ke `localStorage`, redirect ke route utama.
  - Jika gagal: tampilkan `errorMessage` pada UI.

## 2. POST /api/logout

- **Lokasi panggilan di**: `src/components/layout/MainLayout.jsx`
- **Deskripsi**: Logout user — menghapus token di server.
- **Request**:
  - Method: `POST`
  - Headers: `Content-Type: application/json`, `Accept: application/json`, `Authorization: Bearer <token>`
- **Respon**:
  - JSON respons dari server.
  - Setelah logout client menghapus `localStorage` dan redirect ke `/login`.

## 3. GET /api/emails/all

- **Lokasi panggilan di**: `src/context/EmailContext.jsx`
- **Deskripsi**: Mengambil semua email; EmailContext lalu memecah/peruntukkan ke folder (inbox, sent, drafts, archive, starred, deleted, dll).
- **Request**:
  - Method: `GET`
  - Headers: `Content-Type: application/json`, `Accept: application/json`, `Authorization: Bearer <authToken>`
- **Behavior di client**:
  - Jika token tidak ada => alert dan redirect ke `/login`.
  - Jika response status `401` => hapus token & redirect login.
  - Data disimpan ke `emails` state di `EmailContext`.
