<?php

namespace App\Service;

use App\Interface\IService\IUserService;
use App\Interface\IRepo\IUserRepo;

class UserService extends GenericService implements IUserService
{
    public function __construct(IUserRepo $userRepository)
    {
        parent::__construct($userRepository);
    }
}
