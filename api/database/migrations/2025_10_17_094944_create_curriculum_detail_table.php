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
        Schema::create('curriculum_detail', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('curriculum_id')
                ->constrained('curriculum')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('course_id')
                ->constrained('course')
                ->onDelete('cascade');
            // Field
            $table->integer('year_order')->default(0);
            $table->integer('term_order')->default(0); 
            $table->string('term_alias');
            $table->boolean('is_include_gwa')->default(false);

            $table->unique(['curriculum_id', 'course_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('curriculum_detail');
    }
};
