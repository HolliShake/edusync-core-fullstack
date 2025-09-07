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
        Schema::create('academic_program', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('program_name');
            $table->string('short_name');
            $table->date('year_first_implemented');
            $table->foreignId('college_id')
                ->constrained('college')
                ->onDelete('cascade');
            $table->foreignId('program_type_id')
                ->constrained('program_type')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_program');
    }
};
