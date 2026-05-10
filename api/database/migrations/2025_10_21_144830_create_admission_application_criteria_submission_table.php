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
        Schema::create('admission_application_criteria_submission', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('admission_application_id');
            $table->foreign('admission_application_id', 'aacs_app_fk')
                ->references('id')
                ->on('admission_application')
                ->cascadeOnDelete();

            $table->foreignId('admission_criteria_id');
            $table->foreign('admission_criteria_id', 'aacs_criteria_fk')
                ->references('id')
                ->on('admission_criteria')
                ->cascadeOnDelete();

            // Fields
            $table->decimal('score', 10, 2);
            $table->text('comments')->nullable();
            $table->boolean('is_posted')->default(false);

            // Unique
            $table->unique(['admission_application_id', 'admission_criteria_id'], 'aacs_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admission_application_criteria_submission');
    }
};
