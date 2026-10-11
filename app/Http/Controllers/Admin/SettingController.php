<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\ImageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function __construct(private readonly ImageService $images) {}

    public function edit(): Response
    {
        return Inertia::render('admin/SettingsEdit', array_merge(
            $this->adminShell('pengaturan', 'Pengaturan Situs'),
            [
                'settings' => Setting::grouped(),
                'flat' => Setting::all(),
                'user' => auth()->user()?->only(['name', 'username', 'email', 'phone', 'role_label']),
            ]
        ));
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate($this->rules($request), [], $this->messages());

        // Handle uploads
        foreach (['hero_gambar', 'profil_foto'] as $key) {
            if ($request->hasFile($key)) {
                Setting::put([$key => $this->images->store($request->file($key), 'pengaturan')]);
            }
        }

        $flat = collect($data)
            ->except(['hero_gambar', 'profil_foto'])
            ->filter(fn ($v, $k) => ! str_starts_with($k, '_'))
            ->map(fn ($v) => is_array($v) ? json_encode($v, JSON_UNESCAPED_UNICODE) : $v)
            ->all();

        $checkboxes = ['tampilkan_ringkasan_aset', 'tampilkan_statistik'];
        foreach ($checkboxes as $key) {
            if (array_key_exists($key, $data)) {
                continue;
            }
            $flat[$key] = '0';
        }

        Setting::put($flat);
        Setting::flush();

        return back()->with('success', 'Pengaturan situs berhasil disimpan.');
    }

    public function updateProfile(Request $request): RedirectResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'username' => ['required', 'string', 'max:100', 'alpha_dash', Rule::unique('users', 'username')->ignore($user->id)],
            'email' => ['required', 'email', 'max:100', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:30'],
            'role_label' => ['nullable', 'string', 'max:100'],
            'current_password' => ['nullable', 'string'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ], [], [
            'current_password' => 'kata sandi saat ini',
            'password' => 'kata sandi baru',
        ]);

        if (filled($data['password'] ?? null)) {
            if (! Hash::check($data['current_password'] ?? '', $user->password)) {
                return back()->withErrors(['current_password' => 'Kata sandi saat ini salah.'])->with('error', 'Gagal memperbarui kata sandi.');
            }
            $user->password = $data['password'];
            unset($data['password'], $data['current_password']);
        }

        unset($data['password'], $data['current_password']);
        $user->fill($data)->save();

        return back()->with('success', 'Profil administrator diperbarui.');
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    private function rules(Request $request): array
    {
        $rules = [
            'nama_instansi' => ['nullable', 'string', 'max:150'],
            'nama_kantor' => ['nullable', 'string', 'max:150'],
            'kontak_alamat' => ['nullable', 'string', 'max:300'],
            'kontak_kota' => ['nullable', 'string', 'max:100'],
            'kontak_telepon' => ['nullable', 'string', 'max:50'],
            'kontak_email' => ['nullable', 'email', 'max:100'],
            'kontak_whatsapp' => ['nullable', 'string', 'max:30'],
            'kontak_maps_embed' => ['nullable', 'string', 'max:1000'],
            'kontak_maps_link' => ['nullable', 'url', 'max:500'],
            'hero_judul' => ['nullable', 'string', 'max:180'],
            'hero_subjudul' => ['nullable', 'string', 'max:400'],
            'hero_badge' => ['nullable', 'string', 'max:80'],
            'hero_gambar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'maklumat_isi' => ['nullable', 'string', 'max:2000'],
            'santunan_catatan' => ['nullable', 'string', 'max:1000'],
            'profil_tentang' => ['nullable', 'string', 'max:3000'],
            'profil_visor' => ['nullable', 'string', 'max:1000'],
            'profil_misi' => ['nullable', 'string', 'max:1000'],
            'profil_foto' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'footer_teks' => ['nullable', 'string', 'max:300'],
            'pdf_pejabat' => ['nullable', 'string', 'max:100'],
            'pdf_jabatan' => ['nullable', 'string', 'max:100'],
            'pdf_periode' => ['nullable', 'string', 'max:100'],
            'tampilkan_ringkasan_aset' => ['nullable', 'boolean'],
            'tampilkan_statistik' => ['nullable', 'boolean'],
        ];

        for ($i = 1; $i <= 5; $i++) {
            $rules["santunan_judul_langkah_{$i}"] = ['nullable', 'string', 'max:150'];
            $rules["santunan_langkah_{$i}"] = ['nullable', 'string', 'max:500'];
        }
        for ($i = 1; $i <= 10; $i++) {
            $rules["wilayah_nama_{$i}"] = ['nullable', 'string', 'max:120'];
            $rules["wilayah_deskripsi_{$i}"] = ['nullable', 'string', 'max:400'];
            $rules["wilayah_ikon_{$i}"] = ['nullable', 'string', 'max:40'];
        }
        for ($i = 1; $i <= 12; $i++) {
            $rules["faq_{$i}_tanya"] = ['nullable', 'string', 'max:200'];
            $rules["faq_{$i}_jawab"] = ['nullable', 'string', 'max:1000'];
        }
        for ($i = 1; $i <= 7; $i++) {
            $rules["jam_kerja_{$i}"] = ['nullable', 'string', 'max:120'];
        }

        return $rules;
    }

    /**
     * @return array<string, string>
     */
    private function messages(): array
    {
        return [
            'kontak_email.email' => 'Format email kontak tidak valid.',
            'kontak_maps_link.url' => 'Tautan Google Maps harus berupa URL yang valid.',
            'hero_gambar.image' => 'Berkas hero harus berupa gambar.',
            'hero_gambar.mimes' => 'Format gambar harus JPG, PNG, atau WebP.',
            'hero_gambar.max' => 'Ukuran gambar maksimal 4 MB.',
        ];
    }
}
