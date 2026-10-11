<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gallery_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->string('slug', 100)->unique();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('gallery_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gallery_category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title')->nullable();
            $table->string('caption', 500)->nullable();
            $table->string('image_path');
            $table->date('taken_at')->nullable();
            $table->boolean('is_published')->default(true)->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_photos');
        Schema::dropIfExists('gallery_categories');
    }
};
