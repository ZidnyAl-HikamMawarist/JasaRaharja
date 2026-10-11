<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VisitorLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class VisitorController extends Controller
{
    /**
     * Display a listing of visitor logs and analytics.
     */
    public function index(Request $request): Response
    {
        $filters = [
            'q' => $request->input('q', ''),
            'device' => $request->input('device', 'all'),
            'date' => $request->input('date', 'all'),
        ];

        $visitors = VisitorLog::query()
            ->filter($filters)
            ->latest('id')
            ->paginate(25)
            ->withQueryString()
            ->through(fn (VisitorLog $v) => [
                'id' => $v->id,
                'ip_address' => $v->ip_address,
                'url' => $v->url,
                'method' => $v->method,
                'device_type' => $v->device_type,
                'platform' => $v->platform ?? 'Unknown',
                'browser' => $v->browser ?? 'Unknown',
                'country' => $v->country ?? 'ID',
                'referer' => $v->referer,
                'created_at' => $v->created_at?->format('d M Y, H:i:s'),
                'time_ago' => $v->created_at?->diffForHumans(),
            ]);

        $totalVisits = VisitorLog::count();
        $uniqueIps = VisitorLog::distinct('ip_address')->count('ip_address');
        $todayVisits = VisitorLog::today()->count();
        $todayUnique = VisitorLog::today()->distinct('ip_address')->count('ip_address');

        $mobileCount = VisitorLog::where('device_type', 'mobile')->count();
        $desktopCount = VisitorLog::where('device_type', 'desktop')->count();
        $tabletCount = VisitorLog::where('device_type', 'tablet')->count();

        // Top 5 Visited Pages
        $topPages = VisitorLog::query()
            ->select('url', DB::raw('count(*) as count'))
            ->groupBy('url')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        return Inertia::render('admin/VisitorIndex', array_merge(
            $this->adminShell('pengunjung', 'Data Pengunjung Web'),
            [
                'visitors' => $visitors,
                'filters' => $filters,
                'metrics' => [
                    'total_visits' => $totalVisits,
                    'unique_ips' => $uniqueIps,
                    'today_visits' => $todayVisits,
                    'today_unique' => $todayUnique,
                    'device_stats' => [
                        'mobile' => $mobileCount,
                        'desktop' => $desktopCount,
                        'tablet' => $tabletCount,
                    ],
                ],
                'topPages' => $topPages,
            ]
        ));
    }

    /**
     * Delete a single visitor log record.
     */
    public function destroy(VisitorLog $visitor): RedirectResponse
    {
        $visitor->delete();

        return back()->with('success', 'Catatan log pengunjung berhasil dihapus.');
    }

    /**
     * Clear all visitor log records.
     */
    public function clear(): RedirectResponse
    {
        VisitorLog::truncate();

        return back()->with('success', 'Seluruh riwayat log pengunjung telah dibersihkan.');
    }
}
