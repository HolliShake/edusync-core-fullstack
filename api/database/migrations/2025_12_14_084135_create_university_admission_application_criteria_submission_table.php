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
        Schema::create('university_admission_application_criteria_submission', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('university_admission_application_id')
                ->constrained('university_admission_application')
                ->onDelete('cascade')
                ->name('uaacs_application_id_foreign');
            // Fk
            $table->foreignId('university_admission_criteria_id')
                ->constrained('university_admission_criteria')
                ->onDelete('cascade')
                ->name('uaacs_criteria_id_foreign');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admission_criteria_submission');
    }
};
