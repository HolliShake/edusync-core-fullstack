import BuildingModal from '@/components/campus/building.modal';
import { useConfirm } from '@/components/confirm.provider';
import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCampusContext } from '@/context/campus.context';
import { encryptIdForUrl } from '@/lib/hash';
import { useDeleteBuilding, useGetBuildingPaginated } from '@rest/api';
import { DeleteIcon, EditIcon, EllipsisIcon, MapPinIcon } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function AdminBuildingTab(): React.ReactNode {
  const [page, setPage] = useState(1);
  const [rows] = useState(10);

  const campus = useCampusContext();
  const controller = useModal<any>();
  const confirm = useConfirm();
  const navigate = useNavigate();

  const {
    data: buildingsPaginated,
    isLoading,
    refetch,
  } = useGetBuildingPaginated(
    {
      page,
      rows,
      'filter[campus_id]': campus?.id,
    },
    {
      query: {
        enabled: !!campus?.id,
      },
    }
  );

  const { mutateAsync: deleteBuilding } = useDeleteBuilding();

  const handleDelete = async (building: any) => {
    try {
      await deleteBuilding({ id: building.id });
      toast.success('Building deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete building');
      console.error('Delete error:', error);
    }
  };

  const columns = useMemo<TableColumn<any>[]>(
    () => [
      {
        key: 'name',
        title: 'Name',
        render: (value) => <div className="font-medium">{String(value)}</div>,
      },
      {
        key: 'short_name',
        title: 'Short Name',
        render: (value) => <div className="text-sm text-muted-foreground">{String(value)}</div>,
      },
      {
        key: 'coordinates',
        title: 'Location',
        render: (_, row) => (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPinIcon className="w-3 h-3" />
            <span>
              {typeof row.latitude === 'number' ? row.latitude.toFixed(4) : '—'},{' '}
              {typeof row.longitude === 'number' ? row.longitude.toFixed(4) : '—'}
            </span>
          </div>
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

  const items = useMemo(() => buildingsPaginated?.data?.data ?? [], [buildingsPaginated]);
  const paginationMeta = useMemo(() => {
    return buildingsPaginated?.data;
  }, [buildingsPaginated]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="border rounded-lg">
          <div className="border-b p-4">
            <div className="grid grid-cols-5 gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="border-b last:border-b-0 p-4">
              <div className="grid grid-cols-5 gap-4 items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Buildings</h2>
          <p className="text-muted-foreground">
            Manage buildings for {campus?.name || 'this campus'}
          </p>
        </div>
        <Button onClick={() => controller.openFn()}>Add Building</Button>
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
            <MapPinIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No buildings found</h3>
            <p className="text-muted-foreground">
              Get started by adding a new building to this campus.
            </p>
          </div>
        }
        onClickRow={(row) => {
          const campusId = encryptIdForUrl(campus?.id as number);
          const buildingId = encryptIdForUrl(row.id as number);
          navigate(`/admin/campuses/${campusId}/buildings/${buildingId}/rooms`);
        }}
      />

      <BuildingModal
        controller={controller}
        campusId={campus?.id}
        onSubmit={() => {
          refetch();
        }}
      />
    </div>
  );
}
