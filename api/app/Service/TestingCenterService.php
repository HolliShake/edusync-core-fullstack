<?php

namespace App\Service;

use App\Interface\IService\ITestingCenterService;
use App\Interface\IRepo\ITestingCenterRepo;
use App\Models\TestingCenter;
use Illuminate\Database\Eloquent\Model;

class TestingCenterService extends GenericService implements ITestingCenterService
{
    public function __construct(ITestingCenterRepo $testingCenterRepository)
    {
        parent::__construct($testingCenterRepository);
    }

    public function create(array $data): Model
    {
        $data['code'] = strtoupper(substr(bin2hex(random_bytes(2)), 0, 4));
        return parent::create($data);
    }
}
