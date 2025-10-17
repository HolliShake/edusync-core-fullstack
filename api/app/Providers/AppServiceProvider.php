<?php

namespace App\Providers;

use App\Interface\IRepo\IAcademicCalendarRepo;
use App\Interface\IRepo\IAcademicProgramRepo;
use App\Interface\IRepo\IAcademicTermRepo;
use App\Interface\IRepo\IBuildingRepo;
use App\Interface\IRepo\ICampusRepo;
use App\Interface\IRepo\ICollegeRepo;
use App\Interface\IRepo\ICourseRepo;
use App\Interface\IRepo\ICurriculumRepo;
use App\Interface\IRepo\IProgramTypeRepo;
use App\Interface\IRepo\IRoomRepo;
use App\Interface\IRepo\ISchoolYearRepo;
use App\Interface\IRepo\ICurriculumDetailRepo;
use App\Interface\IRepo\ISectionRepo;
use App\Interface\IService\IAcademicCalendarService;
use App\Interface\IService\IAcademicProgramService;
use App\Interface\IService\IAcademicTermService;
use App\Interface\IService\IBuildingService;
use App\Interface\IService\ICampusService;
use App\Interface\IService\ICollegeService;
use App\Interface\IService\ICourseService;
use App\Interface\IService\ICurriculumService;
use App\Interface\IService\IProgramTypeService;
use App\Interface\IService\IRoomService;
use App\Interface\IService\ISchoolYearService;
use App\Interface\IService\ICurriculumDetailService;
use App\Interface\IService\ISectionService;
use App\Repo\AcademicCalendarRepo;
use App\Repo\AcademicProgramRepo;
use App\Repo\AcademicTermRepo;
use App\Repo\BuildingRepo;
use App\Repo\CampusRepo;
use App\Repo\CollegeRepo;
use App\Repo\CourseRepo;
use App\Repo\CurriculumRepo;
use App\Repo\CurriculumDetailRepo;
use App\Repo\SectionRepo;
use App\Repo\ProgramTypeRepo;
use App\Repo\RoomRepo;
use App\Repo\SchoolYearRepo;
use App\Service\CurriculumDetailService;
use App\Service\AcademicCalendarService;
use App\Service\AcademicProgramService;
use App\Service\AcademicTermService;
use App\Service\BuildingService;
use App\Service\CampusService;
use App\Service\CollegeService;
use App\Service\CourseService;
use App\Service\CurriculumService;
use App\Service\ProgramTypeService;
use App\Service\RoomService;
use App\Service\SchoolYearService;
use App\Service\SectionService;
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
        $this->app->bind(IAcademicProgramService::class, AcademicProgramService::class);
        $this->app->bind(ICurriculumRepo::class, CurriculumRepo::class);
        $this->app->bind(ICourseRepo::class, CourseRepo::class);
        $this->app->bind(ISchoolYearRepo::class, SchoolYearRepo::class);
        $this->app->bind(IAcademicCalendarRepo::class, AcademicCalendarRepo::class);
        $this->app->bind(IAcademicTermRepo::class, AcademicTermRepo::class);
        $this->app->bind(ICurriculumDetailRepo::class, CurriculumDetailRepo::class);
        $this->app->bind(ISectionRepo::class, SectionRepo::class);
        // Service
        $this->app->bind(IAcademicProgramService::class, AcademicProgramService::class);
        $this->app->bind(IProgramTypeService::class, ProgramTypeService::class);
        $this->app->bind(ICampusService::class, CampusService::class);
        $this->app->bind(IBuildingService::class, BuildingService::class);
        $this->app->bind(ICollegeService::class, CollegeService::class);
        $this->app->bind(IRoomService::class, RoomService::class);
        $this->app->bind(IAcademicProgramService::class, AcademicProgramService::class);
        $this->app->bind(ICurriculumService::class, CurriculumService::class);
        $this->app->bind(ICourseService::class, CourseService::class);
        $this->app->bind(ISchoolYearService::class, SchoolYearService::class);
        $this->app->bind(IAcademicCalendarService::class, AcademicCalendarService::class);
        $this->app->bind(IAcademicTermService::class, AcademicTermService::class);
        $this->app->bind(ICurriculumDetailService::class, CurriculumDetailService::class);
        $this->app->bind(ISectionService::class, SectionService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
