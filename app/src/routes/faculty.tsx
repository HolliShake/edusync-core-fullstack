import FacultyScheduleDetail from '@/pages/faculty/schedule/[id]/page';
import FacultySchedule from '@/pages/faculty/schedule/page';
import type { Route } from '@/types/route';
import { UserRoleEnum } from '@rest/models';
import { ClipboardListIcon } from 'lucide-react';

const FACULTY: Route[] = [
  {
    key: 'faculty.label',
    title: 'Faculty',
    path: '#',
    layout: 'default',
    type: 'label',
    roles: [UserRoleEnum.faculty],
  },
  {
    key: 'faculty.schedule',
    title: 'Schedule',
    path: '/faculty/enrollment',
    component: <FacultySchedule />,
    icon: <ClipboardListIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.faculty],
  },
  {
    key: 'faculty.schedule.detail',
    title: 'Schedule Detail',
    path: '/faculty/schedule/:id',
    component: <FacultyScheduleDetail />,
    icon: <ClipboardListIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
    roles: [UserRoleEnum.faculty],
  },
];

export default FACULTY;
