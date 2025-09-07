import { useGetCampusById } from '@rest/api';
import type { Campus } from '@rest/models';
import { createContext, useContext, useMemo } from 'react';

export const CampusContext = createContext<Campus | undefined>(undefined);

export const useCampusContext = () => {
  const context = useContext(CampusContext);
  // Context can be null if campus is not fully loaded from db
  return context;
};

interface CampusContextProviderProps {
  children: React.ReactNode;
  campusId: number;
}

export default function CampusContextProvider({ children, campusId }: CampusContextProviderProps) {
  const { data: campus } = useGetCampusById(campusId);
  const campusData = useMemo<Campus | undefined>(() => campus?.data, [campus]);
  return <CampusContext.Provider value={campusData}>{children}</CampusContext.Provider>;
}
