<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

#[Fillable(['name', 'slug', 'sort_order'])]
class GalleryCategory extends Model
{
    protected $guarded = ['id'];

    public function photos(): HasMany
    {
        return $this->hasMany(GalleryPhoto::class, 'gallery_category_id');
    }

    public static function booted(): void
    {
        static::saving(function (GalleryCategory $category) {
            $category->slug = Str::slug($category->slug ?: $category->name) ?: 'kategori';
        });
    }
}
