<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\GalleryCategory;
use App\Models\GalleryPhoto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'kategori' => ['nullable', 'integer', 'exists:gallery_categories,id'],
        ]);

        $photos = GalleryPhoto::published()
            ->with('category')
            ->when($filters['kategori'] ?? null, fn ($q, $id) => $q->where('gallery_category_id', $id))
            ->latest()
            ->paginate(18)
            ->withQueryString()
            ->through(fn (GalleryPhoto $p) => [
                'id' => $p->id,
                'title' => $p->title,
                'caption' => $p->caption,
                'image' => asset('storage/'.$p->image_path),
                'taken_at' => $p->taken_at?->format('d M Y'),
                'category' => $p->category?->name,
            ]);

        return Inertia::render('public/GalleryIndex', array_merge($this->publicShell('galeri'), [
            'photos' => $photos,
            'filters' => ['kategori' => $filters['kategori'] ?? null],
            'categories' => GalleryCategory::query()
                ->withCount(['photos' => fn ($q) => $q->published()])
                ->orderBy('sort_order')
                ->get()
                ->filter(fn (GalleryCategory $c) => $c->photos_count > 0)
                ->map(fn (GalleryCategory $c) => [
                    'id' => $c->id,
                    'name' => $c->name,
                    'slug' => $c->slug,
                    'count' => $c->photos_count,
                ])
                ->values(),
        ]));
    }
}
