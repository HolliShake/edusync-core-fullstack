import TitledPage from '@/components/pages/titled.page';
import ScheduleView from '@/views/shared/schedule.view';
import { UserRoleEnum } from '@rest/models';
import type React from 'react';

export default function CampusRegistrarSchedule(): React.ReactNode {
  return (
    <TitledPage
      title="Schedule Management"
      description="Organize and manage class schedules with room assignments"
    >
      <ScheduleView role={UserRoleEnum.campus_registrar} />
    </TitledPage>
  );
}
