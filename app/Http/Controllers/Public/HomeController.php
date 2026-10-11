<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Asset;
use App\Models\GalleryPhoto;
use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $settings = Setting::all();

        $articles = Article::published()
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->limit(6)
            ->get()
            ->map(fn (Article $a) => [
                'id' => $a->id,
                'title' => $a->title,
                'slug' => $a->slug,
                'excerpt' => $a->excerpt,
                'image' => $a->image_path ? asset('storage/'.$a->image_path) : null,
                'published_at' => $a->published_at?->format('d M Y'),
                'category' => $a->category?->name,
                'category_color' => $a->category?->color,
                'reading_time' => $a->reading_time,
            ]);

        $hero = Article::published()->where('is_featured', true)->orderByDesc('published_at')->orderByDesc('id')->first()
            ?? Article::published()->orderByDesc('published_at')->orderByDesc('id')->first();

        $photos = GalleryPhoto::published()->latest()->limit(8)->get()
            ->map(fn (GalleryPhoto $p) => [
                'id' => $p->id,
                'title' => $p->title,
                'caption' => $p->caption,
                'image' => asset('storage/'.$p->image_path),
                'taken_at' => $p->taken_at?->format('d M Y'),
                'category' => $p->category?->name,
            ]);

        $counts = Asset::query()
            ->selectRaw('condition_status, COUNT(*) as total')
            ->groupBy('condition_status')
            ->pluck('total', 'condition_status');

        $assetCondition = [
            'total' => Asset::count(),
            'baik' => (int) ($counts['baik'] ?? 0),
            'servis' => (int) ($counts['servis'] ?? 0),
            'rusak' => (int) ($counts['rusak'] ?? 0),
        ];

        $heroImage = $this->assetUrl('hero_gambar') ?: asset('images/carousel/jasa-raharja-gedung.webp');

        $carouselSlides = [
            [
                'id' => 'gedung-kantor',
                'badge' => 'KANTOR PERWAKILAN RESMI',
                'title' => 'Perlindungan Pasti & Santunan Cepat untuk Masyarakat.',
                'headline_prefix' => 'Perlindungan Pasti &',
                'headline_accent' => 'Santunan Cepat',
                'headline_suffix' => 'untuk Masyarakat.',
                'subheadline' => 'Memberikan jaminan kepastian santunan bagi korban kecelakaan penumpang umum dan lalu lintas jalan di Tasikmalaya, Ciamis, Banjar, dan Pangandaran.',
                'image' => asset('images/carousel/jasa-raharja-gedung.webp'),
                'tag' => 'Gedung Kantor Jasa Raharja',
                'location' => 'Tasikmalaya, Jawa Barat',
                'cta_primary' => [
                    'label' => 'Lihat Alur Santunan',
                    'url' => '#alur-santunan',
                ],
                'cta_secondary' => [
                    'label' => 'Informasi Kantor & Kontak',
                    'url' => '/kontak',
                ],
            ],
            [
                'id' => 'sosialisasi-keselamatan',
                'badge' => 'KAMPANYE KESELAMATAN JALAN',
                'title' => 'Sosialisasi & Edukasi Keselamatan Berkendara.',
                'headline_prefix' => 'Sosialisasi &',
                'headline_accent' => 'Edukasi Keselamatan',
                'headline_suffix' => 'Berkendara.',
                'subheadline' => 'Petugas Jasa Raharja Tasikmalaya aktif turun langsung ke jalan raya mengedukasi masyarakat demi menekan angka fatalitas kecelakaan lalu lintas.',
                'image' => asset('images/carousel/jasaraharja-sosialisasi-tasikmalaya.webp'),
                'tag' => 'Sosialisasi di Jl. R.E. Martadinata',
                'location' => 'Kota Tasikmalaya',
                'cta_primary' => [
                    'label' => 'Baca Berita & Kegiatan',
                    'url' => '/berita',
                ],
                'cta_secondary' => [
                    'label' => 'Dokumentasi Galeri',
                    'url' => '/galeri',
                ],
            ],
            [
                'id' => 'jemput-bola-rsud',
                'badge' => 'LAYANAN CEPAT TANGGAP',
                'title' => 'Layanan Jemput Bola di RSUD Dr. Soekardjo dan Rumah Duka.',
                'headline_prefix' => 'Layanan Jemput Bola di',
                'headline_accent' => 'RSUD Dr. Soekardjo',
                'headline_suffix' => 'dan Rumah Duka.',
                'subheadline' => 'Kerjasama terpadu bersama rumah sakit dan kepolisian memastikan keabsahan santunan diproses cepat, tepat, dan cair tanpa potongan biaya.',
                'image' => asset('images/carousel/jasaraharja-layanan-rsud-tasikmalaya.webp'),
                'tag' => 'Loket Jasa Raharja RSUD Dr. Soekardjo',
                'location' => 'Tasikmalaya',
                'cta_primary' => [
                    'label' => 'Konsultasi WhatsApp Petugas',
                    'url' => 'https://wa.me/'.Setting::text('kontak_whatsapp', '6281200000000'),
                ],
                'cta_secondary' => [
                    'label' => 'Alur 5 Langkah Pengajuan',
                    'url' => '#alur-santunan',
                ],
            ],
        ];

        return Inertia::render('public/Home', array_merge($this->publicShell('beranda'), [
            'hero' => [
                'badge' => Setting::text('hero_badge', 'Pelayanan Resmi'),
                'headline' => Setting::text('hero_judul', 'Jasa Raharja'),
                'subheadline' => Setting::text('hero_subjudul', ''),
                'image' => $heroImage,
                'slides' => $carouselSlides,
                'ctaPrimary' => [
                    'label' => Setting::text('hero_cta_utama_label', 'Lihat Alur Santunan'),
                    'url' => Setting::text('hero_cta_utama_url', '#alur-santunan'),
                ],
                'ctaSecondary' => [
                    'label' => Setting::text('hero_cta_kedua_label', 'Hubungi Petugas'),
                    'url' => Setting::text('hero_cta_kedua_url', ''),
                ],
                'highlight' => $hero ? [
                    'title' => $hero->title,
                    'slug' => $hero->slug,
                    'excerpt' => $hero->excerpt,
                    'image' => $hero->image_path ? asset('storage/'.$hero->image_path) : null,
                    'published_at' => $hero->published_at?->format('d M Y'),
                    'category' => $hero->category?->name,
                ] : null,
            ],
            'maklumat' => [
                'title' => Setting::text('maklumat_judul', 'Maklumat Layanan'),
                'body' => Setting::text('maklumat_isi', ''),
            ],
            'quickFacts' => [
                ['label' => 'Waktu Layanan', 'value' => Setting::text('maklumat_waktu', '')],
                ['label' => 'Kanal Konsultasi', 'value' => Setting::text('maklumat_kanal', '')],
                ['label' => 'Lingkup Wilayah', 'value' => Setting::text('maklumat_wilayah', '')],
                ['label' => 'Penyaluran', 'value' => Setting::text('maklumat_penyaluran', '')],
            ],
            'steps' => array_map(fn (int $i) => [
                'no' => $i,
                'title' => Setting::text('santunan_judul_langkah_'.$i, ''),
                'desc' => Setting::text('santunan_langkah_'.$i, ''),
            ], range(1, 5)),
            'stepNote' => Setting::text('santunan_catatan', ''),
            'articles' => $articles,
            'gallery' => $photos,
            'stats' => [
                'artikel' => Article::published()->count(),
                'santunan' => Setting::int('statistik_santunan', 0),
                'wilayah' => Setting::int('statistik_wilayah', 0),
                'petugas' => Setting::int('statistik_petugas', 0),
            ],
            'assetCondition' => $assetCondition,
            'assetSummaryEnabled' => Setting::bool('tampilkan_ringkasan_aset', true),
        ]));
    }

    public function contact(): Response
    {
        return Inertia::render('public/Contact', array_merge($this->publicShell('kontak'), [
            'officeHours' => Setting::hours(),
            'faqs' => Setting::faqs(),
            'profile' => [
                'body' => Setting::text('profil_tentang', ''),
                'vision' => Setting::text('profil_visor', ''),
                'mission' => Setting::text('profil_misi', ''),
                'regions' => Setting::regions(),
            ],
        ]));
    }
}
