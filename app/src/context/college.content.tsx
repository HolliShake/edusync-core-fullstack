import { useGetCollegeById } from '@rest/api';
import type { College } from '@rest/models';
import { createContext, useContext, useMemo } from 'react';

export const CollegeContext = createContext<College | undefined>(undefined);

export const useCollegeContext = () => {
  const context = useContext(CollegeContext);
  // Context can be null if college is not fully loaded from db
  return context;
};

interface CollegeContextProviderProps {
  children: React.ReactNode;
  collegeId: number;
}

export default function CollegeContextProvider({
  children,
  collegeId,
}: CollegeContextProviderProps) {
  const { data: college } = useGetCollegeById(collegeId);
  const collegeData = useMemo<College | undefined>(() => college?.data, [college]);
  return <CollegeContext.Provider value={collegeData}>{children}</CollegeContext.Provider>;
}
