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
        Schema::create('academic_term', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            //
            $table->string('name');
            $table->string('suffix');
            $table->text('description')->nullable();
            //
            $table->integer('number_of_terms');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_term');
    }
};
