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
        Schema::create('university_admission_schedule', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('university_admission_id')
                ->constrained('university_admission')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('testing_center_id')
                ->constrained('testing_center')
                ->onDelete('cascade');
            // Field
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            // Unique
            $table->unique(['university_admission_id', 'testing_center_id', 'start_date', 'end_date'], 'university_admission_schedule_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('university_admission_schedule');
    }
};
