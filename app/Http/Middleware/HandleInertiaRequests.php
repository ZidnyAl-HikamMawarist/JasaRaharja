<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'appName' => Setting::text('nama_instansi', 'Jasa Raharja'),
            'settings' => Setting::all(),
            'auth' => $user ? [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'email' => $user->email,
                    'role_label' => $user->role_label,
                ],
                'flash' => [
                    'success' => fn () => $request->session()->get('success'),
                    'error' => fn () => $request->session()->get('error'),
                ],
            ] : null,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'waNumber' => static::normalizedWa(Setting::text('kontak_whatsapp', '')),
        ];
    }

    public static function normalizedWa(?string $number): string
    {
        $digits = preg_replace('/\D+/', '', (string) $number) ?? '';

        return $digits !== '' ? $digits : '6281200000000';
    }
}
