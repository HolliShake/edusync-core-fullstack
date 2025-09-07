import { useGetBuildingById } from '@rest/api';
import type { Building } from '@rest/models';
import { createContext, useContext, useMemo } from 'react';

export const BuildingContext = createContext<Building | undefined>(undefined);

export const useBuildingContext = () => {
  const context = useContext(BuildingContext);
  // Context can be null if building is not fully loaded from db
  return context;
};

interface BuildingContextProviderProps {
  children: React.ReactNode;
  buildingId: number;
}

export default function BuildingContextProvider({
  children,
  buildingId,
}: BuildingContextProviderProps) {
  const { data: building } = useGetBuildingById(buildingId);
  const buildingData = useMemo<Building | undefined>(() => building?.data, [building]);
  return <BuildingContext.Provider value={buildingData}>{children}</BuildingContext.Provider>;
}
