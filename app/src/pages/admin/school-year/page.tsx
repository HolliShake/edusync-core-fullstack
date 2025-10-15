import { useConfirm } from '@/components/confirm.provider';
import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import TitledPage from '@/components/pages/titled.page';
import SchoolYearModal from '@/components/school-year/school-year.modal'; // Ensure this path is correct
import { Button } from '@/components/ui/button';
import { encryptIdForUrl } from '@/lib/hash';
import { useDeleteSchoolYear, useGetSchoolYearPaginated } from '@rest/api';
import type { SchoolYear } from '@rest/models/schoolYear';
import { DeleteIcon, EditIcon, EllipsisIcon, LockIcon, StarIcon, UnlockIcon } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function AdminSchoolYear(): React.ReactNode {
  const [page, setPage] = useState(1);
  const rows = 10;

  const { data: schoolYears, refetch } = useGetSchoolYearPaginated({
    sort: '-start_date',
    page,
    rows,
  });

  const { mutateAsync: deleteSchoolYear } = useDeleteSchoolYear();

  const controller = useModal<SchoolYear>();
  const confirm = useConfirm();
  const navigate = useNavigate();

  const handleDelete = async (row: SchoolYear) => {
    confirm.confirm(async () => {
      try {
        await deleteSchoolYear({ id: row.id as number });
        toast.success('School Year deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete School Year');
        // eslint-disable-next-line no-console
        console.error('Delete error:', error);
      }
    });
  };

  const columns = useMemo<TableColumn<SchoolYear>[]>(
    () => [
      {
        key: 'school_year_code',
        title: 'Code',
        dataIndex: 'school_year_code',
        render: (_value, row) => row.school_year_code,
      },
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
        render: (_value, row) => row.name,
      },
      {
        key: 'start_date',
        title: 'Start Date',
        dataIndex: 'start_date',
        render: (_value, row) => (
          <span>{row.start_date ? new Date(row.start_date).toLocaleDateString() : ''}</span>
        ),
      },
      {
        key: 'end_date',
        title: 'End Date',
        dataIndex: 'end_date',
        render: (_value, row) => (
          <span>{row.end_date ? new Date(row.end_date).toLocaleDateString() : ''}</span>
        ),
      },
      {
        key: 'is_active',
        title: 'Active',
        dataIndex: 'is_active',
        render: (_value, row) => {
          const active = row.is_active === true;
          return (
            <span className={active ? 'text-green-600 font-semibold' : 'text-gray-400'}>
              {active ? 'Yes' : 'No'}
            </span>
          );
        },
      },
      {
        key: 'is_current',
        title: 'Current',
        dataIndex: 'is_current',
        render: (_value, row) => {
          // is_current is always boolean!
          if (row.is_current) {
            return (
              <span className="inline-flex items-center text-blue-700 font-semibold space-x-1">
                <StarIcon className="w-4 h-4 text-yellow-400" aria-label="Current School Year" />
                <span>Current</span>
              </span>
            );
          }
          return <span className="text-xs text-gray-400">—</span>;
        },
      },
      {
        key: 'is_locked',
        title: 'Locked',
        dataIndex: 'is_locked',
        render: (_value, row) => {
          // is_locked is always boolean!
          return (
            <span className="inline-flex items-center space-x-1">
              {row.is_locked ? (
                <>
                  <LockIcon className="w-4 h-4 text-red-500" aria-label="Locked" />
                  <span className="text-xs text-red-500 font-semibold">Locked</span>
                </>
              ) : (
                <>
                  <UnlockIcon className="w-4 h-4 text-green-500" aria-label="Unlocked" />
                  <span className="text-xs text-green-500 font-semibold">Open</span>
                </>
              )}
            </span>
          );
        },
      },
      {
        key: 'actions',
        title: 'Actions',
        render: (_value, row) => (
          <Menu
            items={[
              {
                label: 'Edit',
                icon: <EditIcon />,
                variant: 'default',
                onClick: () => controller.openFn(row),
              },
              {
                label: 'Delete',
                icon: <DeleteIcon />,
                variant: 'destructive',
                onClick: () => handleDelete(row),
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

  const tableRows = useMemo(() => schoolYears?.data?.data ?? [], [schoolYears]);
  const paginationMeta = useMemo(() => schoolYears?.data, [schoolYears]);

  return (
    <TitledPage title="School Year" description="Manage school years in your institution">
      <Button onClick={() => controller.openFn()} className="mb-4">
        Add School Year
      </Button>
      <Table
        columns={columns}
        rows={tableRows}
        itemsPerPage={rows}
        pagination={paginationMeta}
        onPageChange={setPage}
        showPagination={true}
        onClickRow={(row) => navigate(`/admin/school-year/${encryptIdForUrl(row?.id as number)}`)}
      />
      <SchoolYearModal controller={controller} onSubmit={() => refetch()} />
    </TitledPage>
  );
}
