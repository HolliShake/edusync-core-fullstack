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
        DB::unprepared('
            CREATE TRIGGER enrollment_log_after_insert_registrar_approved
            AFTER INSERT ON enrollment_log
            FOR EACH ROW
            BEGIN
                DECLARE v_curriculum_id BIGINT DEFAULT NULL;
                DECLARE v_user_id BIGINT DEFAULT NULL;

                IF NEW.action = "registrar_approved" THEN
                    -- get the curriculum_id and user_id via joins
                    SELECT cd.curriculum_id, e.user_id
                    INTO v_curriculum_id, v_user_id
                    FROM enrollment e
                    INNER JOIN section s ON s.id = e.section_id
                    INNER JOIN curriculum_detail cd ON cd.id = s.curriculum_detail_id
                    WHERE e.id = NEW.enrollment_id
                    LIMIT 1;

                    IF v_curriculum_id IS NOT NULL AND v_user_id IS NOT NULL THEN
                        -- Deactivate all existing active taggings for this user
                        UPDATE curriculum_tagging
                        SET is_active = FALSE, updated_at = NOW()
                        WHERE user_id = v_user_id AND is_active = TRUE;

                        -- Insert or update the curriculum tagging
                        INSERT INTO curriculum_tagging (curriculum_id, user_id, is_active, created_at, updated_at)
                        VALUES (v_curriculum_id, v_user_id, TRUE, NOW(), NOW())
                        ON DUPLICATE KEY UPDATE
                            is_active = TRUE,
                            updated_at = NOW();
                    END IF;
                END IF;
            END;
        ');

        DB::unprepared('
            CREATE TRIGGER enrollment_log_after_update_registrar_approved
            AFTER UPDATE ON enrollment_log
            FOR EACH ROW
            BEGIN
                DECLARE v_curriculum_id BIGINT DEFAULT NULL;
                DECLARE v_user_id BIGINT DEFAULT NULL;

                IF NEW.action = "registrar_approved" AND (OLD.action <> "registrar_approved" OR OLD.action IS NULL) THEN
                    SELECT cd.curriculum_id, e.user_id
                    INTO v_curriculum_id, v_user_id
                    FROM enrollment e
                    INNER JOIN section s ON s.id = e.section_id
                    INNER JOIN curriculum_detail cd ON cd.id = s.curriculum_detail_id
                    WHERE e.id = NEW.enrollment_id
                    LIMIT 1;

                    IF v_curriculum_id IS NOT NULL AND v_user_id IS NOT NULL THEN
                        -- Deactivate all existing active taggings for this user
                        UPDATE curriculum_tagging
                        SET is_active = FALSE, updated_at = NOW()
                        WHERE user_id = v_user_id AND is_active = TRUE;

                        -- Insert or update the curriculum tagging
                        INSERT INTO curriculum_tagging (curriculum_id, user_id, is_active, created_at, updated_at)
                        VALUES (v_curriculum_id, v_user_id, TRUE, NOW(), NOW())
                        ON DUPLICATE KEY UPDATE
                            is_active = TRUE,
                            updated_at = NOW();
                    END IF;
                END IF;
            END;
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS enrollment_log_after_insert_registrar_approved');
        DB::unprepared('DROP TRIGGER IF EXISTS enrollment_log_after_update_registrar_approved');
    }
};
