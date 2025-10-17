<?php

use App\Enum\CurriculumStateEnum;
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
        Schema::create('curriculum', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('academic_program_id')
                ->constrained('academic_program')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('academic_term_id')
                ->constrained('academic_term')
                ->onDelete('cascade');
            //
            $table->string('curriculum_code')->unique();
            $table->string('curriculum_name');
            $table->text('description')->nullable();
            $table->year('effective_year');
            $table->integer('total_units')->default(0);
            $table->integer('total_hours')->default(0);
            $table->enum('status', array_column(CurriculumStateEnum::cases(), 'value'))->default(CurriculumStateEnum::ACTIVE->value);
            $table->date('approved_date')->nullable();
            $table->string('approved_by')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('curriculum');
    }
};
