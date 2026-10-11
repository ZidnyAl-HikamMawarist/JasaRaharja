<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class ImageService
{
    public const MAX_WIDTH = 1280;

    public const MAX_HEIGHT = 1280;

    /**
     * Menyimpan gambar yang sudah dikompresi ke WebP + thumbnail.
     *
     * @return string path relatif terhadap disk publik
     */
    public function store(UploadedFile $file, string $folder): string
    {
        $slug = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) ?: 'gambar';
        $name = $folder.'/'.now()->format('Y/m').'/'.$slug.'-'.Str::random(6).'.webp';

        $image = Image::read($file->getRealPath());

        $image->scaleDown(self::MAX_WIDTH, self::MAX_HEIGHT)
            ->toWebp(quality: 82)
            ->save(Storage::disk('public')->path($name));

        $image->scaleDown(480, 480)
            ->toWebp(quality: 78)
            ->save(Storage::disk('public')->path($this->thumbPath($name)));

        return $name;
    }

    /**
     * Path thumbnail diturunkan dari path utama agar mudah dihapus.
     */
    public function thumbPath(string $mainPath): string
    {
        return preg_replace('#^(.+)/([^/]+)$#', '$1/thumbnails/$2', $mainPath) ?: $mainPath;
    }

    public function url(?string $path): ?string
    {
        return filled($path) ? asset('storage/'.$path) : null;
    }

    public function thumbUrl(?string $path): ?string
    {
        return filled($path) ? asset('storage/'.$this->thumbPath($path)) : null;
    }

    public function delete(?string $path): void
    {
        if (blank($path)) {
            return;
        }

        Storage::disk('public')->delete([$path, $this->thumbPath($path)]);
    }
}
