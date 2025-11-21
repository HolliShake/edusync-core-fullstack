import GuestAdmissionApplications from '@/pages/guest/admission-applications/page';
import GuestAdmissionApplicationStatus from '@/pages/guest/admission-applications/status/page';
import GuestAdmissionPage from '@/pages/guest/admission/page';
import GuestEnrollment from '@/pages/guest/enrollment/accepted/application/page';
import GuestAcceptedAdmission from '@/pages/guest/enrollment/accepted/page';
import { default as GuestEnrollmentApplications } from '@/pages/guest/enrollment/applications/page';
import GuestRequestDocument from '@/pages/guest/request/page';
import type { Route } from '@/types/route';
import { UserRoleEnum } from '@rest/models';
import {
  BookOpenIcon,
  ClipboardListIcon,
  FileTextIcon,
  GraduationCapIcon,
  ListIcon,
  MapPinnedIcon,
  ScrollIcon,
} from 'lucide-react';

const GUEST: Route[] = [
  {
    key: 'guest.label',
    title: 'Guest',
    path: '#',
    layout: 'default',
    type: 'label',
    roles: [UserRoleEnum.guest],
  },
  {
    key: 'guest.admission',
    title: 'Admission',
    path: '/guest/admission',
    children: [
      {
        key: 'guest.admission.journey',
        title: 'Journey',
        path: '/guest/admission/process',
        component: <GuestAdmissionPage />,
        icon: <MapPinnedIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.guest],
      },
      {
        key: 'guest.admission.applications',
        title: 'Applications',
        path: '/guest/admission/applications',
        component: <GuestAdmissionApplications />,
        icon: <FileTextIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.guest],
      },
      {
        key: 'guest.admission.application.status',
        title: 'Application Status',
        path: '/guest/admission/applications/:admissionApplicationId',
        component: <GuestAdmissionApplicationStatus />,
        icon: <FileTextIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: false,
        roles: [UserRoleEnum.guest],
      },
    ],
    icon: <BookOpenIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.guest],
  },
  {
    key: 'guest.enrollment',
    title: 'Enrollment',
    path: '/guest/enrollment',
    children: [
      {
        key: 'guest.enrollment.accepted',
        title: 'Active Enrollment',
        path: '/guest/enrollment/accepted',
        component: <GuestAcceptedAdmission />,
        icon: <ClipboardListIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.guest],
      },
      {
        key: 'guest.enrollment.accepted.application',
        title: 'Enrollment Application',
        path: '/guest/enrollment/accepted/:applicationId',
        component: <GuestEnrollment />,
        icon: <ScrollIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: false,
        roles: [UserRoleEnum.guest],
      },
      {
        key: 'guest.enrollment.list',
        title: 'Enrollment List',
        path: '/guest/enrollment/list',
        component: <GuestEnrollmentApplications />,
        icon: <ListIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.guest],
      },
    ],
    icon: <GraduationCapIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.guest],
  },
  {
    key: 'guest.settings',
    title: 'Request A Document',
    path: '/guest/settings',
    component: <GuestRequestDocument />,
    icon: <FileTextIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.guest],
  },
];

export default GUEST;
