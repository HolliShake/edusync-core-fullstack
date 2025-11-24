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
        DB::unprepared("
            CREATE TRIGGER after_school_year_insert
            AFTER INSERT ON school_year
            FOR EACH ROW
            BEGIN
                DECLARE base_date DATE;
                DECLARE begin_date DATE;
                DECLARE end_date DATE;
                DECLARE idx INT DEFAULT 1;

                SET base_date = NEW.start_date;
                SET begin_date = NEW.start_date;
                SET end_date = NEW.end_date;

                -- FIRST SEMESTER

                -- Enrollment Period - First Semester
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Enrollment Period - First Semester',
                    'Regular and late enrollment for first semester',
                    GREATEST(DATE_SUB(base_date, INTERVAL 14 DAY), begin_date),
                    LEAST(DATE_SUB(base_date, INTERVAL 1 DAY), end_date),
                    NEW.id,
                    'ENROLLMENT',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Start of First Semester (ACADEMIC_TRANSITION)
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Start of First Semester',
                    'First Semester officially begins',
                    GREATEST(base_date, begin_date),
                    LEAST(base_date, end_date),
                    NEW.id,
                    'ACADEMIC_TRANSITION',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Start of Classes - First Semester
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Start of Classes - First Semester',
                    'Classes begin for first semester',
                    GREATEST(base_date, begin_date),
                    LEAST(base_date, end_date),
                    NEW.id,
                    'START_OF_CLASSES',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Adding / Dropping of Subjects - First Semester
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Adding / Dropping of Subjects - First Semester',
                    'Adding/Dropping period - requires adviser approval',
                    GREATEST(base_date, begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 13 DAY), end_date),
                    NEW.id,
                    'ADDING_DROPPING_OF_SUBJECTS',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Preliminary Examinations - First Semester
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Preliminary Examinations - First Semester',
                    'Preliminary examinations for first semester',
                    GREATEST(DATE_ADD(base_date, INTERVAL 28 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 34 DAY), end_date),
                    NEW.id,
                    'PERIODIC_EXAM',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Grade Submission Deadline - Preliminary (First Semester)
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Grade Submission Deadline - Preliminary (First Semester)',
                    'Deadline for faculty to submit preliminary grades to registrar',
                    GREATEST(DATE_ADD(base_date, INTERVAL 35 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 35 DAY), end_date),
                    NEW.id,
                    'GRADE_SUBMISSION',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Midterm Examinations - First Semester
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Midterm Examinations - First Semester',
                    'Midterm examinations for first semester',
                    GREATEST(DATE_ADD(base_date, INTERVAL 56 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 62 DAY), end_date),
                    NEW.id,
                    'PERIODIC_EXAM',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Grade Submission Deadline - Midterm (First Semester)
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Grade Submission Deadline - Midterm (First Semester)',
                    'Deadline for faculty to submit midterm grades to registrar',
                    GREATEST(DATE_ADD(base_date, INTERVAL 63 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 63 DAY), end_date),
                    NEW.id,
                    'GRADE_SUBMISSION',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Final Examinations - First Semester
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Final Examinations - First Semester',
                    'Final examinations for first semester',
                    GREATEST(DATE_ADD(base_date, INTERVAL 100 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 106 DAY), end_date),
                    NEW.id,
                    'PERIODIC_EXAM',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Faculty Evaluation - First Semester
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Faculty Evaluation - First Semester',
                    'Student evaluation of faculty for first semester',
                    GREATEST(DATE_ADD(base_date, INTERVAL 107 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 113 DAY), end_date),
                    NEW.id,
                    'FACULTY_EVALUATION',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- End of Classes - First Semester
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'End of Classes - First Semester',
                    'Last day of classes for first semester',
                    GREATEST(DATE_ADD(base_date, INTERVAL 139 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 139 DAY), end_date),
                    NEW.id,
                    'END_OF_CLASSES',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Christmas Break
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Christmas Break',
                    'Christmas and New Year holiday break',
                    GREATEST(DATE_ADD(base_date, INTERVAL 140 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 154 DAY), end_date),
                    NEW.id,
                    'HOLIDAY',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Grade Submission Deadline - First Semester
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Grade Submission Deadline - First Semester',
                    'Deadline for faculty to submit first semester grades to registrar',
                    GREATEST(DATE_ADD(base_date, INTERVAL 155 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 155 DAY), end_date),
                    NEW.id,
                    'GRADE_SUBMISSION',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- SECOND SEMESTER

                -- Enrollment Period - Second Semester
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Enrollment Period - Second Semester',
                    'Regular and late enrollment for second semester',
                    GREATEST(DATE_ADD(base_date, INTERVAL 156 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 168 DAY), end_date),
                    NEW.id,
                    'ENROLLMENT',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Start of Second Semester (ACADEMIC_TRANSITION)
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Start of Second Semester',
                    'Second Semester officially begins',
                    GREATEST(DATE_ADD(base_date, INTERVAL 169 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 169 DAY), end_date),
                    NEW.id,
                    'ACADEMIC_TRANSITION',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Start of Classes - Second Semester
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Start of Classes - Second Semester',
                    'Classes begin for second semester',
                    GREATEST(DATE_ADD(base_date, INTERVAL 169 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 169 DAY), end_date),
                    NEW.id,
                    'START_OF_CLASSES',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Adding / Dropping of Subjects - Second Semester
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Adding / Dropping of Subjects - Second Semester',
                    'Adding/Dropping period - requires adviser approval',
                    GREATEST(DATE_ADD(base_date, INTERVAL 169 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 182 DAY), end_date),
                    NEW.id,
                    'ADDING_DROPPING_OF_SUBJECTS',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Preliminary Examinations - Second Semester
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Preliminary Examinations - Second Semester',
                    'Preliminary examinations for second semester',
                    GREATEST(DATE_ADD(base_date, INTERVAL 197 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 203 DAY), end_date),
                    NEW.id,
                    'PERIODIC_EXAM',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Grade Submission Deadline - Preliminary (Second Semester)
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Grade Submission Deadline - Preliminary (Second Semester)',
                    'Deadline for faculty to submit preliminary grades to registrar',
                    GREATEST(DATE_ADD(base_date, INTERVAL 204 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 204 DAY), end_date),
                    NEW.id,
                    'GRADE_SUBMISSION',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Holy Week Break
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Holy Week Break',
                    'Holy Week holiday (no classes)',
                    GREATEST(DATE_ADD(base_date, INTERVAL 225 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 231 DAY), end_date),
                    NEW.id,
                    'HOLIDAY',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Midterm Examinations - Second Semester
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Midterm Examinations - Second Semester',
                    'Midterm examinations for second semester',
                    GREATEST(DATE_ADD(base_date, INTERVAL 253 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 259 DAY), end_date),
                    NEW.id,
                    'PERIODIC_EXAM',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Grade Submission Deadline - Midterm (Second Semester)
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Grade Submission Deadline - Midterm (Second Semester)',
                    'Deadline for faculty to submit midterm grades to registrar',
                    GREATEST(DATE_ADD(base_date, INTERVAL 260 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 260 DAY), end_date),
                    NEW.id,
                    'GRADE_SUBMISSION',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Final Examinations - Second Semester
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Final Examinations - Second Semester',
                    'Final examinations for second semester',
                    GREATEST(DATE_ADD(base_date, INTERVAL 281 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 287 DAY), end_date),
                    NEW.id,
                    'PERIODIC_EXAM',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Faculty Evaluation - Second Semester
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Faculty Evaluation - Second Semester',
                    'Student evaluation of faculty for second semester',
                    GREATEST(DATE_ADD(base_date, INTERVAL 288 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 294 DAY), end_date),
                    NEW.id,
                    'FACULTY_EVALUATION',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- End of Classes - Second Semester
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'End of Classes - Second Semester',
                    'Last day of classes for second semester',
                    GREATEST(DATE_ADD(base_date, INTERVAL 295 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 295 DAY), end_date),
                    NEW.id,
                    'END_OF_CLASSES',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Grade Submission Deadline - Second Semester
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Grade Submission Deadline - Second Semester',
                    'Deadline for faculty to submit second semester grades to registrar',
                    GREATEST(DATE_ADD(base_date, INTERVAL 296 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 296 DAY), end_date),
                    NEW.id,
                    'GRADE_SUBMISSION',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Graduation Ceremony
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Graduation Ceremony',
                    'Annual graduation ceremony - End of AY',
                    GREATEST(DATE_ADD(base_date, INTERVAL 297 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 297 DAY), end_date),
                    NEW.id,
                    'GRADUATION',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- SUMMER TERM

                -- Enrollment - Summer Term
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Enrollment - Summer Term',
                    'Enrollment for optional summer term',
                    GREATEST(DATE_ADD(base_date, INTERVAL 298 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 310 DAY), end_date),
                    NEW.id,
                    'ENROLLMENT',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Start of Summer Term (ACADEMIC_TRANSITION)
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Start of Summer Term',
                    'Summer Term officially begins',
                    GREATEST(DATE_ADD(base_date, INTERVAL 311 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 311 DAY), end_date),
                    NEW.id,
                    'ACADEMIC_TRANSITION',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Summer Classes
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Summer Classes',
                    'Intensive summer courses',
                    GREATEST(DATE_ADD(base_date, INTERVAL 311 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 338 DAY), end_date),
                    NEW.id,
                    'START_OF_CLASSES',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Adding / Dropping of Subjects - Summer Term
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Adding / Dropping of Subjects - Summer Term',
                    'Adding/Dropping period for summer - requires adviser approval',
                    GREATEST(DATE_ADD(base_date, INTERVAL 311 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 317 DAY), end_date),
                    NEW.id,
                    'ADDING_DROPPING_OF_SUBJECTS',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- End of Classes - Summer Term
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'End of Classes - Summer Term',
                    'Last day of classes for summer term',
                    GREATEST(DATE_ADD(base_date, INTERVAL 338 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 338 DAY), end_date),
                    NEW.id,
                    'END_OF_CLASSES',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Final Examinations - Summer Term
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Final Examinations - Summer Term',
                    'Final examinations for summer term',
                    GREATEST(DATE_ADD(base_date, INTERVAL 339 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 345 DAY), end_date),
                    NEW.id,
                    'PERIODIC_EXAM',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Faculty Evaluation - Summer Term
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Faculty Evaluation - Summer Term',
                    'Student evaluation of faculty for summer term',
                    GREATEST(DATE_ADD(base_date, INTERVAL 339 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 345 DAY), end_date),
                    NEW.id,
                    'FACULTY_EVALUATION',
                    idx,
                    NOW(),
                    NOW()
                );
                SET idx = idx + 1;

                -- Grade Submission Deadline - Summer Term
                INSERT INTO academic_calendar (name, description, start_date, end_date, school_year_id, event, `order`, created_at, updated_at)
                VALUES (
                    'Grade Submission Deadline - Summer Term',
                    'Deadline for faculty to submit summer term grades to registrar',
                    GREATEST(DATE_ADD(base_date, INTERVAL 346 DAY), begin_date),
                    LEAST(DATE_ADD(base_date, INTERVAL 346 DAY), end_date),
                    NEW.id,
                    'GRADE_SUBMISSION',
                    idx,
                    NOW(),
                    NOW()
                );
            END
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS after_school_year_insert');
    }
};
