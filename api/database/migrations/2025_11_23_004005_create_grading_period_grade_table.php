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
        Schema::create('grading_period_grade', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('gradebook_grading_period_id')
                ->constrained('gradebook_grading_period')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('enrollment_id')
                ->constrained('enrollment')
                ->onDelete('cascade');
            // Field
            $table->decimal('grade', 10, 2);
            $table->boolean('is_posted')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grading_period_grade');
    }
};
