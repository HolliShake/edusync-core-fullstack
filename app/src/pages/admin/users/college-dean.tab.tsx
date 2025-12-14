import { useConfirm } from '@/components/confirm.provider';
import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import CollegeDeanModal from '@/components/designition/college-dean.modal';
import { Button } from '@/components/ui/button';
import { useDeleteDesignition, useGetDesignitionPaginated } from '@rest/api';
import type { Designition } from '@rest/models/designition';
import { DeleteIcon, EditIcon, EllipsisIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export function CollegeDeanTab() {
  const [page, setPage] = useState(1);
  const [rows] = useState(10);

  const collegeDeanModalController = useModal<Designition>();

  const {
    data: designitions,
    isLoading,
    refetch,
  } = useGetDesignitionPaginated({
    'filter[designitionable_type]': 'App\\Models\\College' as 'AppModelsCollege',
    page,
    rows,
  });

  const { mutateAsync: deleteDesignition } = useDeleteDesignition();

  const confirm = useConfirm();

  const handleDelete = async (row: Designition) => {
    confirm.confirm(async () => {
      try {
        await deleteDesignition({ id: row.id as number });
        toast.success('College Dean deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete College Dean');
        console.error('Delete error:', error);
      }
    });
  };

  const tableDesignitions = useMemo(() => designitions?.data?.data ?? [], [designitions]);
  const paginationMeta = useMemo(() => {
    return designitions?.data;
  }, [designitions]);

  const handleCollegeDeanSubmit = () => {
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
        key: 'college',
        title: 'College',
        render: (_, row) => row.designitionable?.college_name ?? 'N/A',
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
                  collegeDeanModalController.openFn(row);
                },
              },
              {
                label: 'Delete',
                icon: <DeleteIcon />,
                variant: 'destructive',
                onClick: () => {
                  handleDelete(row);
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
    [collegeDeanModalController]
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">College Deans</h2>
        <Button onClick={() => collegeDeanModalController.openFn()}>Add College Dean</Button>
      </div>
      <Table
        columns={columns}
        rows={tableDesignitions}
        loading={isLoading}
        pagination={paginationMeta}
        onPageChange={setPage}
        showPagination={true}
      />
      <CollegeDeanModal
        controller={collegeDeanModalController}
        onSubmit={handleCollegeDeanSubmit}
      />
    </div>
  );
}
