<?php

namespace App\Models;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "KeyValuePair",
    title: "KeyValuePair",
    type: "object",
    required: [
        "label",
        "value"
    ],
    properties: [
        new OA\Property(property: "label", type: "string"),
        new OA\Property(property: "value", type: "string"),
        new OA\Property(property: "parent_value", type: "string", nullable: true)
    ]
)]
class Util {} // Dummy class
