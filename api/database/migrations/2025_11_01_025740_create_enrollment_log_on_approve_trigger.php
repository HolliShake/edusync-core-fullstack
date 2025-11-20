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
                DECLARE v_has_active_tagging INT DEFAULT 0;

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
                        -- Check if user already has an active curriculum_tagging
                        SELECT COUNT(*) INTO v_has_active_tagging
                        FROM curriculum_tagging
                        WHERE user_id = v_user_id AND is_active = TRUE;

                        -- If user has an active, SKIP
                        IF v_has_active_tagging = 0 THEN
                            -- Deactivate all existing active taggings for this user (safety, in case uniqueness is violated)
                            UPDATE curriculum_tagging
                            SET is_active = FALSE, updated_at = NOW()
                            WHERE user_id = v_user_id AND is_active = TRUE;

                            -- Try to update an existing inactive record for this (curriculum_id, user_id)
                            UPDATE curriculum_tagging
                            SET is_active = TRUE, updated_at = NOW()
                            WHERE curriculum_id = v_curriculum_id
                              AND user_id = v_user_id;

                            -- If no record was updated (ROW_COUNT() = 0), insert it
                            IF ROW_COUNT() = 0 THEN
                                INSERT INTO curriculum_tagging (curriculum_id, user_id, is_active, created_at, updated_at)
                                VALUES (v_curriculum_id, v_user_id, TRUE, NOW(), NOW());
                            END IF;
                        END IF;
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
                DECLARE v_has_active_tagging INT DEFAULT 0;

                IF NEW.action = "registrar_approved" AND (OLD.action <> "registrar_approved" OR OLD.action IS NULL) THEN
                    SELECT cd.curriculum_id, e.user_id
                    INTO v_curriculum_id, v_user_id
                    FROM enrollment e
                    INNER JOIN section s ON s.id = e.section_id
                    INNER JOIN curriculum_detail cd ON cd.id = s.curriculum_detail_id
                    WHERE e.id = NEW.enrollment_id
                    LIMIT 1;

                    IF v_curriculum_id IS NOT NULL AND v_user_id IS NOT NULL THEN
                        -- Check if user already has an active curriculum_tagging
                        SELECT COUNT(*) INTO v_has_active_tagging
                        FROM curriculum_tagging
                        WHERE user_id = v_user_id AND is_active = TRUE;

                        -- If user has an active, SKIP
                        IF v_has_active_tagging = 0 THEN
                            -- Deactivate all existing active taggings for this user (safety, in case uniqueness is violated)
                            UPDATE curriculum_tagging
                            SET is_active = FALSE, updated_at = NOW()
                            WHERE user_id = v_user_id AND is_active = TRUE;

                            -- Try to update an existing inactive record for this (curriculum_id, user_id)
                            UPDATE curriculum_tagging
                            SET is_active = TRUE, updated_at = NOW()
                            WHERE curriculum_id = v_curriculum_id
                              AND user_id = v_user_id;

                            -- If no record was updated (ROW_COUNT() = 0), insert it
                            IF ROW_COUNT() = 0 THEN
                                INSERT INTO curriculum_tagging (curriculum_id, user_id, is_active, created_at, updated_at)
                                VALUES (v_curriculum_id, v_user_id, TRUE, NOW(), NOW());
                            END IF;
                        END IF;
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
