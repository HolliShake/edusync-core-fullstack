import { UserRoleEnum } from '@/enums/role-enum';
import ProgramChairCurriculum from '@/pages/program-chair/curriculum/page';
import ProgramRequirementPage from '@/pages/program-chair/program-requirement/page';
import type { Route } from '@/types/route';
import { BookOpenIcon } from 'lucide-react';

const PROGRAM_CHAIR: Route[] = [
  {
    key: 'program-chair.label',
    title: 'Program Chair',
    path: '#',
    layout: 'default',
    type: 'label',
    roles: [UserRoleEnum.PROGRAM_CHAIR],
  },
  {
    key: 'program-chair.curriculum',
    title: 'Curriculum',
    path: '/program-chair/curriculum',
    component: <ProgramChairCurriculum />,
    icon: <BookOpenIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.PROGRAM_CHAIR],
  },
  {
    key: 'program-chair.program-requirement',
    title: 'Program Requirement',
    path: '/program-chair/program-requirement',
    component: <ProgramRequirementPage />,
    icon: <BookOpenIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.PROGRAM_CHAIR],
  },
];

export default PROGRAM_CHAIR;
