import TitledPage from '@/components/pages/titled.page';
import { UserRoleEnum } from '@/enums/role-enum';
import CommunityStudentView from '@/views/shared/community-student.view';
import type React from 'react';

export default function CampusRegistrarCommunityStudent(): React.ReactNode {
  return (
    <TitledPage title="Students" description="Manage students in your program">
      <CommunityStudentView role={UserRoleEnum.CAMPUS_REGISTRAR} />
    </TitledPage>
  );
}
