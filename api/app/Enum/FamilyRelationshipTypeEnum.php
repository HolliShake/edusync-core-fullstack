<?php
namespace App\Enum;


use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "FamilyRelationshipTypeEnum",
    title: "FamilyRelationshipTypeEnum",
    type: "string",
    enum: FamilyRelationshipTypeEnum::class,
)]
enum FamilyRelationshipTypeEnum: string
{
    case FATHER   = 'father';
    case MOTHER   = 'mother';
    case BROTHER  = 'brother';
    case GUARDIAN = 'guardian';
    case OTHER    = 'other';
}