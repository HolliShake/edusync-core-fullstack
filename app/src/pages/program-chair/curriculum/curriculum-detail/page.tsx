import CurriculumTable from '@/components/curriclum-detail/curriculum-detail.table';
import TitledPage from '@/components/pages/titled.page';
import { decryptIdFromUrl } from '@/lib/hash';
import { useGetCurriculumDetailPaginated } from '@rest/api';
import type { CurriculumDetail } from '@rest/models';
import { useMemo } from 'react';
import { useParams } from 'react-router';

export default function ProgramChairCurriculumDetail(): React.ReactNode {
  const { curriculumId } = useParams();
  const { data: curriculumDetailsResponse, isLoading } = useGetCurriculumDetailPaginated({
    'filter[curriculum_id]': decryptIdFromUrl(curriculumId as string),
    paginate: false,
    page: 1,
    rows: Number.MAX_SAFE_INTEGER,
  });

  const curriculumDetails = useMemo(
    () => curriculumDetailsResponse?.data ?? [],
    [curriculumDetailsResponse]
  );

  console.log(curriculumDetails);

  return (
    <TitledPage title="Curriculum Detail" description="Manage your curriculum detail">
      <CurriculumTable
        curriculumDetails={curriculumDetails as CurriculumDetail[]}
        isLoading={isLoading}
        onGenerateSchedule={() => {}}
      />
    </TitledPage>
  );
}
