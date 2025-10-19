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
            Schema::create('designition', function (Blueprint $table) {
                $table->id();
                $table->timestamps();
                // Fk
                $table->foreignId('user_id')
                    ->constrained('user')
                    ->onDelete('cascade');
                // Field
                $table->boolean('is_active')->default(true);
                // Polymorphic
                $table->morphs('designitionable'); // academic_program, college
                // Unique
                $table->unique(['user_id', 'designitionable_id', 'designitionable_type']);
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('designition');
    }
};
