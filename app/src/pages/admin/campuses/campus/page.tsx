import TitledPage from '@/components/pages/titled.page';
import CampusContextProvider from '@/context/campus.context';
import { decryptId } from '@/lib/hash';
import type React from 'react';
import { useParams } from 'react-router';
import AdminCampusDetailContent from './content';

export default function AdminCampusDetail(): React.ReactNode {
  const { campusId } = useParams();
  return (
    <TitledPage title="Campus" description="Manage your campus">
      <CampusContextProvider campusId={decryptId(campusId as string)}>
        <AdminCampusDetailContent />
      </CampusContextProvider>
    </TitledPage>
  );
}
