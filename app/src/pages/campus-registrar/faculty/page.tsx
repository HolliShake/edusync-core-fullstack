import TitledPage from '@/components/pages/titled.page';
import CommunityFacultyView from '@/views/shared/community-faculty.view';
import { UserRoleEnum } from '@rest/models';
import type React from 'react';

export default function CampusRegistrarCommunityFaculty(): React.ReactNode {
  return (
    <TitledPage title="Faculties" description="View faculty assignments">
      <CommunityFacultyView role={UserRoleEnum.campus_registrar} />
    </TitledPage>
  );
}
