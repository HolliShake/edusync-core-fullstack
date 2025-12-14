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
        Schema::create('admission_schedule', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('university_admission_id')
                ->constrained('university_admission')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('academic_program_id')
                ->constrained('academic_program')
                ->onDelete('cascade');
            // Field
            $table->integer('intake_limit');
            $table->date('start_date');
            $table->date('end_date');

            // Unique
            // only one admission schedule per university admission and academic program
            $table->unique(['university_admission_id', 'academic_program_id'], 'admission_schedule_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admission_schedule');
    }
};
