import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import TitledPage from '@/components/pages/titled.page';
import RequirementModal from '@/components/requirement/requirement.modal';
import { Button } from '@/components/ui/button';
import { useGetRequirementPaginated } from '@rest/api';
import { RequirementTypeEnum, type Requirement } from '@rest/models';
import { DeleteIcon, EditIcon, EllipsisIcon } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';

export default function AdminRequirements(): React.ReactNode {
  const [page, setPage] = useState(1);
  const [rows] = useState(10);

  const { data: requirements, refetch } = useGetRequirementPaginated({
    page,
    rows,
  });

  const controller = useModal<Requirement>();

  const columns = useMemo<TableColumn<Requirement>[]>(
    () => [
      {
        key: 'requirement_name',
        title: 'Name',
        dataIndex: 'requirement_name',
      },
      {
        key: 'description',
        title: 'Description',
        dataIndex: 'description',
      },
      {
        key: 'requirement_type',
        title: 'Type',
        dataIndex: 'requirement_type',
        render: (value) => (
          <span className="capitalize">{RequirementTypeEnum[value as RequirementTypeEnum]}</span>
        ),
      },
      {
        key: 'is_mandatory',
        title: 'Mandatory',
        dataIndex: 'is_mandatory',
        render: (value) => <span>{value ? 'Yes' : 'No'}</span>,
      },
      {
        key: 'is_active',
        title: 'Active',
        dataIndex: 'is_active',
        render: (value) => <span>{value ? 'Yes' : 'No'}</span>,
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
                  console.log('Delete', row);
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

  const tableRequirements = useMemo(() => requirements?.data?.data ?? [], [requirements]);
  const paginationMeta = useMemo(() => {
    return requirements?.data;
  }, [requirements]);

  return (
    <TitledPage title="Requirements" description="Manage your requirements">
      <Button onClick={() => controller.openFn()}>Add Requirement</Button>
      <Table
        columns={columns}
        rows={tableRequirements}
        itemsPerPage={rows}
        pagination={paginationMeta}
        onPageChange={setPage}
        showPagination={true}
      />
      <RequirementModal
        controller={controller}
        onSubmit={() => {
          refetch();
        }}
      />
    </TitledPage>
  );
}
