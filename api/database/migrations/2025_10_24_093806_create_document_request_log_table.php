<?php

use App\Enum\DocumentRequestLogActionEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('document_request_log', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            // Fk
            $table->foreignId('document_request_id')
                ->constrained('document_request')
                ->onDelete('cascade');
            // Fk
            $table->foreignId('user_id')
                ->constrained('user')
                ->onDelete('cascade');
            // Fields
            $table->enum('action', array_column(DocumentRequestLogActionEnum::cases(), 'value'));
            $table->text('note')->nullable();

            // Unique
            $table->unique(['document_request_id', 'action'], 'document_request_log_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_request_log');
    }
};
