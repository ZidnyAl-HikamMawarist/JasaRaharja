<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminAuthenticated
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! Auth::check()) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Sesi berakhir, silakan masuk kembali.'], 401);
            }

            return redirect()
                ->guest(route('login'))
                ->with('error', 'Silakan masuk untuk mengakses dashboard.');
        }

        // Single-admin policy: only the first (primary) account may access /admin.
        $primary = \App\Models\User::query()->orderBy('id')->value('id');
        if ((int) Auth::id() !== (int) $primary) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->with('error', 'Akun ini tidak memiliki akses dashboard.');
        }

        if ($request->session()->get('last_activity')) {
            $idleMinutes = (int) config('session.lifetime');
            if (now()->diffInMinutes($request->session()->get('last_activity')) > $idleMinutes) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return redirect()->route('login')->with('error', 'Sesi berakhir karena tidak ada aktivitas selama '.$idleMinutes.' menit.');
            }
        }
        $request->session()->put('last_activity', now()->toDateTimeString());

        return $next($request);
    }
}
