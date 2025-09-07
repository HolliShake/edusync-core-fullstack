import CollegeModal from '@/components/campus/college.modal';
import { useConfirm } from '@/components/confirm.provider';
import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCampusContext } from '@/context/campus.context';
import { encryptIdForUrl } from '@/lib/hash';
import { useDeleteCollege, useGetCollegePaginated } from '@rest/api';
import { DeleteIcon, EditIcon, EllipsisIcon, GraduationCapIcon } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function AdminCollegeTab(): React.ReactNode {
  const [page, setPage] = useState(1);
  const [rows] = useState(10);

  const campus = useCampusContext();
  const controller = useModal<any>();
  const confirm = useConfirm();
  const navigate = useNavigate();

  const {
    data: collegesPaginated,
    isLoading,
    refetch,
  } = useGetCollegePaginated(
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

  const { mutateAsync: deleteCollege } = useDeleteCollege();

  const handleDelete = async (college: any) => {
    try {
      await deleteCollege({ id: college.id });
      toast.success('College deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete college');
      console.error('Delete error:', error);
    }
  };

  const columns = useMemo<TableColumn<any>[]>(
    () => [
      {
        key: 'college_name',
        title: 'College Name',
        render: (value) => <div className="font-medium">{String(value)}</div>,
      },
      {
        key: 'college_shortname',
        title: 'Short Name',
        render: (value) => <div className="text-sm text-muted-foreground">{String(value)}</div>,
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

  const items = useMemo(() => collegesPaginated?.data?.data ?? [], [collegesPaginated]);
  const paginationMeta = useMemo(() => {
    return collegesPaginated?.data;
  }, [collegesPaginated]);

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
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          {/* Table Rows Skeleton */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="border-b p-4">
              <div className="grid grid-cols-4 gap-4 items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
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
          <h2 className="text-2xl font-semibold tracking-tight">Colleges</h2>
          <p className="text-muted-foreground">
            Manage colleges for {campus?.name || 'this campus'}
          </p>
        </div>
        <Button onClick={() => controller.openFn()}>Add College</Button>
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
            <GraduationCapIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No colleges found</h3>
            <p className="text-muted-foreground">
              Get started by adding a new college to this campus.
            </p>
          </div>
        }
        onClickRow={(row) => {
          const campusId = encryptIdForUrl(campus?.id as number);
          const collegeId = encryptIdForUrl(row.id as number);
          navigate(`/admin/campuses/${campusId}/colleges/${collegeId}`);
        }}
      />

      <CollegeModal
        controller={controller}
        campus_id={campus?.id}
        onSubmit={() => {
          refetch();
        }}
      />
    </div>
  );
}
