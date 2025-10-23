import Select from '@/components/custom/select.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth.context';
import { type AdmissionApplicationLogType } from '@/enums/admission-application-log-type-enum';
import { encryptIdForUrl } from '@/lib/hash';
import { useGetAdmissionApplicationPaginated, useGetSchoolYearPaginated } from '@rest/api';
import type { SchoolYear } from '@rest/models';
import type { AdmissionApplication } from '@rest/models/admissionApplication';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

export default function ProgramChairAdmissionApplicationGenericTab({
  status,
}: {
  status: AdmissionApplicationLogType;
}): React.ReactNode {
  const [page, setPage] = useState(1);
  const [rows] = useState(10);
  const [schoolYearId, setSchoolYearId] = useState<number | undefined>(undefined);

  const navigate = useNavigate();

  const { session } = useAuth();

  const { data: applications } = useGetAdmissionApplicationPaginated(
    {
      'filter[academic_program_id]': session?.active_academic_program ?? 0,
      'filter[school_year_id]': schoolYearId ?? 0,
      'filter[latest_status]': status,
      page,
      rows,
    },
    { query: { enabled: !!schoolYearId || !!session?.active_academic_program } }
  );

  const { data: schoolYearResponse } = useGetSchoolYearPaginated({
    sort: '-start_date',
    page: 1,
    rows: Number.MAX_SAFE_INTEGER,
  });

  const schoolYearsList = useMemo(
    () =>
      schoolYearResponse?.data?.data?.map((data: SchoolYear) => ({
        label: data.name,
        value: String(data.id),
      })) ?? [],
    [schoolYearResponse]
  );

  useEffect(() => {
    if (schoolYearsList.length > 0 && schoolYearId === undefined) {
      setSchoolYearId(parseInt(schoolYearsList[0].value));
    }
  }, [schoolYearsList, schoolYearId]);

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'default'; // green - final acceptance
      case 'approved':
        return 'secondary'; // blue/purple - approved for evaluation
      case 'submitted':
        return 'outline'; // neutral - initial state
      case 'rejected':
      case 'cancelled':
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
        key: 'pool_no',
        title: 'Pool No.',
        render: (_, row) => row.pool_no ?? 'N/A',
      },
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
        render: (_, row) => row.academicProgram?.program_name ?? 'N/A',
      },
      {
        key: 'schoolYear',
        title: 'School Year',
        render: (_, row) => row.schoolYear?.name ?? 'N/A',
      },
      {
        key: 'year',
        title: 'Year',
        render: (_, row) => row.year ?? 'N/A',
      },
      {
        key: 'status',
        title: 'Status',
        render: (_, row) => {
          const status = row.latest_status || '';
          return (
            <Badge variant={getStatusVariant(status)}>
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

  return (
    <div className="space-y-2">
      <div className="w-fit">
        <Select
          options={schoolYearsList}
          value={schoolYearId?.toString()}
          onValueChange={(value) => setSchoolYearId(parseInt(value))}
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
