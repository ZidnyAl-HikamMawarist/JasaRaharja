<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Asset;
use App\Models\GalleryPhoto;
use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;

class Controller
{
    /**
     * Data yang dipakai bersama oleh halaman publik (navbar, footer, CTA).
     *
     * @return array<string, mixed>
     */
    protected function publicShell(?string $active = null): array
    {
        $settings = Setting::all();

        return [
            'activeMenu' => $active,
            'site' => [
                'name' => $settings['nama_instansi'] ?? 'Jasa Raharja',
                'office' => $settings['nama_kantor'] ?? 'Perwakilan Tasikmalaya',
                'tagline' => $settings['hero_tagline'] ?? '',
                'address' => $settings['kontak_alamat'] ?? '',
                'city' => $settings['kontak_kota'] ?? 'Tasikmalaya',
                'phone' => $settings['kontak_telepon'] ?? '',
                'email' => $settings['kontak_email'] ?? '',
                'hours' => $settings['kontak_jam_kerja'] ?? '',
                'whatsapp' => $settings['kontak_whatsapp'] ?? '',
                'mapsEmbed' => $settings['kontak_maps_embed'] ?? '',
                'mapsLink' => $settings['kontak_maps_link'] ?? '',
                'social' => [
                    'instagram' => $settings['sosial_instagram'] ?? '',
                    'facebook' => $settings['sosial_facebook'] ?? '',
                    'youtube' => $settings['sosial_youtube'] ?? '',
                    'twitter' => $settings['sosial_twitter'] ?? '',
                ],
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function adminShell(string $active, string $title): array
    {
        return [
            'activeMenu' => $active,
            'pageTitle' => $title,
            'stats' => [
                'artikel' => Article::count(),
                'artikel_terbit' => Article::published()->count(),
                'galeri' => GalleryPhoto::count(),
                'aset' => Asset::count(),
                'pengunjung' => \App\Models\VisitorLog::today()->count(),
            ],
        ];
    }

    protected function inertia(string $component, array $props): Response
    {
        return Inertia::render($component, array_merge($props, [
            'nav' => ['public' => $this->publicShell()],
        ]));
    }

    protected function assetUrl(?string $settingKey): ?string
    {
        $path = Setting::text($settingKey);

        return filled($path) ? asset('storage/'.$path) : null;
    }
}
