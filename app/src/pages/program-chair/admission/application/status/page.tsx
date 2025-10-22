import TitledPage from '@/components/pages/titled.page';
import AdmissionApplicationStatusView from '@/views/shared/admission-application.view';
import type React from 'react';

export default function ProgramChairAdmissionApplicationStatus(): React.ReactNode {
  return (
    <TitledPage
      title="Application Status"
      description="Track the status of your admission application"
    >
      <AdmissionApplicationStatusView />
    </TitledPage>
  );
}
