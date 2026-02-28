<?php

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
        Schema::create('campus', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name');
            $table->string('short_name');
            $table->string('address');
            $table->boolean('main_campus')
                ->default(false);
        });

        // Insert default campus
        DB::table('campus')->insert([
            'id' => MainCampus::ID,
            'name' => MainCampus::NAME,
            'short_name' => MainCampus::SHORTNAME,
            'address' => MainCampus::ADDRESS,
            'main_campus' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campus');

        // Delete default campus
        DB::table('campus')
            ->where('id', MainCampus::ID)
            ->delete();
    }
};
