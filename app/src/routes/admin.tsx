import { UserRoleEnum } from '@/enums/role-enum';
import AdminAcademicTerm from '@/pages/admin/academic-term/page';
import AdminBuilding from '@/pages/admin/campuses/building/page';
import AdminCampusDetail from '@/pages/admin/campuses/campus/page';
import AdminCollege from '@/pages/admin/campuses/college/page';
import AdminCurriculum from '@/pages/admin/campuses/curriculum/page';
import AdminCampus from '@/pages/admin/campuses/page';
import AdminCourses from '@/pages/admin/courses/page';
import AdminDashboard from '@/pages/admin/dashboard';
import AdminProgramTypes from '@/pages/admin/program-type/page';
import AdminRequirements from '@/pages/admin/requirements/page';
import AdminAcademicCalendarPage from '@/pages/admin/school-year/academic-calendar/page';
import AdminSchoolYear from '@/pages/admin/school-year/page';
import AdminSections from '@/pages/admin/sections/page';
import type { Route } from '@/types/types';
import {
  BookIcon,
  BookOpenIcon,
  BuildingIcon,
  CalendarIcon,
  ClockIcon,
  FileIcon,
  FolderIcon,
  GraduationCapIcon,
  LayoutDashboardIcon,
  LibraryIcon,
  SchoolIcon,
} from 'lucide-react';

const ADMIN: Route[] = [
  {
    key: 'admin.label',
    title: 'Admin',
    path: '#',
    layout: 'default',
    type: 'label',
    roles: [UserRoleEnum.ADMIN],
  },
  {
    key: 'admin.dashboard',
    title: 'Dashboard',
    path: '/admin/dashboard',
    component: <AdminDashboard />,
    icon: <LayoutDashboardIcon className="h-4 w-4" />,
    layout: 'dashboard',
    roles: [UserRoleEnum.ADMIN],
  },
  {
    key: 'admin.school-year',
    title: 'School Year',
    path: '/admin/school-year',
    component: <AdminSchoolYear />,
    icon: <CalendarIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.ADMIN],
  },
  {
    key: 'admin.academic-calendar',
    title: 'Academic Calendar',
    path: '/admin/school-year/:schoolYearId',
    component: <AdminAcademicCalendarPage />,
    icon: <BookOpenIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
    roles: [UserRoleEnum.ADMIN],
  },
  {
    key: 'admin.academic-term',
    title: 'Academic Term',
    path: '/admin/academic-term',
    component: <AdminAcademicTerm />,
    icon: <ClockIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.ADMIN],
  },
  {
    key: 'admin.campuses',
    title: 'Campuses',
    path: '/admin/campuses',
    component: <AdminCampus />,
    icon: <SchoolIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.ADMIN],
  },
  // Campus/:id
  {
    key: 'admin.campus',
    title: 'Campus',
    path: '/admin/campuses/:campusId',
    component: <AdminCampusDetail />,
    icon: <SchoolIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
    roles: [UserRoleEnum.ADMIN],
  },
  // Building/:id/rooms
  {
    key: 'admin.building',
    title: 'Building',
    path: '/admin/campuses/:campusId/buildings/:buildingId/rooms',
    component: <AdminBuilding />,
    icon: <BuildingIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
    roles: [UserRoleEnum.ADMIN],
  },
  // College/:id/programs
  {
    key: 'admin.college',
    title: 'College',
    path: '/admin/campuses/:campusId/colleges/:collegeId/programs',
    component: <AdminCollege />,
    icon: <GraduationCapIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
    roles: [UserRoleEnum.ADMIN],
  },
  // Curriculum/:id
  {
    key: 'admin.curriculum',
    title: 'Curriculum',
    path: '/admin/campuses/:campusId/colleges/:collegeId/programs/:programId/curriculum/:curriculumId',
    component: <AdminCurriculum />,
    icon: <LibraryIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
    roles: [UserRoleEnum.ADMIN],
  },
  {
    key: 'admin.program-type',
    title: 'Program Type',
    path: '/admin/program-type',
    component: <AdminProgramTypes />,
    icon: <GraduationCapIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.ADMIN],
  },
  // Courses
  {
    key: 'admin.course',
    title: 'Course',
    path: '/admin/courses',
    component: <AdminCourses />,
    icon: <BookIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.ADMIN],
  },
  // Sections
  {
    key: 'admin.section',
    title: 'Section',
    path: '/admin/sections',
    component: <AdminSections />,
    icon: <FolderIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.ADMIN],
  },
  // Requirements
  {
    key: 'admin.requirement',
    title: 'Requirement',
    path: '/admin/requirements',
    component: <AdminRequirements />,
    icon: <FileIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.ADMIN],
  },
];

export default ADMIN;
