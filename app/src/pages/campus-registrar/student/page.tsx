import TitledPage from '@/components/pages/titled.page';
import CommunityStudentView from '@/views/shared/community-student.view';
import { UserRoleEnum } from '@rest/models';
import type React from 'react';

export default function CampusRegistrarCommunityStudent(): React.ReactNode {
  return (
    <TitledPage title="Students" description="Manage students in your program">
      <CommunityStudentView role={UserRoleEnum.campus_registrar} />
    </TitledPage>
  );
}
