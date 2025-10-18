import AdminAcademicTerm from '@/pages/admin/academic-term/page';
import AdminBuilding from '@/pages/admin/campuses/building/page';
import AdminCampusDetail from '@/pages/admin/campuses/campus/page';
import AdminCollege from '@/pages/admin/campuses/college/page';
import AdminCurriculum from '@/pages/admin/campuses/curriculum/page';
import AdminCampus from '@/pages/admin/campuses/page';
import AdminCourses from '@/pages/admin/courses/page';
import AdminDashboard from '@/pages/admin/dashboard';
import AdminProgramTypes from '@/pages/admin/program-type/page';
import AdminAcademicCalendarPage from '@/pages/admin/school-year/academic-calendar/page';
import AdminSchoolYear from '@/pages/admin/school-year/page';
import type { Route } from '@/types/types';
import {
  BookIcon,
  BuildingIcon,
  CalendarIcon,
  ClockIcon,
  GraduationCapIcon,
  LayoutDashboardIcon,
  SchoolIcon,
} from 'lucide-react';

const ADMIN: Route[] = [
  {
    key: 'admin.dashboard',
    title: 'Dashboard',
    path: '/admin/dashboard',
    component: <AdminDashboard />,
    icon: <LayoutDashboardIcon className="h-4 w-4" />,
    layout: 'dashboard',
  },
  {
    key: 'admin.school-year',
    title: 'School Year',
    path: '/admin/school-year',
    component: <AdminSchoolYear />,
    icon: <CalendarIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
  },
  {
    key: 'admin.academic-calendar',
    title: 'Academic Calendar',
    path: '/admin/school-year/:schoolYearId',
    component: <AdminAcademicCalendarPage />,
    icon: <BookIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
  },
  {
    key: 'admin.academic-term',
    title: 'Academic Term',
    path: '/admin/academic-term',
    component: <AdminAcademicTerm />,
    icon: <ClockIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
  },
  {
    key: 'admin.campuses',
    title: 'Campuses',
    path: '/admin/campuses',
    component: <AdminCampus />,
    icon: <SchoolIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
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
  },
  // Curriculum/:id
  {
    key: 'admin.curriculum',
    title: 'Curriculum',
    path: '/admin/campuses/:campusId/colleges/:collegeId/programs/:programId/curriculum/:curriculumId',
    component: <AdminCurriculum />,
    icon: <BookIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
  },
  {
    key: 'admin.program-type',
    title: 'Program Type',
    path: '/admin/program-type',
    component: <AdminProgramTypes />,
    icon: <GraduationCapIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
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
  },
];

export default ADMIN;
