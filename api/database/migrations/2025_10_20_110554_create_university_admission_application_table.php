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
        Schema::create('university_admission_application', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('university_admission_id')
                ->constrained('university_admission')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('university_admission_schedule_id')
                ->nullable() // the applicant will select if already validated
                ->constrained('university_admission_schedule', 'id', 'ua_sched_fk')
                ->onDelete('set null');
            // Fk
            $table->foreignId('user_id')
                ->constrained('user')
                ->onDelete('cascade');
            // Field
            $table->boolean('is_passed')
                ->nullable()
                ->default(null);
            $table->decimal('score', 10, 2)
                ->nullable()
                ->default(null);
            $table->string('remark');
            // Auto
            $table->year('year')->default(now()->year);
            $table->unsignedBigInteger('pool_no');

            // Unique
            $table->unique(['university_admission_id', 'user_id'], 'university_admission_application_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('university_admission_application');
    }
};
