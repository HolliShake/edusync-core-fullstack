import { UserRoleEnum } from '@/enums/role-enum';
import GuestAdmissionPage from '@/pages/guest/admission/page';
import type { Route } from '@/types/route';
import { BookOpenIcon } from 'lucide-react';

const GUEST: Route[] = [
  {
    key: 'guest.label',
    title: 'Guest',
    path: '#',
    layout: 'default',
    type: 'label',
    roles: [UserRoleEnum.GUEST],
  },
  {
    key: 'guest.admission',
    title: 'Admission',
    path: '/guest/admission',
    children: [
      {
        key: 'guest.admission.process',
        title: 'Process',
        path: '/guest/admission/process',
        component: <GuestAdmissionPage />,
        icon: <BookOpenIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.GUEST],
      },
      {
        key: 'guest.admission.applications',
        title: 'Application',
        path: '/guest/admission/application',
        component: <GuestAdmissionPage />,
        icon: <BookOpenIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.GUEST],
      },
    ],
    icon: <BookOpenIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.GUEST],
  },
];

export default GUEST;
