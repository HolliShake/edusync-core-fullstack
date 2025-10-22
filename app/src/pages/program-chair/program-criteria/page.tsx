import { useConfirm } from '@/components/confirm.provider';
import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Select, { type SelectOption } from '@/components/custom/select.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import TitledPage from '@/components/pages/titled.page';
import AcademicProgramCriteriaModal from '@/components/program-chair-only/academic-program-criteria/academic-program-criteria.modal';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth.context';
import { cn } from '@/lib/utils';
import {
  useDeleteAcademicProgramCriteria,
  useGetAcademicProgramCriteriaPaginated,
  useGetSchoolYearPaginated,
} from '@rest/api';
import type { AcademicProgramCriteria, SchoolYear } from '@rest/models';
import { AlertTriangleIcon, DeleteIcon, EditIcon, EllipsisIcon } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { toast } from 'sonner';

export default function ProgramCriteria(): React.ReactNode {
  const { session } = useAuth();
  const [page, setPage] = useState(1);
  const [rows] = useState(Number.MAX_SAFE_INTEGER);
  const [schoolYearId, setSchoolYearId] = useState<number>(0);

  const { data: criteria, refetch } = useGetAcademicProgramCriteriaPaginated({
    'filter[academic_program_id]': session?.active_academic_program ?? 0,
    'filter[school_year_id]': schoolYearId,
    page,
    rows,
  });

  const { data: schoolYearResponse } = useGetSchoolYearPaginated({
    sort: '-start_date',
    page: 1,
    rows: Number.MAX_SAFE_INTEGER,
  });

  const schoolYearsList = useMemo<SelectOption[]>(
    () =>
      schoolYearResponse?.data?.data?.map((schoolYear: SchoolYear) => ({
        label: schoolYear.name,
        value: String(schoolYear.id),
      })) ?? [],
    [schoolYearResponse]
  );

  const { mutateAsync: deleteCriteria } = useDeleteAcademicProgramCriteria();

  const controller = useModal<AcademicProgramCriteria>();

  const confirm = useConfirm();

  const handleDelete = async (data: AcademicProgramCriteria) => {
    try {
      await deleteCriteria({ id: data.id as number });
      toast.success('Program criteria deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete program criteria');
    }
  };

  useEffect(() => {
    if (schoolYearsList.length > 0) setSchoolYearId(parseInt(schoolYearsList[0].value));
  }, [schoolYearsList]);

  const totalWeight = useMemo(() => {
    const criteriaList = criteria?.data?.data ?? [];
    return criteriaList.reduce((sum, item) => sum + (item.weight || 0), 0);
  }, [criteria]);

  const isWeightExceeded = totalWeight > 100;

  const columns = useMemo<TableColumn<AcademicProgramCriteria>[]>(
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
    <TitledPage title="Program Criteria" description="Manage academic program evaluation criteria">
      <div className="flex flex-row gap-2 items-center">
        <div className="w-fit">
          <Select
            options={schoolYearsList}
            value={schoolYearId?.toString()}
            onValueChange={(value) => setSchoolYearId(parseInt(value))}
            placeholder="Select school year"
          />
        </div>
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
