import { UserRoleEnum } from '@/enums/role-enum';
import GuestAdmissionApplications from '@/pages/guest/admission-applications/page';
import GuestAdmissionApplicationStatus from '@/pages/guest/admission-applications/status/page';
import GuestAdmissionPage from '@/pages/guest/admission/page';
import type { Route } from '@/types/route';
import { BookOpenIcon, FileTextIcon, MapPinnedIcon } from 'lucide-react';

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
        title: 'Journey',
        path: '/guest/admission/process',
        component: <GuestAdmissionPage />,
        icon: <MapPinnedIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.GUEST],
      },
      {
        key: 'guest.admission.applications',
        title: 'Applications',
        path: '/guest/admission/applications',
        component: <GuestAdmissionApplications />,
        icon: <FileTextIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.GUEST],
      },
      {
        key: 'guest.admission.applications.status',
        title: 'Status',
        path: '/guest/admission/applications/:admissionApplicationId',
        component: <GuestAdmissionApplicationStatus />,
        icon: <FileTextIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: false,
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
