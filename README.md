# Judul Karya
Skin Sight

## Institusi
Universitas Amikom Purwokerto

## Nama Anggota
- Ketua : Noval Esa Ramdany
- Anggota 1 : Akhmad Fauzan
- Anggota 2 : Muhammad Zhiya Ulhaq

## Deskripsi Karya 
SkinSight adalah aplikasi web analisa kondisi kulit berbasis gambar dan chat AI. Repo ini berisi frontend React (shadcn + Tailwind), backend Express + Prisma (MongoDB), integrasi Cloudinary untuk penyimpanan gambar, dan panggilan model generatif (Gemini/Google Generative AI).

## Link website
https://skinsight.web.id

---

## Quick start (development)

1. Clone repository

```bash
git clone https://github.com/ozan-fn/skin-sight
cd skin-sight
```

2. Install dependencies

```bash
npm install
```

3. Salin environment example dan isi nilai sensitif

```bash
cp .env.example .env
# kemudian edit .env dan isi DATABASE_URL, CLOUDINARY_*, ACCESS/REFRESH token, dsb.
```

4. Generate Prisma client & push schema (MongoDB)

```bash
npx prisma generate
npx prisma db push
```

5. (Opsional) Seed DB (script TypeScript). Jika `tsx` sudah tersedia:

```bash
npx tsx prisma/seed.ts
# atau jika Anda menggunakan ts-node: npx ts-node prisma/seed.ts
```

6. Jalankan development

```bash
npm run dev
```

> `npm run dev` menjalankan bundler (`rsbuild dev`) dan server API (`tsx api/main.ts`) secara bersamaan (lihat `package.json`).

---

## Environment variables (lihat juga `.env.example`)

- `DATABASE_URL` — MongoDB connection string (Prisma datasource)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `ACCESS_TOKEN_SECRET` — JWT access token secret
- `REFRESH_TOKEN_SECRET` — JWT refresh token secret
- `NODE_ENV` (development/production)
- `PORT` (optional)

Catatan: Anda dapat mengelola API key Gemini (jika dipakai) lewat tabel `GeminiApiKey` di database.

---

## Demo account (lokal)

Untuk testing cepat tersedia akun demo:

- Email: `demo@mail.com`
- Password: `password`

(Credential ini disiapkan oleh seed script `prisma/seed.ts` ketika dijalankan dan hanya untuk dev.)

---

## Struktur penting

- `src/` — frontend React app (shadcn components, pages)
    - `src/pages/(home)/` — halaman home, deteksi, ensiklopedia, tentang
    - `src/components/ui/` — shadcn-style UI primitives (Button, Card, Tabs, dsb.)
- `api/` — backend Express controllers & route handlers
- `prisma/` — Prisma schema (`schema.prisma`) & seed (`seed.ts`)
- `public/` — static assets (gambar, favicon)
- `rsbuild.config.ts` — bundler config (rsbuild)
- `package.json` — skrip & dependensi

---

## Teknologi utama (ringkas)

- Frontend: `react` (v19), `react-dom`, `react-router`
- Styling: `tailwindcss` (+ typography), `shadcn` components (Radix + Tailwind)
- Animations: `framer-motion` (dipakai pada banyak halaman)
- Icons: `lucide-react`
- State: `zustand`
- Markdown: `react-markdown`, `remark-gfm`
- Backend: `express` (v5)
- ORM: `prisma` (MongoDB)
- File storage: `cloudinary` (+ `multer-storage-cloudinary`)
- AI integration: `@google/generative-ai` (Gemini)
- Bundler / build: `rsbuild` (`@rsbuild/core`, plugin-react, plugin-babel)
- Utils & lainnya: `axios`, `bcryptjs`, `jsonwebtoken`, `cheerio`, `puppeteer-core`, `turndown`

---

## Hal yang perlu dicek / catatan developer

- `framer-motion` dipakai di kode; pastikan dependency `framer-motion` terpasang (beberapa file juga mengimpor `motion` package). Jika menemukan error missing package: jalankan
    ```bash
    npm install framer-motion
    ```
- Setelah memasang `@dr.pogodin/react-helmet` (digunakan untuk pengaturan head/title), jalankan:
    ```bash
    npm install @dr.pogodin/react-helmet
    ```
- Pastikan variabel Cloudinary terisi agar upload gambar berfungsi.
- Gemini / Google Generative AI membutuhkan API key/akses — logic pemilihan key ada di DB (`GeminiApiKey` model).

---

## Deployment (singkat)

- Pastikan environment variables production sudah terisi (DATABASE*URL, CLOUDINARY*\*, ACCESS/REFRESH secrets).
- Build frontend + jalankan server (lihat platform target; Vercel/Node server):
    ```bash
    npm run build
    # atau sesuai pipeline CI/CD Anda
    ```

---

## Troubleshooting cepat

- Error DB connection: periksa `DATABASE_URL`
- Upload gambar gagal: periksa `CLOUDINARY_*` di `.env` dan fungsi `api/lib/cloudinary.ts`
- Login/seed: jika demo user tidak muncul, jalankan `npx tsx prisma/seed.ts`
- Missing packages: jalankan `npm install` dan periksa console untuk paket yang hilang (`framer-motion`, `@dr.pogodin/react-helmet`, dsb.)
