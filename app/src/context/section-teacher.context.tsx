import { useGetSectionTeacherById } from '@rest/api';
import type { SectionTeacher } from '@rest/models';
import { createContext, useContext, useMemo } from 'react';

// null if not fully loaded
const SectionTeacherContext = createContext<SectionTeacher | null | undefined>(undefined);

interface SectionTeacherContextProviderProps {
  children: React.ReactNode;
  sectionTeacherId: number;
}

export default function SectionTeacherContextProvider({
  children,
  sectionTeacherId,
}: SectionTeacherContextProviderProps) {
  const { data: sectionTeacher } = useGetSectionTeacherById(sectionTeacherId);
  const sectionTeacherData = useMemo(() => sectionTeacher?.data, [sectionTeacher]);
  return (
    <SectionTeacherContext.Provider value={sectionTeacherData}>
      {children}
    </SectionTeacherContext.Provider>
  );
}

export const useSectionTeacherContext = () => {
  const context = useContext(SectionTeacherContext);
  return context;
};
