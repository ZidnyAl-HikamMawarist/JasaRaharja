<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['group', 'key', 'value'])]
class SiteSetting extends Model
{
    #[Hidden(['value'])]
    protected $guarded = ['id'];

    public static function seed(array $rows): void
    {
        foreach ($rows as $row) {
            static::updateOrCreate(
                ['key' => $row['key']],
                ['group' => $row['group'], 'value' => $row['value']],
            );
        }
    }
}
