import AdminAcademicTerm from '@/pages/admin/academic-term/page';
import AdminBuilding from '@/pages/admin/campuses/building/page';
import AdminCampusDetail from '@/pages/admin/campuses/campus/page';
import AdminCollege from '@/pages/admin/campuses/college/page';
import AdminCurriculum from '@/pages/admin/campuses/curriculum/page';
import AdminCampus from '@/pages/admin/campuses/page';
import AdminCourses from '@/pages/admin/courses/page';
import AdminCourseRequisites from '@/pages/admin/courses/requisite/page';
import AdminDashboard from '@/pages/admin/dashboard';
import AdminProgramTypes from '@/pages/admin/program-type/page';
import AdminRequirements from '@/pages/admin/requirements/page';
import AdminAcademicCalendarPage from '@/pages/admin/school-year/academic-calendar/page';
import AdminSchoolYear from '@/pages/admin/school-year/page';
import AdminSections from '@/pages/admin/sections/page';
import AdminUsers from '@/pages/admin/users/page';
import type { Route } from '@/types/route';
import { UserRoleEnum } from '@rest/models';
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
  UserIcon,
} from 'lucide-react';

const ADMIN: Route[] = [
  {
    key: 'admin.label',
    title: 'Admin',
    path: '#',
    layout: 'default',
    type: 'label',
    roles: [UserRoleEnum.admin],
  },
  {
    key: 'admin.dashboard',
    title: 'Dashboard',
    path: '/admin/dashboard',
    component: <AdminDashboard />,
    icon: <LayoutDashboardIcon className="h-4 w-4" />,
    layout: 'dashboard',
    roles: [UserRoleEnum.admin],
  },
  {
    key: 'admin.school-year',
    title: 'School Year',
    path: '/admin/school-year',
    component: <AdminSchoolYear />,
    icon: <CalendarIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.admin],
  },
  {
    key: 'admin.academic-calendar',
    title: 'Academic Calendar',
    path: '/admin/school-year/:schoolYearId',
    component: <AdminAcademicCalendarPage />,
    icon: <BookOpenIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
    roles: [UserRoleEnum.admin],
  },
  {
    key: 'admin.academic-term',
    title: 'Academic Term',
    path: '/admin/academic-term',
    component: <AdminAcademicTerm />,
    icon: <ClockIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.admin],
  },
  {
    key: 'admin.campus',
    title: 'Campus',
    path: '/admin/campus',
    component: <AdminCampus />,
    icon: <SchoolIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.admin],
  },
  // Campus/:id
  {
    key: 'admin.campus-detail',
    title: 'Campus Detail',
    path: '/admin/campus/:campusId',
    component: <AdminCampusDetail />,
    icon: <SchoolIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
    roles: [UserRoleEnum.admin],
  },
  // Building/:id/rooms
  {
    key: 'admin.building',
    title: 'Building',
    path: '/admin/campus/:campusId/building/:buildingId/room',
    component: <AdminBuilding />,
    icon: <BuildingIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
    roles: [UserRoleEnum.admin],
  },
  // College/:id/programs
  {
    key: 'admin.college',
    title: 'College',
    path: '/admin/campus/:campusId/college/:collegeId/program',
    component: <AdminCollege />,
    icon: <GraduationCapIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
    roles: [UserRoleEnum.admin],
  },
  // Curriculum/:id
  {
    key: 'admin.curriculum',
    title: 'Curriculum',
    path: '/admin/campus/:campusId/college/:collegeId/program/:programId/curriculum/:curriculumId',
    component: <AdminCurriculum />,
    icon: <LibraryIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
    roles: [UserRoleEnum.admin],
  },
  {
    key: 'admin.program-type',
    title: 'Program Type',
    path: '/admin/program-type',
    component: <AdminProgramTypes />,
    icon: <GraduationCapIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.admin],
  },
  // Courses
  {
    key: 'admin.course',
    title: 'Course',
    path: '/admin/course',
    component: <AdminCourses />,
    icon: <BookIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.admin],
  },
  // Courses/:id/requisites
  {
    key: 'admin.course-requisite',
    title: 'Course Requisite',
    path: '/admin/course/:courseId',
    component: <AdminCourseRequisites />,
    icon: <BookIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
    roles: [UserRoleEnum.admin],
  },
  // Sections
  {
    key: 'admin.section',
    title: 'Section',
    path: '/admin/section',
    component: <AdminSections />,
    icon: <FolderIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.admin],
  },
  // Requirements
  {
    key: 'admin.requirement',
    title: 'Requirement',
    path: '/admin/requirement',
    component: <AdminRequirements />,
    icon: <FileIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.admin],
  },
  {
    key: 'admin.user',
    title: 'User',
    path: '/admin/user',
    component: <AdminUsers />,
    icon: <UserIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.admin],
  },
];

export default ADMIN;
