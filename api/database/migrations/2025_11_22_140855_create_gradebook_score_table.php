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
        Schema::create('gradebook_score', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('gradebook_item_detail_id')
                ->constrained('gradebook_item_detail')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('enrollment_id')
                ->constrained('enrollment')
                ->onDelete('cascade');
            // Field
            $table->decimal('score', 10, 2);

            // Unique
            $table->unique(['gradebook_item_detail_id', 'enrollment_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gradebook_score');
    }
};
