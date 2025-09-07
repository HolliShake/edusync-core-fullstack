import CampusModal from '@/components/campus/campus.modal';
import { useConfirm } from '@/components/confirm.provider';
import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import TitledPage from '@/components/pages/titled.page';
import { Button } from '@/components/ui/button';
import { encryptIdForUrl } from '@/lib/hash';
import { useDeleteCampus, useGetCampusPaginated } from '@rest/api';
import type { Campus } from '@rest/models';
import { DeleteIcon, EditIcon, EllipsisIcon } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function AdminCampus(): React.ReactNode {
  const [page, setPage] = useState(1);
  const [rows] = useState(10);

  const { data: campuses, refetch } = useGetCampusPaginated({
    page,
    rows,
  });

  const { mutateAsync: deleteCampus } = useDeleteCampus();

  const navigate = useNavigate();

  const controller = useModal<any>();

  const confirm = useConfirm();

  const handleDelete = async (row: Campus) => {
    try {
      await deleteCampus({ id: row.id as number });

      toast.success('Campus deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete campus');
      console.error('Delete error:', error);
    }
  };

  const columns = useMemo<TableColumn<any>[]>(
    () => [
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
      },
      {
        key: 'short_name',
        title: 'Short Name',
        dataIndex: 'short_name',
      },
      {
        key: 'address',
        title: 'Address',
        dataIndex: 'address',
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
                  confirm.confirm(async () => await handleDelete(row));
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
    []
  );
  const items = useMemo(() => campuses?.data?.data ?? [], [campuses]);
  const paginationMeta = useMemo(() => {
    return campuses?.data;
  }, [campuses]);

  return (
    <TitledPage title="Campuses" description="Manage your campuses">
      <div className="flex w-full">
        <Button className="ms-auto" onClick={() => controller.openFn()}>
          Add Campus
        </Button>
      </div>
      <Table
        columns={columns}
        rows={items}
        itemsPerPage={rows}
        pagination={paginationMeta}
        onPageChange={setPage}
        showPagination={true}
        onClickRow={(row) => navigate(`/admin/campuses/${encryptIdForUrl(row?.id as number)}`)}
      />
      <CampusModal
        controller={controller}
        onSubmit={() => {
          refetch();
        }}
      />
    </TitledPage>
  );
}
