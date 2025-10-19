# EduSync API Application Layer

## Overview

The `/api/app` directory contains the core application layer of the EduSync educational management system. This Laravel-based backend implements a clean architecture pattern with a clear separation of concerns through a layered structure utilizing the Repository and Service pattern.

## Architecture Pattern

This application follows a **Layered Architecture** with the following flow:

```
HTTP Request → Controller → Service → Repository → Model → Database
                  ↓            ↓          ↓          ↓
               Validation   Business   Data       Eloquent
                            Logic      Access      ORM
```

### Key Principles

1. **Interface-Driven Development**: Every repository and service implements an interface, enabling dependency injection and testability
2. **Single Responsibility**: Each layer has a distinct responsibility
3. **Dependency Injection**: Dependencies are injected via constructors and bound in the service provider
4. **Generic Base Classes**: Common CRUD operations are abstracted into generic classes to reduce code duplication
5. **OpenAPI Documentation**: All API endpoints are documented using PHP 8 attributes

## Directory Structure

```
app/
├── Console/              # Artisan commands
│   └── Commands/
│       └── SwaggerGenerate.php    # OpenAPI spec generation
│
├── Enum/                 # Application enumerations
│   ├── CalendarEventEnum.php      # Calendar event types
│   ├── CurriculumStateEnum.php    # Curriculum states
│   ├── RequirementTypeEnum.php    # Requirement types
│   └── UserRoleEnum.php           # User roles (admin, faculty, student, etc.)
│
├── Http/                 # HTTP layer
│   └── Controllers/      # Request handlers
│       ├── Controller.php                   # Base controller with response helpers
│       ├── AcademicCalendarController.php   # Academic calendar endpoints
│       ├── AcademicProgramController.php    # Academic program endpoints
│       ├── AcademicTermController.php       # Academic term endpoints
│       ├── BuildingController.php           # Building management endpoints
│       ├── CampusController.php             # Campus management endpoints
│       ├── CollegeController.php            # College management endpoints
│       ├── CourseController.php             # Course management endpoints
│       ├── CurriculumController.php         # Curriculum management endpoints
│       ├── CurriculumDetailController.php   # Curriculum detail endpoints
│       ├── ProgramTypeController.php        # Program type endpoints
│       ├── RequirementController.php        # Requirement management endpoints
│       ├── RoomController.php               # Room management endpoints
│       ├── SchoolYearController.php         # School year endpoints
│       └── SectionController.php            # Section management endpoints
│
├── Interface/            # Contract definitions
│   ├── IRepo/           # Repository interfaces
│   │   ├── IGenericRepo.php                # Base repository interface
│   │   ├── IAcademicCalendarRepo.php       # Academic calendar repository contract
│   │   ├── IAcademicProgramRepo.php        # Academic program repository contract
│   │   ├── IAcademicTermRepo.php           # Academic term repository contract
│   │   ├── IBuildingRepo.php               # Building repository contract
│   │   ├── ICampusRepo.php                 # Campus repository contract
│   │   ├── ICollegeRepo.php                # College repository contract
│   │   ├── ICourseRepo.php                 # Course repository contract
│   │   ├── ICurriculumRepo.php             # Curriculum repository contract
│   │   ├── ICurriculumDetailRepo.php       # Curriculum detail repository contract
│   │   ├── IProgramTypeRepo.php            # Program type repository contract
│   │   ├── IRequirementRepo.php            # Requirement repository contract
│   │   ├── IRoomRepo.php                   # Room repository contract
│   │   ├── ISchoolYearRepo.php             # School year repository contract
│   │   └── ISectionRepo.php                # Section repository contract
│   │
│   └── IService/        # Service interfaces
│       ├── IGenericService.php             # Base service interface
│       ├── IAcademicCalendarService.php    # Academic calendar service contract
│       ├── IAcademicProgramService.php     # Academic program service contract
│       ├── IAcademicTermService.php        # Academic term service contract
│       ├── IBuildingService.php            # Building service contract
│       ├── ICampusService.php              # Campus service contract
│       ├── ICollegeService.php             # College service contract
│       ├── ICourseService.php              # Course service contract
│       ├── ICurriculumService.php          # Curriculum service contract
│       ├── ICurriculumDetailService.php    # Curriculum detail service contract
│       ├── IProgramTypeService.php         # Program type service contract
│       ├── IRequirementService.php         # Requirement service contract
│       ├── IRoomService.php                # Room service contract
│       ├── ISchoolYearService.php          # School year service contract
│       └── ISectionService.php             # Section service contract
│
├── Models/               # Eloquent ORM models
│   ├── AcademicCalendar.php    # Academic calendar model
│   ├── AcademicProgram.php     # Academic program model
│   ├── AcademicTerm.php        # Academic term model
│   ├── Building.php            # Building model
│   ├── Campus.php              # Campus model
│   ├── College.php             # College model
│   ├── Course.php              # Course model
│   ├── Curriculum.php          # Curriculum model
│   ├── CurriculumDetail.php    # Curriculum detail model
│   ├── ProgramType.php         # Program type model
│   ├── Requirement.php         # Requirement model
│   ├── Room.php                # Room model
│   ├── SchoolYear.php          # School year model
│   ├── Section.php             # Section model
│   └── User.php                # User model
│
├── Providers/            # Service providers
│   └── AppServiceProvider.php  # Binds interfaces to implementations
│
├── Repo/                 # Repository implementations
│   ├── GenericRepo.php                 # Base repository with CRUD operations
│   ├── AcademicCalendarRepo.php        # Academic calendar data access
│   ├── AcademicProgramRepo.php         # Academic program data access
│   ├── AcademicTermRepo.php            # Academic term data access
│   ├── BuildingRepo.php                # Building data access
│   ├── CampusRepo.php                  # Campus data access
│   ├── CollegeRepo.php                 # College data access
│   ├── CourseRepo.php                  # Course data access
│   ├── CurriculumRepo.php              # Curriculum data access
│   ├── CurriculumDetailRepo.php        # Curriculum detail data access
│   ├── ProgramTypeRepo.php             # Program type data access
│   ├── RequirementRepo.php             # Requirement data access
│   ├── RoomRepo.php                    # Room data access
│   ├── SchoolYearRepo.php              # School year data access
│   └── SectionRepo.php                 # Section data access
│
└── Service/              # Business logic layer
    ├── GenericService.php              # Base service with lifecycle hooks
    ├── AcademicCalendarService.php     # Academic calendar business logic
    ├── AcademicProgramService.php      # Academic program business logic
    ├── AcademicTermService.php         # Academic term business logic
    ├── BuildingService.php             # Building business logic
    ├── CampusService.php               # Campus business logic
    ├── CollegeService.php              # College business logic
    ├── CourseService.php               # Course business logic
    ├── CurriculumService.php           # Curriculum business logic
    ├── CurriculumDetailService.php     # Curriculum detail business logic
    ├── ProgramTypeService.php          # Program type business logic
    ├── RequirementService.php          # Requirement business logic
    ├── RoomService.php                 # Room business logic
    ├── SchoolYearService.php           # School year business logic
    └── SectionService.php              # Section business logic
```

## Layer Responsibilities

### 1. Controllers (`Http/Controllers/`)

**Purpose**: Handle HTTP requests and responses

**Responsibilities**:

-   Receive and validate HTTP requests
-   Call appropriate service methods
-   Format and return HTTP responses
-   Handle exceptions and error responses
-   Document API endpoints with OpenAPI attributes

**Example Pattern**:

```php
class CampusController extends Controller
{
    public function __construct(protected CampusService $service) {}

    public function index(Request $request)
    {
        // Extract query parameters
        $page = $request->query("page", 0);
        $rows = $request->query("rows", 10);

        // Call service layer
        return $this->ok($this->service->getAll(true, $page, $rows));
    }
}
```

**Base Controller Features**:

-   `ok($data)` - 200 success response
-   `noContent()` - 204 no content response
-   `badRequest($data)` - 400 bad request
-   `unauthorized($data)` - 401 unauthorized
-   `forbidden($data)` - 403 forbidden
-   `notFound($data)` - 404 not found
-   `conflict($data)` - 409 conflict
-   `validationError($errors)` - 422 validation error
-   `internalServerError($data)` - 500 internal server error

### 2. Services (`Service/`)

**Purpose**: Implement business logic and orchestration

**Responsibilities**:

-   Validate business rules
-   Orchestrate complex operations
-   Transform data between layers
-   Provide lifecycle hooks (before/after create/update/delete)
-   Coordinate multiple repository calls

**Example Pattern**:

```php
class CampusService extends GenericService implements ICampusService
{
    public function __construct(ICampusRepo $campusRepository)
    {
        parent::__construct($campusRepository);
    }

    // Override lifecycle hooks for custom business logic
    protected function beforeCreate(array $data): array
    {
        // Custom validation or transformation
        return $data;
    }
}
```

**Generic Service Lifecycle Hooks**:

-   `beforeCreate(array $data): array` - Called before creating a record
-   `afterCreate(Model $model, array $data): void` - Called after creating a record
-   `beforeUpdate(int|string $id, array $data): array` - Called before updating
-   `afterUpdate(Model $model, array $data): void` - Called after updating
-   `beforeDelete(int|string $id): void` - Called before deletion
-   `afterDelete(int|string $id): void` - Called after deletion

### 3. Repositories (`Repo/`)

**Purpose**: Abstract database operations

**Responsibilities**:

-   Execute database queries
-   Handle Eloquent model interactions
-   Define allowed filters, sorts, and includes
-   Provide query builder access
-   Support pagination

**Example Pattern**:

```php
class CampusRepo extends GenericRepo implements ICampusRepo
{
    public function __construct()
    {
        parent::__construct(Campus::class);
    }

    protected function getAllowedFilters(): array
    {
        return [
            // AllowedFilter::exact('status'),
            // AllowedFilter::partial('name'),
        ];
    }

    protected function getAllowedSorts(): array
    {
        return ['created_at', 'updated_at', 'name'];
    }

    protected function getAllowedIncludes(): array
    {
        return [
            // 'buildings', 'colleges'
        ];
    }
}
```

**Generic Repository Methods**:

-   `query(): Builder` - Get query builder for the model
-   `getAll(bool $paginate, int $page, int $rows)` - Get all records with optional pagination
-   `getById(int|string $id, array $relations)` - Get a single record by ID
-   `create(array $data): Model` - Create a new record
-   `createMultiple(array $data): array` - Create multiple records in transaction
-   `update(int|string $id, array $data, array $relations): Model` - Update a record
-   `delete(int|string $id, array $relations): bool` - Delete a record

### 4. Models (`Models/`)

**Purpose**: Define database entities and relationships

**Responsibilities**:

-   Define table structure and fillable fields
-   Define Eloquent relationships
-   Provide OpenAPI schema documentation
-   Define model accessors and mutators

**Example Pattern**:

```php
#[OA\Schema(
    schema: "Campus",
    required: ["name", "short_name", "address"],
    properties: [
        new OA\Property(property: "id", type: "integer"),
        new OA\Property(property: "name", type: "string"),
        new OA\Property(property: "short_name", type: "string"),
        new OA\Property(property: "address", type: "string"),
    ]
)]
class Campus extends Model
{
    protected $table = 'campus';
    protected $fillable = ['name', 'short_name', 'address'];
}
```

### 5. Interfaces (`Interface/`)

**Purpose**: Define contracts for repositories and services

**Responsibilities**:

-   Define method signatures
-   Enable dependency injection
-   Support testing with mock implementations
-   Ensure consistency across implementations

### 6. Enums (`Enum/`)

**Purpose**: Define typed constants for application

**Available Enums**:

#### UserRoleEnum

```php
enum UserRoleEnum: string
{
    case ADMIN = 'admin';
    case PROGRAM_CHAIR = 'program-chair';
    case COLLEGE_DEAN = 'college-dean';
    case SPECIALIZATION_CHAIR = 'specialization-chair';
    case CAMPUS_SCHEDULER = 'campus-scheduler';
    case CAMPUS_REGISTRAR = 'campus-registrar';
    case STUDENT = 'student';
    case FACULTY = 'faculty';
    case GUEST = 'guest';
}
```

#### CalendarEventEnum

Defines types of academic calendar events

#### CurriculumStateEnum

Defines states for curriculum (e.g., draft, active, archived)

#### RequirementTypeEnum

Defines types of requirements for academic programs

### 7. Providers (`Providers/`)

**Purpose**: Bind interfaces to implementations

The `AppServiceProvider` registers all interface-to-implementation bindings:

```php
// Repository bindings
$this->app->bind(ICampusRepo::class, CampusRepo::class);
$this->app->bind(IBuildingRepo::class, BuildingRepo::class);
// ... more bindings

// Service bindings
$this->app->bind(ICampusService::class, CampusService::class);
$this->app->bind(IBuildingService::class, BuildingService::class);
// ... more bindings
```

## Domain Entities

The application manages the following core entities:

### Infrastructure & Location

-   **Campus**: Educational institution campuses
-   **Building**: Buildings within campuses
-   **Room**: Rooms within buildings
-   **College**: Academic colleges/departments

### Academic Structure

-   **ProgramType**: Types of academic programs (e.g., Bachelor's, Master's)
-   **AcademicProgram**: Specific degree programs
-   **Curriculum**: Program curricula
-   **CurriculumDetail**: Individual courses within a curriculum
-   **Course**: Course definitions

### Scheduling & Time

-   **SchoolYear**: Academic years
-   **AcademicTerm**: Semesters/terms within a school year
-   **AcademicCalendar**: Calendar events
-   **Section**: Course sections/classes

### Administrative

-   **Requirement**: Program or enrollment requirements
-   **User**: System users with various roles

## Features & Capabilities

### 1. Generic CRUD Operations

All entities support standard CRUD operations through the generic base classes:

-   Create single or multiple records
-   Read with pagination, filtering, sorting, and eager loading
-   Update records by ID
-   Delete records by ID

### 2. Advanced Querying

Powered by [Spatie Query Builder](https://github.com/spatie/laravel-query-builder):

-   **Filtering**: Apply filters on specific fields
-   **Sorting**: Sort by allowed fields
-   **Includes**: Eager load relationships
-   **Pagination**: Built-in pagination support

### 3. OpenAPI Documentation

All API endpoints are fully documented using PHP 8 attributes:

-   Request/response schemas
-   Parameter documentation
-   Authentication requirements
-   Standard error responses

Generate OpenAPI spec:

```bash
php artisan swagger:generate
```

### 4. Consistent API Responses

All responses follow a standardized format:

**Success Response**:

```json
{
  "status": "success",
  "data": { ... }
}
```

**Error Response**:

```json
{
    "status": "error",
    "message": "Error description"
}
```

**Validation Error**:

```json
{
    "message": "The title field is required. (and 3 more errors)",
    "errors": {
        "field_name": ["Error message 1", "Error message 2"]
    }
}
```

**Paginated Response**:

```json
{
  "status": "success",
  "data": {
    "data": [...],
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 50,
    "from": 1,
    "to": 10
  }
}
```

## Design Patterns

### 1. Repository Pattern

Abstracts data access logic from business logic, making the application easier to test and maintain.

### 2. Service Pattern

Encapsulates business logic separate from data access and presentation layers.

### 3. Dependency Injection

All dependencies are injected via constructors, resolved by Laravel's service container.

### 4. Interface Segregation

Each repository and service implements a specific interface, following SOLID principles.

### 5. Template Method Pattern

Generic base classes provide template methods with hooks that can be overridden by child classes.

## Adding a New Entity

To add a new entity to the application, follow these steps:

### 1. Create the Model

```bash
php artisan make:model EntityName
```

Add OpenAPI schemas and define fillable fields in `app/Models/EntityName.php`.

### 2. Create Repository Interface

Create `app/Interface/IRepo/IEntityNameRepo.php`:

```php
<?php
namespace App\Interface\IRepo;

interface IEntityNameRepo extends IGenericRepo
{
    // Add custom repository methods if needed
}
```

### 3. Create Repository Implementation

Create `app/Repo/EntityNameRepo.php`:

```php
<?php
namespace App\Repo;

use App\Interface\IRepo\IEntityNameRepo;
use App\Models\EntityName;

class EntityNameRepo extends GenericRepo implements IEntityNameRepo
{
    public function __construct()
    {
        parent::__construct(EntityName::class);
    }

    protected function getAllowedFilters(): array
    {
        return [
            // Define filters
        ];
    }

    protected function getAllowedSorts(): array
    {
        return ['created_at', 'updated_at'];
    }

    protected function getAllowedIncludes(): array
    {
        return [
            // Define relationships
        ];
    }
}
```

### 4. Create Service Interface

Create `app/Interface/IService/IEntityNameService.php`:

```php
<?php
namespace App\Interface\IService;

interface IEntityNameService extends IGenericService
{
    // Add custom service methods if needed
}
```

### 5. Create Service Implementation

Create `app/Service/EntityNameService.php`:

```php
<?php
namespace App\Service;

use App\Interface\IService\IEntityNameService;
use App\Interface\IRepo\IEntityNameRepo;

class EntityNameService extends GenericService implements IEntityNameService
{
    public function __construct(IEntityNameRepo $repository)
    {
        parent::__construct($repository);
    }
}
```

### 6. Create Controller

```bash
php artisan make:controller EntityNameController
```

Implement CRUD endpoints with OpenAPI documentation.

### 7. Register Bindings

Add to `app/Providers/AppServiceProvider.php`:

```php
$this->app->bind(IEntityNameRepo::class, EntityNameRepo::class);
$this->app->bind(IEntityNameService::class, EntityNameService::class);
```

### 8. Define Routes

Add routes in `routes/api.php`:

```php
Route::prefix('EntityName')->group(function () {
    Route::get('/', [EntityNameController::class, 'index']);
    Route::get('/{id}', [EntityNameController::class, 'show']);
    Route::post('/create', [EntityNameController::class, 'store']);
    Route::put('/update/{id}', [EntityNameController::class, 'update']);
    Route::delete('/delete/{id}', [EntityNameController::class, 'destroy']);
});
```

## Testing

The layered architecture facilitates testing at multiple levels:

### Unit Testing

-   Test services with mocked repositories
-   Test repositories with in-memory databases
-   Test models in isolation

### Integration Testing

-   Test controller → service → repository flow
-   Test database interactions
-   Test API endpoints

### Example Test Structure

```php
use Tests\TestCase;

class CampusServiceTest extends TestCase
{
    public function test_can_create_campus()
    {
        $data = [
            'name' => 'Main Campus',
            'short_name' => 'MC',
            'address' => '123 University Ave'
        ];

        $campus = $this->campusService->create($data);

        $this->assertInstanceOf(Campus::class, $campus);
        $this->assertEquals('Main Campus', $campus->name);
    }
}
```

## Best Practices

### 1. Use Dependency Injection

Always inject dependencies via constructor, never use facades or static calls in business logic.

### 2. Keep Controllers Thin

Controllers should only handle HTTP concerns. Move all business logic to services.

### 3. Keep Services Focused

Each service should have a single, well-defined responsibility.

### 4. Use Repository for All Data Access

Never query models directly from services or controllers.

### 5. Validate Early

Validate input in controllers before passing to services.

### 6. Use Transactions

Wrap multi-step operations in database transactions (handled automatically in `createMultiple`).

### 7. Document Everything

Use OpenAPI attributes to document all endpoints and schemas.

### 8. Handle Exceptions Gracefully

Catch and handle exceptions appropriately in controllers.

## Technology Stack

-   **Framework**: Laravel 11.x
-   **PHP**: 8.2+
-   **Query Builder**: [Spatie Laravel Query Builder](https://github.com/spatie/laravel-query-builder)
-   **API Documentation**: OpenAPI 3.0 (via [zircote/swagger-php](https://github.com/zircote/swagger-php))
-   **ORM**: Eloquent
-   **Dependency Injection**: Laravel Service Container

## API Documentation

The API documentation is automatically generated from OpenAPI attributes:

### Generate OpenAPI Spec

```bash
php artisan swagger:generate
```

This generates `/public/openapi.json` which can be imported into:

-   Swagger UI
-   Postman
-   Insomnia
-   Frontend code generators (e.g., Orval)

## Performance Considerations

### 1. Eager Loading

Use the `includes` query parameter to eager load relationships:

```
GET /api/Campus?include=buildings,colleges
```

### 2. Pagination

Always use pagination for list endpoints to prevent loading large datasets:

```
GET /api/Campus?page=1&rows=20
```

### 3. Query Optimization

Define appropriate filters and sorts in repositories to enable efficient querying.

### 4. Caching

Consider caching frequently accessed data at the service layer.

## Security Considerations

### 1. Input Validation

All input is validated in controllers before processing.

### 2. Mass Assignment Protection

Models use `$fillable` to protect against mass assignment vulnerabilities.

### 3. SQL Injection Prevention

Eloquent ORM automatically prevents SQL injection.

### 4. Authorization

Implement authorization checks in controllers or middleware.

## Troubleshooting

### Common Issues

#### 1. Interface Not Found

**Problem**: Interface binding not registered

**Solution**: Add binding in `AppServiceProvider::register()`

#### 2. Query Builder Errors

**Problem**: Invalid filter/sort/include

**Solution**: Check `getAllowedFilters()`, `getAllowedSorts()`, and `getAllowedIncludes()` in repository

#### 3. Validation Errors

**Problem**: Missing required fields

**Solution**: Check validation rules in controller and ensure all required fields are provided

## Contributing

When contributing to this codebase:

1. Follow the established patterns for new entities
2. Add comprehensive OpenAPI documentation
3. Write unit and integration tests
4. Update this README if adding new patterns or conventions
5. Ensure all interfaces are properly bound in `AppServiceProvider`
6. Follow PSR-12 coding standards

## Related Documentation

-   [Laravel Documentation](https://laravel.com/docs)
-   [Spatie Query Builder](https://spatie.be/docs/laravel-query-builder)
-   [OpenAPI Specification](https://swagger.io/specification/)
-   [PHP 8 Attributes](https://www.php.net/manual/en/language.attributes.overview.php)

---

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Maintained By**: EduSync Development Team
