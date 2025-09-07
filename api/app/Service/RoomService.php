<?php

namespace App\Service;

use App\interface\IService\IRoomService;
use App\interface\IRepo\IRoomRepo;

class RoomService extends GenericService implements IRoomService
{
    public function __construct(IRoomRepo $roomRepository)
    {
        parent::__construct($roomRepository);
    }
}
