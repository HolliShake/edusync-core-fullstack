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
        Schema::create('gradebook_item_detail', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('gradebook_item_id')
                ->constrained('gradebook_item')
                ->onDelete('cascade');
            // Field
            $table->string('title');
            $table->decimal('min_score', 10, 2);
            $table->decimal('max_score', 10, 2);
            $table->decimal('weight', 10, 2);

            // Unique
            $table->unique(['gradebook_item_id', 'title'], 'gradebook_item_detail_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gradebook_item_detail');
    }
};
