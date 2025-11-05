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
            CREATE TRIGGER document_request_on_insert_trigger
            AFTER INSERT ON document_request
            FOR EACH ROW
            BEGIN
                DECLARE document_price DECIMAL(10,2);

                -- Get the price of the document type
                SELECT price INTO document_price
                FROM document_type
                WHERE id = NEW.document_type_id;

                -- Insert submitted log
                INSERT INTO document_request_log (document_request_id, user_id, action, note, created_at, updated_at)
                VALUES (NEW.id, NEW.user_id, "submitted", "Document request submitted", NOW(), NOW());

                -- If price is 0, also insert paid log
                IF document_price = 0 THEN
                    INSERT INTO document_request_log (document_request_id, user_id, action, note, created_at, updated_at)
                    VALUES (NEW.id, NEW.user_id, "paid", "Payment not required (free document)", NOW(), NOW());
                END IF;
            END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS document_request_on_insert_trigger');
    }
};
