import Menu from '@/components/custom/menu.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import SelectUniversityAdmission from '@/components/shared/university-admission.select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth.context';
import { encryptIdForUrl } from '@/lib/hash';
import {
  useCreateUniversityAdmissionApplicationLog,
  useGetUniversityAdmissionApplicationPaginated,
} from '@rest/api';
import { AdmissionApplicationLogTypeEnum, type UniversityAdmissionApplication } from '@rest/models';
import { Check, EllipsisIcon, X } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function CampusRegistrarAdmissionApplicationGenericTab({
  status,
}: {
  status: AdmissionApplicationLogTypeEnum;
}): React.ReactNode {
  const [page, setPage] = useState(1);
  const [rows] = useState(10);
  const [universityAdmissionId, setUniversityAdmissionId] = useState<number | undefined>(undefined);

  const navigate = useNavigate();

  const { session } = useAuth();

  const {
    data: applications,
    isLoading: isLoadingApplications,
    refetch,
  } = useGetUniversityAdmissionApplicationPaginated(
    {
      'filter[university_admission_id]': Number(universityAdmissionId),
      'filter[latest_status]': status,
      page,
      rows,
    },
    { query: { enabled: !!universityAdmissionId || !!session?.active_academic_program } }
  );

  const { mutateAsync: createUniversityAdmissionApplicationLog, isPending: isCreatingLog } =
    useCreateUniversityAdmissionApplicationLog();

  const hideAction = useMemo(() => {
    return status !== AdmissionApplicationLogTypeEnum.submitted;
  }, [status]);

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

  const handleCreateLog = async (applicationId: number, type: AdmissionApplicationLogTypeEnum) => {
    try {
      await createUniversityAdmissionApplicationLog({
        data: {
          university_admission_application_id: applicationId,
          user_id: Number(session?.id),
          type,
          note:
            type === AdmissionApplicationLogTypeEnum.approved
              ? 'Approved by authorized person'
              : 'Rejected by authorized person',
        },
      });
      refetch();
      toast.success('Log created successfully');
    } catch (error) {
      toast.error('Failed to create log');
    }
  };

  const columns = useMemo<TableColumn<UniversityAdmissionApplication>[]>(
    () => [
      //   {
      //     key: 'university_admission',
      //     title: 'University Admission',
      //     render: (_, row) => row.university_admission?.title ?? 'N/A',
      //   },
      {
        key: 'temporary_id',
        title: 'Temporary ID',
      },
      {
        key: 'name',
        title: 'Name',
        render: (_, row) => row.user?.name ?? 'N/A',
      },
      {
        key: 'is_passed',
        title: 'Passed',
        render: (_, row) => (row.is_passed ? 'Yes' : 'No'),
      },
      {
        key: 'score',
        title: 'Score',
        render: (_, row) => row.score ?? 'N/A',
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
      ...(!hideAction
        ? [
            {
              key: 'actions',
              title: 'Actions',
              render: (_: any, row: UniversityAdmissionApplication) => {
                return (
                  <Menu
                    trigger={
                      <Button variant="outline" size="icon">
                        <EllipsisIcon />
                      </Button>
                    }
                    items={[
                      {
                        label: 'Approve',
                        icon: <Check className="h-4 w-4" />,
                        disabled: isCreatingLog,
                        onClick: () => {
                          // Handle approve action
                          handleCreateLog(row.id!, AdmissionApplicationLogTypeEnum.approved);
                        },
                      },
                      {
                        label: 'Reject',
                        icon: <X className="h-4 w-4" />,
                        disabled: isCreatingLog,
                        onClick: () => {
                          // Handle reject action
                          handleCreateLog(row.id!, AdmissionApplicationLogTypeEnum.rejected);
                        },
                        variant: 'destructive',
                      },
                    ]}
                  />
                );
              },
            },
          ]
        : []),
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
        <SelectUniversityAdmission
          value={universityAdmissionId?.toString()}
          onValueChange={(value) => setUniversityAdmissionId(parseInt(value))}
          placeholder="Select university admission"
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
          navigate(`/campus-registrar/admission/application/${encryptIdForUrl(row.id as number)}`);
        }}
      />
    </div>
  );
}
