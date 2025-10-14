<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Ensure start_date and end_date do not overlap with any existing school_years using triggers (MySQL syntax)
        // Also ensure that only one SchoolYear has is_active = 1

        // BEFORE INSERT: Prevent overlapping dates + only one active school_year
        DB::unprepared("
            CREATE TRIGGER school_year_constraints_before_insert
            BEFORE INSERT ON school_year
            FOR EACH ROW
            BEGIN
                -- Check for overlapping date ranges
                IF EXISTS (
                    SELECT 1 FROM school_year
                    WHERE
                        (NEW.start_date <= end_date AND NEW.end_date >= start_date)
                ) THEN
                    SIGNAL SQLSTATE '45000'
                        SET MESSAGE_TEXT = 'Date range overlaps with an existing SchoolYear.';
                END IF;

                -- Check that there is only one active school year
                IF NEW.is_active = 1 THEN
                    IF EXISTS (
                        SELECT 1 FROM school_year WHERE is_active = 1
                    ) THEN
                        SIGNAL SQLSTATE '45000'
                            SET MESSAGE_TEXT = 'Only one SchoolYear can be active at a time.';
                    END IF;
                END IF;
            END
        ");

        // BEFORE UPDATE: Prevent overlapping dates (ignore the row itself) + only one active school_year
        DB::unprepared("
            CREATE TRIGGER school_year_constraints_before_update
            BEFORE UPDATE ON school_year
            FOR EACH ROW
            BEGIN
                -- Check for overlapping date ranges (ignore itself)
                IF EXISTS (
                    SELECT 1 FROM school_year
                    WHERE
                        id <> NEW.id
                        AND (NEW.start_date <= end_date AND NEW.end_date >= start_date)
                ) THEN
                    SIGNAL SQLSTATE '45000'
                        SET MESSAGE_TEXT = 'Date range overlaps with an existing SchoolYear.';
                END IF;

                -- If setting active, make sure it's the only one
                IF NEW.is_active = 1 THEN
                    IF EXISTS (
                        SELECT 1 FROM school_year
                        WHERE id <> NEW.id AND is_active = 1
                    ) THEN
                        SIGNAL SQLSTATE '45000'
                            SET MESSAGE_TEXT = 'Only one SchoolYear can be active at a time.';
                    END IF;
                END IF;
            END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the triggers created in up()
        DB::unprepared("DROP TRIGGER IF EXISTS school_year_constraints_before_insert");
        DB::unprepared("DROP TRIGGER IF EXISTS school_year_constraints_before_update");
    }
};
