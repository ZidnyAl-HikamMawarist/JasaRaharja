<?php

use App\Http\Controllers\Admin\AssetController;
use App\Http\Controllers\Admin\AssetExportController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\GalleryCategoryController;
use App\Http\Controllers\Admin\GalleryPhotoController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\AssetCategoryController;
use App\Http\Controllers\Admin\ArticleCategoryController;
use App\Http\Controllers\Admin\VisitorController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Public\ArticleController as PublicArticleController;
use App\Http\Controllers\Public\GalleryController;
use App\Http\Controllers\Public\HomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/berita', [PublicArticleController::class, 'index'])->name('berita.index');
Route::get('/berita/{slug}', [PublicArticleController::class, 'show'])->name('berita.show');
Route::get('/galeri', [GalleryController::class, 'index'])->name('galeri');
Route::get('/kontak', [HomeController::class, 'contact'])->name('kontak');

Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
Route::get('/admin/login', [AuthenticatedSessionController::class, 'create'])->name('admin.login');
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->middleware('throttle:6,1');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

Route::prefix('admin')->name('admin.')->middleware('admin.auth')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('berita', ArticleController::class)->parameters(['berita' => 'article']);
    Route::match(['patch', 'post'], 'berita/{article}/toggle', [ArticleController::class, 'toggle'])
        ->name('berita.toggle');
    Route::match(['patch', 'post'], 'berita/{article}/feature', [ArticleController::class, 'feature'])
        ->name('berita.feature');

    Route::resource('kategori-berita', ArticleCategoryController::class)
        ->except(['show', 'create', 'edit'])
        ->parameters(['kategori-berita' => 'category']);

    Route::resource('galeri', GalleryPhotoController::class);
    Route::resource('kategori-galeri', GalleryCategoryController::class)
        ->except(['show', 'create', 'edit'])
        ->parameters(['kategori-galeri' => 'category']);

    Route::resource('inventaris', AssetController::class);
    Route::resource('kategori-aset', AssetCategoryController::class)
        ->except(['show', 'create', 'edit'])
        ->parameters(['kategori-aset' => 'category']);

    Route::prefix('inventaris/ekspor')->name('inventaris.ekspor.')->group(function () {
        Route::get('excel', [AssetExportController::class, 'excel'])->name('excel');
        Route::get('csv', [AssetExportController::class, 'csv'])->name('csv');
        Route::get('pdf', [AssetExportController::class, 'pdf'])->name('pdf');
    });

    Route::get('pengunjung', [VisitorController::class, 'index'])->name('visitors.index');
    Route::delete('pengunjung/{visitor}', [VisitorController::class, 'destroy'])->name('visitors.destroy');
    Route::post('pengunjung/clear', [VisitorController::class, 'clear'])->name('visitors.clear');

    Route::get('pengaturan', [SettingController::class, 'edit'])->name('pengaturan.edit');
    Route::put('pengaturan', [SettingController::class, 'update'])->name('pengaturan.update');
    Route::put('pengaturan/profil', [SettingController::class, 'updateProfile'])->name('pengaturan.profil');
});
