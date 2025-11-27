<?php

use App\Enum\AcademicCalendarEventEnum;
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
        Schema::table('academic_calendar', function (Blueprint $table) {
            $table->enum('event', array_map(fn($enum) => $enum->value, AcademicCalendarEventEnum::cases()))
                ->default(AcademicCalendarEventEnum::OTHER->value);
            $table->integer('order')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('academic_calendar', function (Blueprint $table) {
            $table->dropColumn('event');
        });
    }
};
