import { useGetCurriculumById } from '@rest/api';
import type { Curriculum } from '@rest/models';
import { createContext, useContext, useMemo } from 'react';

export const CurriculumContext = createContext<Curriculum | undefined>(undefined);

export const useCurriculumContext = () => {
  const context = useContext(CurriculumContext);
  // Context can be null if curriculum is not fully loaded from db
  return context;
};

interface CurriculumContextProviderProps {
  children: React.ReactNode;
  curriculumId: number;
}

export default function CurriculumContextProvider({
  children,
  curriculumId,
}: CurriculumContextProviderProps) {
  const { data: curriculum } = useGetCurriculumById(curriculumId);
  const curriculumData = useMemo<Curriculum | undefined>(() => curriculum?.data, [curriculum]);
  return <CurriculumContext.Provider value={curriculumData}>{children}</CurriculumContext.Provider>;
}
