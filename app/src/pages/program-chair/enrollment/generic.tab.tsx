import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Select from '@/components/custom/select.component';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth.context';
import {
  useGetEnrollmentsByAcademicProgramIdGroupedByUser,
  useGetScholasticFilter,
  useGetSchoolYearPaginated,
} from '@rest/api';
import {
  EnrollmentLogAction,
  type Enrollment,
  type KeyValuePair,
  type SchoolYear,
} from '@rest/models';
import {
  CheckCircle2Icon,
  ClockIcon,
  DeleteIcon,
  EditIcon,
  EllipsisIcon,
  InboxIcon,
  XCircleIcon,
} from 'lucide-react';
import React, { useEffect, useMemo } from 'react';

export default function ProgramChairEnrollmentGenericTab({
  status,
}: {
  status: EnrollmentLogAction;
}): React.ReactNode {
  const { session } = useAuth();
  const [page] = React.useState(1);
  const [rows] = React.useState(10);
  const [schoolYearId, setSchoolYearId] = React.useState<string | undefined>(undefined);
  const [yearId, setYearId] = React.useState<string | undefined>(undefined);
  const [termId, setTermId] = React.useState<string | undefined>(undefined);

  const { data: schoolYearResponse, isLoading: isLoadingSchoolYears } = useGetSchoolYearPaginated({
    sort: '-start_date',
    page: 1,
    rows: Number.MAX_SAFE_INTEGER,
  });

  const { data: scholasticFilterResponse } = useGetScholasticFilter(
    Number(session?.active_academic_program),
    {
      'filter[latest_status]': status,
      'filter[school_year_id]': Number(schoolYearId),
    },
    { query: { enabled: !!schoolYearId && !!session?.active_academic_program } }
  );

  const { data: enrollmentResponse, isLoading: isLoadingEnrollments } =
    useGetEnrollmentsByAcademicProgramIdGroupedByUser(
      Number(session?.active_academic_program),
      {
        'filter[latest_status]': status,
        'filter[school_year_id]': Number(schoolYearId),
        'filter[year_id]': Number(yearId),
        'filter[term_id]': Number(termId),
        page: page,
        rows: rows,
      },
      {
        query: {
          enabled: !!schoolYearId && !!session?.active_academic_program && !!yearId && !!termId,
        },
      }
    );

  const controller = useModal<any>();

  const groupedData = useMemo(() => {
    const data = enrollmentResponse?.data?.data;
    if (!data || typeof data !== 'object') return {};
    return data;
  }, [enrollmentResponse]);

  const schoolYearsList = useMemo(() => {
    return (
      schoolYearResponse?.data?.data?.map((schoolYear: SchoolYear) => ({
        label: schoolYear.name,
        value: String(schoolYear.id?.toString()),
      })) ?? []
    );
  }, [schoolYearResponse]);

  const yearsList = useMemo(() => {
    return (
      scholasticFilterResponse?.data?.year?.map((year: KeyValuePair) => ({
        label: year.label,
        value: String(year.value),
      })) ?? []
    );
  }, [scholasticFilterResponse]);

  const termsList = useMemo(() => {
    return (
      scholasticFilterResponse?.data?.term?.map((term: KeyValuePair) => ({
        label: term.label,
        value: String(term.value),
      })) ?? []
    );
  }, [scholasticFilterResponse]);

  useEffect(() => {
    if (schoolYearsList.length > 0 && schoolYearId === undefined) {
      setSchoolYearId(schoolYearsList[0].value);
    }
  }, [schoolYearsList, schoolYearId]);

  useEffect(() => {
    if (yearsList.length > 0 && yearId === undefined) {
      setYearId(yearsList[0].value);
    }
  }, [yearsList, yearId]);

  useEffect(() => {
    if (termsList.length > 0 && termId === undefined) {
      setTermId(termsList[0].value);
    }
  }, [termsList, termId]);

  // Reset year and term when school year changes
  useEffect(() => {
    setYearId(undefined);
    setTermId(undefined);
  }, [schoolYearId]);

  const getStudentStatus = (enrollmentList: any[]) => {
    if (!enrollmentList || enrollmentList.length === 0) return 'secondary';

    const hasValidated = enrollmentList.some((e: any) => e.validated && !e.is_dropped);
    const hasPending = enrollmentList.some((e: any) => !e.validated && !e.is_dropped);

    if (hasValidated && hasPending) {
      return 'secondary'; // Partial
    } else if (hasValidated) {
      return 'default'; // Validated
    } else {
      return 'secondary'; // Pending
    }
  };

  const getStudentStatusLabel = (enrollmentList: any[]) => {
    if (!enrollmentList || enrollmentList.length === 0) return 'No Enrollments';

    const hasValidated = enrollmentList.some((e: any) => e.validated && !e.is_dropped);
    const hasPending = enrollmentList.some((e: any) => !e.validated && !e.is_dropped);

    if (hasValidated && hasPending) {
      return 'Partial';
    } else if (hasValidated) {
      return 'Validated';
    } else {
      return 'Pending';
    }
  };

  const getEnrollmentBadgeVariant = (enrollment: Enrollment) => {
    const status = enrollment.latest_status;
    switch (status) {
      case EnrollmentLogAction.enroll:
        return 'default' as const;
      case EnrollmentLogAction.dropped:
        return 'secondary' as const;
      case EnrollmentLogAction.program_chair_approved:
      case EnrollmentLogAction.registrar_approved:
        return 'default' as const;
      case EnrollmentLogAction.program_chair_dropped_approved:
      case EnrollmentLogAction.registrar_dropped_approved:
        return 'destructive' as const;
      default:
        return 'outline' as const;
    }
  };

  const getEmptyStateContent = () => {
    switch (status) {
      case EnrollmentLogAction.enroll:
        return {
          icon: <ClockIcon className="h-16 w-16 text-muted-foreground/50" />,
          title: 'No Pending Enrollments',
          description:
            'All enrollment requests have been processed. Check back later for new submissions.',
        };
      case EnrollmentLogAction.dropped:
        return {
          icon: <XCircleIcon className="h-16 w-16 text-muted-foreground/50" />,
          title: 'No Drop Requests',
          description: 'There are currently no pending drop requests to review.',
        };
      case EnrollmentLogAction.program_chair_approved:
        return {
          icon: <CheckCircle2Icon className="h-16 w-16 text-muted-foreground/50" />,
          title: 'No Recently Approved Enrollments',
          description:
            'No enrollments have been approved recently. Approved items will appear here.',
        };
      case EnrollmentLogAction.rejected:
        return {
          icon: <XCircleIcon className="h-16 w-16 text-muted-foreground/50" />,
          title: 'No Rejected Enrollments',
          description: 'Great news! There are no rejected enrollment requests at this time.',
        };
      default:
        return {
          icon: <InboxIcon className="h-16 w-16 text-muted-foreground/50" />,
          title: 'No Enrollments Found',
          description: 'There are no enrollment records matching this status.',
        };
    }
  };

  if (isLoadingEnrollments || isLoadingSchoolYears) {
    return (
      <div>
        <div className="w-fit">
          <Skeleton className="h-10 w-[200px]" />
        </div>
        <div className="space-y-4 mt-4">
          <div className="w-full space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg px-4 bg-card">
                <div className="py-4">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex flex-col gap-1 text-left">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-3 w-64" />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end gap-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-row w-fit space-x-2">
        <Select
          options={schoolYearsList}
          value={schoolYearId}
          onValueChange={(value) => setSchoolYearId(value)}
        />
        {yearsList.length > 0 && (
          <Select options={yearsList} value={yearId} onValueChange={(value) => setYearId(value)} />
        )}
        {termsList.length > 0 && (
          <Select options={termsList} value={termId} onValueChange={(value) => setTermId(value)} />
        )}
      </div>
      <div className="space-y-4 mt-4">
        <Accordion type="single" collapsible className="w-full space-y-2">
          {Object.entries(groupedData).map(([studentName, enrollmentList]: [string, any]) => {
            const firstEnrollment = enrollmentList[0];
            const user = firstEnrollment?.user;

            return (
              <AccordionItem
                key={studentName}
                value={studentName}
                className="border rounded-lg px-4 bg-card"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex flex-col gap-1 text-left">
                      <span className="font-medium">{user?.name || studentName}</span>
                      {user?.email && (
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-medium">
                          {enrollmentList?.length || 0} courses
                        </span>
                        <Badge variant={getStudentStatus(enrollmentList)}>
                          {getStudentStatusLabel(enrollmentList)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2 pb-4">
                    <div className="flex justify-end mb-2">
                      <Menu
                        items={[
                          {
                            label: 'View Details',
                            icon: <EditIcon />,
                            variant: 'default',
                            onClick: () => {
                              controller.openFn({ user, enrollments: enrollmentList });
                            },
                          },
                          {
                            label: 'Delete',
                            icon: <DeleteIcon />,
                            variant: 'destructive',
                            onClick: () => {
                              console.log('Delete', { user, enrollments: enrollmentList });
                            },
                          },
                        ]}
                        trigger={
                          <Button variant="outline" size="icon">
                            <EllipsisIcon />
                          </Button>
                        }
                      />
                    </div>
                    {enrollmentList?.map((enrollment: Enrollment, index: number) => (
                      <div
                        key={enrollment.id || index}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium">
                            {enrollment.section?.curriculum_detail?.course?.course_title ||
                              enrollment.section?.curriculum_detail?.course?.course_code ||
                              'Unknown Course'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Code:{' '}
                            {enrollment.section?.curriculum_detail?.course?.course_code || 'N/A'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Section:{' '}
                            {enrollment.section?.section_name ||
                              enrollment.section?.section_name ||
                              'N/A'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {enrollment.section?.curriculum_detail?.year_label || 'N/A'}{' '}
                            <span className="mx-2">•</span>{' '}
                            {enrollment.section?.curriculum_detail?.term_label || 'N/A'}
                          </span>
                        </div>
                        <Badge variant={getEnrollmentBadgeVariant(enrollment)}>
                          {enrollment.latest_status_label}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {Object.keys(groupedData).length === 0 && (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center justify-center py-12">
              {getEmptyStateContent().icon}
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {getEmptyStateContent().title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">
                {getEmptyStateContent().description}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
