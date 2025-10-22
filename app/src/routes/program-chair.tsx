import { UserRoleEnum } from '@/enums/role-enum';
import ProgramChairAdmissionApplication from '@/pages/program-chair/admission/application/page';
import ProgramChairAdmissionApplicationStatus from '@/pages/program-chair/admission/application/status/page';
import ProgramChairAdmissionEvaluation from '@/pages/program-chair/admission/evaluation/page';
import ProgramChairCurriculum from '@/pages/program-chair/curriculum/page';
import ProgramCriteria from '@/pages/program-chair/program-criteria/page';
import ProgramRequirement from '@/pages/program-chair/program-requirement/page';
import type { Route } from '@/types/route';
import {
  BarChartIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  FileTextIcon,
  GraduationCapIcon,
} from 'lucide-react';

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
    key: 'program-chair.admission',
    title: 'Admission',
    path: '/program-chair/admission',
    icon: <GraduationCapIcon className="h-4 w-4" />,
    children: [
      {
        key: 'program-chair.admission.application',
        title: 'Application',
        path: '/program-chair/admission/application',
        component: <ProgramChairAdmissionApplication />,
        icon: <FileTextIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.PROGRAM_CHAIR],
      },
      {
        key: 'program-chair.admission.application.status',
        title: 'Status',
        path: '/program-chair/admission/application/:admissionApplicationId',
        component: <ProgramChairAdmissionApplicationStatus />,
        icon: <FileTextIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: false,
        roles: [UserRoleEnum.PROGRAM_CHAIR],
      },
      {
        key: 'program-chair.admission.evaluation',
        title: 'Evaluation',
        path: '/program-chair/admission/evaluation',
        component: <ProgramChairAdmissionEvaluation />,
        icon: <CheckCircleIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.PROGRAM_CHAIR],
      },
    ],
    layout: 'dashboard',
    sidebar: true,
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
    component: <ProgramRequirement />,
    icon: <ClipboardListIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.PROGRAM_CHAIR],
  },
  {
    key: 'program-chair.program-criteria',
    title: 'Program Criteria',
    path: '/program-chair/program-criteria',
    component: <ProgramCriteria />,
    icon: <BarChartIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.PROGRAM_CHAIR],
  },
];

export default PROGRAM_CHAIR;
