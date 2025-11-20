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
        Schema::create('admission_application', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('user_id')
                ->constrained('user')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('admission_schedule_id')
                ->constrained('admission_schedule')
                ->onDelete('cascade');
            // Auto
            $table->year('year')
                ->default(now()->year);
            $table->unsignedBigInteger('pool_no');
            // Fields
            $table->string('first_name');
            $table->string('last_name');
            $table->string('middle_name')->nullable();
            $table->string('email');
            $table->string('phone');
            $table->text('address');

            // Unique
            $table->unique(['user_id', 'admission_schedule_id'], 'admission_application_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admission_application');
    }
};
