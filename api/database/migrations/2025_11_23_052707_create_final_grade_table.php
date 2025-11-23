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
        Schema::create('final_grade', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('enrollment_id')
                ->constrained('enrollment')
                ->onDelete('cascade');
            // Field
            $table->decimal('grade', 10, 2);
            $table->integer('credited_units')->default(0);
            $table->boolean('is_posted')->default(false);

            // Unique
            $table->unique(['enrollment_id'], 'final_grade_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('final_grade');
    }
};
