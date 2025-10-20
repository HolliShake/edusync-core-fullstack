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
        Schema::create('admission_application', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Auto
            $table->year('year')
                ->default(now()->year);
            $table->unsignedBigInteger('pool_no');
            // Fields
            $table->string('firstName');
            $table->string('lastName');
            $table->string('middleName')->nullable();
            $table->string('email');
            $table->string('phone');
            $table->text('address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admission_application');
    }
};
