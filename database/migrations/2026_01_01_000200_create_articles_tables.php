<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('article_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->string('slug', 100)->unique();
            $table->string('color', 20)->default('#2563eb');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('excerpt', 500)->nullable();
            $table->string('image_path')->nullable();
            $table->longText('content')->nullable();
            $table->enum('status', ['draft', 'published'])->default('published')->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->unsignedInteger('views')->default(0);
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('published_at')->index();
            $table->timestamps();

            $table->index(['status', 'published_at'], 'articles_status_published_index');
            $table->index(['title', 'excerpt'], 'articles_search_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
        Schema::dropIfExists('article_categories');
    }
};
