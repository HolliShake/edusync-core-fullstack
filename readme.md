# EduSync Core Fullstack

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/PHP-8.3-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP">
  <img src="https://img.shields.io/badge/Docker-24.0-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

A comprehensive educational management system built with modern technologies. EduSync Core provides a robust platform for managing academic institutions, including campuses, programs, curricula, courses, schedules, and more.

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage](#-usage)
- [Development](#-development)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

EduSync Core is a full-stack educational management system designed to streamline administrative processes in academic institutions. The platform provides comprehensive tools for managing:

- **Infrastructure**: Campuses, buildings, and rooms
- **Academic Structure**: Programs, curricula, courses, and sections
- **Scheduling**: Academic terms, school years, and calendars
- **Admission**: Application processing, evaluation, and scoring
- **Enrollment**: Student enrollment with approval workflows
- **Document Management**: Document requests and tracking
- **Grade Management**: Gradebook system with grading items and student tracking
- **User Management**: Role-based access control with designation system
- **Administration**: Requirements, users, and comprehensive role management

The system follows clean architecture principles with a clear separation between frontend and backend, making it scalable, maintainable, and testable.

## ✨ Features

### 🏛️ Campus Management

- Multi-campus support
- Building and room management
- College/department organization

### 📚 Academic Program Management

- Program type definitions (Bachelor's, Master's, etc.)
- Academic program creation and management
- Curriculum design and versioning
- Course catalog management
- Course prerequisites and co-requisites
- Academic program criteria for admission evaluation
- Academic program requirements management
- Curriculum tagging

### 📅 Scheduling & Calendar

- School year management
- Academic term (semester) configuration
- Calendar event management
- Section/class scheduling

### 👥 User Management

- Role-based access control (RBAC)
- Multiple user roles:
  - Admin
  - Program Chair
  - College Dean
  - Specialization Chair
  - Campus Scheduler
  - Campus Registrar
  - Faculty
  - Student
  - Guest
- Role designation system (Designition)
- Specialized role assignment workflows for Program Chair, College Dean, and Campus Registrar
- User profile management

### 📊 Requirements Management

- Define program requirements
- Track enrollment requirements
- Manage prerequisites

### 🎓 Admission System

- Multi-step admission application process
- Application pool numbering and tracking
- Admission schedule management per campus
- Application evaluation and scoring
- Program-specific admission criteria
- Application status tracking (Submitted, Approved, Rejected, Accepted, Cancelled)
- Application logs and history
- File upload support for application requirements

### 📝 Enrollment System

- Student enrollment management
- Multi-level approval workflow (Program Chair → Campus Registrar)
- Enrollment status tracking
- Drop enrollment functionality
- Enrollment validation and verification
- Scholastic record filtering by campus and school year
- Enrollment logs and audit trail

### 📄 Document Request System

- Document request submission and tracking
- Document type management
- Request status workflow (Submitted, Processing, Completed, Rejected, Cancelled, Pickup, Paid)
- Request cancellation support
- Document request logs and history
- Campus-specific document requests

### 📊 Gradebook System

- Gradebook management for sections
- Grade item creation with configurable weights
- Grade item detail tracking for individual students
- Hierarchical grade structure (Gradebook → Items → Item Details)
- Support for various grading criteria
- Student performance tracking and evaluation

### 🔍 Advanced Features

- Filtering, sorting, and pagination
- Relationship eager loading
- RESTful API with OpenAPI documentation
- Real-time data synchronization
- Responsive modern UI with dark mode
- Automated database triggers for workflow management
- Batch operations for bulk data processing
- Rate limiting on high-traffic endpoints
- Type-safe API client generation with Orval

## 🛠️ Tech Stack

### Backend

- **Framework**: Laravel 12.x
- **Language**: PHP 8.3+
- **Database**: MySQL 8.0
- **Authentication**: Laravel Sanctum
- **API Documentation**: OpenAPI 3.0 (Swagger)
- **Query Builder**: Spatie Laravel Query Builder
- **Media Management**: Spatie Laravel Media Library
- **ORM**: Eloquent
- **Database Triggers**: Automated workflow triggers for admission, enrollment, and document requests

### Frontend

- **Framework**: React 19.x
- **Language**: TypeScript 5.8
- **Build Tool**: Vite 7.x
- **UI Framework**: Tailwind CSS 4.x
- **Component Library**: Radix UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Routing**: React Router 7.x
- **Form Handling**: React Hook Form + Zod
- **API Client Generation**: Orval

### DevOps

- **Containerization**: Docker & Docker Compose
- **Web Server**: PHP Built-in Server (Development)
- **Database Admin**: phpMyAdmin

## 🏗️ Architecture

### Backend Architecture

The backend follows a **Layered Architecture** pattern:

```
┌─────────────────────────────────────────────┐
│           HTTP Layer (Controllers)          │
│  • Request handling                         │
│  • Response formatting                      │
│  • OpenAPI documentation                    │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         Business Logic (Services)           │
│  • Business rules validation                │
│  • Transaction orchestration                │
│  • Lifecycle hooks                          │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         Data Access (Repositories)          │
│  • Database queries                         │
│  • Filtering & sorting                      │
│  • Eager loading                            │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│            Models (Eloquent ORM)            │
│  • Database entities                        │
│  • Relationships                            │
└─────────────────────────────────────────────┘
```

**Key Patterns**:

- Repository Pattern for data abstraction
- Service Pattern for business logic
- Dependency Injection via Laravel Container
- Interface-driven development for testability
- Generic base classes to reduce code duplication

### Frontend Architecture

The frontend follows a **Component-Based Architecture**:

```
┌─────────────────────────────────────────────┐
│             Pages (Routes)                  │
│  • Admin pages                              │
│  • College dean pages                       │
│  • Program chair pages                      │
│  • Student pages                            │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│           Layouts & Components              │
│  • Dashboard layout                         │
│  • Reusable UI components                   │
│  • Navigation & headers                     │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         State Management (Zustand)          │
│  • Global state                             │
│  • Authentication state                     │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│        API Layer (Axios + React Query)      │
│  • HTTP requests                            │
│  • Caching & synchronization                │
│  • Type-safe API clients                    │
└─────────────────────────────────────────────┘
```

## 📁 Project Structure

```
edusync-core-fullstack/
├── api/                          # Laravel Backend
│   ├── app/
│   │   ├── Console/              # Artisan commands
│   │   ├── Enum/                 # Application enumerations
│   │   ├── Http/Controllers/     # API controllers
│   │   ├── Interface/            # Repository & Service interfaces
│   │   │   ├── IRepo/            # Repository interfaces
│   │   │   └── IService/         # Service interfaces
│   │   ├── Models/               # Eloquent models
│   │   ├── Providers/            # Service providers
│   │   ├── Repo/                 # Repository implementations
│   │   └── Service/              # Business logic services
│   ├── database/
│   │   ├── migrations/           # Database migrations
│   │   └── seeders/              # Database seeders
│   ├── routes/
│   │   └── api.php               # API routes
│   ├── public/
│   │   └── openapi.json          # Generated OpenAPI spec
│   └── composer.json             # PHP dependencies
│
├── app/                          # React Frontend
│   ├── src/
│   │   ├── assets/               # Static assets
│   │   ├── components/           # Reusable React components
│   │   ├── context/              # React contexts
│   │   ├── enums/                # TypeScript enums
│   │   ├── hooks/                # Custom React hooks
│   │   ├── layouts/              # Layout components
│   │   ├── lib/                  # Utility libraries
│   │   ├── pages/                # Page components
│   │   │   ├── admin/            # Admin pages
│   │   │   ├── college-dean/     # College dean pages
│   │   │   ├── program-chair/    # Program chair pages
│   │   │   └── student/          # Student pages
│   │   ├── routes/               # Route definitions
│   │   ├── store/                # State management
│   │   └── types/                # TypeScript type definitions
│   ├── rest/
│   │   ├── api.ts                # API client
│   │   ├── axios.ts              # Axios configuration
│   │   └── models/               # Generated API models
│   └── package.json              # Node dependencies
│
├── docker/                       # Docker configurations
│   ├── api/Dockerfile            # Backend Dockerfile
│   └── app/Dockerfile            # Frontend Dockerfile
│
├── docker-compose.yml            # Docker Compose configuration
└── readme.md                     # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker Desktop** (v24.0 or higher) - [Download](https://www.docker.com/products/docker-desktop)
- **Docker Compose** (v2.0 or higher) - Usually included with Docker Desktop
- **Git** - For cloning the repository

**OR** if you prefer local development without Docker:

- **PHP** 8.3 or higher with extensions: PDO, MySQL, mbstring, XML, BCMath, GD, ZIP
- **Composer** - PHP dependency manager
- **Node.js** 22.x or higher
- **npm** or **yarn**
- **MySQL** 8.0 or higher

## 🚀 Installation

### Option 1: Docker (Recommended)

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/edusync-core-fullstack.git
   cd edusync-core-fullstack
   ```

2. **Set up environment variables**

   For the backend (Laravel):

   ```bash
   cd api
   cp .env.example .env
   ```

   Edit `.env` if needed (default values work with Docker):

   ```env
   DB_CONNECTION=mysql
   DB_HOST=mysql
   DB_PORT=3306
   DB_DATABASE=edusync
   DB_USERNAME=edusync
   DB_PASSWORD=password
   ```

3. **Start Docker containers**

   ```bash
   cd .. # Back to root directory
   docker-compose up -d
   ```

4. **Install backend dependencies and set up database**

   ```bash
   # Enter the backend container
   docker-compose exec backend bash

   # Generate application key
   php artisan key:generate

   # Run migrations
   php artisan migrate

   # (Optional) Seed database with sample data
   php artisan db:seed

   # Generate OpenAPI documentation
   php artisan swagger:generate

   # Exit container
   exit
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - phpMyAdmin: http://localhost:8080
   - API Documentation: http://localhost:8000/openapi.json

### Option 2: Local Development

#### Backend Setup

1. **Navigate to the API directory**

   ```bash
   cd api
   ```

2. **Install PHP dependencies**

   ```bash
   composer install
   ```

3. **Set up environment**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your database credentials:

   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=edusync
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

4. **Generate application key**

   ```bash
   php artisan key:generate
   ```

5. **Run migrations and seeders**

   ```bash
   php artisan migrate
   php artisan db:seed
   ```

6. **Generate API documentation**

   ```bash
   php artisan swagger:generate
   ```

7. **Start the development server**
   ```bash
   php artisan serve
   ```

#### Frontend Setup

1. **Open a new terminal and navigate to the app directory**

   ```bash
   cd app
   ```

2. **Install Node dependencies**

   ```bash
   npm install --legacy-peer-deps
   ```

3. **Create environment file** (if needed)

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173 (or the port Vite assigns)
   - Backend API: http://localhost:8000

## 💻 Usage

### Authentication

The application uses Laravel Sanctum for API authentication with token-based authorization.

**Authentication Flow**:

1. User submits credentials to `/api/Auth/login`
2. Server validates and returns a bearer token
3. Client includes token in `Authorization` header for subsequent requests
4. Token can be revoked via `/api/Auth/logout`

**Protected Routes**: Most endpoints require authentication. Include the token in the header:

```
Authorization: Bearer {your-token-here}
```

### API Endpoints

#### Authentication Endpoints

```
POST /api/Auth/login      # User login (returns token)
POST /api/Auth/logout     # User logout (requires authentication)
GET  /api/Auth/session    # Get current session (requires authentication)
```

#### Resource Endpoints

The API follows RESTful conventions. Common endpoints for each resource:

```
GET    /api/{resource}              # List all (with pagination)
GET    /api/{resource}/{id}         # Get by ID
POST   /api/{resource}/create       # Create new
PUT    /api/{resource}/update/{id}  # Update by ID
DELETE /api/{resource}/delete/{id}  # Delete by ID
```

#### Available Resources

- `Campus` - Campus management
- `Building` - Building management
- `Room` - Room management
- `College` - College/department management
- `ProgramType` - Program type definitions
- `AcademicProgram` - Academic programs
- `AcademicProgramCriteria` - Admission evaluation criteria
- `AcademicProgramRequirement` - Program-specific requirements
- `Curriculum` - Curricula
- `CurriculumDetail` - Curriculum courses
- `CurriculumTagging` - Curriculum tagging
- `Course` - Course catalog
- `CourseRequisite` - Course prerequisites and co-requisites
- `SchoolYear` - School years
- `AcademicTerm` - Academic terms/semesters
- `AcademicCalendar` - Calendar events
- `Section` - Course sections
- `Requirement` - Requirements
- `Designition` - Role designations
- `User` - User management
- `AdmissionApplication` - Admission applications
- `AdmissionApplicationLog` - Application status logs
- `AdmissionApplicationScore` - Application evaluation scores
- `AdmissionSchedule` - Admission schedules
- `Enrollment` - Student enrollments
- `EnrollmentLog` - Enrollment status logs
- `DocumentRequest` - Document requests
- `DocumentRequestLog` - Document request status logs
- `DocumentType` - Document type definitions
- `GradeBook` - Gradebook management
- `GradeBookItem` - Grade items
- `GradeBookItemDetail` - Grade item details

#### Query Parameters

All list endpoints support:

- **Pagination**: `?page=1&rows=10`
- **Filtering**: `?filter[field]=value`
- **Sorting**: `?sort=field` or `?sort=-field` (descending)
- **Includes**: `?include=relation1,relation2` (eager loading)

**Example**:

```
GET /api/Campus?page=1&rows=20&sort=-created_at&include=buildings,colleges
```

#### Special Endpoints

Some resources have additional specialized endpoints:

- **Section Generation**: `POST /api/Section/generate` - Bulk generate sections
- **Section by Code**: `DELETE /api/Section/code/{section_code}` - Delete by section code
- **Curriculum Multiple**: `POST /api/CurriculumDetail/multiple` - Create multiple curriculum details
- **Admission Score Batch**: `POST /api/AdmissionApplicationScore/createOrUpdateMultiple` - Batch create/update scores
- **Enrollment Filters**:
  - `GET /api/Enrollment/campus/scholastic-filter/{campus_id}` - Filter by campus
  - `GET /api/Enrollment/academic-program/scholastic-filter/{academic_program_id}` - Filter by program
  - `GET /api/Enrollment/campus/grouped-by-user-name/{campus_id}` - Grouped by user (campus)
  - `GET /api/Enrollment/academic-program/grouped-by-user-name/{academic_program_id}` - Grouped by user (program)
- **Enrollment Actions**: `POST /api/Enrollment/enroll` - Process enrollment
- **Designition Role Creation**:
  - `POST /api/Designition/create-program-chair` - Assign Program Chair role
  - `POST /api/Designition/create-college-dean` - Assign College Dean role
  - `POST /api/Designition/create-campus-registrar` - Assign Campus Registrar role

### Frontend Pages

The application provides different interfaces based on user roles:

#### Admin Dashboard

- **Dashboard**: `/admin/dashboard`
- **Campus Management**: `/admin/campuses`
- **Campus Detail**: `/admin/campuses/:campusId`
- **Building Rooms**: `/admin/campuses/:campusId/buildings/:buildingId/rooms`
- **College Programs**: `/admin/campuses/:campusId/colleges/:collegeId/programs`
- **Curriculum**: `/admin/campuses/:campusId/colleges/:collegeId/programs/:programId/curriculum/:curriculumId`
- **Program Management**: `/admin/program-type`
- **Course Management**: `/admin/courses`
- **Course Requisites**: `/admin/courses/:courseId`
- **Section Management**: `/admin/sections`
- **Academic Term**: `/admin/academic-term`
- **School Year**: `/admin/school-year`
- **Academic Calendar**: `/admin/school-year/:schoolYearId`
- **Requirements**: `/admin/requirements`
- **Users**: `/admin/users`

#### Program Chair

- **Curriculum Management**: `/program-chair/curriculum`
- **Curriculum Detail**: `/program-chair/curriculum/:curriculumId`
- **Curriculum Students**: `/program-chair/curriculum/:curriculumId/student`
- **Admission Evaluation**: `/program-chair/admission/evaluation`
- **Admission Applications**: `/program-chair/admission/application`
- **Application Status**: `/program-chair/admission/application/:admissionApplicationId`
- **Program Criteria**: `/program-chair/program-criteria`
- **Program Requirements**: `/program-chair/program-requirement`
- **Enrollment Management**: `/program-chair/enrollment`
- **Gradebook**: `/program-chair/gradebook`
- **Gradebook Detail**: `/program-chair/gradebook/:gradebookId`
- **Community Students**: `/program-chair/community/students`
- **Community Faculties**: `/program-chair/community/faculties`

#### Campus Registrar

- **Document Requests**: `/campus-registrar/document-request`
- **Document Request Detail**: `/campus-registrar/request/:documentRequestId`
- **Enrollment Management**: `/campus-registrar/enrollment`
- **Students**: `/campus-registrar/student`

#### Guest (Public)

- **Admission Application**: `/guest/admission`
- **My Applications**: `/guest/admission-applications`
- **Application Status**: `/guest/admission-applications/:id`
- **Enrollment**: `/guest/enrollment`
- **Accepted Applications**: `/guest/enrollment/accepted`
- **Document Requests**: `/guest/request`

#### Student

- **Enrollment**: `/student`
- **Evaluation**: `/student/evaluation`
- **Gradebook**: `/student/gradebook`
- **Document Requests**: `/student/request`

## 🔧 Development

### Backend Development

#### Running Tests

```bash
cd api
php artisan test
```

#### Code Style

```bash
# Run Laravel Pint for code formatting
./vendor/bin/pint
```

#### Adding a New Entity

See the detailed guide in `/api/app/README.md` for step-by-step instructions on adding new entities to the system.

This guide covers:

- Creating models with relationships
- Implementing repository and service layers
- Adding controllers with OpenAPI documentation
- Registering dependencies in the service provider
- Best practices for maintaining the layered architecture

#### Generate API Documentation

To generate the API documentation (OpenAPI specification):

```bash
php artisan swagger:generate
```

### Frontend Development

#### Running Linter

```bash
cd app
npm run lint
```

#### Building for Production

```bash
npm run build
```

#### Preview Production Build

```bash
npm run preview
```

#### Generating API Client

The frontend uses Orval to generate type-safe API clients from the OpenAPI specification:

```bash
# Ensure backend is running and openapi.json is up to date
npm run orval
```

This command reads the OpenAPI specification from the backend and generates TypeScript types and API client functions in the `rest/` directory.

### Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f [service_name]

# Restart a service
docker-compose restart [service_name]

# Rebuild containers
docker-compose up -d --build

# Access container shell
docker-compose exec [service_name] bash

# Service names: frontend, backend, mysql, phpmyadmin
```

## 📚 API Documentation

The API is fully documented using OpenAPI 3.0 specification.

### Accessing Documentation

1. **OpenAPI JSON**: Available at `http://localhost:8000/openapi.json`

2. **Import to Swagger UI**:

   - Visit https://editor.swagger.io/
   - Import the OpenAPI JSON file

3. **Postman**:

   - Import the OpenAPI JSON file into Postman for interactive API testing

4. **Insomnia**:
   - Import the OpenAPI JSON file into Insomnia

### Generating API Documentation

To generate the API documentation, use:

```bash
cd api
php artisan swagger:generate
```

This command scans all controllers and models for OpenAPI attributes and generates the specification. Run this after making changes to controllers or models.

## 🧪 Testing

### Backend Tests

```bash
cd api

# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/CampusTest.php

# Run with coverage
php artisan test --coverage
```

### Frontend Tests

```bash
cd app

# Run tests (when configured)
npm test
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Backend Contributions

1. Follow the established architecture patterns (Repository, Service, Interface)
2. Add comprehensive OpenAPI documentation to all endpoints
3. Write unit and integration tests
4. Follow PSR-12 coding standards
5. Update the API README when adding new patterns

### Frontend Contributions

1. Follow React best practices and hooks conventions
2. Use TypeScript for all new code
3. Follow the established component structure
4. Ensure responsive design works on all screen sizes
5. Add proper type definitions

### Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Review

- All PRs require at least one approval
- Ensure all tests pass
- Follow the code style guidelines
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Philipp Andrew Redondo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👥 Authors

- **Philipp Andrew Redondo** - _Initial work_

## 🙏 Acknowledgments

- Laravel Framework Team
- React Team
- All open-source contributors whose libraries make this project possible

## 📞 Support

For support, please open an issue on the GitHub repository or contact the development team.

## 🗺️ Roadmap

### Upcoming Features

- [ ] Faculty workload management
- [ ] Class scheduling automation
- [ ] Report generation
- [ ] Email notifications
- [ ] Mobile application
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Integration with LMS platforms

### In Progress

- [ ] Self-enrollment system
- [ ] Faculty module enhancements
- [ ] Student module enhancements
- [ ] Bulk approve for campus registrar validation
- [ ] Bulk approve for program chair approval
- [ ] Reject actions for program chair and campus registrar
- [ ] Advanced search and filtering
- [ ] Student evaluation system completion

### Completed

- [x] Core infrastructure management
- [x] Academic program management
- [x] Curriculum management
- [x] Curriculum tagging system
- [x] Course catalog
- [x] Course prerequisites and co-requisites
- [x] Academic program criteria and requirements
- [x] Calendar and scheduling
- [x] Section management and generation
- [x] User authentication and authorization
- [x] Role-based access control implementation
- [x] User designation system (Designition)
- [x] Admission application system
- [x] Admission evaluation and scoring
- [x] Student enrollment management
- [x] Enrollment approval workflow
- [x] Document request system
- [x] Document tracking and status management
- [x] Gradebook system
- [x] Grade items and grading criteria
- [x] OpenAPI documentation
- [x] Docker containerization
- [x] Modern React UI with Tailwind CSS

---

**Last Updated**: November 14, 2025  
**Version**: 1.2.0  
**Status**: Active Development

Made with ❤️ by HolliShake
