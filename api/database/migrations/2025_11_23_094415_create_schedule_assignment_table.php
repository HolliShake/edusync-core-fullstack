<?php

use App\Enum\WeeklyScheduleEnum;
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
        Schema::create('schedule_assignment', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('section_id')
                ->constrained('section')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('room_id')
                ->constrained('room')
                ->onDelete('cascade');
            // Field
            $table->enum('day_schedule', array_column(WeeklyScheduleEnum::cases(), 'value'))->default(WeeklyScheduleEnum::MONDAY->value);
            $table->time('start_time');
            $table->time('end_time');

            // Unique
            $table->unique(['section_id', 'room_id', 'day_schedule', 'start_time', 'end_time'], 'schedule_assignment_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedule_assignment');
    }
};
