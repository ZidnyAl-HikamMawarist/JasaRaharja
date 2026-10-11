<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

#[Fillable(['name', 'slug', 'color', 'sort_order'])]
class ArticleCategory extends Model
{
    protected $guarded = ['id'];

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class, 'article_category_id');
    }

    public static function booted(): void
    {
        static::saving(function (ArticleCategory $category) {
            $category->slug = Str::slug($category->slug ?: $category->name) ?: 'kategori';
        });
    }
}
