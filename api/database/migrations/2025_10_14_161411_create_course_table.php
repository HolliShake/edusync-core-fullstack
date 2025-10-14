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
        Schema::create('course', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            //
            $table->string('course_code')->unique();
            $table->string('course_title');
            $table->text('course_description');
            $table->boolean('with_laboratory')->default(false);
            $table->boolean('is_specialize')->default(false);
            $table->decimal('lecture_units', 18, 2);
            $table->decimal('laboratory_units', 18, 2);
            $table->decimal('credit_units', 18, 2);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course');
    }
};
