<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AssetCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssetCategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/AssetCategoryIndex', array_merge(
            $this->adminShell('kategori-aset', 'Kategori Aset'),
            [
                'categories' => AssetCategory::query()
                    ->withCount('assets')
                    ->orderBy('sort_order')
                    ->get()
                    ->map(fn (AssetCategory $c) => [
                        'id' => $c->id,
                        'name' => $c->name,
                        'code' => $c->code,
                        'description' => $c->description,
                        'sort_order' => $c->sort_order,
                        'count' => $c->assets_count,
                    ]),
            ]
        ));
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        AssetCategory::create($data);

        return back()->with('success', 'Kategori aset "'.$data['name'].'" ditambahkan.');
    }

    public function update(Request $request, AssetCategory $category): RedirectResponse
    {
        $category->update($this->validated($request, $category));

        return back()->with('success', 'Kategori aset diperbarui.');
    }

    public function destroy(AssetCategory $category): RedirectResponse
    {
        if ($category->assets()->exists()) {
            return back()->with('error', 'Kategori masih memiliki aset. Pindahkan atau hapus aset terlebih dahulu.');
        }

        $category->delete();

        return back()->with('success', 'Kategori aset dihapus.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?AssetCategory $category = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:asset_categories,name'.($category ? ','.$category->id : '')],
            'code' => ['required', 'string', 'max:30', 'regex:/^[A-Z0-9]+$/', 'unique:asset_categories,code'.($category ? ','.$category->id : '')],
            'description' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:999'],
        ], [
            'code.regex' => 'Kode kategori hanya boleh huruf kapital dan angka.',
        ], [
            'name' => 'nama kategori',
            'code' => 'kode kategori',
        ]);
    }
}
