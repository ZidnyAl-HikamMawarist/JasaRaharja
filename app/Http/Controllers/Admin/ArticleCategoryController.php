<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ArticleCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleCategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/ArticleCategoryIndex', array_merge(
            $this->adminShell('kategori-berita', 'Kategori Berita'),
            [
                'categories' => ArticleCategory::query()
                    ->withCount('articles')
                    ->orderBy('sort_order')
                    ->get()
                    ->map(fn (ArticleCategory $c) => [
                        'id' => $c->id,
                        'name' => $c->name,
                        'slug' => $c->slug,
                        'color' => $c->color,
                        'sort_order' => $c->sort_order,
                        'count' => $c->articles_count,
                    ]),
            ]
        ));
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        ArticleCategory::create($data);

        return back()->with('success', 'Kategori "'.$data['name'].'" ditambahkan.');
    }

    public function update(Request $request, ArticleCategory $category): RedirectResponse
    {
        $category->update($this->validated($request));

        return back()->with('success', 'Kategori diperbarui.');
    }

    public function destroy(ArticleCategory $category): RedirectResponse
    {
        $category->delete();

        return back()->with('success', 'Kategori dihapus. Artikel terkait kini tanpa kategori.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'color' => ['nullable', 'string', 'max:20', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:999'],
        ], [], ['name' => 'nama kategori']);
    }
}
