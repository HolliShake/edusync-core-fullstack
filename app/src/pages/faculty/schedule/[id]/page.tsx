import TitledPage from '@/components/pages/titled.page';
import SectionTeacherContextProvider from '@/context/section-teacher.context';
import { decryptIdFromUrl } from '@/lib/hash';
import type React from 'react';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import FacultyScheduleDetailContent from './content';

export default function FacultyScheduleDetail(): React.ReactNode {
  const { sectionTeacherId } = useParams<{ sectionTeacherId: string }>();

  const parsedSectionTeacherId = useMemo(() => {
    return decryptIdFromUrl(sectionTeacherId!);
  }, [sectionTeacherId]);

  return (
    <TitledPage
      title="Schedule Details"
      description="View detailed information about this schedule"
    >
      <SectionTeacherContextProvider sectionTeacherId={parsedSectionTeacherId}>
        <FacultyScheduleDetailContent />
      </SectionTeacherContextProvider>
    </TitledPage>
  );
}
