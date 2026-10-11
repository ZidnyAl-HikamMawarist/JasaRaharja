<?php

namespace App\Models;

use Illuminate\Support\Facades\Cache;

class Setting
{
    public const CACHE_KEY = 'site.settings.all';

    /**
     * @return array<string, string|null>
     */
    public static function all(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, function () {
            return SiteSetting::query()
                ->pluck('value', 'key')
                ->map(fn ($value) => is_string($value) ? $value : json_encode($value))
                ->all();
        });
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        $value = self::all()[$key] ?? null;

        if ($value === null || $value === '') {
            return $default;
        }

        return match (strtolower(trim($value))) {
            'true', 'yes', 'on' => true,
            'false', 'no', 'off' => false,
            default => $value,
        };
    }

    public static function text(string $key, mixed $default = null): mixed
    {
        return self::get($key, $default);
    }

    public static function bool(string $key, bool $default = false): bool
    {
        $value = self::get($key, $default);

        return filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? $default;
    }

    public static function int(string $key, int $default = 0): int
    {
        $value = self::get($key, $default);

        return is_numeric($value) ? (int) $value : $default;
    }

    /**
     * @param  array<string, mixed>  $values
     */
    public static function put(array $values): void
    {
        foreach ($values as $key => $value) {
            $setting = SiteSetting::firstOrNew(['key' => $key]);
            $setting->group = self::groupFor($key);
            $setting->value = is_array($value) ? json_encode($value, JSON_UNESCAPED_UNICODE) : (string) $value;
            $setting->save();
        }

        self::flush();
    }

    public static function flush(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * @return array<string, mixed>
     */
    public static function grouped(): array
    {
        return SiteSetting::query()
            ->orderBy('group')
            ->orderBy('id')
            ->get()
            ->groupBy('group')
            ->map(fn ($items) => $items->pluck('value', 'key')->all())
            ->all();
    }

    private static function groupFor(string $key): string
    {
        return match (true) {
            str_starts_with($key, 'hero_') => 'hero',
            str_starts_with($key, 'cta_') => 'hero',
            str_starts_with($key, 'maklumat_') => 'hero',
            str_starts_with($key, 'kontak_') => 'kontak',
            str_starts_with($key, 'santunan_') => 'santunan',
            str_starts_with($key, 'sosial_') => 'kontak',
            str_starts_with($key, 'profil_') => 'profil',
            str_starts_with($key, 'wilayah_') => 'wilayah',
            str_starts_with($key, 'faq_') => 'faq',
            str_starts_with($key, 'footer_') => 'profil',
            str_starts_with($key, 'statistik_') => 'statistik',
            default => 'umum',
        };
    }

    /**
     * Jam kerja dari settings `jam_kerja_1..n` (format "Hari|Jam").
     *
     * @return array<int, array{day: string, time: string}>
     */
    public static function hours(): array
    {
        $out = [];

        for ($i = 1; $i <= 7; $i++) {
            $row = self::text("jam_kerja_{$i}");
            if (! filled($row)) {
                continue;
            }
            [$day, $time] = array_pad(explode('|', (string) $row, 2), 2, '');
            $out[] = ['day' => trim($day), 'time' => trim($time)];
        }

        return $out;
    }

    /**
     * @return array<int, array{q: string, a: string}>
     */
    public static function faqs(): array
    {
        $out = [];

        for ($i = 1; $i <= 12; $i++) {
            $q = self::text("faq_{$i}_tanya");
            $a = self::text("faq_{$i}_jawab");
            if (filled($q) && filled($a)) {
                $out[] = ['q' => $q, 'a' => $a];
            }
        }

        return $out;
    }

    /**
     * @return array<int, array{title: string, body: string, icon: string}>
     */
    public static function regions(): array
    {
        $out = [];

        for ($i = 1; $i <= 10; $i++) {
            $title = self::text("wilayah_nama_{$i}");
            if (! filled($title)) {
                continue;
            }
            $out[] = [
                'title' => $title,
                'body' => self::text("wilayah_deskripsi_{$i}", ''),
                'icon' => self::text("wilayah_ikon_{$i}", 'MapPin'),
            ];
        }

        return $out;
    }
}
