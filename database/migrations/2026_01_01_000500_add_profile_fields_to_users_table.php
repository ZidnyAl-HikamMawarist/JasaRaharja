<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username', 100)->unique()->after('name');
            $table->string('phone', 30)->nullable()->after('email');
            $table->string('role_label', 100)->default('Administrator')->after('phone');
            $table->timestamp('last_login_at')->nullable()->after('role_label');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['username', 'phone', 'role_label', 'last_login_at']);
        });
    }
};
