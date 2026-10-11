<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GalleryCategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/GalleryCategoryIndex', array_merge(
            $this->adminShell('kategori-galeri', 'Kategori Galeri'),
            [
                'categories' => GalleryCategory::query()
                    ->withCount('photos')
                    ->orderBy('sort_order')
                    ->get()
                    ->map(fn (GalleryCategory $c) => [
                        'id' => $c->id,
                        'name' => $c->name,
                        'slug' => $c->slug,
                        'sort_order' => $c->sort_order,
                        'count' => $c->photos_count,
                    ]),
            ]
        ));
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        GalleryCategory::create($data);

        return back()->with('success', 'Kategori galeri "'.$data['name'].'" ditambahkan.');
    }

    public function update(Request $request, GalleryCategory $category): RedirectResponse
    {
        $category->update($this->validated($request));

        return back()->with('success', 'Kategori galeri diperbarui.');
    }

    public function destroy(GalleryCategory $category): RedirectResponse
    {
        $category->delete();

        return back()->with('success', 'Kategori galeri dihapus.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:999'],
        ], [], ['name' => 'nama kategori']);
    }
}
