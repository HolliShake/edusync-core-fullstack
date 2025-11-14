import { useConfirm } from '@/components/confirm.provider';
import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import TitledPage from '@/components/pages/titled.page';
import GradebookModal from '@/components/program-chair-only/gradebook/gradebook.modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth.context';
import { encryptIdForUrl } from '@/lib/hash';
import { useDeleteGradeBook, useGetGradeBookPaginated } from '@rest/api';
import type { GradeBook } from '@rest/models';
import { DeleteIcon, EditIcon, EllipsisIcon, EyeIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function ProgramChairGradebookPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rows] = useState(10);

  const controller = useModal<GradeBook>();
  const confirm = useConfirm();

  const {
    data: gradebooksResponse,
    isLoading,
    refetch,
  } = useGetGradeBookPaginated(
    {
      'filter[academic_program_id]': session?.active_academic_program ?? 0,
      'filter[is_template]': true,
      page,
      rows,
    },
    { query: { enabled: !!session?.active_academic_program } }
  );

  const { mutateAsync: deleteGradeBook } = useDeleteGradeBook();

  const handleDelete = async (gradebook: GradeBook) => {
    confirm.confirm(async () => {
      try {
        await deleteGradeBook({ id: gradebook.id as number });
        toast.success('Gradebook deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete gradebook');
        console.error('Delete error:', error);
      }
    });
  };

  const columns = useMemo<TableColumn<GradeBook>[]>(
    () => [
      {
        key: 'title',
        title: 'Title',
        render: (_, row) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.title}</span>
            {row.academic_program?.program_name && (
              <span className="text-xs text-muted-foreground">
                {row.academic_program.program_name}
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'is_template',
        title: 'Type',
        render: (_, row) => (
          <span className="text-sm">{row.is_template ? 'Template' : 'Section-specific'}</span>
        ),
      },
      {
        key: 'gradebook_items',
        title: 'Items',
        render: (_, row) => (
          <span className="text-sm">{row.gradebook_items?.length ?? 0} item(s)</span>
        ),
      },
      {
        key: 'fully_setup',
        title: 'Status',
        render: (_, row) => (
          <Badge variant={row.fully_setup ? 'default' : 'secondary'}>
            {row.fully_setup ? 'Complete' : 'Incomplete'}
          </Badge>
        ),
      },
      {
        key: 'actions',
        title: 'Actions',
        render: (_, row) => (
          <Menu
            items={[
              {
                label: 'View Details',
                icon: <EyeIcon />,
                variant: 'default',
                onClick: () => {
                  navigate(`/program-chair/gradebook/${encryptIdForUrl(row.id as number)}`);
                },
              },
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
    [controller, confirm]
  );

  const tableGradebooks = useMemo(() => gradebooksResponse?.data?.data ?? [], [gradebooksResponse]);

  const paginationMeta = useMemo(() => {
    return gradebooksResponse?.data;
  }, [gradebooksResponse]);

  return (
    <TitledPage title="Gradebook" description="Manage your gradebook templates">
      <div className="space-y-4">
        <Button onClick={() => controller.openFn()}>Create Gradebook</Button>

        <Table
          columns={columns}
          rows={tableGradebooks}
          itemsPerPage={rows}
          pagination={paginationMeta}
          onPageChange={setPage}
          showPagination={true}
          loading={isLoading}
        />
      </div>

      <GradebookModal
        controller={controller}
        onSubmit={() => {
          refetch();
        }}
      />
    </TitledPage>
  );
}
