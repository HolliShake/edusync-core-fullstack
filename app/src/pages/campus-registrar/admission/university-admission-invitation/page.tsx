import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import TitledPage from '@/components/pages/titled.page';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UniversityAdmissionModal from '@/components/university-admission/university-admission.modal';
import { dateToWord } from '@/lib/formatter';
import { encryptIdForUrl } from '@/lib/hash';
import { useGetUniversityAdmissionPaginated } from '@rest/api';
import type { UniversityAdmission } from '@rest/models';
import { DeleteIcon, EditIcon, EllipsisIcon, EyeIcon, Plus } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

export default function CampusRegistrarUniversityAdmissionInvitation(): React.ReactNode {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rows] = useState(10);

  const {
    data: admissions,
    refetch,
    isLoading: isLoadingAdmissions,
  } = useGetUniversityAdmissionPaginated({
    sort: '-open_date',
    page,
    rows,
  });

  const controller = useModal<UniversityAdmission>();

  const columns = useMemo<TableColumn<UniversityAdmission>[]>(
    () => [
      {
        key: 'title',
        title: 'Title',
        render: (_, row) => row.title ?? 'N/A',
      },
      {
        key: 'open_date',
        title: 'Open Date',
        render: (_, row) => dateToWord(row.open_date),
      },
      {
        key: 'close_date',
        title: 'Close Date',
        render: (_, row) => dateToWord(row.close_date),
      },
      {
        key: 'is_open_override',
        title: 'Status',
        render: (_, row) => (
          <Badge variant={row.is_open_override ? undefined : 'outline'}>
            {row.is_open_override ? 'Open (Override)' : row.is_ongoing ? 'Open' : 'Closed'}
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
                label: 'View',
                icon: <EyeIcon />,
                variant: 'default',
                onClick: () => {
                  navigate(
                    `/campus-registrar/admission/invitation/${encryptIdForUrl(row.id as number)}`
                  );
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

  const tableItems = useMemo(() => admissions?.data?.data ?? [], [admissions]);
  const paginationMeta = useMemo(() => {
    return admissions?.data;
  }, [admissions]);

  return (
    <TitledPage title="University Admission" description="Manage university admission invitations">
      <Button onClick={() => controller.openFn()}>
        <Plus className="h-4 w-4 mr-2" />
        Add Admission Invitation
      </Button>
      <Table
        columns={columns}
        rows={tableItems}
        itemsPerPage={rows}
        pagination={paginationMeta}
        onPageChange={setPage}
        showPagination={true}
        loading={isLoadingAdmissions}
      />
      <UniversityAdmissionModal controller={controller} onSubmit={() => refetch()} />
    </TitledPage>
  );
}
