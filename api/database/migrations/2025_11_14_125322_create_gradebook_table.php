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
        Schema::create('gradebook', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('section_id')
                ->nullable()
                ->constrained('section')
                ->onDelete('cascade'); // nullable if is_template is true
            // Fk
            $table->foreignId('academic_program_id')
                ->constrained('academic_program')
                ->onDelete('cascade');
            // Field
            $table->boolean('is_template')->default(false);
            $table->string('title');

            // Unique
            $table->unique(['section_id', 'academic_program_id', 'is_template', 'title'], 'gradebook_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gradebook');
    }
};
