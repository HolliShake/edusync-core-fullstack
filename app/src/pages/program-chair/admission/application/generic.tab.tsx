import Table, { type TableColumn } from '@/components/custom/table.component';
import SelectAdmissionSchedule from '@/components/program-chair-only/admission/admission-schedule.select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth.context';
import { encryptIdForUrl } from '@/lib/hash';
import { useGetAdmissionApplicationPaginated } from '@rest/api';
import { AdmissionApplicationLogTypeEnum } from '@rest/models';
import type { AdmissionApplication } from '@rest/models/admissionApplication';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

export default function ProgramChairAdmissionApplicationGenericTab({
  status,
}: {
  status: AdmissionApplicationLogTypeEnum;
}): React.ReactNode {
  const [page, setPage] = useState(1);
  const [rows] = useState(10);
  const [admissionScheduleId, setadmissionScheduleId] = useState<number | undefined>(undefined);

  const navigate = useNavigate();

  const { session } = useAuth();

  const { data: applications, isLoading: isLoadingApplications } =
    useGetAdmissionApplicationPaginated(
      {
        'filter[academic_program_id]': Number(session?.active_academic_program),
        'filter[admission_schedule_id]': Number(admissionScheduleId),
        'filter[latest_status]': status,
        page,
        rows,
      },
      { query: { enabled: !!admissionScheduleId || !!session?.active_academic_program } }
    );

  const getStatusVariant = (status: AdmissionApplicationLogTypeEnum) => {
    switch (status) {
      case AdmissionApplicationLogTypeEnum.accepted:
        return 'default'; // green - final acceptance
      case AdmissionApplicationLogTypeEnum.approved:
        return 'secondary'; // blue/purple - approved for evaluation
      case AdmissionApplicationLogTypeEnum.submitted:
        return 'outline'; // neutral - initial state
      case AdmissionApplicationLogTypeEnum.rejected:
      case AdmissionApplicationLogTypeEnum.cancelled:
        return 'destructive'; // red - negative outcome
      default:
        return 'outline';
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const columns = useMemo<TableColumn<AdmissionApplication>[]>(
    () => [
      {
        key: 'name',
        title: 'Name',
        render: (_, row) =>
          `${row.first_name} ${row.middle_name ? row.middle_name + ' ' : ''}${row.last_name}`,
      },
      {
        key: 'email',
        title: 'Email',
      },
      {
        key: 'phone',
        title: 'Phone',
      },
      {
        key: 'academicProgram',
        title: 'Program',
        render: (_, row) => row.admission_schedule?.academic_program?.program_name ?? 'N/A',
      },
      {
        key: 'schoolYear',
        title: 'School Year',
        render: (_, row) =>
          row.admission_schedule?.university_admission?.school_year?.name ?? 'N/A',
      },
      {
        key: 'status',
        title: 'Status',
        render: (_, row) => {
          const status = row.latest_status || '';
          return (
            <Badge variant={getStatusVariant(status as AdmissionApplicationLogTypeEnum)}>
              {status ? formatStatus(status) : 'No Status'}
            </Badge>
          );
        },
      },
    ],
    []
  );

  const tableItems = useMemo(() => applications?.data?.data ?? [], [applications]);
  const paginationMeta = useMemo(() => applications?.data, [applications]);

  if (isLoadingApplications) {
    return (
      <div className="space-y-2">
        <div className="w-fit">
          <Skeleton className="h-10 w-[200px]" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Table Header Skeleton */}
              <div className="flex gap-4 pb-4 border-b">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              {/* Table Rows Skeleton */}
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex gap-4 py-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="w-fit">
        <SelectAdmissionSchedule
          value={admissionScheduleId?.toString()}
          onValueChange={(value) => setadmissionScheduleId(parseInt(value))}
          placeholder="Select school year"
        />
      </div>
      <Table
        columns={columns}
        rows={tableItems}
        itemsPerPage={rows}
        pagination={paginationMeta}
        onPageChange={setPage}
        showPagination={true}
        onClickRow={(row) => {
          navigate(`/program-chair/admission/application/${encryptIdForUrl(row.id as number)}`);
        }}
      />
    </div>
  );
}
