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
        Schema::create('academic_program_criteria', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('academic_program_id')
                ->constrained('academic_program')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('school_year_id')
                ->constrained('school_year')
                ->onDelete('cascade');
            // Field
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('max_score');
            $table->integer('min_score');
            $table->integer('weight');
            $table->boolean('is_active')->default(true);
            // Unique
            $table->unique(['academic_program_id', 'school_year_id', 'title'], 'academic_program_criteria_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_program_criteria');
    }
};
