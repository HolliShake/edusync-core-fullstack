import CampusRegistrarUniversityAdmissionApplication from '@/pages/campus-registrar/admission/application/page';
import CampusRegistrarUniversityAdmissionDetail from '@/pages/campus-registrar/admission/university-admission-invitation/[id]/page';
import CampusRegistrarUniversityAdmissionInvitation from '@/pages/campus-registrar/admission/university-admission-invitation/page';
import CampusRegistrarEnrollment from '@/pages/campus-registrar/enrollment/page';
import CampusRegistrarCommunityFaculty from '@/pages/campus-registrar/faculty/page';
import CampusRegistrarRequest from '@/pages/campus-registrar/request/page';
import CampusRegistrarScheduleDetail from '@/pages/campus-registrar/schedule/[id]/page';
import CampusRegistrarSchedule from '@/pages/campus-registrar/schedule/page';
import CampusRegistrarCommunityStudent from '@/pages/campus-registrar/student/page';
import CampusRegistrarTestingCenter from '@/pages/campus-registrar/testing-center/page';
import type { Route } from '@/types/route';
import { UserRoleEnum } from '@rest/models';
import {
  CalendarFoldIcon,
  CalendarIcon,
  ClipboardListIcon,
  FileTextIcon,
  FlagIcon,
  GraduationCapIcon,
  Users2Icon,
} from 'lucide-react';

const CAMPUS_REGISTRAR: Route[] = [
  {
    key: 'campus-registrar.label',
    title: 'Campus Registrar',
    path: '#',
    layout: 'default',
    type: 'label',
    roles: [UserRoleEnum.campus_registrar],
  },
  {
    /*
     * University Admission Management
     *
     * For campus registrar, university admission is the process of managing admission invitations and schedules.
     * This involves:
     * - Creating and managing university admission invitations for specific school years
     * - Setting open and close dates for admission periods
     * - Managing admission status overrides
     * - Viewing and tracking admission schedules across academic programs
     * - Monitoring intake limits and admission periods
     *
     * The university admission process is tied to specific school years and determines when students
     * can apply for enrollment in academic programs.
     */
    key: 'campus-registrar.university-admission',
    title: 'Admission',
    path: '/campus-registrar/university-admission',
    icon: <FileTextIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.campus_registrar],
    children: [
      {
        key: 'campus-registrar.university-admission.invitation',
        title: 'Invitation',
        path: '/campus-registrar/admission/invitation',
        icon: <CalendarFoldIcon className="h-4 w-4" />,
        component: <CampusRegistrarUniversityAdmissionInvitation />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.campus_registrar],
      },
      {
        key: 'campus-registrar.university-admission.detail',
        title: 'Detail',
        path: '/campus-registrar/admission/invitation/:universityAdmissionId',
        component: <CampusRegistrarUniversityAdmissionDetail />,
        layout: 'dashboard',
        sidebar: false,
        roles: [UserRoleEnum.campus_registrar],
      },
      //
      {
        key: 'campus-registrar.university-admission.application',
        title: 'Application',
        path: '/campus-registrar/admission/application',
        icon: <FileTextIcon className="h-4 w-4" />,
        component: <CampusRegistrarUniversityAdmissionApplication />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.campus_registrar],
      },
    ],
  },
  {
    key: 'campus-registrar.enrollment',
    title: 'Enrollment',
    path: '/campus-registrar/enrollment',
    component: <CampusRegistrarEnrollment />,
    icon: <ClipboardListIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.campus_registrar],
  },
  {
    key: 'campus-registrar.request',
    title: 'Request',
    path: '/campus-registrar/request',
    component: <CampusRegistrarRequest />,
    icon: <FileTextIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.campus_registrar],
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
        title: 'Student',
        path: '/campus-registrar/community/student',
        component: <CampusRegistrarCommunityStudent />,
        icon: <GraduationCapIcon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.campus_registrar],
      },
      {
        key: 'campus-registrar.community.faculty',
        title: 'Faculty',
        path: '/campus-registrar/community/faculty',
        component: <CampusRegistrarCommunityFaculty />,
        icon: <Users2Icon className="h-4 w-4" />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.campus_registrar],
      },
    ],
    roles: [UserRoleEnum.campus_registrar],
  },
  {
    key: 'campus-registrar.schedule',
    title: 'Schedule',
    path: '/campus-registrar/schedule',
    component: <CampusRegistrarSchedule />,
    icon: <CalendarIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.campus_registrar],
  },
  {
    key: 'campus-registrar.schedule.detail',
    title: 'Schedule Detail',
    path: '/campus-registrar/schedule/:scheduleId',
    component: <CampusRegistrarScheduleDetail />,
    icon: <CalendarIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: false,
    roles: [UserRoleEnum.campus_registrar],
  },
  {
    key: 'campus-registrar.testing-center',
    title: 'Testing Center',
    path: '/campus-registrar/testing-center',
    component: <CampusRegistrarTestingCenter />,
    icon: <FlagIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.campus_registrar],
  },
];

export default CAMPUS_REGISTRAR;
