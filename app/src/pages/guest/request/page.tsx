import TitledPage from '@/components/pages/titled.page';
import RequestDocumentView from '@/views/shared/request-application.view';
import type React from 'react';

export default function GuestRequestDocument(): React.ReactNode {
  return (
    <TitledPage title="Request a Document" description="Request a document from the school">
      <RequestDocumentView />
    </TitledPage>
  );
}
