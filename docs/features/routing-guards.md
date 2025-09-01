# Routing & Auth Guards

## Deskripsi

Routing diatur menggunakan `react-router-dom`. Terdapat dua guard komponennya: `GuestRoute` dan `ProtectedRoute`.

## Fungsionalitas

- `GuestRoute` — melindungi route hanya untuk guest (mis. login), redirect user yang sudah login.
- `ProtectedRoute` — melindungi route yang membutuhkan autentikasi (memeriksa token di `localStorage`).

## Komponen React yang Terlibat

- `src/components/auth/GuestRoute.jsx`
- `src/components/auth/ProtectedRoute.jsx`
- `src/App.jsx` (daftar route aplikasi)

## State / Context yang Digunakan

- Token autentikasi disimpan di `localStorage`. `ProtectedRoute` & `GuestRoute` membaca localStorage untuk memutuskan redirect.

## Status

- **Selesai**
