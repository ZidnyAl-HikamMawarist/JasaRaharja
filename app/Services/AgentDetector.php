<?php

namespace App\Services;

class AgentDetector
{
    /**
     * Parse User Agent into structured device, platform, and browser.
     *
     * @return array{device_type: string, platform: string, browser: string}
     */
    public static function parse(?string $userAgent): array
    {
        $ua = $userAgent ?? '';

        return [
            'device_type' => self::detectDeviceType($ua),
            'platform' => self::detectPlatform($ua),
            'browser' => self::detectBrowser($ua),
        ];
    }

    private static function detectDeviceType(string $ua): string
    {
        if (empty($ua)) {
            return 'desktop';
        }

        // Bot / Crawler
        if (preg_match('/(bot|crawler|spider|slurp|facebookexternalhit|whatsapp|telegram)/i', $ua)) {
            return 'bot';
        }

        // Tablet
        if (preg_match('/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i', $ua)) {
            return 'tablet';
        }

        // Mobile
        if (preg_match('/(mobile|ipod|iphone|android|blackberry|opera mini|opera mobi|windows phone|iemobile)/i', $ua)) {
            return 'mobile';
        }

        return 'desktop';
    }

    private static function detectPlatform(string $ua): string
    {
        if (empty($ua)) {
            return 'Unknown';
        }

        $platforms = [
            'Android' => '/android/i',
            'iOS' => '/(iphone|ipad|ipod)/i',
            'Windows' => '/windows nt/i',
            'macOS' => '/(macintosh|mac os x)/i',
            'Linux' => '/linux/i',
            'Chrome OS' => '/cros/i',
        ];

        foreach ($platforms as $platform => $pattern) {
            if (preg_match($pattern, $ua)) {
                return $platform;
            }
        }

        return 'Lainnya';
    }

    private static function detectBrowser(string $ua): string
    {
        if (empty($ua)) {
            return 'Unknown';
        }

        if (preg_match('/(bot|crawler|spider)/i', $ua)) {
            return 'Bot/Crawler';
        }

        if (preg_match('/edg/i', $ua)) {
            return 'Edge';
        }
        if (preg_match('/samsungbrowser/i', $ua)) {
            return 'Samsung Browser';
        }
        if (preg_match('/opr|opera/i', $ua)) {
            return 'Opera';
        }
        if (preg_match('/chrome|crios/i', $ua) && !preg_match('/edg|opr/i', $ua)) {
            return 'Chrome';
        }
        if (preg_match('/firefox|fxios/i', $ua)) {
            return 'Firefox';
        }
        if (preg_match('/safari/i', $ua) && !preg_match('/chrome|crios|android/i', $ua)) {
            return 'Safari';
        }

        return 'Lainnya';
    }
}
