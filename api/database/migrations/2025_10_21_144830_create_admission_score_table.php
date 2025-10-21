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
        Schema::create('admission_score', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('admission_application_id')
                ->constrained('admission_application')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('academic_program_criteria_id')
                ->constrained('academic_program_criteria')
                ->onDelete('cascade');
            // Fields
            $table->decimal('score', 10, 2);
            $table->text('comments')->nullable();
            $table->boolean('is_passed')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admission_score');
    }
};
