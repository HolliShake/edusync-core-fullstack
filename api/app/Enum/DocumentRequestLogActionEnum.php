<?php

namespace App\Enum;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "DocumentRequestLogActionEnum",
    title: "DocumentRequestLogActionEnum",
    type: "string",
    enum: DocumentRequestLogActionEnum::class,
)]
enum DocumentRequestLogActionEnum: string
{
    case SUBMITTED   = 'submitted';
    case CANCELLED   = 'cancelled';
    case PAID        = 'paid';
    case REJECTED    = 'rejected';
    case PROCESSING  = 'processing';
    case PICKUP      = 'pickup';
    case COMPLETED   = 'completed';
}
