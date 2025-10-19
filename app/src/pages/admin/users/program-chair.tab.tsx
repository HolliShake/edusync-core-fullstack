import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import ProgramChairModal from '@/components/designition/program-chair.modal';
import { Button } from '@/components/ui/button';
import { useGetDesignitionPaginated } from '@rest/api';
import type { Designition } from '@rest/models/designition';
import { DeleteIcon, EditIcon, EllipsisIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

export function ProgramChairTab() {
  const [page, setPage] = useState(1);
  const [rows] = useState(10);

  const programChairModalController = useModal<Designition>();

  const {
    data: designitions,
    isLoading,
    refetch,
  } = useGetDesignitionPaginated({
    'filter[designitionable_type]': 'App\\Models\\AcademicProgram' as 'AppModelsAcademicProgram',
    page,
    rows,
  });

  const tableDesignitions = useMemo(() => designitions?.data?.data ?? [], [designitions]);
  const paginationMeta = useMemo(() => {
    return designitions?.data;
  }, [designitions]);

  const handleProgramChairSubmit = () => {
    refetch();
  };

  const columns = useMemo<TableColumn<any>[]>(
    () => [
      {
        key: 'user_name',
        title: 'Name',
        render: (_, row) => row.user?.name ?? 'N/A',
      },
      {
        key: 'program',
        title: 'Program',
        render: (_, row) => row.designitionable?.program_name ?? 'N/A',
      },
      {
        key: 'is_active',
        title: 'Status',
        render: (_, row) => (
          <span className={row.is_active ? 'text-green-600' : 'text-gray-400'}>
            {row.is_active ? 'Active' : 'Inactive'}
          </span>
        ),
      },
      {
        key: 'created_at',
        title: 'Assigned Date',
        render: (_, row) => new Date(row.created_at).toLocaleDateString(),
      },
      {
        key: 'actions',
        title: 'Actions',
        render: (_, row) => (
          <Menu
            items={[
              {
                label: 'Edit',
                icon: <EditIcon />,
                variant: 'default',
                onClick: () => {
                  programChairModalController.openFn(row);
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
              <Button variant="ghost" size="icon">
                <EllipsisIcon className="h-4 w-4" />
              </Button>
            }
          />
        ),
      },
    ],
    [programChairModalController]
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Program Chairs</h2>
        <Button onClick={() => programChairModalController.openFn()}>Add Program Chair</Button>
      </div>
      <Table
        columns={columns}
        rows={tableDesignitions}
        loading={isLoading}
        pagination={paginationMeta}
        onPageChange={setPage}
        showPagination={true}
      />
      <ProgramChairModal
        controller={programChairModalController}
        onSubmit={handleProgramChairSubmit}
      />
    </div>
  );
}
