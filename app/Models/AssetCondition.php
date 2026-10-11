<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'slug', 'badge_color', 'description', 'sort_order'])]
class AssetCondition extends Model
{
    protected $guarded = ['id'];

    public function assets(): HasMany
    {
        return $this->hasMany(Asset::class, 'asset_condition_id');
    }
}
