<?php

namespace App\Http\Middleware;

use App\Models\VisitorLog;
use App\Services\AgentDetector;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class TrackVisitor
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only track successful GET requests for public pages
        if ($request->isMethod('GET') && $this->shouldTrack($request)) {
            $this->logVisitor($request);
        }

        return $response;
    }

    /**
     * Determine if the request should be logged.
     */
    private function shouldTrack(Request $request): bool
    {
        // Don't track admin backend, auth endpoints, or asset routes
        if ($request->is(
            'admin*',
            'login*',
            'logout*',
            'build*',
            'images*',
            'storage*',
            'favicon*',
            'robots.txt',
            'up',
            'api*'
        )) {
            return false;
        }

        return true;
    }

    /**
     * Record visitor details into database.
     */
    private function logVisitor(Request $request): void
    {
        try {
            // Resolve true visitor IP (Cloudflare Tunnel passes CF-Connecting-IP)
            $rawIp = $request->header('cf-connecting-ip')
                ?? $request->header('x-real-ip')
                ?? $request->header('x-forwarded-for')
                ?? $request->ip();

            if (str_contains($rawIp, ',')) {
                $rawIp = trim(explode(',', $rawIp)[0]);
            }

            $ip = substr($rawIp, 0, 45);
            $url = '/' . ltrim($request->path(), '/');

            // Debounce: don't log duplicate refresh of identical URL from same IP within 15 seconds
            $recent = VisitorLog::query()
                ->where('ip_address', $ip)
                ->where('url', $url)
                ->where('created_at', '>=', now()->subSeconds(15))
                ->exists();

            if ($recent) {
                return;
            }

            $userAgent = $request->userAgent();
            $detected = AgentDetector::parse($userAgent);
            $country = $request->header('cf-ipcountry');

            // If local loopback, label as Local
            if (in_array($ip, ['127.0.0.1', '::1'])) {
                $country = $country ?? 'Local';
            } else {
                $country = $country ?? 'ID';
            }

            VisitorLog::create([
                'ip_address' => $ip,
                'url' => substr($url, 0, 255),
                'method' => 'GET',
                'referer' => substr((string) $request->header('referer'), 0, 500) ?: null,
                'user_agent' => $userAgent,
                'device_type' => $detected['device_type'],
                'platform' => $detected['platform'],
                'browser' => $detected['browser'],
                'country' => $country ? substr($country, 0, 10) : null,
                'city' => null,
            ]);
        } catch (Throwable) {
            // Silently ignore logging exceptions to never disrupt user experience
        }
    }
}
