Mari kita susun instruksi lengkap ini agar AI agent kamu bisa langsung mengeksekusinya dengan presisi. Ringkasan ini mencakup spesifikasi teknis, struktur folder, dan langkah kerja yang sistematis. 🏗️

### 📋 Ringkasan Proyek: Portfolio Arsitektur Digital

| Komponen        | Spesifikasi                                                             |
| --------------- | ----------------------------------------------------------------------- |
| **Frontend**    | Next.js (App Router), Tailwind CSS 🎨                                   |
| **Backend**     | Node.js, Express.js 🚀                                                  |
| **Database**    | MySQL 🗄️                                                                |
| **Fitur Utama** | Galeri Publik (Grid), Dashboard Admin (CRUD), Upload Gambar (Multer) 📸 |

---

### 📂 Struktur Folder Target

Minta AI agent untuk mengikuti struktur ini:

- `server/`: Berisi API Express, konfigurasi MySQL, middleware `multer`, dan folder `uploads/`.
- `client/`: Berisi aplikasi Next.js dengan folder `src/app/` (Public & Admin routes) dan `src/components/`.

---

### 🛠️ Perintah Eksekusi untuk AI Agent (Prompt)

Salin dan berikan perintah ini secara berurutan kepada AI agent kamu:

1. **Tahap 1 (Setup & DB):** "Buatkan backend menggunakan Express.js dan hubungkan ke database MySQL. Buat tabel `projects` dengan kolom: `id`, `title`, `description`, `image_url`, dan `category`. Sertakan skrip SQL-nya."
2. **Tahap 2 (API CRUD):** "Buat API endpoint di Express untuk: `GET /projects` (ambil semua), `POST /projects` (tambah dengan upload gambar via Multer), `PUT /projects/:id` (edit), dan `DELETE /projects/:id` (hapus)."
3. **Tahap 3 (Frontend Base):** "Setup project Next.js dengan Tailwind CSS. Buat layout utama yang minimalis khas arsitektur. Gunakan font sans-serif yang bersih."
4. **Tahap 4 (Admin & Gallery):** "Buat halaman galeri di `/` menggunakan Tailwind CSS Grid untuk menampilkan foto proyek. Buat juga halaman admin terpisah di `/admin` yang berisi tabel daftar proyek dan form modal untuk CRUD."

---

Ringkasan di atas sudah dirancang agar AI agent memahami pemisahan antara sisi server dan tampilan depan yang estetik.

Apakah instruksi di atas sudah mencakup semua fitur yang kamu bayangkan, atau kita perlu menambahkan detail khusus tentang bagaimana cara membagi kategori proyek (misal: Perumahan vs Komersial)? 📐
