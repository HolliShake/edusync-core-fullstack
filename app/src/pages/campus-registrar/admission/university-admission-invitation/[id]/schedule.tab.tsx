import { useConfirm } from '@/components/confirm.provider';
import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import { Button } from '@/components/ui/button';
import UniversityAdmissionScheduleModal from '@/components/university-admission-schedule/university-admission-schedule.modal';
import { dateToWord } from '@/lib/formatter';
import { decryptIdFromUrl } from '@/lib/hash';
import {
  useDeleteUniversityAdmissionSchedule,
  useGetUniversityAdmissionSchedulePaginated,
} from '@rest/api';
import type { UniversityAdmissionSchedule } from '@rest/models';
import { EditIcon, EllipsisIcon, Plus, Trash2Icon } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';

export default function CampusRegistrarUniversityAdmissionDetailScheduleTab(): React.ReactNode {
  const { universityAdmissionId } = useParams<{ universityAdmissionId: string }>();
  const [page, setPage] = useState(1);
  const [rows] = useState(10);

  const parsedUniversityAdmissionId = useMemo(
    () => decryptIdFromUrl(String(universityAdmissionId)),
    [universityAdmissionId]
  );

  const {
    data: schedulesData,
    refetch,
    isLoading,
  } = useGetUniversityAdmissionSchedulePaginated({
    page,
    rows,
    'filter[university_admission_id]': Number(parsedUniversityAdmissionId),
  });

  const confirm = useConfirm();

  const deleteScheduleMutation = useDeleteUniversityAdmissionSchedule();

  const controller = useModal<UniversityAdmissionSchedule>();

  const schedules = useMemo(() => schedulesData?.data?.data ?? [], [schedulesData]);
  const paginationMeta = useMemo(() => schedulesData?.data, [schedulesData]);

  const handleDelete = async (schedule: UniversityAdmissionSchedule) => {
    confirm.confirm(async () => {
      try {
        await deleteScheduleMutation.mutateAsync({ id: schedule.id! });
        toast.success('Schedule deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete schedule');
        console.error('Delete error:', error);
      }
    });
  };

  const columns = useMemo<TableColumn<UniversityAdmissionSchedule>[]>(
    () => [
      {
        key: 'testing_center_id',
        title: 'Testing Center',
        render: (_, row) => {
          const testingCenter = row.testing_center;
          if (testingCenter?.room?.building?.name && testingCenter?.room?.room_code) {
            return `${testingCenter.room.building.name} - ${testingCenter.room.room_code}`;
          }
          return testingCenter?.code ?? `Testing Center #${row.testing_center_id}`;
        },
      },
      {
        key: 'start_date',
        title: 'Start Date',
        render: (_, row) => dateToWord(row.start_date),
      },
      {
        key: 'end_date',
        title: 'End Date',
        render: (_, row) => dateToWord(row.end_date),
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
          <h2 className="text-2xl font-bold tracking-tight">Schedules</h2>
          <p className="text-muted-foreground">
            Manage admission testing schedules and testing centers
          </p>
        </div>
        <Button onClick={() => controller.openFn()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Schedule
        </Button>
      </div>
      <Table
        columns={columns}
        rows={schedules}
        loading={isLoading}
        showPagination={true}
        pagination={paginationMeta}
        onPageChange={setPage}
        emptyState="No schedules found. Add a schedule to get started."
      />
      <UniversityAdmissionScheduleModal
        controller={controller}
        universityAdmissionId={parsedUniversityAdmissionId}
        onSubmit={() => refetch()}
      />
    </div>
  );
}
