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
        Schema::create('section', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('curriculum_detail_id')
                ->constrained('curriculum_detail')
                ->onDelete('cascade');
            $table->foreignId('school_year_id')
                ->constrained('school_year')
                ->onDelete('cascade');
            // Field
            $table->string('section_ref')->unique();
            $table->string('section_name');
            $table->integer('min_students');
            $table->integer('max_students');
            $table->boolean('is_posted')
                ->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('section');
    }
};
