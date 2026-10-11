<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

#[Fillable(['gallery_category_id', 'title', 'caption', 'image_path', 'taken_at', 'is_published', 'sort_order'])]
class GalleryPhoto extends Model
{
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'taken_at' => 'date',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(GalleryCategory::class, 'gallery_category_id');
    }

    public static function booted(): void
    {
        static::saving(function (GalleryPhoto $photo) {
            if (! $photo->title) {
                $photo->title = 'Dokumentasi '.Str::upper(Str::random(6));
            }
        });
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeLatest(Builder $query): Builder
    {
        return $query->orderByDesc('taken_at')->orderByDesc('sort_order')->orderByDesc('id');
    }
}
