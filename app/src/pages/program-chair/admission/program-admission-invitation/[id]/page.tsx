import { useConfirm } from '@/components/confirm.provider';
import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import TitledPage from '@/components/pages/titled.page';
import AcademicProgramCriteriaModal from '@/components/program-chair-only/admission-criteria/admission-criteria.modal';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth.context';
import { decryptIdFromUrl } from '@/lib/hash';
import { cn } from '@/lib/utils';
import { useDeleteAdmissionCriteria, useGetAdmissionCriteriaPaginated } from '@rest/api';
import type { AdmissionCriteria } from '@rest/models/admissionCriteria';
import { AlertTriangleIcon, DeleteIcon, EditIcon, EllipsisIcon } from 'lucide-react';
import type React from 'react';
import { useMemo, useState, type ReactNode } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';

export default function ProgramChairAdmissionInvitationDetail(): React.ReactNode {
  const { session } = useAuth();
  const { admissionScheduleId } = useParams<{ admissionScheduleId: string }>();
  const [page, setPage] = useState(1);
  const [rows] = useState(Number.MAX_SAFE_INTEGER);

  const parsedAdmissionScheduleId = useMemo(
    () => decryptIdFromUrl(String(admissionScheduleId)),
    [admissionScheduleId]
  );

  const { data: criteria, refetch } = useGetAdmissionCriteriaPaginated(
    {
      'filter[academic_program_id]': session?.active_academic_program ?? 0,
      'filter[admission_schedule_id]': parsedAdmissionScheduleId,
      page,
      rows,
    },
    { query: { enabled: !!parsedAdmissionScheduleId } }
  );

  const { mutateAsync: deleteCriteria } = useDeleteAdmissionCriteria();

  const controller = useModal<AdmissionCriteria>();

  const confirm = useConfirm();

  const handleDelete = async (data: AdmissionCriteria) => {
    try {
      await deleteCriteria({ id: data.id as number });
      toast.success('Admission criteria deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete admission criteria');
    }
  };

  const totalWeight = useMemo(() => {
    const criteriaList = criteria?.data?.data ?? [];
    return criteriaList.reduce((sum: number, item) => sum + (item.weight ?? 0), 0);
  }, [criteria]);

  const isWeightExceeded = totalWeight > 100;

  const columns = useMemo<TableColumn<AdmissionCriteria>[]>(
    () => [
      {
        key: 'title',
        title: 'Title',
      },
      {
        key: 'description',
        title: 'Description',
        render: (value) => (value || '-') as ReactNode,
      },
      {
        key: 'requirement',
        title: 'Requirement',
        render: (requirement: any) =>
          requirement ? (
            <div className="flex flex-col gap-1">
              <span className="font-medium">{requirement?.requirement_name}</span>
              {requirement?.description && (
                <span className="text-xs text-muted-foreground">{requirement?.description}</span>
              )}
            </div>
          ) : (
            <Badge variant="secondary">None</Badge>
          ),
      },
      {
        key: 'weight',
        title: 'Weight',
        render: (value) => `${value}%`,
      },
      {
        key: 'score_range',
        title: 'Score Range',
        render: (_, row) => `${row.min_score} - ${row.max_score}`,
      },
      {
        key: 'is_active',
        title: 'Status',
        dataIndex: 'is_active',
        render: (value) =>
          value ? (
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              Active
            </Badge>
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          ),
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
    [controller]
  );

  const tableItems = useMemo(() => criteria?.data?.data ?? [], [criteria]);
  const paginationMeta = useMemo(() => {
    return criteria?.data;
  }, [criteria]);

  return (
    <TitledPage title="Admission Criteria" description="Manage admission evaluation criteria">
      <div className="flex flex-row gap-2 items-center">
        <div className="flex items-center gap-2">
          <Badge
            variant={
              totalWeight === 100 ? 'default' : totalWeight > 100 ? 'destructive' : 'secondary'
            }
            className={cn(
              totalWeight === 100
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : '',
              'py-2'
            )}
          >
            Total Weight: {totalWeight}%
          </Badge>
        </div>
        <Button onClick={() => controller.openFn()}>Add Criteria</Button>
      </div>
      {isWeightExceeded && (
        <Alert variant="destructive">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>Weight Exceeded</AlertTitle>
          <AlertDescription>
            Total weight is {totalWeight}% which exceeds the maximum allowed weight of 100%. Please
            adjust the criteria weights.
          </AlertDescription>
        </Alert>
      )}
      <Table
        columns={columns}
        rows={tableItems}
        itemsPerPage={rows}
        pagination={paginationMeta}
        onPageChange={setPage}
        showPagination={true}
      />
      <AcademicProgramCriteriaModal
        controller={controller}
        onSubmit={() => {
          refetch();
        }}
      />
    </TitledPage>
  );
}
