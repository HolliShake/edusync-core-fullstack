import { useConfirm } from '@/components/confirm.provider';
import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import { Button } from '@/components/ui/button';
import UniversityAdmissionCriteriaModal from '@/components/university-admission-criteria/university-admission-criteria.modal';
import { decryptIdFromUrl } from '@/lib/hash';
import {
  useDeleteUniversityAdmissionCriteria,
  useGetUniversityAdmissionCriteriaPaginated,
} from '@rest/api';
import type { UniversityAdmissionCriteria } from '@rest/models';
import { EditIcon, EllipsisIcon, Plus, Trash2Icon } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';

export default function CampusRegistrarUniversityAdmissionDetailCriteriaTab(): React.ReactNode {
  const { universityAdmissionId } = useParams<{ universityAdmissionId: string }>();
  const [page, setPage] = useState(1);
  const [rows] = useState(10);

  const parsedUniversityAdmissionId = useMemo(
    () => decryptIdFromUrl(String(universityAdmissionId)),
    [universityAdmissionId]
  );

  const {
    data: criteriaData,
    refetch,
    isLoading,
  } = useGetUniversityAdmissionCriteriaPaginated({
    page,
    rows,
    'filter[university_admission_id]': Number(parsedUniversityAdmissionId),
  });

  const confirm = useConfirm();

  const deleteCriteriaMutation = useDeleteUniversityAdmissionCriteria();

  const controller = useModal<UniversityAdmissionCriteria>();

  const criteria = useMemo(() => criteriaData?.data?.data ?? [], [criteriaData]);
  const paginationMeta = useMemo(() => criteriaData?.data, [criteriaData]);

  const handleDelete = async (criteriaItem: UniversityAdmissionCriteria) => {
    confirm.confirm(async () => {
      try {
        await deleteCriteriaMutation.mutateAsync({ id: criteriaItem.id! });
        toast.success('Criteria deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete criteria');
        console.error('Delete error:', error);
      }
    });
  };

  const columns = useMemo<TableColumn<UniversityAdmissionCriteria>[]>(
    () => [
      {
        key: 'title',
        title: 'Title',
        render: (_, row) => row.title,
      },
      {
        key: 'requirement',
        title: 'Requirement',
        render: (_, row) => row.requirement?.requirement_name ?? 'N/A',
      },
      {
        key: 'score_range',
        title: 'Score Range',
        render: (_, row) => `${row.min_score} - ${row.max_score}`,
      },
      {
        key: 'weight',
        title: 'Weight',
        render: (_, row) => row.weight,
      },
      {
        key: 'file_suffix',
        title: 'File Suffix',
        render: (_, row) => row.file_suffix,
      },
      {
        key: 'is_active',
        title: 'Status',
        render: (_, row) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              row.is_active
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
            }`}
          >
            {row.is_active ? 'Active' : 'Inactive'}
          </span>
        ),
      },
      {
        key: 'actions',
        title: 'Actions',
        align: 'right',
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
                icon: <Trash2Icon />,
                variant: 'destructive',
                onClick: () => {
                  handleDelete(row);
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admission Criteria</h2>
          <p className="text-muted-foreground">
            Manage admission criteria and requirements for evaluation
          </p>
        </div>
        <Button onClick={() => controller.openFn()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Criteria
        </Button>
      </div>
      <Table
        columns={columns}
        rows={criteria}
        loading={isLoading}
        showPagination={true}
        pagination={paginationMeta}
        onPageChange={setPage}
        emptyState="No criteria found. Add a criteria to get started."
      />
      <UniversityAdmissionCriteriaModal
        controller={controller}
        universityAdmissionId={parsedUniversityAdmissionId}
        onSubmit={() => refetch()}
      />
    </div>
  );
}
