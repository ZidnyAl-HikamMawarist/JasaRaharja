<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ArticleCategory;
use App\Services\ImageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function __construct(private readonly ImageService $images) {}

    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'in:published,draft'],
            'kategori' => ['nullable', 'integer', 'exists:article_categories,id'],
        ]);

        $articles = Article::query()
            ->with('category')
            ->with('author')
            ->search($filters['q'] ?? null)
            ->when($filters['status'] ?? null, fn ($q, $s) => $q->where('status', $s))
            ->when($filters['kategori'] ?? null, fn ($q, $id) => $q->where('article_category_id', $id))
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Article $a) => [
                'id' => $a->id,
                'title' => $a->title,
                'slug' => $a->slug,
                'image' => $a->image_path ? asset('storage/'.$a->image_path) : null,
                'status' => $a->status,
                'is_featured' => $a->is_featured,
                'views' => $a->views,
                'category' => $a->category?->name,
                'category_color' => $a->category?->color,
                'author' => $a->author?->name,
                'published_at' => $a->published_at?->format('d M Y'),
            ]);

        $summary = [
            'total' => Article::count(),
            'published' => Article::where('status', 'published')->count(),
            'draft' => Article::where('status', 'draft')->count(),
            'views' => (int) Article::sum('views'),
        ];

        return Inertia::render('admin/ArticleIndex', array_merge($this->adminShell('berita', 'Kelola Berita'), [
            'articles' => $articles,
            'summary' => $summary,
            'filters' => [
                'q' => $filters['q'] ?? '',
                'status' => $filters['status'] ?? '',
                'kategori' => $filters['kategori'] ?? null,
            ],
            'categories' => ArticleCategory::orderBy('sort_order')->get()
                ->map(fn (ArticleCategory $c) => ['id' => $c->id, 'name' => $c->name, 'color' => $c->color]),
        ]));
    }

    public function create(): Response
    {
        return Inertia::render('admin/ArticleForm', array_merge($this->adminShell('berita', 'Tulis Berita Baru'), [
            'article' => null,
            'categories' => $this->categoryOptions(),
            'suggestedCode' => '',
        ]));
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        DB::transaction(function () use ($data, $request) {
            $article = Article::create([
                ...$data,
                'author_id' => $request->user()->id,
                'published_at' => $data['published_at'] ?? now()->toDateString(),
            ]);

            if ($request->hasFile('image')) {
                $article->update(['image_path' => $this->images->store($request->file('image'), 'berita')]);
            }
        });

        return redirect()->route('admin.berita.index')->with('success', 'Berita berhasil disimpan dan tayang.');
    }

    public function edit(Article $article): Response
    {
        return Inertia::render('admin/ArticleForm', array_merge($this->adminShell('berita', 'Ubah Berita'), [
            'article' => [
                'id' => $article->id,
                'title' => $article->title,
                'slug' => $article->slug,
                'excerpt' => $article->excerpt,
                'content' => $article->content,
                'status' => $article->status,
                'is_featured' => $article->is_featured,
                'published_at' => $article->published_at?->toDateString(),
                'article_category_id' => $article->article_category_id,
                'image' => $article->image_path ? asset('storage/'.$article->image_path) : null,
            ],
            'categories' => $this->categoryOptions(),
        ]));
    }

    public function update(Request $request, Article $article): RedirectResponse
    {
        $data = $this->validated($request, $article);

        DB::transaction(function () use ($article, $data, $request) {
            $article->fill($data);

            if ($request->boolean('hapus_gambar')) {
                $article->image_path = null;
            }

            if ($request->hasFile('image')) {
                $article->image_path = $this->images->store($request->file('image'), 'berita');
            }

            $article->save();
        });

        return redirect()->route('admin.berita.index')->with('success', 'Berita berhasil diperbarui.');
    }

    public function destroy(Article $article): RedirectResponse
    {
        $this->images->delete($article->image_path);
        $article->delete();

        return back()->with('success', 'Berita "'.$article->title.'" telah dihapus.');
    }

    public function toggle(Article $article): RedirectResponse
    {
        $article->update(['status' => $article->status === 'published' ? 'draft' : 'published']);

        return back()->with('success', $article->status === 'published'
            ? 'Berita dipublikasikan.'
            : 'Berita disimpan sebagai draft.');
    }

    public function feature(Article $article): RedirectResponse
    {
        $target = ! $article->is_featured;
        if ($target) {
            Article::where('is_featured', true)->update(['is_featured' => false]);
        }
        $article->update(['is_featured' => $target]);

        return back()->with('success', $target ? 'Berita dijadikan sorotan utama.' : 'Sorotan utama dilepas.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?Article $article = null): array
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'regex:/^[a-z0-9\-]*$/'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string', 'min:20'],
            'status' => ['required', 'in:published,draft'],
            'is_featured' => ['nullable', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'article_category_id' => ['nullable', 'integer', 'exists:article_categories,id'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ], [], [
            'title' => 'judul berita',
            'content' => 'isi berita',
            'image' => 'gambar sampul',
            'image.max' => 'Ukuran gambar maksimal 4 MB.',
        ]);

        return [
            'title' => $data['title'],
            'slug' => filled($data['slug'] ?? null) ? Str::slug($data['slug']) : null,
            'excerpt' => $data['excerpt'] ?? null,
            'content' => $data['content'],
            'status' => $data['status'],
            'is_featured' => $request->boolean('is_featured'),
            'published_at' => $data['published_at'] ?? null,
            'article_category_id' => ! empty($data['article_category_id'])
                ? (int) $data['article_category_id']
                : null,
        ];
    }

    /**
     * @return array<int, array{id: int, name: string, color: string}>
     */
    private function categoryOptions(): array
    {
        return ArticleCategory::orderBy('sort_order')->get()
            ->map(fn (ArticleCategory $c) => ['id' => $c->id, 'name' => $c->name, 'color' => $c->color])
            ->all();
    }
}
