# Jasa Raharja — Portal & Inventaris Perdagangan

Portal publik Representation Tasikmalaya (berita, galeri, panduan santunan) plus dashboard admin untuk mengelola berita, galeri foto, dan inventaris aset tetap.

## Stack

- Laravel 13 (PHP 8.3)
- Inertia.js + React 19
- Tailwind CSS v4
- MySQL
- Maatwebsite Excel + dompdf untuk ekspor laporan

## Menjalankan secara lokal

```bash
composer install
npm install

# salin .env.example ke .env lalu sesuaikan kredensial database
php artisan key:generate
php artisan storage:link

php artisan migrate --seed
npm run build
php artisan serve
```

Untuk pengembangan dengan hot reload, jalankan dua terminal:

```bash
php artisan serve
npm run dev
```

## Akun admin

| Field | Nilai |
| --- | --- |
| URL | `/login` |
| Username | `admin` |
| Email | `admin@jasaraharja-tasikmalaya.test` |
| Password | `JasaRaharja2026!` |

Ganti password ini lewat **Pengaturan → Akun Admin** sebelum dipakai di lingkungan publik. Hanya akun admin pertama yang dibuat pada database yang bisa mengakses `/admin`.

## Rute

Publik:

| Rute | Isi |
| --- | --- |
| `/` | Hero, maklumat, alur santunan 5 langkah, berita terbaru, ringkasan aset, galeri |
| `/berita` | Arsip berita dengan pencarian dan filter kategori |
| `/berita/{slug}` | Detail berita lengkap dengan berita terkait |
| `/galeri` | Galeri foto masonry dengan filter kategori dan lightbox |
| `/kontak` | Alamat, jam kerja, wilayah layanan, peta, profil, FAQ |
| `/login` | Autentikasi admin |

Admin (butuh login):

| Rute | Isi |
| --- | --- |
| `/admin` | Statistik aset, berita, galeri, grafik publikasi |
| `/admin/berita` | CRUD berita, toggle tayang/draft, tandai sorotan |
| `/admin/kategori-berita` | Kategori berita beserta warna label |
| `/admin/galeri` | CRUD foto galeri |
| `/admin/kategori-galeri` | Kategori galeri |
| `/admin/inventaris` | CRUD aset, filter kondisi/kategori/lokasi, ekspor |
| `/admin/kategori-aset` | Kategori aset beserta kode untuk penomoran otomatis |
| `/admin/pengaturan` | Seluruh teks dan kontak landing page, kop surat PDF, akun admin |

Ekspor inventaris tersedia di `/admin/inventaris/ekspor/{excel|csv|pdf}` dan mengikuti filter yang sedang aktif.

## Struktur data

- `site_settings` — key/value untuk seluruh konten landing page
- `article_categories`, `articles` — berita beserta kategori dan status tayang
- `gallery_categories`, `gallery_photos` — galeri foto
- `asset_categories`, `asset_conditions`, `assets` — inventaris aset tetap
- `users` — akun admin, ditambah kolom `username`, `phone`, `role_label`

## Catatan operasional

- Semua teks landing page, nomor kontak, dan kop surat diatur dari **Pengaturan**, bukan dari kode.
- Nomor WhatsApp diisi format internasional tanpa tanda `+` (contoh `6281200000000`).
- Embed Google Maps diisi dengan nilai `src` dari iframe Google Maps.
- Gambar yang diunggah otomatis dikompresi ke WebP dan dibuat thumbnail.
- Sesi admin berakhir otomatis setelah 120 menit tanpa aktivitas.
- Kode aset dibuat otomatis dengan pola `JR-TSK-{KODE}-{TAHUN}-{URUT}` bila kolom kode dikosongkan.

## Pengujian

```bash
php artisan test
```
