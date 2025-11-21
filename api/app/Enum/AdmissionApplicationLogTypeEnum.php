<?php

namespace App\Enum;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "AdmissionApplicationLogTypeEnum",
    title: "AdmissionApplicationLogTypeEnum",
    type: "string",
    enum: AdmissionApplicationLogTypeEnum::class,
)]
enum AdmissionApplicationLogTypeEnum: string
{
    case SUBMITTED = 'submitted'; // default, auto inserted by trigger
    case CANCELLED = 'cancelled'; // application cancelled by user
    case APPROVED  = 'approved';  // ready for evaluation
    case REJECTED  = 'rejected';  // rejected by program chair, cannot proceed to evaluation
    case ACCEPTED  = 'accepted';  // accepted by program chair, can proceed to enrollment!
}
