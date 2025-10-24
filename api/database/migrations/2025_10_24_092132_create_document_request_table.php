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
        Schema::create('document_request', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('user_id')
                ->constrained('user')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('campus_id')
                ->constrained('campus')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('document_type_id')
                ->constrained('document_type')
                ->onDelete('cascade');
            // Fields
            $table->text('purpose');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_request');
    }
};
