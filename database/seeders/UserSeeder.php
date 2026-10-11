<?php

namespace Database\Seeders;

use App\Models\ArticleCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Administrator Kantor',
                'email' => 'admin@jasaraharja-tasikmalaya.test',
                'password' => 'JasaRaharja2026!',
                'phone' => '081200000000',
                'role_label' => 'Administrator Sistem',
                'email_verified_at' => now(),
            ]
        );

        ArticleCategory::updateOrCreate(['slug' => 'santunan'], [
            'name' => 'Penyaluran Santunan',
            'color' => '#2563eb',
            'sort_order' => 1,
        ]);

        ArticleCategory::updateOrCreate(['slug' => 'sosialisasi'], [
            'name' => 'Sosialisasi & Edukasi',
            'color' => '#0ea5e9',
            'sort_order' => 2,
        ]);

        ArticleCategory::updateOrCreate(['slug' => 'kegiatan'], [
            'name' => 'Kegiatan Kantor',
            'color' => '#0891b2',
            'sort_order' => 3,
        ]);

        ArticleCategory::updateOrCreate(['slug' => 'pengumuman'], [
            'name' => 'Pengumuman',
            'color' => '#475569',
            'sort_order' => 4,
        ]);
    }
}
