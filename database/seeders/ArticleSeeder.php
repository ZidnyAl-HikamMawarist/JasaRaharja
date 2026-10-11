<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
  public function run(): void
  {
    $admin = User::where('username', 'admin')->first();
    $cat = ArticleCategory::pluck('id', 'slug');

    $items = [
      [
        'slug' => 'penyaluran-santunan-kota-tasikmalaya',
        'category' => 'santunan',
        'title' => 'Penyaluran Santunan Kecelakaan di Kota Tasikmalaya',
        'excerpt' => 'Petugas kantor mengadministrasikan santunan bagi korban kecelakaan lalu lintas.',
        'content' => "<p>Perwakilan Tasikmalaya mengadministrasikan santunan bagi korban kecelakaan lalu lintas di wilayah Kota Tasikmalaya.</p>\n<p>Setelah berkas diverifikasi, santunan dicairkan melalui transfer bank ke rekening korban atau ahli waris.</p>",
        'days_ago' => 2,
        'featured' => true,
      ],
      [
        'slug' => 'sosialisasi-keselamatan-jalan-kabupaten-ciamis',
        'category' => 'sosialisasi',
        'title' => 'Sosialisasi Keselamatan Jalan di Kabupaten Ciamis',
        'excerpt' => 'Kegiatan sosialisasi keselamatan lalu lintas kepada masyarakat di dua kecamatan.',
        'content' => "<p>Petugas kantor menyampaikan sesi sosialisasi keselamatan jalan di dua kecamatan, Kabupaten Ciamis.</p>\n<p>Kegiatan dilanjutkan dengan diskusi tentang alur pengajuan santunan bagi korban kecelakaan.</p>",
        'days_ago' => 6,
      ],
      [
        'slug' => 'jemput-bola-petugas-di-lokasi-kecelakaan',
        'category' => 'santunan',
        'title' => 'Jemput Bola Petugas di Lokasi Kecelakaan',
        'excerpt' => 'Petugas datang ke lokasi kecelakaan untuk mendokumentasikan kondisi kejadian.',
        'content' => "<p>Petugas kantor datang ke lokasi kecelakaan segera setelah menerima laporan.</p>\n<p>Dokumentasi dilakukan sebagai bagian dari proses verifikasi berkas.</p>",
        'days_ago' => 11,
      ],
      [
        'slug' => 'kunjungan-koordinasi-ke-polisi-sektor',
        'category' => 'kegiatan',
        'title' => 'Kunjungan Koordinasi ke Polisi Sektor',
        'excerpt' => 'Koordinasi jalur pelaporan kecelakaan lalu lintas dengan tiga sektor polisi.',
        'content' => "<p>Kunjungan koordinasi dilakukan untuk kelancaran jalur pelaporan kecelakaan lalu lintas dengan tiga sektor polisi.</p>\n<p>Kegiatan ini dilanjutkan dengan komunikasi antar pihak.</p>",
        'days_ago' => 18,
      ],
      [
        'slug' => 'penataan-arsip-dan-pemeliharaan-aset',
        'category' => 'pengumuman',
        'title' => 'Penataan Arsip dan Pemeliharaan Aset Kantor',
        'excerpt' => 'Penataan arsip serta pemeriksaan kondisi perangkat dan kendaraan dinas.',
        'content' => "<p>Tim kantor melakukan penataan arsip dan pemeriksaan kondisi perangkat serta kendaraan dinas secara berkala.</p>\n<p>Hasil pemeriksaan menjadi dasar pemutakhiran data inventaris aset tetap kantor.</p>",
        'days_ago' => 25,
      ],
      [
        'slug' => 'sosialisasi-antar-penumpang-bus-terminal',
        'category' => 'sosialisasi',
        'title' => 'Sosialisasi Keselamatan bagi Penumpang Bus',
        'excerpt' => 'Petugas memberikan informasi keselamatan kepada penumpang bus di terminal Tasikmalaya.',
        'content' => "<p>Petugas memberikan informasi keselamatan kepada penumpang bus di terminal Kota Tasikmalaya.</p>\n<p>Materi yang dibagikan meliputi prosedur pelaporan kecelakaan dan hak santunan bagi korban.</p>",
        'days_ago' => 33,
      ],
    ];

    foreach ($items as $item) {
      Article::updateOrCreate(['slug' => $item['slug']], [
        'article_category_id' => $cat[$item['category']] ?? null,
        'title' => $item['title'],
        'excerpt' => $item['excerpt'],
        'content' => $item['content'],
        'status' => 'published',
        'is_featured' => (bool) ($item['featured'] ?? false),
        'author_id' => $admin?->id,
        'published_at' => now()->subDays($item['days_ago'])->toDateString(),
        'views' => 120,
      ]);
    }
  }
}