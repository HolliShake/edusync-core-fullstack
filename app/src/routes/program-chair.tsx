import { UserRoleEnum } from '@/enums/role-enum';
import ProgramChairAdmissionApplication from '@/pages/program-chair/admission/application/page';
import ProgramChairAdmissionApplicationStatus from '@/pages/program-chair/admission/application/status/page';
import ProgramChairAdmissionEvaluation from '@/pages/program-chair/admission/evaluation/page';
import ProgramChairAdmissionSchedule from '@/pages/program-chair/admission/schedule/page';
import ProgramChairCurriculumDetail from '@/pages/program-chair/curriculum/curriculum-detail/page';
import ProgramChairCurriculum from '@/pages/program-chair/curriculum/page';
import ProgramChairCurriculumStudent from '@/pages/program-chair/curriculum/student/page';
import ProgramChairEnrollment from '@/pages/program-chair/enrollment/page';
import ProgramChairCommunityFaculty from '@/pages/program-chair/faculty/page';
import GradebookDetailPage from '@/pages/program-chair/gradebook/[id]/page';
import ProgramChairGradebookPage from '@/pages/program-chair/gradebook/page';
import ProgramCriteria from '@/pages/program-chair/program-criteria/page';
import ProgramRequirement from '@/pages/program-chair/program-requirement/page';
import ProgramChairCommunityStudent from '@/pages/program-chair/student/page';
import type { Route } from '@/types/route';
import {
  BarChartIcon,
  BookOpenIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  FileTextIcon,
  GraduationCapIcon,
  Users2Icon,
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
        key: 'program-chair.admission.schedule',
        title: 'Schedule',
        path: '/program-chair/admission/schedule',
        component: <ProgramChairAdmissionSchedule />,
        icon: <CalendarIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.PROGRAM_CHAIR],
      },
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
    key: 'program-chair.enrollment',
    title: 'Enrollment',
    path: '/program-chair/enrollment',
    component: <ProgramChairEnrollment />,
    icon: <ClipboardListIcon className="h-4 w-4" />,
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
  // curriculum detail
  {
    key: 'program-chair.curriculum-detail',
    title: 'Curriculum Detail',
    path: '/program-chair/curriculum/:curriculumId',
    component: <ProgramChairCurriculumDetail />,
    icon: <BookOpenIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
  },
  // curriculum student
  {
    key: 'program-chair.curriculum-student',
    title: 'Curriculum Student',
    path: '/program-chair/curriculum/:curriculumId/student',
    component: <ProgramChairCurriculumStudent />,
    icon: <GraduationCapIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
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
  {
    key: 'program-chair.gradebook',
    title: 'Gradebook',
    path: '/program-chair/gradebook',
    component: <ProgramChairGradebookPage />,
    icon: <ClipboardListIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.PROGRAM_CHAIR],
  },
  {
    key: 'program-chair.gradebook-detail',
    title: 'Gradebook Detail',
    path: '/program-chair/gradebook/:gradebookId',
    component: <GradebookDetailPage />,
    icon: <ClipboardListIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
    roles: [UserRoleEnum.PROGRAM_CHAIR],
  },
  {
    key: 'program-chair.community',
    title: 'Community',
    path: '/program-chair/community',
    icon: <Users2Icon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    children: [
      {
        key: 'program-chair.community.student',
        title: 'Students',
        path: '/program-chair/community/students',
        component: <ProgramChairCommunityStudent />,
        icon: <GraduationCapIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.PROGRAM_CHAIR],
      },
      {
        key: 'program-chair.community.faculty',
        title: 'Faculties',
        path: '/program-chair/community/faculties',
        component: <ProgramChairCommunityFaculty />,
        icon: <Users2Icon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.PROGRAM_CHAIR],
      },
    ],
    roles: [UserRoleEnum.PROGRAM_CHAIR],
  },
];

export default PROGRAM_CHAIR;
