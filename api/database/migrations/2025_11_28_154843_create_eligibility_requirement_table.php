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
        Schema::create('eligibility_requirement', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('eligibility_schedule_id')
                ->constrained('eligibility_schedule')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('requirement_id')
                ->constrained('requirement')
                ->onDelete('cascade');
            // Field
            $table->boolean('is_mandatory')->default(true);
            $table->boolean('is_active')->default(true);
            // Unique
            $table->unique(['eligibility_schedule_id', 'requirement_id'], 'eligibility_requirement_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eligibility_requirement');
    }
};
