import TitledPage from '@/components/pages/titled.page';
import { encryptIdForUrl } from '@/lib/hash';
import ScheduleView from '@/views/shared/schedule.view';
import { UserRoleEnum, type Section } from '@rest/models';
import type React from 'react';
import { useNavigate } from 'react-router';

export default function CampusRegistrarSchedule(): React.ReactNode {
  const navigate = useNavigate();

  const handleViewDetails = (section: Section) => {
    if (!section?.id) return;
    navigate(`/campus-registrar/schedule/${encryptIdForUrl(section.id!)}`);
  };

  return (
    <TitledPage
      title="Schedule Management"
      description="Organize and manage class schedules with room assignments"
    >
      <ScheduleView role={UserRoleEnum.campus_registrar} onClickViewDetails={handleViewDetails} />
    </TitledPage>
  );
}
