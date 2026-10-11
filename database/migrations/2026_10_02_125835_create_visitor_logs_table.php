<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('visitor_logs', function (Blueprint $table) {
            $table->id();
            $table->string('ip_address', 45)->index();
            $table->string('url', 255)->default('/');
            $table->string('method', 10)->default('GET');
            $table->string('referer', 500)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('device_type', 20)->default('desktop')->index();
            $table->string('platform', 50)->nullable();
            $table->string('browser', 50)->nullable();
            $table->string('country', 10)->nullable();
            $table->string('city', 100)->nullable();
            $table->timestamps();

            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visitor_logs');
    }
};
