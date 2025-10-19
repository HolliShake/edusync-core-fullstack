import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import TitledPage from '@/components/pages/titled.page';
import { Button } from '@/components/ui/button';
import { useGetCurriculumPaginated } from '@rest/api';
import type { Curriculum } from '@rest/models';
import { DeleteIcon, EditIcon, EllipsisIcon } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';

export default function ProgramChairCurriculum(): React.ReactNode {
  const [page, setPage] = useState(1);
  const [rows] = useState(10);

  const { data: curriculums } = useGetCurriculumPaginated({
    page,
    rows,
  });

  const controller = useModal<Curriculum>();

  const columns = useMemo<TableColumn<Curriculum>[]>(
    () => [
      {
        key: 'curriculum_code',
        title: 'Code',
        dataIndex: 'curriculum_code',
      },
      {
        key: 'curriculum_name',
        title: 'Name',
        dataIndex: 'curriculum_name',
      },
      {
        key: 'description',
        title: 'Description',
        dataIndex: 'description',
      },
      {
        key: 'effective_year',
        title: 'Effective Year',
        dataIndex: 'effective_year',
      },
      {
        key: 'status',
        title: 'Status',
        dataIndex: 'status',
      },
      {
        key: 'actions',
        title: 'Actions',
        dataIndex: 'actions',
        render: (_, row) => (
          <Menu
            items={[
              {
                label: 'Edit',
                icon: <EditIcon />,
                variant: 'default',
                onClick: () => {
                  controller.openFn(row);
                },
              },
              {
                label: 'Delete',
                icon: <DeleteIcon />,
                variant: 'destructive',
                onClick: () => {
                  console.log('Delete', row);
                },
              },
            ]}
            trigger={
              <Button variant="outline" size="icon">
                <EllipsisIcon />
              </Button>
            }
          />
        ),
      },
    ],
    [controller]
  );
  const tableItems = useMemo(() => curriculums?.data?.data ?? [], [curriculums]);
  const paginationMeta = useMemo(() => {
    return curriculums?.data;
  }, [curriculums]);

  return (
    <TitledPage title="Curriculum" description="Manage your curriculum">
      <Button onClick={() => controller.openFn()}>Add Curriculum</Button>
      <Table
        columns={columns}
        rows={tableItems}
        itemsPerPage={rows}
        pagination={paginationMeta}
        onPageChange={setPage}
        showPagination={true}
      />
    </TitledPage>
  );
}
