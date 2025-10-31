<?php

use App\Enum\CourseRequisiteTypeEnum;
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
        Schema::create('course_requisite', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('course_id')
                ->constrained('course')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('requisite_course_id')
                ->constrained('course')
                ->onDelete('cascade');

            // Field
            $table->enum('requisite_type', array_column(CourseRequisiteTypeEnum::cases(), 'value'))->default(CourseRequisiteTypeEnum::PRE_REQUISITE->value);

            // Unique
            $table->unique(['course_id', 'requisite_course_id', 'requisite_type'], 'course_requisite_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_requisite');
    }
};
