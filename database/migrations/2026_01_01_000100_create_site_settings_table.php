<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->longText('value')->nullable();
            $table->string('group')->default('umum')->index();
            $table->timestamps();

            $table->index(['group', 'key'], 'site_settings_group_key_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
