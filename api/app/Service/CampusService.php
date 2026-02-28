<?php

namespace App\Service;

use App\Constant\MainCampus;
use App\Interface\IService\ICampusService;
use App\Interface\IRepo\ICampusRepo;

class CampusService extends GenericService implements ICampusService
{
    public function __construct(ICampusRepo $campusRepository)
    {
        parent::__construct($campusRepository);
    }

    protected function beforeDelete(int|string $id): void
    {
        $restrict = [
            MainCampus::ID
        ];
        if (\in_array($id, $restrict)) {
            throw new \Exception('Main campus cannot be deleted');
        }
        parent::beforeDelete($id);
    }
}
