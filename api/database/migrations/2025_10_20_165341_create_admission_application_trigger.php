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
            CREATE TRIGGER admission_application_insert_trigger
            AFTER INSERT ON admission_application
            FOR EACH ROW
            BEGIN
                INSERT INTO admission_application_log (admission_application_id, user_id, action, created_at, updated_at)
                VALUES (NEW.id, NEW.user_id, "submitted", NOW(), NOW());
            END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS admission_application_insert_trigger');
    }
};
