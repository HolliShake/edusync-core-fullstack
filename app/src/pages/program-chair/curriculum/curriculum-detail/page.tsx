import TitledPage from '@/components/pages/titled.page';
import { CurriculumContext } from '@/context/curriculum.context';
import { decryptIdFromUrl } from '@/lib/hash';
import { useGetCurriculumById } from '@rest/api';
import { useParams } from 'react-router';
import CurriculumContent from './content';

export default function ProgramChairCurriculumDetail(): React.ReactNode {
  const { curriculumId } = useParams();
  const { data: curriculum } = useGetCurriculumById(decryptIdFromUrl(curriculumId as string), {
    query: { enabled: !!curriculumId },
  });
  return (
    <TitledPage title="Curriculum Detail" description="Manage your curriculum detail">
      <CurriculumContext value={curriculum?.data}>
        <CurriculumContent />
      </CurriculumContext>
    </TitledPage>
  );
}
