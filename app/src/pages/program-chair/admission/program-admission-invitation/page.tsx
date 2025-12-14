import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import TitledPage from '@/components/pages/titled.page';
import AdmissionScheduleModal from '@/components/program-chair-only/admission/admission-schedule.modal';
import SelectUniversityAdmission from '@/components/shared/university-admission.select';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth.context';
import { dateToWord } from '@/lib/formatter';
import { encryptIdForUrl } from '@/lib/hash';
import { useDeleteAdmissionSchedule, useGetAdmissionSchedulePaginated } from '@rest/api';
import type { AdmissionSchedule } from '@rest/models/admissionSchedule';
import { DeleteIcon, EditIcon, EllipsisIcon, EyeIcon } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function ProgramChairAdmissionInvitation(): React.ReactNode {
  const { session } = useAuth();
  const [page, setPage] = useState(1);
  const [rows] = useState(10);
  const [universityAdmissionId, setUniversityAdmissionId] = useState<number | undefined>(undefined);

  const navigate = useNavigate();

  const { data: admissionSchedules, refetch } = useGetAdmissionSchedulePaginated(
    {
      'filter[academic_program_id]': Number(session?.active_academic_program),
      ...(universityAdmissionId && { 'filter[university_admission_id]': universityAdmissionId }),
      sort: '-start_date',
      page,
      rows,
    },
    {
      query: { enabled: !!session?.active_academic_program && universityAdmissionId !== undefined },
    }
  );

  const { mutateAsync: deleteAdmissionSchedule } = useDeleteAdmissionSchedule();

  const controller = useModal<AdmissionSchedule>();

  const handleDelete = async (id: number) => {
    try {
      await deleteAdmissionSchedule({ id });
      toast.success('Admission schedule deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete admission schedule');
    }
  };

  const columns = useMemo<TableColumn<AdmissionSchedule>[]>(
    () => [
      // {
      //   key: 'school_year',
      //   title: 'School Year',
      //   render: (_, row) => row.university_admission?.school_year?.name ?? 'N/A',
      // },
      // {
      //   key: 'academic_program',
      //   title: 'Academic Program',
      //   render: (_, row) => row.academic_program?.program_name ?? 'Unknown',
      // },
      {
        key: 'intake_limit',
        title: 'Intake Limit',
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
        render: (_, row) => (
          <Menu
            items={[
              {
                label: 'View',
                icon: <EyeIcon />,
                variant: 'default',
                onClick: () => {
                  console.log(window.location.pathname);
                  navigate(`${window.location.pathname}/${encryptIdForUrl(row.id as number)}`);
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
                  if (row.id) {
                    handleDelete(row.id);
                  }
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

  const tableItems = useMemo(() => admissionSchedules?.data?.data ?? [], [admissionSchedules]);
  const paginationMeta = useMemo(() => {
    return admissionSchedules?.data;
  }, [admissionSchedules]);

  return (
    <TitledPage
      title="Admission Schedule"
      description="View and manage admission schedules and events"
    >
      <div className="flex gap-4 items-center mb-4">
        <SelectUniversityAdmission
          className="w-[250px]"
          placeholder="Filter by University Admission"
          value={universityAdmissionId ? String(universityAdmissionId) : undefined}
          onValueChange={(value) => {
            setUniversityAdmissionId(Number(value));
            setPage(1);
          }}
        />
        <Button onClick={() => controller.openFn()}>Add Admission Schedule</Button>
      </div>
      <Table
        columns={columns}
        rows={tableItems}
        itemsPerPage={rows}
        pagination={paginationMeta}
        onPageChange={setPage}
        showPagination={true}
      />
      <AdmissionScheduleModal
        controller={controller}
        onSubmit={() => {
          refetch();
        }}
      />
    </TitledPage>
  );
}
