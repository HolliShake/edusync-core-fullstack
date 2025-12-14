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
        // Create trigger for INSERT
        DB::unprepared('
            CREATE TRIGGER admission_application_score_posted_insert_trigger
            AFTER INSERT ON admission_application_score
            FOR EACH ROW
            BEGIN
                DECLARE total_score DECIMAL(10, 2);
                DECLARE total_weight INT;
                DECLARE weighted_score DECIMAL(10, 2);
                DECLARE all_scores_posted INT;
                DECLARE criteria_count INT;
                DECLARE posted_scores_count INT;
                DECLARE passing_threshold DECIMAL(10, 2);
                DECLARE is_passing BOOLEAN;
                DECLARE log_exists INT;

                -- Only proceed if the new score is posted
                IF NEW.is_posted = 1 THEN
                    -- Get the academic program from the admission application via admission schedule
                    SELECT asch.academic_program_id
                    INTO @program_id
                    FROM admission_application aa
                    INNER JOIN admission_schedule asch ON aa.admission_schedule_id = asch.id
                    WHERE aa.id = NEW.admission_application_id;

                    -- Count total criteria for this program and admission schedule
                    SELECT COUNT(*)
                    INTO criteria_count
                    FROM admission_criteria
                    WHERE academic_program_id = @program_id
                    AND admission_schedule_id = (
                        SELECT admission_schedule_id 
                        FROM admission_application 
                        WHERE id = NEW.admission_application_id
                    )
                    AND is_active = 1;

                    -- Count distinct criteria that have posted scores
                    SELECT COUNT(DISTINCT admission_criteria_id)
                    INTO posted_scores_count
                    FROM admission_application_score
                    WHERE admission_application_id = NEW.admission_application_id
                    AND is_posted = 1;

                    SET all_scores_posted = (posted_scores_count >= criteria_count);

                    IF all_scores_posted = 1 THEN
                        -- Calculate weighted score using the latest posted score for each criteria-user combination
                        SELECT
                            SUM((aas.score / ac.max_score) * ac.weight),
                            SUM(ac.weight)
                        INTO weighted_score, total_weight
                        FROM (
                            SELECT
                                admission_application_id,
                                admission_criteria_id,
                                user_id,
                                score
                            FROM admission_application_score
                            WHERE admission_application_id = NEW.admission_application_id
                            AND is_posted = 1
                        ) aas
                        INNER JOIN admission_criteria ac
                            ON aas.admission_criteria_id = ac.id
                        WHERE ac.is_active = 1;

                        -- Calculate final score as percentage
                        IF total_weight > 0 THEN
                            SET total_score = (weighted_score / total_weight) * 100;
                        ELSE
                            SET total_score = 0;
                        END IF;

                        -- Set passing threshold to 75%
                        SET passing_threshold = 75.00;
                        SET is_passing = (total_score >= passing_threshold);

                        IF is_passing = 1 THEN
                            -- Delete rejected log if passing
                            DELETE FROM admission_application_log
                            WHERE admission_application_id = NEW.admission_application_id
                            AND type = "rejected";

                            -- Check if accepted log already exists
                            SELECT COUNT(*)
                            INTO log_exists
                            FROM admission_application_log
                            WHERE admission_application_id = NEW.admission_application_id
                            AND type = "accepted";

                            -- Insert accepted log if it doesn\'t exist
                            IF log_exists = 0 THEN
                                INSERT INTO admission_application_log (
                                    admission_application_id,
                                    user_id,
                                    type,
                                    note,
                                    created_at,
                                    updated_at
                                ) VALUES (
                                    NEW.admission_application_id,
                                    NEW.user_id,
                                    "accepted",
                                    CONCAT("Automatically accepted with score: ", ROUND(total_score, 2), "%"),
                                    NOW(),
                                    NOW()
                                );
                            END IF;
                        ELSE
                            -- Delete accepted log if failing
                            DELETE FROM admission_application_log
                            WHERE admission_application_id = NEW.admission_application_id
                            AND type = "accepted";

                            -- Check if rejected log already exists
                            SELECT COUNT(*)
                            INTO log_exists
                            FROM admission_application_log
                            WHERE admission_application_id = NEW.admission_application_id
                            AND type = "rejected";

                            -- Insert rejected log if it doesn\'t exist
                            IF log_exists = 0 THEN
                                INSERT INTO admission_application_log (
                                    admission_application_id,
                                    user_id,
                                    type,
                                    note,
                                    created_at,
                                    updated_at
                                ) VALUES (
                                    NEW.admission_application_id,
                                    NEW.user_id,
                                    "rejected",
                                    CONCAT("Automatically rejected with score: ", ROUND(total_score, 2), "%"),
                                    NOW(),
                                    NOW()
                                );
                            END IF;
                        END IF;
                    ELSE
                        -- Not all scores posted, delete accepted/rejected log if exists
                        DELETE FROM admission_application_log
                        WHERE admission_application_id = NEW.admission_application_id
                        AND type IN ("accepted", "rejected");
                    END IF;
                ELSE
                    -- Score is not posted, remove accepted/rejected log if exists
                    DELETE FROM admission_application_log
                    WHERE admission_application_id = NEW.admission_application_id
                    AND type IN ("accepted", "rejected");
                END IF;
            END
        ');

        // Create trigger for UPDATE
        DB::unprepared('
            CREATE TRIGGER admission_application_score_posted_update_trigger
            AFTER UPDATE ON admission_application_score
            FOR EACH ROW
            BEGIN
                DECLARE total_score DECIMAL(10, 2);
                DECLARE total_weight INT;
                DECLARE weighted_score DECIMAL(10, 2);
                DECLARE all_scores_posted INT;
                DECLARE criteria_count INT;
                DECLARE posted_scores_count INT;
                DECLARE passing_threshold DECIMAL(10, 2);
                DECLARE is_passing BOOLEAN;
                DECLARE log_exists INT;

                -- Only proceed if the new score is posted
                IF NEW.is_posted = 1 THEN
                    -- Get the academic program from the admission application via admission schedule
                    SELECT asch.academic_program_id
                    INTO @program_id
                    FROM admission_application aa
                    INNER JOIN admission_schedule asch ON aa.admission_schedule_id = asch.id
                    WHERE aa.id = NEW.admission_application_id;

                    -- Count total criteria for this program and admission schedule
                    SELECT COUNT(*)
                    INTO criteria_count
                    FROM admission_criteria
                    WHERE academic_program_id = @program_id
                    AND admission_schedule_id = (
                        SELECT admission_schedule_id 
                        FROM admission_application 
                        WHERE id = NEW.admission_application_id
                    )
                    AND is_active = 1;

                    -- Count distinct criteria that have posted scores
                    SELECT COUNT(DISTINCT admission_criteria_id)
                    INTO posted_scores_count
                    FROM admission_application_score
                    WHERE admission_application_id = NEW.admission_application_id
                    AND is_posted = 1;

                    SET all_scores_posted = (posted_scores_count >= criteria_count);

                    IF all_scores_posted = 1 THEN
                        -- Calculate weighted score using the latest posted score for each criteria-user combination
                        SELECT
                            SUM((aas.score / ac.max_score) * ac.weight),
                            SUM(ac.weight)
                        INTO weighted_score, total_weight
                        FROM (
                            SELECT
                                admission_application_id,
                                admission_criteria_id,
                                user_id,
                                score
                            FROM admission_application_score
                            WHERE admission_application_id = NEW.admission_application_id
                            AND is_posted = 1
                        ) aas
                        INNER JOIN admission_criteria ac
                            ON aas.admission_criteria_id = ac.id
                        WHERE ac.is_active = 1;

                        -- Calculate final score as percentage
                        IF total_weight > 0 THEN
                            SET total_score = (weighted_score / total_weight) * 100;
                        ELSE
                            SET total_score = 0;
                        END IF;

                        -- Set passing threshold to 75%
                        SET passing_threshold = 75.00;
                        SET is_passing = (total_score >= passing_threshold);

                        IF is_passing = 1 THEN
                            -- Delete rejected log if passing
                            DELETE FROM admission_application_log
                            WHERE admission_application_id = NEW.admission_application_id
                            AND type = "rejected";

                            -- Check if accepted log already exists
                            SELECT COUNT(*)
                            INTO log_exists
                            FROM admission_application_log
                            WHERE admission_application_id = NEW.admission_application_id
                            AND type = "accepted";

                            -- Insert accepted log if it doesn\'t exist
                            IF log_exists = 0 THEN
                                INSERT INTO admission_application_log (
                                    admission_application_id,
                                    user_id,
                                    type,
                                    note,
                                    created_at,
                                    updated_at
                                ) VALUES (
                                    NEW.admission_application_id,
                                    NEW.user_id,
                                    "accepted",
                                    CONCAT("Automatically accepted with score: ", ROUND(total_score, 2), "%"),
                                    NOW(),
                                    NOW()
                                );
                            END IF;
                        ELSE
                            -- Delete accepted log if failing
                            DELETE FROM admission_application_log
                            WHERE admission_application_id = NEW.admission_application_id
                            AND type = "accepted";

                            -- Check if rejected log already exists
                            SELECT COUNT(*)
                            INTO log_exists
                            FROM admission_application_log
                            WHERE admission_application_id = NEW.admission_application_id
                            AND type = "rejected";

                            -- Insert rejected log if it doesn\'t exist
                            IF log_exists = 0 THEN
                                INSERT INTO admission_application_log (
                                    admission_application_id,
                                    user_id,
                                    type,
                                    note,
                                    created_at,
                                    updated_at
                                ) VALUES (
                                    NEW.admission_application_id,
                                    NEW.user_id,
                                    "rejected",
                                    CONCAT("Automatically rejected with score: ", ROUND(total_score, 2), "%"),
                                    NOW(),
                                    NOW()
                                );
                            END IF;
                        END IF;
                    ELSE
                        -- Not all scores posted, delete accepted/rejected log if exists
                        DELETE FROM admission_application_log
                        WHERE admission_application_id = NEW.admission_application_id
                        AND type IN ("accepted", "rejected");
                    END IF;
                ELSE
                    -- Score is not posted, remove accepted/rejected log if exists
                    DELETE FROM admission_application_log
                    WHERE admission_application_id = NEW.admission_application_id
                    AND type IN ("accepted", "rejected");
                END IF;
            END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS admission_application_score_posted_insert_trigger');
        DB::unprepared('DROP TRIGGER IF EXISTS admission_application_score_posted_update_trigger');
    }
};
