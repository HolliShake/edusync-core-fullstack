<?php

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
        DB::unprepared('
            CREATE TRIGGER university_admission_application_insert_trigger
            AFTER INSERT ON university_admission_application
            FOR EACH ROW
            BEGIN
                INSERT INTO university_admission_application_log (university_admission_application_id, user_id, type, note, created_at, updated_at)
                VALUES (NEW.id, NEW.user_id, "submitted", NULL, NOW(), NOW());
            END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS university_admission_application_insert_trigger');
    }
};
