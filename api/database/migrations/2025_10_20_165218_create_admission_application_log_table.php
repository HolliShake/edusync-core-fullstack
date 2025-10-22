<?php

use App\Enum\AdmissionApplicationLogTypeEnum;
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
        Schema::create('admission_application_log', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('admission_application_id')
                ->constrained('admission_application')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('user_id') // user who made the action
                ->constrained('user')
                ->onDelete('cascade');
            // Fields
            $table->enum('type', array_column(AdmissionApplicationLogTypeEnum::cases(), 'value'));
            $table->text('note')->nullable();

            // Unique
            $table->unique(['admission_application_id', 'user_id', 'type'], 'admission_application_log_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admission_application_log');
    }
};
