import AdminBuilding from '@/pages/admin/campuses/building/page';
import AdminCampusDetail from '@/pages/admin/campuses/campus/page';
import AdminCollege from '@/pages/admin/campuses/college/page';
import AdminCampus from '@/pages/admin/campuses/page';
import AdminCourses from '@/pages/admin/courses/page';
import AdminDashboard from '@/pages/admin/dashboard';
import AdminProgramTypes from '@/pages/admin/program-types/page';
import AdminAcademicCalendarPage from '@/pages/admin/school-year/academic-calendar/page';
import AdminSchoolYear from '@/pages/admin/school-year/page';
import type { Route } from '@/types/types';
import {
  BookIcon,
  BuildingIcon,
  CalendarIcon,
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
    icon: <BookIcon className="h-4 w-4" />, // replaced CalendarIcon with BookIcon for more relevance
    layout: 'dashboard',
    sidebar: false,
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
  // Building/:id
  {
    key: 'admin.building',
    title: 'Building',
    path: '/admin/campuses/:campusId/buildings/:buildingId',
    component: <AdminBuilding />,
    icon: <BuildingIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
  },
  // College/:id
  {
    key: 'admin.college',
    title: 'College',
    path: '/admin/campuses/:campusId/colleges/:collegeId',
    component: <AdminCollege />,
    icon: <GraduationCapIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
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
  {
    key: 'admin.program-type',
    title: 'Program Type',
    path: '/admin/program-type',
    component: <AdminProgramTypes />,
    icon: <GraduationCapIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
  },
];

export default ADMIN;
