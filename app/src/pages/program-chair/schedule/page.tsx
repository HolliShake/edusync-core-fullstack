import TitledPage from '@/components/pages/titled.page';
import ScheduleView from '@/views/shared/schedule.view';
import { UserRoleEnum } from '@rest/models';
import type React from 'react';

const SECTION_COLORS = [
  {
    bg: '#3b82f6',
    border: '#2563eb',
    tailwindBorder: 'border-blue-500',
    tailwindBg: 'bg-blue-50 dark:bg-blue-950/20',
  }, // blue-500
  {
    bg: '#22c55e',
    border: '#16a34a',
    tailwindBorder: 'border-green-500',
    tailwindBg: 'bg-green-50 dark:bg-green-950/20',
  }, // green-500
  {
    bg: '#ef4444',
    border: '#dc2626',
    tailwindBorder: 'border-red-500',
    tailwindBg: 'bg-red-50 dark:bg-red-950/20',
  }, // red-500
  {
    bg: '#a855f7',
    border: '#9333ea',
    tailwindBorder: 'border-purple-500',
    tailwindBg: 'bg-purple-50 dark:bg-purple-950/20',
  }, // purple-500
  {
    bg: '#f97316',
    border: '#ea580c',
    tailwindBorder: 'border-orange-500',
    tailwindBg: 'bg-orange-50 dark:bg-orange-950/20',
  }, // orange-500
  {
    bg: '#06b6d4',
    border: '#0891b2',
    tailwindBorder: 'border-cyan-500',
    tailwindBg: 'bg-cyan-50 dark:bg-cyan-950/20',
  }, // cyan-500
];

export default function ProgramChairSchedule(): React.ReactNode {
  return (
    <TitledPage
      title="Schedule Management"
      description="Organize and manage class schedules with room assignments"
    >
      <ScheduleView role={UserRoleEnum.program_chair} />
    </TitledPage>
  );
}
