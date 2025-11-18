import { UserRoleEnum } from '@/enums/role-enum';
import CampusRegistrarEnrollment from '@/pages/campus-registrar/enrollment/page';
import CampusRegistrarCommunityFaculty from '@/pages/campus-registrar/faculty/page';
import CampusRegistrarRequest from '@/pages/campus-registrar/request/page';
import CampusRegistrarCommunityStudent from '@/pages/campus-registrar/student/page';
import type { Route } from '@/types/route';
import { ClipboardListIcon, FileTextIcon, GraduationCapIcon, Users2Icon } from 'lucide-react';

const CAMPUS_REGISTRAR: Route[] = [
  {
    key: 'campus-registrar.label',
    title: 'Campus Registrar',
    path: '#',
    layout: 'default',
    type: 'label',
    roles: [UserRoleEnum.CAMPUS_REGISTRAR],
  },
  {
    key: 'campus-registrar.enrollment',
    title: 'Enrollment',
    path: '/campus-registrar/enrollment',
    component: <CampusRegistrarEnrollment />,
    icon: <ClipboardListIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.CAMPUS_REGISTRAR],
  },
  {
    key: 'campus-registrar.request',
    title: 'Request',
    path: '/campus-registrar/request',
    component: <CampusRegistrarRequest />,
    icon: <FileTextIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.CAMPUS_REGISTRAR],
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
        title: 'Students',
        path: '/campus-registrar/community/students',
        component: <CampusRegistrarCommunityStudent />,
        icon: <GraduationCapIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.CAMPUS_REGISTRAR],
      },
      {
        key: 'campus-registrar.community.faculty',
        title: 'Faculties',
        path: '/campus-registrar/community/faculties',
        component: <CampusRegistrarCommunityFaculty />,
        icon: <Users2Icon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.CAMPUS_REGISTRAR],
      },
    ],
    roles: [UserRoleEnum.CAMPUS_REGISTRAR],
  },
];

export default CAMPUS_REGISTRAR;
