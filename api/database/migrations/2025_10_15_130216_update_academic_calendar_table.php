<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enum\CalendarEventEnum;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('academic_calendar', function (Blueprint $table) {
            $table->enum('event', array_map(fn($enum) => $enum->value, CalendarEventEnum::cases()))
                ->default(CalendarEventEnum::OTHER->value);
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
