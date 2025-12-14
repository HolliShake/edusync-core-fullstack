import ProgramChairAdmissionApplication from '@/pages/program-chair/admission/application/page';
import ProgramChairAdmissionApplicationStatus from '@/pages/program-chair/admission/application/status/page';
import ProgramChairAdmissionEvaluation from '@/pages/program-chair/admission/evaluation/page';
import ProgramChairAdmissionInvitationDetail from '@/pages/program-chair/admission/program-admission-invitation/[id]/page';
import ProgramChairAdmissionProgramAdmissionInvitation from '@/pages/program-chair/admission/program-admission-invitation/page';
import ProgramChairCurriculumDetail from '@/pages/program-chair/curriculum/curriculum-detail/page';
import ProgramChairCurriculum from '@/pages/program-chair/curriculum/page';
import ProgramChairCurriculumStudent from '@/pages/program-chair/curriculum/student/page';
import ProgramChairEnrollment from '@/pages/program-chair/enrollment/page';
import ProgramChairCommunityFaculty from '@/pages/program-chair/faculty/page';
import GradebookDetailPage from '@/pages/program-chair/gradebook/[id]/page';
import ProgramChairGradebookPage from '@/pages/program-chair/gradebook/page';
import ProgramChairScheduleDetail from '@/pages/program-chair/schedule/[id]/page';
import ProgramChairSchedule from '@/pages/program-chair/schedule/page';
import ProgramChairCommunityStudent from '@/pages/program-chair/student/page';
import type { Route } from '@/types/route';
import { UserRoleEnum } from '@rest/models';
import {
  BookMarkedIcon,
  BookOpenCheckIcon,
  BookOpenIcon,
  CalendarFoldIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  ClockIcon,
  FileTextIcon,
  GraduationCapIcon,
  UserCheckIcon,
  Users2Icon,
  UsersIcon,
} from 'lucide-react';

const PROGRAM_CHAIR: Route[] = [
  {
    key: 'program-chair.label',
    title: 'Program Chair',
    path: '#',
    layout: 'default',
    type: 'label',
    roles: [UserRoleEnum.program_chair],
  },
  {
    key: 'program-chair.admission',
    title: 'Admission',
    path: '/program-chair/admission',
    icon: <UserCheckIcon className="h-4 w-4" />,
    children: [
      {
        key: 'program-chair.admission.invitation',
        title: 'Invitation',
        path: '/program-chair/admission/invitation',
        component: <ProgramChairAdmissionProgramAdmissionInvitation />,
        icon: <CalendarFoldIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.program_chair],
      },
      {
        key: 'program-chair.admission.invitation.detail',
        title: 'Invitation Detail',
        path: '/program-chair/admission/invitation/:admissionScheduleId',
        component: <ProgramChairAdmissionInvitationDetail />,
        layout: 'dashboard',
        sidebar: false,
        roles: [UserRoleEnum.program_chair],
      },
      {
        key: 'program-chair.admission.application',
        title: 'Application',
        path: '/program-chair/admission/application',
        component: <ProgramChairAdmissionApplication />,
        icon: <FileTextIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.program_chair],
      },
      {
        key: 'program-chair.admission.application.status',
        title: 'Status',
        path: '/program-chair/admission/application/:admissionApplicationId',
        component: <ProgramChairAdmissionApplicationStatus />,
        icon: <FileTextIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: false,
        roles: [UserRoleEnum.program_chair],
      },
      {
        key: 'program-chair.admission.evaluation',
        title: 'Evaluation',
        path: '/program-chair/admission/evaluation',
        component: <ProgramChairAdmissionEvaluation />,
        icon: <CheckCircleIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.program_chair],
      },
    ],
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.program_chair],
  },
  {
    key: 'program-chair.enrollment',
    title: 'Enrollment',
    path: '/program-chair/enrollment',
    component: <ProgramChairEnrollment />,
    icon: <ClipboardListIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.program_chair],
  },
  {
    key: 'program-chair.curriculum',
    title: 'Curriculum',
    path: '/program-chair/curriculum',
    component: <ProgramChairCurriculum />,
    icon: <BookOpenIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.program_chair],
  },
  // curriculum detail
  {
    key: 'program-chair.curriculum-detail',
    title: 'Curriculum Detail',
    path: '/program-chair/curriculum/:curriculumId',
    component: <ProgramChairCurriculumDetail />,
    icon: <BookMarkedIcon className="h-4 w-4" />,
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
    key: 'program-chair.gradebook',
    title: 'Gradebook',
    path: '/program-chair/gradebook',
    component: <ProgramChairGradebookPage />,
    icon: <BookOpenCheckIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.program_chair],
  },
  {
    key: 'program-chair.gradebook-detail',
    title: 'Gradebook Detail',
    path: '/program-chair/gradebook/:gradebookId',
    component: <GradebookDetailPage />,
    icon: <BookOpenCheckIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
    roles: [UserRoleEnum.program_chair],
  },
  {
    key: 'program-chair.community',
    title: 'Community',
    path: '/program-chair/community',
    icon: <UsersIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    children: [
      {
        key: 'program-chair.community.student',
        title: 'Student',
        path: '/program-chair/community/student',
        component: <ProgramChairCommunityStudent />,
        icon: <GraduationCapIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.program_chair],
      },
      {
        key: 'program-chair.community.faculty',
        title: 'Faculty',
        path: '/program-chair/community/faculty',
        component: <ProgramChairCommunityFaculty />,
        icon: <Users2Icon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.program_chair],
      },
    ],
    roles: [UserRoleEnum.program_chair],
  },
  {
    key: 'program-chair.schedule',
    title: 'Schedule',
    path: '/program-chair/schedule',
    component: <ProgramChairSchedule />,
    icon: <ClockIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.program_chair],
  },
  {
    key: 'program-chair.schedule.detail',
    title: 'Schedule Detail',
    path: '/program-chair/schedule/:scheduleId',
    component: <ProgramChairScheduleDetail />,
    icon: <CalendarIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
    roles: [UserRoleEnum.program_chair],
  },
];

export default PROGRAM_CHAIR;
