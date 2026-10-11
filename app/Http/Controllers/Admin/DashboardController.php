<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Asset;
use App\Models\AssetCategory;
use App\Models\GalleryPhoto;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $counts = Asset::query()
            ->selectRaw('condition_status, COUNT(*) as total')
            ->groupBy('condition_status')
            ->pluck('total', 'condition_status');

        $byCategory = AssetCategory::query()
            ->withCount('assets')
            ->orderBy('sort_order')
            ->get()
            ->map(fn (AssetCategory $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'count' => $c->assets_count,
                'bar' => Asset::where('asset_category_id', $c->id)->count(),
            ]);

        $recentArticles = Article::query()
            ->with('category')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Article $a) => [
                'id' => $a->id,
                'title' => $a->title,
                'status' => $a->status,
                'is_featured' => $a->is_featured,
                'published_at' => $a->published_at?->format('d M Y'),
                'views' => $a->views,
            ]);

        $articlesByMonth = Article::query()
            ->where('status', 'published')
            ->where('published_at', '>=', now()->subMonths(11)->startOfMonth())
            ->get(['published_at'])
            ->groupBy(fn (Article $a) => $a->published_at->format('Y-m'))
            ->map->count()
            ->sortKeys();

        return Inertia::render('admin/Dashboard', array_merge($this->adminShell('dashboard', 'Ringkasan Dashboard'), [
            'cards' => [
                [
                    'label' => 'Total Aset Tetap',
                    'value' => Asset::count(),
                    'hint' => AssetCategory::count().' kategori aset',
                    'tone' => 'blue',
                ],
                [
                    'label' => 'Aset Kondisi Baik',
                    'value' => (int) ($counts['baik'] ?? 0),
                    'hint' => 'Siap digunakan',
                    'tone' => 'emerald',
                ],
                [
                    'label' => 'Perlu Servis',
                    'value' => (int) ($counts['servis'] ?? 0),
                    'hint' => 'Butuh perbaikan ringan',
                    'tone' => 'amber',
                ],
                [
                    'label' => 'Rusak Berat',
                    'value' => (int) ($counts['rusak'] ?? 0),
                    'hint' => 'Perlu tindakan segera',
                    'tone' => 'rose',
                ],
                [
                    'label' => 'Artikel Terbit',
                    'value' => Article::published()->count(),
                    'hint' => Article::where('status', 'draft')->count().' draft',
                    'tone' => 'sky',
                ],
                [
                    'label' => 'Foto Galeri',
                    'value' => GalleryPhoto::count(),
                    'hint' => GalleryPhoto::where('is_published', false)->count().' belum publik',
                    'tone' => 'indigo',
                ],
            ],
            'conditionBreakdown' => [
                ['label' => 'Baik', 'value' => (int) ($counts['baik'] ?? 0), 'color' => '#10b981'],
                ['label' => 'Perlu Servis', 'value' => (int) ($counts['servis'] ?? 0), 'color' => '#f59e0b'],
                ['label' => 'Rusak Berat', 'value' => (int) ($counts['rusak'] ?? 0), 'color' => '#ef4444'],
            ],
            'byCategory' => $byCategory,
            'recentArticles' => $recentArticles,
            'chart' => [
                'labels' => $articlesByMonth->keys()->map(fn ($k) => \Carbon\Carbon::createFromFormat('Y-m', $k)->translatedFormat('M'))->values(),
                'values' => $articlesByMonth->values(),
            ],
        ]));
    }
}
