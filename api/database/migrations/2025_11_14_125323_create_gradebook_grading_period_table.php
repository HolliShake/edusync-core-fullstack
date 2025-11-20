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
        Schema::create('gradebook_grading_period', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('gradebook_id')
                ->constrained('gradebook')
                ->onDelete('cascade');
            // Field
            $table->string('title');
            $table->decimal('weight', 10, 2);

            // Unique
            $table->unique(['gradebook_id', 'title'], 'gradebook_grading_period_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gradebook_grading_period');
    }
};
