import OfficeModal from '@/components/campus/office.modal';
import { useConfirm } from '@/components/confirm.provider';
import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCampusContext } from '@/context/campus.context';
import { useDeleteOffice, useGetOfficePaginated } from '@rest/api';
import { BuildingIcon, DeleteIcon, EditIcon, EllipsisIcon } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function AdminOfficeTab(): React.ReactNode {
  const [page, setPage] = useState(1);
  const [rows] = useState(10);

  const campus = useCampusContext();
  const controller = useModal<any>();
  const confirm = useConfirm();

  const {
    data: officesPaginated,
    isLoading,
    refetch,
  } = useGetOfficePaginated(
    {
      page,
      rows,
      ['filter[campus_id]']: campus?.id,
    },
    {
      query: {
        enabled: !!campus?.id,
      },
    }
  );

  const { mutateAsync: deleteOffice } = useDeleteOffice();

  const handleDelete = async (office: any) => {
    try {
      await deleteOffice({ id: office.id });
      toast.success('Office deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete office');
      console.error('Delete error:', error);
    }
  };

  const columns = useMemo<TableColumn<any>[]>(
    () => [
      {
        key: 'name',
        title: 'Office Name',
        render: (value) => <div className="font-medium">{String(value)}</div>,
      },
      {
        key: 'address',
        title: 'Address',
        render: (value) => (
          <div className="text-sm text-muted-foreground">{value ? String(value) : '—'}</div>
        ),
      },
      {
        key: 'phone',
        title: 'Phone',
        render: (value) => (
          <div className="text-sm text-muted-foreground">{value ? String(value) : '—'}</div>
        ),
      },
      {
        key: 'email',
        title: 'Email',
        render: (value) => (
          <div className="text-sm text-muted-foreground">{value ? String(value) : '—'}</div>
        ),
      },
      {
        key: 'created_at',
        title: 'Created',
        render: (value) => (
          <div className="text-sm text-muted-foreground">
            {value && typeof value === 'string' ? new Date(value).toLocaleDateString() : '—'}
          </div>
        ),
      },
      {
        key: 'actions',
        title: 'Actions',
        render: (_, row) => (
          <Menu
            items={[
              {
                label: 'Edit',
                icon: <EditIcon className="w-4 h-4" />,
                variant: 'default',
                onClick: () => {
                  controller.openFn(row);
                },
              },
              {
                label: 'Delete',
                icon: <DeleteIcon className="w-4 h-4" />,
                variant: 'destructive',
                onClick: () => {
                  confirm.confirm(async () => await handleDelete(row));
                },
              },
            ]}
            trigger={
              <Button variant="outline" size="icon">
                <EllipsisIcon className="w-4 h-4" />
              </Button>
            }
          />
        ),
      },
    ],
    [controller, handleDelete]
  );

  const items = useMemo(() => officesPaginated?.data?.data ?? [], [officesPaginated]);
  const paginationMeta = useMemo(() => {
    return officesPaginated?.data;
  }, [officesPaginated]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>

        <div className="border rounded-lg">
          {/* Table Header Skeleton */}
          <div className="border-b bg-muted/50 p-4">
            <div className="grid grid-cols-6 gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          {/* Table Rows Skeleton */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="border-b p-4">
              <div className="grid grid-cols-6 gap-4 items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-background/50">
            <Skeleton className="h-4 w-48" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Offices</h2>
          <p className="text-muted-foreground">
            Manage offices for {campus?.name || 'this campus'}
          </p>
        </div>
        <Button onClick={() => controller.openFn()}>Add Office</Button>
      </div>

      <Table
        columns={columns}
        rows={items}
        itemsPerPage={rows}
        pagination={paginationMeta}
        onPageChange={setPage}
        showPagination={true}
        emptyState={
          <div className="text-center py-8">
            <BuildingIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No offices found</h3>
            <p className="text-muted-foreground">
              Get started by adding a new office to this campus.
            </p>
          </div>
        }
      />

      <OfficeModal
        controller={controller}
        campus_id={campus?.id}
        onSubmit={() => {
          refetch();
        }}
      />
    </div>
  );
}
