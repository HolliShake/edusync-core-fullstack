<?php

namespace App\Providers;

use App\interface\IRepo\IAcademicProgramRepo;
use App\interface\IRepo\IBuildingRepo;
use App\Repo\AcademicProgramRepo;
use App\Repo\CampusRepo;
use App\interface\IRepo\ICampusRepo;
use App\interface\IRepo\ICollegeRepo;
use App\interface\IRepo\IProgramTypeRepo;
use App\interface\IRepo\IRoomRepo;
use App\interface\IService\IAcademicProgramService;
use App\interface\IService\IBuildingService;
use App\Service\AcademicProgramService;
use App\Service\CampusService;
use App\interface\IService\ICampusService;
use App\interface\IService\ICollegeService;
use App\interface\IService\IProgramTypeService;
use App\interface\IService\IRoomService;
use App\Repo\BuildingRepo;
use App\Repo\CollegeRepo;
use App\Repo\ProgramTypeRepo;
use App\Repo\RoomRepo;
use App\Service\BuildingService;
use App\Service\CollegeService;
use App\Service\ProgramTypeService;
use App\Service\RoomService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Repo
        $this->app->bind(IAcademicProgramRepo::class, AcademicProgramRepo::class);
        $this->app->bind(IProgramTypeRepo::class, ProgramTypeRepo::class);
        $this->app->bind(ICampusRepo::class, CampusRepo::class);
        $this->app->bind(IBuildingRepo::class, BuildingRepo::class);
        $this->app->bind(ICollegeRepo::class, CollegeRepo::class);
        $this->app->bind(IRoomRepo::class, RoomRepo::class);
        // Service
        $this->app->bind(IAcademicProgramService::class, AcademicProgramService::class);
        $this->app->bind(IProgramTypeService::class, ProgramTypeService::class);
        $this->app->bind(ICampusService::class, CampusService::class);
        $this->app->bind(IBuildingService::class, BuildingService::class);
        $this->app->bind(ICollegeService::class, CollegeService::class);
        $this->app->bind(IRoomService::class, RoomService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
