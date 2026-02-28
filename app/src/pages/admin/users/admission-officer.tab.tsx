import { useConfirm } from '@/components/confirm.provider';
import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import AdmissionOfficerModal from '@/components/designition/admission-officer.modal';
import { Button } from '@/components/ui/button';
import { useDeleteDesignition, useGetDesignitionPaginated } from '@rest/api';
import type { Designition } from '@rest/models/designition';
import { DeleteIcon, EditIcon, EllipsisIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export function AdmissionOfficerTab() {
  const [page, setPage] = useState(1);
  const [rows] = useState(10);

  const admissionOfficerModalController = useModal<Designition>();

  const {
    data: designitions,
    isLoading,
    refetch,
  } = useGetDesignitionPaginated({
    'filter[designitionable_type]': 'App\\Models\\Office' as 'AppModelsOffice',
    page,
    rows,
  });

  const { mutateAsync: deleteDesignition } = useDeleteDesignition();

  const confirm = useConfirm();

  const handleDelete = async (row: Designition) => {
    confirm.confirm(async () => {
      try {
        await deleteDesignition({ id: row.id as number });
        toast.success('Admission Officer deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete Admission Officer');
        console.error('Delete error:', error);
      }
    });
  };

  const tableDesignitions = useMemo(() => designitions?.data?.data ?? [], [designitions]);
  const paginationMeta = useMemo(() => {
    return designitions?.data;
  }, [designitions]);

  const handleAdmissionOfficerSubmit = () => {
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
        key: 'office',
        title: 'Office',
        render: (_, row) => row.designitionable?.name ?? 'N/A',
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
                  admissionOfficerModalController.openFn(row);
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
    [admissionOfficerModalController]
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admission Officers</h2>
        <Button onClick={() => admissionOfficerModalController.openFn()}>
          Add Admission Officer
        </Button>
      </div>
      <Table
        columns={columns}
        rows={tableDesignitions}
        loading={isLoading}
        pagination={paginationMeta}
        onPageChange={setPage}
        showPagination={true}
      />
      <AdmissionOfficerModal
        controller={admissionOfficerModalController}
        onSubmit={handleAdmissionOfficerSubmit}
      />
    </div>
  );
}
