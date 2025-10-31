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
        Schema::create('curriculum_tagging', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('curriculum_id')
                ->constrained('curriculum')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('user_id')
                ->constrained('user')
                ->onDelete('cascade');
            // Field
            $table->boolean('is_active')->default(true);

            // Unique - only one active curriculum per student
            $table->unique(['user_id', 'is_active'], 'curriculum_tagging_user_active_unique');
            // Unique - prevent duplicate curriculum assignments
            $table->unique(['curriculum_id', 'user_id'], 'curriculum_tagging_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('curriculum_tagging');
    }
};
