<?php

use App\Constant\AdmissionAndScholarshipOffice;
use App\Constant\MainCampus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('office', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('campus_id')
                ->constrained('campus')
                ->onDelete('cascade');
            // Field
            $table->string('name');
            $table->string('description')->nullable();
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();

            // Unique
            $table->unique(['campus_id', 'name'], 'office_unique');
        });

        // Insert default office
        DB::table('office')->insert([
            'id' => AdmissionAndScholarshipOffice::ID,
            'campus_id' => MainCampus::ID,
            'name' => AdmissionAndScholarshipOffice::NAME,
            'description' => AdmissionAndScholarshipOffice::DESCRIPTION,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('office');

        // Delete default office
        DB::table('office')
            ->where('campus_id', MainCampus::ID)
            ->delete();
    }
};
