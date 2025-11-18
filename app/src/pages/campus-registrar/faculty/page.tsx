import TitledPage from '@/components/pages/titled.page';
import { UserRoleEnum } from '@/enums/role-enum';
import CommunityFacultyView from '@/views/shared/community-faculty.view';
import type React from 'react';

export default function CampusRegistrarCommunityFaculty(): React.ReactNode {
  return (
    <TitledPage title="Faculties" description="View faculty assignments">
      <CommunityFacultyView role={UserRoleEnum.CAMPUS_REGISTRAR} />
    </TitledPage>
  );
}
