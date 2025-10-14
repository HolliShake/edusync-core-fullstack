<?php

namespace App\Service;

use App\Interface\IService\IRoomService;
use App\Interface\IRepo\IRoomRepo;

class RoomService extends GenericService implements IRoomService
{
    public function __construct(IRoomRepo $roomRepository)
    {
        parent::__construct($roomRepository);
    }
}
