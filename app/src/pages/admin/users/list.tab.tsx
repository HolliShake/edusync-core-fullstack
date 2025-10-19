import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import { Button } from '@/components/ui/button';
import UserModal from '@/components/user/user.modal';
import { useGetUserPaginated } from '@rest/api';
import type { User } from '@rest/models/user';
import { DeleteIcon, EditIcon, EllipsisIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

export function UserListTab() {
  const [page, setPage] = useState(1);
  const [rows] = useState(10);

  const userModalController = useModal<User>();

  const {
    data: users,
    isLoading,
    refetch,
  } = useGetUserPaginated({
    page,
    rows,
  });

  const handleUserSubmit = () => {
    refetch();
  };

  const columns = useMemo<TableColumn<User>[]>(
    () => [
      {
        key: 'name',
        title: 'Name',
      },
      {
        key: 'email',
        title: 'Email',
      },
      {
        key: 'role',
        title: 'Role',
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
                  userModalController.openFn(row);
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
    [userModalController]
  );

  const tableUsers = useMemo(() => users?.data?.data ?? [], [users]);
  const paginationMeta = useMemo(() => users?.data, [users]);

  return (
    <div>
      <Table
        columns={columns}
        rows={tableUsers}
        pagination={paginationMeta}
        onPageChange={setPage}
        showPagination={true}
        loading={isLoading}
      />
      <UserModal controller={userModalController} onSubmit={handleUserSubmit} />
    </div>
  );
}
