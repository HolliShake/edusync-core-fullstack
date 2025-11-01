<?php

namespace App\Providers;

use App\Interface\IRepo\IAcademicCalendarRepo;
use App\Interface\IRepo\IAcademicProgramCriteriaRepo;
use App\Interface\IRepo\IAcademicProgramRepo;
use App\Interface\IRepo\IAcademicProgramRequirementRepo;
use App\Interface\IRepo\IAcademicTermRepo;
use App\Interface\IRepo\IAdmissionApplicationLogRepo;
use App\Interface\IRepo\IAdmissionApplicationRepo;
use App\Interface\IRepo\IAdmissionApplicationScoreRepo;
use App\Interface\IRepo\IBuildingRepo;
use App\Interface\IRepo\ICampusRepo;
use App\Interface\IRepo\ICollegeRepo;
use App\Interface\IRepo\ICourseRepo;
use App\Interface\IRepo\ICourseRequisiteRepo;
use App\Interface\IRepo\ICurriculumDetailRepo;
use App\Interface\IRepo\ICurriculumRepo;
use App\Interface\IRepo\ICurriculumTaggingRepo;
use App\Interface\IRepo\IDesignitionRepo;
use App\Interface\IRepo\IDocumentRequestLogRepo;
use App\Interface\IRepo\IDocumentRequestRepo;
use App\Interface\IRepo\IDocumentTypeRepo;
use App\Interface\IRepo\IEnrollmentLogRepo;
use App\Interface\IRepo\IEnrollmentRepo;
use App\Interface\IRepo\IProgramTypeRepo;
use App\Interface\IRepo\IRequirementRepo;
use App\Interface\IRepo\IRoomRepo;
use App\Interface\IRepo\ISchoolYearRepo;
use App\Interface\IRepo\ISectionRepo;
use App\Interface\IRepo\IUserRepo;
use App\Interface\IService\IAcademicCalendarService;
use App\Interface\IService\IAcademicProgramCriteriaService;
use App\Interface\IService\IAcademicProgramRequirementService;
use App\Interface\IService\IAcademicProgramService;
use App\Interface\IService\IAcademicTermService;
use App\Interface\IService\IAdmissionApplicationLogService;
use App\Interface\IService\IAdmissionApplicationScoreService;
use App\Interface\IService\IAdmissionApplicationService;
use App\Interface\IService\IBuildingService;
use App\Interface\IService\ICampusService;
use App\Interface\IService\ICollegeService;
use App\Interface\IService\ICourseRequisiteService;
use App\Interface\IService\ICourseService;
use App\Interface\IService\ICurriculumDetailService;
use App\Interface\IService\ICurriculumService;
use App\Interface\IService\ICurriculumTaggingService;
use App\Interface\IService\IDesignitionService;
use App\Interface\IService\IDocumentRequestLogService;
use App\Interface\IService\IDocumentRequestService;
use App\Interface\IService\IDocumentTypeService;
use App\Interface\IService\IEnrollmentLogService;
use App\Interface\IService\IEnrollmentService;
use App\Interface\IService\IProgramTypeService;
use App\Interface\IService\IRequirementService;
use App\Interface\IService\IRoomService;
use App\Interface\IService\ISchoolYearService;
use App\Interface\IService\ISectionService;
use App\Interface\IService\IUserService;
use App\Repo\AcademicCalendarRepo;
use App\Repo\AcademicProgramCriteriaRepo;
use App\Repo\AcademicProgramRepo;
use App\Repo\AcademicProgramRequirementRepo;
use App\Repo\AcademicTermRepo;
use App\Repo\AdmissionApplicationLogRepo;
use App\Repo\AdmissionApplicationRepo;
use App\Repo\AdmissionApplicationScoreRepo;
use App\Repo\BuildingRepo;
use App\Repo\CampusRepo;
use App\Repo\CollegeRepo;
use App\Repo\CourseRepo;
use App\Repo\CourseRequisiteRepo;
use App\Repo\CurriculumDetailRepo;
use App\Repo\CurriculumRepo;
use App\Repo\CurriculumTaggingRepo;
use App\Repo\DesignitionRepo;
use App\Repo\DocumentRequestLogRepo;
use App\Repo\DocumentRequestRepo;
use App\Repo\DocumentTypeRepo;
use App\Repo\EnrollmentLogRepo;
use App\Repo\EnrollmentRepo;
use App\Repo\ProgramTypeRepo;
use App\Repo\RequirementRepo;
use App\Repo\RoomRepo;
use App\Repo\SchoolYearRepo;
use App\Repo\SectionRepo;
use App\Repo\UserRepo;
use App\Service\AcademicCalendarService;
use App\Service\AcademicProgramCriteriaService;
use App\Service\AcademicProgramRequirementService;
use App\Service\AcademicProgramService;
use App\Service\AcademicTermService;
use App\Service\AdmissionApplicationLogService;
use App\Service\AdmissionApplicationScoreService;
use App\Service\AdmissionApplicationService;
use App\Service\BuildingService;
use App\Service\CampusService;
use App\Service\CollegeService;
use App\Service\CourseRequisiteService;
use App\Service\CourseService;
use App\Service\CurriculumDetailService;
use App\Service\CurriculumService;
use App\Service\CurriculumTaggingService;
use App\Service\DesignitionService;
use App\Service\DocumentRequestLogService;
use App\Service\DocumentRequestService;
use App\Service\DocumentTypeService;
use App\Service\EnrollmentLogService;
use App\Service\EnrollmentService;
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
        $this->app->bind(IAdmissionApplicationLogRepo::class, AdmissionApplicationLogRepo::class);
        $this->app->bind(IAcademicProgramCriteriaRepo::class, AcademicProgramCriteriaRepo::class);
        $this->app->bind(IAdmissionApplicationScoreRepo::class, AdmissionApplicationScoreRepo::class);
        $this->app->bind(IEnrollmentRepo::class, EnrollmentRepo::class);
        $this->app->bind(IDocumentRequestRepo::class, DocumentRequestRepo::class);
        $this->app->bind(IDocumentRequestLogRepo::class, DocumentRequestLogRepo::class);
        $this->app->bind(IDocumentTypeRepo::class, DocumentTypeRepo::class);
        $this->app->bind(ICourseRequisiteRepo::class, CourseRequisiteRepo::class);
        $this->app->bind(IEnrollmentLogRepo::class, EnrollmentLogRepo::class);
        $this->app->bind(ICurriculumTaggingRepo::class, CurriculumTaggingRepo::class);
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
        $this->app->bind(IAdmissionApplicationLogService::class, AdmissionApplicationLogService::class);
        $this->app->bind(IAcademicProgramCriteriaService::class, AcademicProgramCriteriaService::class);
        $this->app->bind(IAdmissionApplicationScoreService::class, AdmissionApplicationScoreService::class);
        $this->app->bind(IEnrollmentService::class, EnrollmentService::class);
        $this->app->bind(IDocumentRequestService::class, DocumentRequestService::class);
        $this->app->bind(IDocumentRequestLogService::class, DocumentRequestLogService::class);
        $this->app->bind(IDocumentTypeService::class, DocumentTypeService::class);
        $this->app->bind(ICourseRequisiteService::class, CourseRequisiteService::class);
        $this->app->bind(IEnrollmentLogService::class, EnrollmentLogService::class);
        $this->app->bind(ICurriculumTaggingService::class, CurriculumTaggingService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
