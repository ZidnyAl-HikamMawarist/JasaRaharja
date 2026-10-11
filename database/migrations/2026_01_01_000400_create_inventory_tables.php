<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asset_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->string('code', 30)->unique();
            $table->text('description')->nullable();
            $table->string('icon', 50)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('asset_conditions', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 30)->unique();
            $table->string('badge_color', 30)->default('gray');
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('asset_code', 50)->unique();
            $table->foreignId('asset_category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('asset_condition_id')->constrained()->cascadeOnDelete();
            $table->string('name', 150);
            $table->string('brand_spec', 200)->nullable();
            $table->string('location', 100);
            $table->decimal('acquisition_value', 15, 2)->nullable();
            $table->date('acquisition_date')->nullable();
            $table->enum('condition_status', ['baik', 'servis', 'rusak'])->default('baik')->index();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['asset_category_id', 'condition_status'], 'assets_cat_condition_index');
            $table->index('location');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assets');
        Schema::dropIfExists('asset_conditions');
        Schema::dropIfExists('asset_categories');
    }
};
