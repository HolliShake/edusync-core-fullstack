import Table, { type TableColumn } from '@/components/custom/table.component';
import { decryptIdFromUrl } from '@/lib/hash';
import { useGetCurriculumTaggingPaginated } from '@rest/api';
import type { CurriculumTagging } from '@rest/models';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router';

export default function StudentContent(): React.ReactNode {
  const { curriculumId } = useParams();

  const [page, setPage] = useState(1);
  const [rows] = useState(10);
  const { data: studentResponse, isLoading } = useGetCurriculumTaggingPaginated(
    {
      'filter[curriculum_id]': decryptIdFromUrl(curriculumId as string),
      page,
      rows,
    },
    { query: { enabled: !!curriculumId } }
  );

  const columns = useMemo<TableColumn<CurriculumTagging>[]>(
    () => [
      {
        key: 'user.name',
        title: 'Name',
        render: (_, row) => row.user?.name || 'N/A',
      },
      {
        key: 'user.email',
        title: 'Email',
        render: (_, row) => row.user?.email || 'N/A',
      },
      {
        key: 'is_active',
        title: 'Status',
        render: (_, row) => (row.is_active ? 'Active' : 'Inactive'),
      },
    ],
    []
  );

  const tableItems = useMemo(() => studentResponse?.data?.data ?? [], [studentResponse]);
  const paginationMeta = useMemo(() => {
    return studentResponse?.data;
  }, [studentResponse]);

  return (
    <div>
      <Table
        columns={columns}
        rows={tableItems}
        itemsPerPage={rows}
        pagination={paginationMeta}
        onPageChange={setPage}
        showPagination={true}
        loading={isLoading}
      />
    </div>
  );
}
