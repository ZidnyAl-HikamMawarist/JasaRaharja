<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitorLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'ip_address',
        'url',
        'method',
        'referer',
        'user_agent',
        'device_type',
        'platform',
        'browser',
        'country',
        'city',
    ];

    /**
     * Scope for today's visitors.
     */
    public function scopeToday(Builder $query): Builder
    {
        return $query->whereDate('created_at', today());
    }

    /**
     * Scope for filtering search query.
     */
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['q'] ?? null, function (Builder $query, string $search) {
                $query->where(function (Builder $q) use ($search) {
                    $q->where('ip_address', 'like', "%{$search}%")
                        ->orWhere('url', 'like', "%{$search}%")
                        ->orWhere('platform', 'like', "%{$search}%")
                        ->orWhere('browser', 'like', "%{$search}%")
                        ->orWhere('country', 'like', "%{$search}%");
                });
            })
            ->when($filters['device'] ?? null, function (Builder $query, string $device) {
                if ($device !== 'all') {
                    $query->where('device_type', $device);
                }
            })
            ->when($filters['date'] ?? null, function (Builder $query, string $date) {
                if ($date === 'today') {
                    $query->whereDate('created_at', today());
                } elseif ($date === 'yesterday') {
                    $query->whereDate('created_at', today()->subDay());
                } elseif ($date === '7days') {
                    $query->where('created_at', '>=', now()->subDays(7));
                } elseif ($date === '30days') {
                    $query->where('created_at', '>=', now()->subDays(30));
                }
            });
    }
}
