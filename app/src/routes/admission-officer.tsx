import AdmissionOfficerAdmissionApplication from '@/pages/admission-officer/admission/application/page';
import AdmissionOfficerUniversityAdmissionDetail from '@/pages/admission-officer/admission/university-admission-invitation/[id]/page';
import AdmissionOfficerUniversityAdmissionInvitation from '@/pages/admission-officer/admission/university-admission-invitation/page';
import AdmissionOfficerTestingCenter from '@/pages/admission-officer/testing-center/page';
import type { Route } from '@/types/route';
import { UserRoleEnum } from '@rest/models';
import { CalendarFoldIcon, FileTextIcon, FlagIcon } from 'lucide-react';

const ADMISSION_OFFICER: Route[] = [
  {
    key: 'admission-officer.label',
    title: 'Admission Officer',
    path: '#',
    layout: 'default',
    type: 'label',
    roles: [UserRoleEnum.admission_officer],
  },
  {
    /*
     * University Admission Management
     *
     * University admission is the process of managing admission invitations and schedules.
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
    key: 'admission-officer.university-admission',
    title: 'Admission',
    path: '/admission-officer/university-admission',
    icon: <FileTextIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.admission_officer],
    children: [
      {
        key: 'admission-officer.university-admission.invitation',
        title: 'Invitation',
        path: '/admission-officer/admission/invitation',
        icon: <CalendarFoldIcon className="h-4 w-4" />,
        component: <AdmissionOfficerUniversityAdmissionInvitation />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.admission_officer],
      },
      {
        key: 'admission-officer.university-admission.detail',
        title: 'Detail',
        path: '/admission-officer/admission/invitation/:universityAdmissionId',
        component: <AdmissionOfficerUniversityAdmissionDetail />,
        layout: 'dashboard',
        sidebar: false,
        roles: [UserRoleEnum.admission_officer],
      },
      //
      {
        key: 'admission-officer.university-admission.application',
        title: 'Application',
        path: '/admission-officer/admission/application',
        icon: <FileTextIcon className="h-4 w-4" />,
        component: <AdmissionOfficerAdmissionApplication />,
        layout: 'dashboard',
        sidebar: true,
        roles: [UserRoleEnum.admission_officer],
      },
    ],
  },
  {
    key: 'admission-officer.testing-center',
    title: 'Testing Center',
    path: '/admission-officer/testing-center',
    component: <AdmissionOfficerTestingCenter />,
    icon: <FlagIcon className="h-4 w-4" />,
    layout: 'dashboard',
    sidebar: true,
    roles: [UserRoleEnum.admission_officer],
  },
];

export default ADMISSION_OFFICER;
