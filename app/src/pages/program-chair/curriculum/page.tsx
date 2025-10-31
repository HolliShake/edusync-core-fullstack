import { useConfirm } from '@/components/confirm.provider';
import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import TitledPage from '@/components/pages/titled.page';
import CurriculumModal from '@/components/program-chair-only/curriculum/curriculum.modal';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth.context';
import { encryptIdForUrl } from '@/lib/hash';
import { useDeleteCurriculum, useGetCurriculumPaginated } from '@rest/api';
import type { Curriculum } from '@rest/models';
import { DeleteIcon, EditIcon, EllipsisIcon } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function ProgramChairCurriculum(): React.ReactNode {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rows] = useState(10);
  const { session } = useAuth();
  const confirm = useConfirm();

  const {
    data: curriculums,
    isLoading,
    refetch,
  } = useGetCurriculumPaginated(
    {
      'filter[academic_program_id]': session?.active_academic_program ?? 0,
      page,
      rows,
    },
    { query: { enabled: !!session?.active_academic_program } }
  );

  const controller = useModal<Curriculum>();
  const { mutateAsync: deleteCurriculum } = useDeleteCurriculum();

  const handleModalSubmit = () => {
    refetch();
  };

  const handleDelete = async (curriculum: Curriculum) => {
    confirm.confirm(async () => {
      try {
        await deleteCurriculum({ id: curriculum.id ?? 0 });
        toast.success('Curriculum deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete curriculum');
        console.error('Delete error:', error);
      }
    });
  };

  const columns = useMemo<TableColumn<Curriculum>[]>(
    () => [
      {
        key: 'curriculum_code',
        title: 'Code',
        dataIndex: 'curriculum_code',
      },
      {
        key: 'curriculum_name',
        title: 'Name',
        dataIndex: 'curriculum_name',
      },
      {
        key: 'description',
        title: 'Description',
        dataIndex: 'description',
      },
      {
        key: 'effective_year',
        title: 'Effective Year',
        dataIndex: 'effective_year',
      },
      {
        key: 'status',
        title: 'Status',
        dataIndex: 'status',
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
  const tableItems = useMemo(() => curriculums?.data?.data ?? [], [curriculums]);
  const paginationMeta = useMemo(() => {
    return curriculums?.data;
  }, [curriculums]);

  return (
    <TitledPage title="Curriculum" description="Manage your curriculum">
      <Button onClick={() => controller.openFn()}>Add Curriculum</Button>
      <Table
        columns={columns}
        rows={tableItems}
        itemsPerPage={rows}
        pagination={paginationMeta}
        onPageChange={setPage}
        showPagination={true}
        loading={isLoading}
        onClickRow={(row) => {
          navigate(`/program-chair/curriculum/${encryptIdForUrl(row.id as number)}`);
        }}
      />
      <CurriculumModal controller={controller} onSubmit={handleModalSubmit} />
    </TitledPage>
  );
}
