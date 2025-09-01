# Setup & Run Project (React + Vite)

Panduan singkat menjalankan project React yang ada dalam repository.

## Prasyarat

- Node.js (v16+ direkomendasikan)
- npm atau yarn
- Backend API: project mengharapkan backend pada `http://127.0.0.1:8000` untuk beberapa endpoint.

## Langkah menjalankan (lokal)

1. Ekstrak/repo sudah di folder project root (misal `flow-sent`).

2. Buka terminal di folder project:

   ```bash
   cd flow-sent-alif/flow-sent-alif   # atau sesuai path project di repo
   npm install
   ```

3. Jalankan dev server:

   ```bash
   npm run dev
   ```

4. Vite akan menyajikan aplikasi di `http://localhost:5173` (atau port yang ditampilkan terminal).

## Backend (opsional, tetapi disarankan)

Beberapa bagian aplikasi melakukan request ke backend di:

- `http://127.0.0.1:8000/api/login` (POST)
- `http://127.0.0.1:8000/api/logout` (POST)
- `http://127.0.0.1:8000/api/emails/all` (GET)

Jika ingin menjalankan seluruh flow (login, fetch email nyata), pastikan backend tersebut tersedia.
