<?php

use App\Enum\EnrollmentLogActionEnum;
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
        Schema::create('enrollment_log', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            //
            $table->foreignId('enrollment_id')
                ->constrained('enrollment')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('user_id')
                ->constrained('user')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('logged_by_user_id')
                ->constrained('user')
                ->onDelete('cascade');
            // Field
            $table->enum('action', array_column(EnrollmentLogActionEnum::cases(), 'value'));

            // Unique
            $table->unique(['enrollment_id', 'action'], 'enrollment_log_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollment_log');
    }
};
