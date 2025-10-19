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
        Schema::create('college', function (Blueprint $table) {
            $table->id();
            $table->string('college_name');
            $table->string('college_shortname');
            $table->unsignedBigInteger('campus_id');
            $table->timestamps();
            // Foreign key constraint
            $table->foreign('campus_id')->references('id')->on('campus')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('college');
    }
};
