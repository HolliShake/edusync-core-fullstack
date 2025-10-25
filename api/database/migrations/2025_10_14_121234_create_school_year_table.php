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
        Schema::create('school_year', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            //
            $table->string('school_year_code')->unique(); // e.g., "2024-2025"
            $table->string('name'); // e.g., "AY 2024-2025"
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_active')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_year');
    }
};
