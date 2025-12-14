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
        Schema::create('university_admission_criteria', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('university_admission_id')
                ->constrained('university_admission')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('requirement_id')
                ->constrained('requirement')
                ->onDelete('cascade');
            // Field
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('max_score');
            $table->integer('min_score');
            $table->integer('weight');
            $table->boolean('is_active')->default(true);
            $table->string('file_suffix');
            // Unique
            $table->unique(['university_admission_id', 'title', 'requirement_id'], 'university_admission_criteria_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('university_admission_criteria');
    }
};
