<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

#[Fillable([
    'asset_code', 'asset_category_id', 'asset_condition_id', 'name', 'brand_spec',
    'location', 'acquisition_value', 'acquisition_date', 'condition_status', 'notes',
])]
class Asset extends Model
{
    public const STATUSES = ['baik', 'servis', 'rusak'];

    public const STATUS_LABELS = [
        'baik' => 'Baik',
        'servis' => 'Perlu Servis',
        'rusak' => 'Rusak Berat',
    ];

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'acquisition_date' => 'date',
            'acquisition_value' => 'decimal:2',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(AssetCategory::class, 'asset_category_id');
    }

    public function condition(): BelongsTo
    {
        return $this->belongsTo(AssetCondition::class, 'asset_condition_id');
    }

    public static function booted(): void
    {
        static::saving(function (Asset $asset) {
            $asset->condition_status = in_array($asset->condition_status, self::STATUSES, true)
                ? $asset->condition_status
                : 'baik';

            $matching = AssetCondition::where('slug', $asset->condition_status)->first();
            if ($matching) {
                $asset->asset_condition_id = $matching->id;
            }
        });
    }

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['q'] ?? null, fn (Builder $q, $term) => $q->where(function (Builder $sub) use ($term) {
                $like = '%'.str_replace(['%', '_'], ['\%', '\_'], $term).'%';
                $sub->where('name', 'like', $like)
                    ->orWhere('asset_code', 'like', $like)
                    ->orWhere('brand_spec', 'like', $like)
                    ->orWhere('location', 'like', $like);
            }))
            ->when($filters['category'] ?? null, fn (Builder $q, $id) => $q->where('asset_category_id', $id))
            ->when($filters['status'] ?? null, fn (Builder $q, $status) => $q->where('condition_status', $status))
            ->when($filters['location'] ?? null, fn (Builder $q, $loc) => $q->where('location', 'like', '%'.$loc.'%'))
            ->when(($filters['lelang'] ?? null) === 'siap', fn (Builder $q) => $q->whereNotNull('acquisition_date')->where('acquisition_date', '<=', now()->subYears(5)))
            ->when(($filters['lelang'] ?? null) === 'aktif', fn (Builder $q) => $q->where(function (Builder $sub) {
                $sub->whereNull('acquisition_date')->orWhere('acquisition_date', '>', now()->subYears(5));
            }));
    }

    public function getStatusLabelAttribute(): string
    {
        return self::STATUS_LABELS[$this->condition_status] ?? ucfirst((string) $this->condition_status);
    }

    public static function generateCode(AssetCategory|int|null $category = null): string
    {
        $year = now()->year;
        $catCode = 'GEN';

        if ($category instanceof AssetCategory) {
            $catCode = strtoupper($category->code);
        } elseif (is_int($category)) {
            $catCode = strtoupper(AssetCategory::find($category)?->code ?? 'GEN');
        }

        $prefix = "JR-TSK-{$catCode}-{$year}-";

        $last = static::where('asset_code', 'like', $prefix.'%')
            ->orderByDesc('asset_code')
            ->value('asset_code');

        $next = $last ? ((int) substr($last, -4)) + 1 : 1;

        return $prefix.str_pad((string) $next, 4, '0', STR_PAD_LEFT);
    }

    public static function slugAsset(string $value): string
    {
        return Str::slug($value) ?: 'aset';
    }
}
