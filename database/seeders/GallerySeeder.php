<?php

namespace Database\Seeders;

use App\Models\GalleryCategory;
use App\Models\GalleryPhoto;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Sosialisasi', 'slug' => 'sosialisasi', 'sort_order' => 1],
            ['name' => 'Penyaluran Santunan', 'slug' => 'penyaluran-santunan', 'sort_order' => 2],
            ['name' => 'Kegiatan Kantor', 'slug' => 'kegiatan-kantor', 'sort_order' => 3],
        ];

        foreach ($categories as $data) {
            GalleryCategory::updateOrCreate(['slug' => $data['slug']], $data);
        }

        $cat = GalleryCategory::pluck('id', 'slug');

        $photos = [
            ['sosialisasi', 'Sosialisasi Keselamatan Jalan', 'Penyampaian informasi keselamatan kepada masyarakat di wilayah Tasikmalaya.', 20],
            ['sosialisasi', 'Penjelasan Petugas di Tepi Jalan', 'Petugas menjelaskan prosedur pengajuan santunan kepada warga.', 24],
            ['sosialisasi', 'Sesi Tanya Jawab', 'Warga mengajukan pertanyaan terkait syarat dan alur santunan.', 24],
            ['penyaluran-santunan', 'Penyerahan Santunan', 'Penyerahan berkas klaim kepada korban dalam proses verifikasi.', 12],
            ['penyaluran-santunan', 'Kunjungan Petugas ke RS', 'Petugas melakukan kunjungan untuk mendokumentasikan kondisi korban di rumah sakit.', 9],
            ['penyaluran-santunan', 'Verifikasi Berkas', 'Pemeriksaan kelengkapan berkas sebelum proses cair dana.', 9],
            ['kegiatan-kantor', 'Rapat Koordinasi', 'Koordinasi internal berkas kantor Tasikmalaya.', 33],
            ['kegiatan-kantor', 'Pemeliharaan Aset', 'Pemeriksaan kondisi perangkat dan kendaraan dinas kantor.', 40],
            ['kegiatan-kantor', 'Pelayanan di Loket', 'Aktivitas pelayanan santunan di ruang loket kantor.', 47],
        ];

        foreach ($photos as $index => [$catSlug, $title, $caption, $daysAgo]) {
            GalleryPhoto::updateOrCreate(
                ['image_path' => $this->placeholder($index)],
                [
                    'gallery_category_id' => $cat[$catSlug] ?? null,
                    'title' => $title,
                    'caption' => $caption,
                    'taken_at' => now()->subDays($daysAgo)->toDateString(),
                    'is_published' => true,
                    'sort_order' => $index,
                ]
            );
        }
    }

    private function placeholder(int $index): string
    {
        $palettes = [
            ['#1e3a8a', '#3b82f6'],
            ['#0c4a6e', '#0ea5e9'],
            ['#075985', '#38bdf8'],
            ['#1e40af', '#60a5fa'],
            ['#164e63', '#22d3ee'],
            ['#312e81', '#818cf8'],
        ];

        [$from, $to] = $palettes[$index % count($palettes)];
        $path = "galeri/contoh/contoh-{$index}.svg";

        $svg = <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{$from}"/>
      <stop offset="100%" stop-color="{$to}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#g)"/>
  <circle cx="980" cy="180" r="220" fill="#ffffff" opacity="0.08"/>
  <circle cx="220" cy="760" r="180" fill="#ffffff" opacity="0.06"/>
  <text x="600" y="440" font-family="Segoe UI, Arial, sans-serif" font-size="46" font-weight="700" fill="#ffffff" text-anchor="middle" opacity="0.9">Dokumentasi</text>
  <text x="600" y="500" font-family="Segoe UI, Arial, sans-serif" font-size="26" fill="#ffffff" text-anchor="middle" opacity="0.75">Jasa Raharja Tasikmalaya</text>
</svg>
SVG;

        Storage::disk('public')->put($path, $svg);

        return $path;
    }
}