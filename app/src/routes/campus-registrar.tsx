import CampusRegistrarEnrollment from '@/pages/campus-registrar/enrollment/page';
import CampusRegistrarCommunityFaculty from '@/pages/campus-registrar/faculty/page';
import CampusRegistrarRequest from '@/pages/campus-registrar/request/page';
import CampusRegistrarScheduleDetail from '@/pages/campus-registrar/schedule/[id]/page';
import CampusRegistrarSchedule from '@/pages/campus-registrar/schedule/page';
import CampusRegistrarCommunityStudent from '@/pages/campus-registrar/student/page';
import type { Route } from '@/types/route';
import { UserRoleEnum } from '@rest/models';
import {
  CalendarIcon,
  ClipboardListIcon,
  FileTextIcon,
  GraduationCapIcon,
  Users2Icon,
} from 'lucide-react';

const CAMPUS_REGISTRAR: Route[] = [
  {
    key: 'campus-registrar.label',
    title: 'Campus Registrar',
    path: '#',
    layout: 'default',
    type: 'label',
    roles: [UserRoleEnum.campus_registrar],
  },
  {
    key: 'campus-registrar.enrollment',
    title: 'Enrollment',
    path: '/campus-registrar/enrollment',
    component: <CampusRegistrarEnrollment />,
    icon: <ClipboardListIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.campus_registrar],
  },
  {
    key: 'campus-registrar.request',
    title: 'Request',
    path: '/campus-registrar/request',
    component: <CampusRegistrarRequest />,
    icon: <FileTextIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.campus_registrar],
  },
  {
    key: 'campus-registrar.community',
    title: 'Community',
    path: '/campus-registrar/community',
    icon: <Users2Icon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    children: [
      {
        key: 'campus-registrar.community.student',
        title: 'Student',
        path: '/campus-registrar/community/student',
        component: <CampusRegistrarCommunityStudent />,
        icon: <GraduationCapIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.campus_registrar],
      },
      {
        key: 'campus-registrar.community.faculty',
        title: 'Faculty',
        path: '/campus-registrar/community/faculty',
        component: <CampusRegistrarCommunityFaculty />,
        icon: <Users2Icon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.campus_registrar],
      },
    ],
    roles: [UserRoleEnum.campus_registrar],
  },
  {
    key: 'campus-registrar.schedule',
    title: 'Schedule',
    path: '/campus-registrar/schedule',
    component: <CampusRegistrarSchedule />,
    icon: <CalendarIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.campus_registrar],
  },
  {
    key: 'campus-registrar.schedule.detail',
    title: 'Schedule Detail',
    path: '/campus-registrar/schedule/:scheduleId',
    component: <CampusRegistrarScheduleDetail />,
    icon: <CalendarIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
    roles: [UserRoleEnum.campus_registrar],
  },
];

export default CAMPUS_REGISTRAR;
