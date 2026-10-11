<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryCategory;
use App\Models\GalleryPhoto;
use App\Services\ImageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class GalleryPhotoController extends Controller
{
    public function __construct(private readonly ImageService $images) {}

    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'kategori' => ['nullable', 'integer', 'exists:gallery_categories,id'],
        ]);

        $photos = GalleryPhoto::query()
            ->with('category')
            ->when($filters['q'] ?? null, fn ($q, $term) => $q->where(function ($sub) use ($term) {
                $sub->where('title', 'like', '%'.$term.'%')
                    ->orWhere('caption', 'like', '%'.$term.'%');
            }))
            ->when($filters['kategori'] ?? null, fn ($q, $id) => $q->where('gallery_category_id', $id))
            ->orderByDesc('taken_at')
            ->orderByDesc('id')
            ->paginate(12)
            ->withQueryString()
            ->through(fn (GalleryPhoto $p) => [
                'id' => $p->id,
                'title' => $p->title,
                'caption' => $p->caption,
                'image' => $this->images->url($p->image_path),
                'thumb' => $this->images->thumbUrl($p->image_path),
                'is_published' => $p->is_published,
                'taken_at' => $p->taken_at?->format('d M Y'),
                'category' => $p->category?->name,
            ]);

        $summary = [
            'total' => GalleryPhoto::count(),
            'published' => GalleryPhoto::where('is_published', true)->count(),
            'draft' => GalleryPhoto::where('is_published', false)->count(),
            'categories' => GalleryCategory::count(),
        ];

        return Inertia::render('admin/GalleryIndex', array_merge($this->adminShell('galeri', 'Kelola Galeri Foto'), [
            'photos' => $photos,
            'summary' => $summary,
            'filters' => [
                'q' => $filters['q'] ?? '',
                'kategori' => $filters['kategori'] ?? null,
            ],
            'categories' => $this->categoryOptions(),
        ]));
    }

    public function create(): Response
    {
        return Inertia::render('admin/GalleryForm', array_merge($this->adminShell('galeri', 'Upload Foto Galeri'), [
            'photo' => null,
            'categories' => $this->categoryOptions(),
        ]));
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        $photo = GalleryPhoto::create([
            ...$data,
            'image_path' => $this->images->store($request->file('image'), 'galeri'),
        ]);

        return redirect()->route('admin.galeri.index')
            ->with('success', 'Foto "'.$photo->title.'" berhasil diunggah.');
    }

    public function edit(GalleryPhoto $photo): Response
    {
        return Inertia::render('admin/GalleryForm', array_merge($this->adminShell('galeri', 'Ubah Foto Galeri'), [
            'photo' => [
                'id' => $photo->id,
                'title' => $photo->title,
                'caption' => $photo->caption,
                'taken_at' => $photo->taken_at?->toDateString(),
                'is_published' => $photo->is_published,
                'gallery_category_id' => $photo->gallery_category_id,
                'image' => $this->images->url($photo->image_path),
            ],
            'categories' => $this->categoryOptions(),
        ]));
    }

    public function update(Request $request, GalleryPhoto $photo): RedirectResponse
    {
        $data = $this->validated($request, false);
        $data['is_published'] = $request->boolean('is_published');

        if ($request->hasFile('image')) {
            $this->images->delete($photo->image_path);
            $data['image_path'] = $this->images->store($request->file('image'), 'galeri');
        }

        $photo->update($data);

        return redirect()->route('admin.galeri.index')->with('success', 'Data foto berhasil diperbarui.');
    }

    public function destroy(GalleryPhoto $photo): RedirectResponse
    {
        $this->images->delete($photo->image_path);
        $photo->delete();

        return back()->with('success', 'Foto telah dihapus dari galeri.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, bool $imageRequired = true): array
    {
        $rules = [
            'title' => ['nullable', 'string', 'max:150'],
            'caption' => ['nullable', 'string', 'max:500'],
            'taken_at' => ['nullable', 'date'],
            'gallery_category_id' => ['nullable', 'integer', 'exists:gallery_categories,id'],
            'image' => [$imageRequired ? 'required' : 'nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ];

        $data = $request->validate($rules, [], [
            'image.required' => 'Foto wajib diunggah.',
            'image.image' => 'Berkas harus berupa gambar.',
            'image.mimes' => 'Format harus JPG, PNG, atau WebP.',
            'image.max' => 'Ukuran foto maksimal 4 MB.',
        ]);

        return [
            'title' => $data['title'] ?? null,
            'caption' => $data['caption'] ?? null,
            'taken_at' => $data['taken_at'] ?? null,
            'gallery_category_id' => ! empty($data['gallery_category_id'])
                ? (int) $data['gallery_category_id']
                : null,
        ];
    }

    /**
     * @return array<int, array{id: int, name: string}>
     */
    private function categoryOptions(): array
    {
        return GalleryCategory::orderBy('sort_order')->get()
            ->map(fn (GalleryCategory $c) => ['id' => $c->id, 'name' => $c->name])
            ->all();
    }
}
