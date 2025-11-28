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
        Schema::create('eligibility_schedule', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('school_year_id')
                ->constrained('school_year')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('room_id')
                ->constrained('room')
                ->onDelete('cascade');
            // Field
            $table->date('start_date');
            $table->date('end_date');
            // Unique
            $table->unique(['school_year_id', 'room_id', 'start_date', 'end_date'], 'eligibility_schedule_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eligibility_schedule');
    }
};
