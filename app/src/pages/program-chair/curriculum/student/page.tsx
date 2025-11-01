import TitledPage from '@/components/pages/titled.page';
import { CurriculumContext } from '@/context/curriculum.context';
import { decryptIdFromUrl } from '@/lib/hash';
import { useGetCurriculumById } from '@rest/api';
import type React from 'react';
import { useParams } from 'react-router';
import StudentContent from './content';

export default function ProgramChairCurriculumStudent(): React.ReactNode {
  const { curriculumId } = useParams();
  const { data: curriculum } = useGetCurriculumById(decryptIdFromUrl(curriculumId as string), {
    query: { enabled: !!curriculumId },
  });

  return (
    <TitledPage
      title="Curriculum Students"
      description="Manage students enrolled in this curriculum"
    >
      <CurriculumContext value={curriculum?.data}>
        <StudentContent />
      </CurriculumContext>
    </TitledPage>
  );
}
