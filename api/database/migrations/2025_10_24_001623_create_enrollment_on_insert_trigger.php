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
            CREATE TRIGGER enrollment_on_insert_trigger
            AFTER INSERT ON enrollment
            FOR EACH ROW
            BEGIN
                INSERT INTO enrollment_log (enrollment_id, user_id, action, logged_by_user_id, created_at, updated_at)
                VALUES (NEW.id, NEW.user_id, "enroll", NEW.user_id, NOW(), NOW());
            END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS enrollment_on_insert_trigger');
    }
};
