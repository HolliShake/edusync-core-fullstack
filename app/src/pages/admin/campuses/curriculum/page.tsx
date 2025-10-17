import TitledPage from '@/components/pages/titled.page';
import { CurriculumContext } from '@/context/curriculum.context';
import { decryptId } from '@/lib/hash';
import { useGetCurriculumById } from '@rest/api';
import type React from 'react';
import { useParams } from 'react-router';
import CurriculumContent from './content';

export default function AdminCurriculum(): React.ReactNode {
  const { curriculumId } = useParams();

  const { data: curriculum } = useGetCurriculumById(decryptId(curriculumId as string));

  return (
    <TitledPage title="Curriculum" description="Manage your curriculum">
      <CurriculumContext value={curriculum?.data}>
        <CurriculumContent />
      </CurriculumContext>
    </TitledPage>
  );
}
