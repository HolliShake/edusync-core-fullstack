import TitledPage from '@/components/pages/titled.page';
import BuildingContextProvider from '@/context/building.context';
import { decryptId } from '@/lib/hash';
import type React from 'react';
import { useParams } from 'react-router';
import AdminBuildingDetailContent from './content';

export default function AdminBuilding(): React.ReactNode {
  const { buildingId } = useParams();

  return (
    <TitledPage title="Buildings" description="Manage your buildings">
      <BuildingContextProvider buildingId={decryptId(buildingId as string)}>
        <AdminBuildingDetailContent />
      </BuildingContextProvider>
    </TitledPage>
  );
}
