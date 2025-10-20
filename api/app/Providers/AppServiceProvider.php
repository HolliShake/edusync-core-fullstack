<?php

namespace App\Providers;

use App\Interface\IRepo\IAcademicCalendarRepo;
use App\Interface\IRepo\IAcademicProgramRepo;
use App\Interface\IRepo\IAcademicProgramRequirementRepo;
use App\Interface\IRepo\IAcademicTermRepo;
use App\Interface\IRepo\IAdmissionApplicationRepo;
use App\Interface\IRepo\IBuildingRepo;
use App\Interface\IRepo\ICampusRepo;
use App\Interface\IRepo\ICollegeRepo;
use App\Interface\IRepo\ICourseRepo;
use App\Interface\IRepo\ICurriculumDetailRepo;
use App\Interface\IRepo\ICurriculumRepo;
use App\Interface\IRepo\IDesignitionRepo;
use App\Interface\IRepo\IProgramTypeRepo;
use App\Interface\IRepo\IRequirementRepo;
use App\Interface\IRepo\IRoomRepo;
use App\Interface\IRepo\ISchoolYearRepo;
use App\Interface\IRepo\ISectionRepo;
use App\Interface\IRepo\IUserRepo;
use App\Interface\IService\IAcademicCalendarService;
use App\Interface\IService\IAcademicProgramRequirementService;
use App\Interface\IService\IAcademicProgramService;
use App\Interface\IService\IAcademicTermService;
use App\Interface\IService\IAdmissionApplicationService;
use App\Interface\IService\IBuildingService;
use App\Interface\IService\ICampusService;
use App\Interface\IService\ICollegeService;
use App\Interface\IService\ICourseService;
use App\Interface\IService\ICurriculumDetailService;
use App\Interface\IService\ICurriculumService;
use App\Interface\IService\IDesignitionService;
use App\Interface\IService\IProgramTypeService;
use App\Interface\IService\IRequirementService;
use App\Interface\IService\IRoomService;
use App\Interface\IService\ISchoolYearService;
use App\Interface\IService\ISectionService;
use App\Interface\IService\IUserService;
use App\Repo\AcademicCalendarRepo;
use App\Repo\AcademicProgramRepo;
use App\Repo\AcademicProgramRequirementRepo;
use App\Repo\AcademicTermRepo;
use App\Repo\AdmissionApplicationRepo;
use App\Repo\BuildingRepo;
use App\Repo\CampusRepo;
use App\Repo\CollegeRepo;
use App\Repo\CourseRepo;
use App\Repo\CurriculumDetailRepo;
use App\Repo\CurriculumRepo;
use App\Repo\DesignitionRepo;
use App\Repo\ProgramTypeRepo;
use App\Repo\RequirementRepo;
use App\Repo\RoomRepo;
use App\Repo\SchoolYearRepo;
use App\Repo\SectionRepo;
use App\Repo\UserRepo;
use App\Service\AcademicCalendarService;
use App\Service\AcademicProgramRequirementService;
use App\Service\AcademicProgramService;
use App\Service\AcademicTermService;
use App\Service\AdmissionApplicationService;
use App\Service\BuildingService;
use App\Service\CampusService;
use App\Service\CollegeService;
use App\Service\CourseService;
use App\Service\CurriculumDetailService;
use App\Service\CurriculumService;
use App\Service\DesignitionService;
use App\Service\ProgramTypeService;
use App\Service\RequirementService;
use App\Service\RoomService;
use App\Service\SchoolYearService;
use App\Service\SectionService;
use App\Service\UserService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Repo
        $this->app->bind(IAcademicCalendarRepo::class, AcademicCalendarRepo::class);
        $this->app->bind(IAcademicProgramRepo::class, AcademicProgramRepo::class);
        $this->app->bind(IAcademicTermRepo::class, AcademicTermRepo::class);
        $this->app->bind(IBuildingRepo::class, BuildingRepo::class);
        $this->app->bind(ICampusRepo::class, CampusRepo::class);
        $this->app->bind(ICollegeRepo::class, CollegeRepo::class);
        $this->app->bind(ICourseRepo::class, CourseRepo::class);
        $this->app->bind(ICurriculumDetailRepo::class, CurriculumDetailRepo::class);
        $this->app->bind(ICurriculumRepo::class, CurriculumRepo::class);
        $this->app->bind(IDesignitionRepo::class, DesignitionRepo::class);
        $this->app->bind(IProgramTypeRepo::class, ProgramTypeRepo::class);
        $this->app->bind(IRequirementRepo::class, RequirementRepo::class);
        $this->app->bind(IRoomRepo::class, RoomRepo::class);
        $this->app->bind(ISchoolYearRepo::class, SchoolYearRepo::class);
        $this->app->bind(ISectionRepo::class, SectionRepo::class);
        $this->app->bind(IUserRepo::class, UserRepo::class);
        $this->app->bind(IAcademicProgramRequirementRepo::class, AcademicProgramRequirementRepo::class);
        $this->app->bind(IAdmissionApplicationRepo::class, AdmissionApplicationRepo::class);
        // Service
        $this->app->bind(IAcademicCalendarService::class, AcademicCalendarService::class);
        $this->app->bind(IAcademicProgramService::class, AcademicProgramService::class);
        $this->app->bind(IAcademicTermService::class, AcademicTermService::class);
        $this->app->bind(IBuildingService::class, BuildingService::class);
        $this->app->bind(ICampusService::class, CampusService::class);
        $this->app->bind(ICollegeService::class, CollegeService::class);
        $this->app->bind(ICourseService::class, CourseService::class);
        $this->app->bind(ICurriculumDetailService::class, CurriculumDetailService::class);
        $this->app->bind(ICurriculumService::class, CurriculumService::class);
        $this->app->bind(IDesignitionService::class, DesignitionService::class);
        $this->app->bind(IProgramTypeService::class, ProgramTypeService::class);
        $this->app->bind(IRequirementService::class, RequirementService::class);
        $this->app->bind(IRoomService::class, RoomService::class);
        $this->app->bind(ISchoolYearService::class, SchoolYearService::class);
        $this->app->bind(ISectionService::class, SectionService::class);
        $this->app->bind(IUserService::class, UserService::class);
        $this->app->bind(IAcademicProgramRequirementService::class, AcademicProgramRequirementService::class);
        $this->app->bind(IAdmissionApplicationService::class, AdmissionApplicationService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
