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
        Schema::create('eligibility_application', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('user_id')
                ->constrained('user')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('eligibility_schedule_id')
                ->constrained('eligibility_schedule')
                ->onDelete('cascade');
            // Field
            $table->integer('validity_in_years')->default(3);
            $table->date('eligibility_date')->nullable()->default(null); // date of eligibility | null if not eligible
            $table->boolean('is_passed')->default(false); // passed through exam?
            // Unique
            $table->unique(['user_id', 'eligibility_schedule_id'], 'eligibility_application_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eligibility_application');
    }
};
