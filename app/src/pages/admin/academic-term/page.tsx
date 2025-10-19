import AcademicTermModal from '@/components/academic-term/academic-term.modal';
import { useConfirm } from '@/components/confirm.provider';
import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import TitledPage from '@/components/pages/titled.page';
import { Button } from '@/components/ui/button';
import { deleteAcademicTerm, useGetAcademicTermPaginated } from '@rest/api';
import { DeleteIcon, EditIcon, EllipsisIcon } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function AdminAcademicTerm(): React.ReactNode {
  const [page, setPage] = useState(1);
  const [rows] = useState(10);

  const { data: academicTerms, refetch } = useGetAcademicTermPaginated({
    page,
    rows,
  });

  const controller = useModal<any>();
  const confirm = useConfirm();

  const handleDelete = async (id: number) => {
    try {
      await deleteAcademicTerm(id);
      toast.success('Academic term deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete academic term');
      console.error('Delete error:', error);
    }
  };

  const columns = useMemo<TableColumn<any>[]>(
    () => [
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
      },
      {
        key: 'description',
        title: 'Description',
        dataIndex: 'description',
      },
      {
        key: 'number_of_terms',
        title: 'Number of Terms',
        dataIndex: 'number_of_terms',
      },
      {
        key: 'suffix',
        title: 'Suffix',
        dataIndex: 'suffix',
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
                  confirm.confirm(() => handleDelete(row.id! as number));
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
    [controller, confirm, handleDelete]
  );

  const tableItems = useMemo(() => academicTerms?.data?.data ?? [], [academicTerms]);
  const paginationMeta = useMemo(() => {
    return academicTerms?.data;
  }, [academicTerms]);

  return (
    <TitledPage title="Academic Terms" description="Manage academic terms">
      <Button onClick={() => controller.openFn()}>Add Academic Term</Button>
      <Table
        columns={columns}
        rows={tableItems}
        itemsPerPage={rows}
        pagination={paginationMeta}
        onPageChange={setPage}
        showPagination={true}
      />
      <AcademicTermModal
        controller={controller}
        onSubmit={() => {
          refetch();
        }}
      />
    </TitledPage>
  );
}
