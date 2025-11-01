import { UserRoleEnum } from '@/enums/role-enum';
import CampusRegistrarEnrollment from '@/pages/campus-registrar/enrollment/page';
import type { Route } from '@/types/route';
import { ClipboardListIcon } from 'lucide-react';

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
];

export default CAMPUS_REGISTRAR;
