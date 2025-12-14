<?php

use App\Enum\RequirementTypeEnum;
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
        Schema::create('requirement', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('requirement_name');
            $table->text('description')->nullable();
            $table->enum('requirement_type', array_column(RequirementTypeEnum::cases(), 'value'))
                ->default(RequirementTypeEnum::GENERAL->value);
            $table->boolean('is_mandatory')->default(true);
            $table->boolean('is_active')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requirement');
    }
};
