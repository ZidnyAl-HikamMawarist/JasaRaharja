<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ArticleCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'kategori' => ['nullable', 'integer', 'exists:article_categories,id'],
        ]);

        $articles = Article::published()
            ->with('category')
            ->search($filters['q'] ?? null)
            ->when($filters['kategori'] ?? null, fn ($q, $id) => $q->where('article_category_id', $id))
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->paginate(9)
            ->withQueryString()
            ->through(fn (Article $a) => $this->card($a));

        return Inertia::render('public/ArticleIndex', array_merge($this->publicShell('berita'), [
            'articles' => $articles,
            'filters' => [
                'q' => $filters['q'] ?? '',
                'kategori' => $filters['kategori'] ?? null,
            ],
            'categories' => ArticleCategory::query()
                ->withCount(['articles' => fn ($q) => $q->published()])
                ->orderBy('sort_order')
                ->get()
                ->filter(fn (ArticleCategory $c) => $c->articles_count > 0)
                ->map(fn (ArticleCategory $c) => [
                    'id' => $c->id,
                    'name' => $c->name,
                    'slug' => $c->slug,
                    'color' => $c->color,
                    'count' => $c->articles_count,
                ])
                ->values(),
        ]));
    }

    public function show(string $slug): Response
    {
        $article = Article::published()->with(['category', 'author'])->where('slug', $slug)->firstOrFail();

        $article->increment('views');

        $related = Article::published()
            ->with('category')
            ->whereKeyNot($article->id)
            ->when($article->article_category_id, fn ($q) => $q->where('article_category_id', $article->article_category_id))
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->limit(3)
            ->get()
            ->map(fn (Article $a) => $this->card($a));

        if ($related->count() < 3) {
            $fill = Article::published()
                ->with('category')
                ->whereKeyNot($article->id)
                ->whereNotIn('id', $related->pluck('id')->push($article->id)->all())
                ->orderByDesc('published_at')
                ->orderByDesc('id')
                ->limit(3 - $related->count())
                ->get()
                ->map(fn (Article $a) => $this->card($a));

            $related = $related->concat($fill);
        }

        return Inertia::render('public/ArticleShow', array_merge($this->publicShell('berita'), [
            'article' => [
                'id' => $article->id,
                'title' => $article->title,
                'excerpt' => $article->excerpt,
                'content' => $article->content,
                'image' => $article->image_path ? asset('storage/'.$article->image_path) : null,
                'published_at' => $article->published_at?->format('d F Y'),
                'views' => $article->views,
                'reading_time' => $article->reading_time,
                'category' => $article->category?->name,
                'category_color' => $article->category?->color,
                'author' => $article->author?->name ?? 'Humas Jasa Raharja',
            ],
            'related' => $related,
        ]));
    }

    /**
     * @return array<string, mixed>
     */
    private function card(Article $a): array
    {
        return [
            'id' => $a->id,
            'title' => $a->title,
            'slug' => $a->slug,
            'excerpt' => $a->excerpt,
            'image' => $a->image_path ? asset('storage/'.$a->image_path) : null,
            'published_at' => $a->published_at?->format('d M Y'),
            'category' => $a->category?->name,
            'category_color' => $a->category?->color,
            'reading_time' => $a->reading_time,
        ];
    }
}
