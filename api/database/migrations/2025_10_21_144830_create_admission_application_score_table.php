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
        Schema::create('admission_application_score', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('admission_application_id')
                ->constrained('admission_application')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('admission_criteria_id')
                ->constrained('admission_criteria')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('user_id')
                ->constrained('user')
                ->onDelete('cascade');
            // Fields
            $table->decimal('score', 10, 2);
            $table->text('comments')->nullable();
            $table->boolean('is_posted')->default(false);

            // Unique
            $table->unique(['admission_application_id', 'admission_criteria_id', 'user_id'], 'admission_application_score_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admission_application_score');
    }
};
