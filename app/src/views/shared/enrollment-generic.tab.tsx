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
  EnrollmentLogActionEnum,
  type EnrollmentLogAction,
} from '@/enums/enrollment-log-action-enum';
import { UserRoleEnum } from '@/enums/role-enum';
import {
  useCreateEnrollmentLog,
  useGetEnrollmentsByAcademicProgramIdGroupedByUser,
  useGetEnrollmentsByCampusIdGroupedByUser,
  useGetScholasticFilterByCampusId,
  useGetScholasticFilterByProgramId,
  useGetSchoolYearPaginated,
} from '@rest/api';
import {
  UserRole,
  type Enrollment,
  type GetScholasticFilterByCampusId200,
  type GetScholasticFilterByProgramId200,
  type KeyValuePair,
  type SchoolYear,
} from '@rest/models';
import {
  AlertCircleIcon,
  BookOpenIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  DeleteIcon,
  EditIcon,
  EllipsisIcon,
  InboxIcon,
  UserIcon,
  XCircleIcon,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';

export default function EnrollmentGenericTab({
  role,
  status,
  needsAction = true,
}: {
  role: UserRole;
  status: EnrollmentLogAction;
  needsAction?: boolean;
}): React.ReactNode {
  const { session } = useAuth();
  const [page] = React.useState(1);
  const [rows] = React.useState(10);
  const [schoolYearId, setSchoolYearId] = React.useState<string | undefined>(undefined);
  const [yearId, setYearId] = React.useState<string | undefined>(undefined);
  const [termId, setTermId] = React.useState<string | undefined>(undefined);

  const { mutateAsync: programChairApproveSingle, isPending: isApprovingSingle } =
    useCreateEnrollmentLog();

  const { mutateAsync: registrarRejectSingle, isPending: isRejectingSingle } =
    useCreateEnrollmentLog();

  const { data: schoolYearResponse, isLoading: isLoadingSchoolYears } = useGetSchoolYearPaginated({
    sort: '-start_date',
    page: 1,
    rows: Number.MAX_SAFE_INTEGER,
  });

  const { data: programChairScholasticFilterResponse } = useGetScholasticFilterByProgramId(
    Number(session?.active_academic_program),
    {
      'filter[latest_status]': status,
      'filter[school_year_id]': Number(schoolYearId),
    },
    {
      query: {
        enabled:
          role === UserRoleEnum.PROGRAM_CHAIR &&
          !!schoolYearId &&
          !!session?.active_academic_program,
      },
    }
  );

  const { data: campusScholasticFilterResponse } = useGetScholasticFilterByCampusId(
    Number(session?.active_campus),
    {
      'filter[latest_status]': status,
      'filter[school_year_id]': Number(schoolYearId),
    },
    {
      query: {
        enabled:
          role === UserRoleEnum.CAMPUS_REGISTRAR && !!schoolYearId && !!session?.active_campus,
      },
    }
  );

  const scholasticFilterResponse = useMemo<
    (GetScholasticFilterByCampusId200 | GetScholasticFilterByProgramId200) | undefined
  >(() => {
    if (role === UserRoleEnum.PROGRAM_CHAIR) return programChairScholasticFilterResponse;
    if (role === UserRoleEnum.CAMPUS_REGISTRAR) return campusScholasticFilterResponse;
    return undefined;
  }, [role, programChairScholasticFilterResponse, campusScholasticFilterResponse]);

  const {
    data: programChairEnrollmentResponse,
    isLoading: isLoadingProgramChairEnrollments,
    refetch: refetchProgramChairEnrollments,
  } = useGetEnrollmentsByAcademicProgramIdGroupedByUser(
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
        enabled:
          role === UserRoleEnum.PROGRAM_CHAIR &&
          !!schoolYearId &&
          !!session?.active_academic_program &&
          !!yearId &&
          !!termId,
      },
    }
  );

  const {
    data: campusRegistrarEnrollmentResponse,
    isLoading: isLoadingCampusRegistrarEnrollments,
    refetch: refetchCampusRegistrarEnrollments,
  } = useGetEnrollmentsByCampusIdGroupedByUser(
    Number(session?.active_campus),
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
        enabled:
          role === UserRoleEnum.CAMPUS_REGISTRAR &&
          !!schoolYearId &&
          !!session?.active_campus &&
          !!yearId &&
          !!termId,
      },
    }
  );

  const controller = useModal<any>();

  const enrollmentResponse = useMemo(() => {
    if (role === UserRoleEnum.PROGRAM_CHAIR) return programChairEnrollmentResponse;
    if (role === UserRoleEnum.CAMPUS_REGISTRAR) return campusRegistrarEnrollmentResponse;
    return undefined;
  }, [role, programChairEnrollmentResponse, campusRegistrarEnrollmentResponse]);

  const isLoadingEnrollments = useMemo(() => {
    return isLoadingProgramChairEnrollments || isLoadingCampusRegistrarEnrollments;
  }, [isLoadingProgramChairEnrollments, isLoadingCampusRegistrarEnrollments]);

  const refetchEnrollments = useCallback(() => {
    if (role === UserRoleEnum.PROGRAM_CHAIR) refetchProgramChairEnrollments();
    if (role === UserRoleEnum.CAMPUS_REGISTRAR) refetchCampusRegistrarEnrollments();
  }, [role, refetchProgramChairEnrollments, refetchCampusRegistrarEnrollments]);

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

  const getStudentStatus = (enrollmentList: Enrollment[]) => {
    if (!enrollmentList || enrollmentList.length === 0) return 'secondary';

    const hasValidated = enrollmentList.some((e: Enrollment) => e.validated && !e.is_dropped);
    const hasPending = enrollmentList.some((e: Enrollment) => !e.validated && !e.is_dropped);

    if (hasValidated && hasPending) {
      return 'secondary'; // Partial
    } else if (hasValidated) {
      return 'default'; // Validated
    } else {
      return 'secondary'; // Pending
    }
  };

  const getStudentStatusLabel = (enrollmentList: Enrollment[]) => {
    if (!enrollmentList || enrollmentList.length === 0) return 'No Enrollments';

    const hasValidated = enrollmentList.some(
      (e: Enrollment) =>
        e.validated &&
        e.section?.curriculum_detail?.term_order == termId &&
        e.section?.curriculum_detail?.year_order == yearId &&
        !e.is_dropped
    );
    const hasPending = enrollmentList.some(
      (e: Enrollment) =>
        !e.validated &&
        !e.is_dropped &&
        e.section?.curriculum_detail?.term_order == termId &&
        e.section?.curriculum_detail?.year_order == yearId
    );

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
      case EnrollmentLogActionEnum.enroll:
        return 'default' as const;
      case EnrollmentLogActionEnum.dropped:
        return 'secondary' as const;
      case EnrollmentLogActionEnum.program_chair_approved:
      case EnrollmentLogActionEnum.registrar_approved:
        return 'default' as const;
      case EnrollmentLogActionEnum.program_chair_dropped_approved:
      case EnrollmentLogActionEnum.registrar_dropped_approved:
        return 'destructive' as const;
      default:
        return 'outline' as const;
    }
  };

  const getEmptyStateContent = () => {
    switch (status) {
      case EnrollmentLogActionEnum.enroll:
        return {
          icon: <ClockIcon className="h-16 w-16 text-muted-foreground/50" />,
          title: 'No Pending Enrollments',
          description:
            'All enrollment requests have been processed. Check back later for new submissions.',
        };
      case EnrollmentLogActionEnum.dropped:
        return {
          icon: <XCircleIcon className="h-16 w-16 text-muted-foreground/50" />,
          title: 'No Drop Requests',
          description: 'There are currently no pending drop requests to review.',
        };
      case EnrollmentLogActionEnum.program_chair_approved:
        return {
          icon: <CheckCircle2Icon className="h-16 w-16 text-muted-foreground/50" />,
          title: 'No Recently Approved Enrollments',
          description:
            'No enrollments have been approved recently. Approved items will appear here.',
        };
      case EnrollmentLogActionEnum.rejected:
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

  const getApprovalAction = (): EnrollmentLogAction => {
    // Program Chair only
    if (
      role == UserRoleEnum.PROGRAM_CHAIR &&
      // User applied for enrollment
      status == EnrollmentLogActionEnum.enroll
    )
      return EnrollmentLogActionEnum.program_chair_approved;

    if (
      role == UserRoleEnum.PROGRAM_CHAIR &&
      // User requested to drop the course
      status == EnrollmentLogActionEnum.dropped
    )
      return EnrollmentLogActionEnum.program_chair_dropped_approved;

    /***********************************************************/

    // Campus Registrar only
    if (
      role == UserRoleEnum.CAMPUS_REGISTRAR &&
      // Must be approved by program chair first
      status == EnrollmentLogActionEnum.program_chair_approved
    )
      return EnrollmentLogActionEnum.registrar_approved;
    if (
      role == UserRoleEnum.CAMPUS_REGISTRAR &&
      // Must be approved by program chair first
      status == EnrollmentLogActionEnum.program_chair_dropped_approved
    )
      return EnrollmentLogActionEnum.registrar_dropped_approved;

    throw new Error('Invalid status');
  };

  const programChairApproveSingleCallback = async (enrollment: Enrollment) => {
    if (!enrollment.is_enrollment_valid) return toast.error('Enrollment is not valid');
    try {
      await programChairApproveSingle({
        data: {
          enrollment_id: enrollment.id!,
          user_id: session?.id!,
          action: getApprovalAction(),
          note: 'Approved by program chair',
        },
      });
      toast.success('Enrollment approved successfully');
      refetchEnrollments();
    } catch (error) {
      console.error('Error approving enrollment:', error);
      toast.error('Failed to approve enrollment');
    }
  };

  const registrarRejectSingleCallback = async (enrollment: Enrollment) => {
    if (!enrollment.is_enrollment_valid) return toast.error('Enrollment is not valid');
    try {
      await registrarRejectSingle({
        data: {
          enrollment_id: enrollment.id!,
          user_id: session?.id!,
          action: getApprovalAction(),
          note: 'Rejected by registrar',
        },
      });
      toast.success('Enrollment rejected successfully');
      refetchEnrollments();
    } catch (error) {
      console.error('Error rejecting enrollment:', error);
      toast.error('Failed to reject enrollment');
    }
  };

  if (isLoadingEnrollments || isLoadingSchoolYears) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[150px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right space-y-2">
                      <Skeleton className="h-4 w-20 ml-auto" />
                      <Skeleton className="h-6 w-24 ml-auto" />
                    </div>
                    <Skeleton className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Section with improved visual hierarchy */}
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filter Options</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                School Year
              </label>
              <Select
                options={schoolYearsList}
                value={schoolYearId}
                onValueChange={(value) => setSchoolYearId(value)}
              />
            </div>
            {yearsList.length > 0 && (
              <div className="flex-1 min-w-[150px]">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Year Level
                </label>
                <Select
                  options={yearsList}
                  value={yearId}
                  onValueChange={(value) => setYearId(value)}
                />
              </div>
            )}
            {termsList.length > 0 && (
              <div className="flex-1 min-w-[150px]">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Term
                </label>
                <Select
                  options={termsList}
                  value={termId}
                  onValueChange={(value) => setTermId(value)}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {Object.keys(groupedData).length > 0 && (
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {Object.keys(groupedData).length}
              </span>{' '}
              {Object.keys(groupedData).length === 1 ? 'student' : 'students'} found
            </span>
          </div>
        </div>
      )}

      {/* Student List */}
      <div className="space-y-3">
        <Accordion type="single" collapsible className="w-full space-y-3">
          {Object.entries(groupedData).map(
            ([studentName, enrollmentList]: [string, Enrollment[]]) => {
              const firstEnrollment = enrollmentList[0];
              const user = firstEnrollment?.user;

              return (
                <AccordionItem
                  key={studentName}
                  value={studentName}
                  className="border-2 rounded-xl overflow-hidden bg-card hover:border-primary/50 transition-all duration-200"
                >
                  <AccordionTrigger className="hover:no-underline px-6 py-5 [&[data-state=open]]:border-b">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 border-2 border-primary/20">
                          <UserIcon className="h-6 w-6 text-primary" />
                        </div>
                        {/* Student Info */}
                        <div className="flex flex-col gap-1.5 text-left">
                          <span className="font-semibold text-base">
                            {user?.name || studentName}
                          </span>
                          {user?.email && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                              {user.email}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Stats */}
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
                            <span>{enrollmentList?.length || 0} courses</span>
                          </div>
                          <Badge variant={getStudentStatus(enrollmentList)} className="font-medium">
                            {getStudentStatusLabel(enrollmentList)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="px-6 py-5 bg-muted/30">
                      {/* Action Menu */}
                      <div className="flex justify-end mb-4">
                        <Menu
                          items={[
                            {
                              label: 'View Details',
                              icon: <EditIcon className="h-4 w-4" />,
                              variant: 'default',
                              onClick: () => {
                                controller.openFn({ user, enrollments: enrollmentList });
                              },
                            },
                            {
                              label: 'Delete',
                              icon: <DeleteIcon className="h-4 w-4" />,
                              variant: 'destructive',
                              onClick: () => {
                                console.log('Delete', { user, enrollments: enrollmentList });
                              },
                            },
                          ]}
                          trigger={
                            <Button variant="outline" size="sm" className="gap-2">
                              <EllipsisIcon className="h-4 w-4" />
                              <span className="text-xs">Actions</span>
                            </Button>
                          }
                        />
                      </div>

                      {/* Course Cards */}
                      <div className="space-y-3">
                        {enrollmentList?.map((enrollment: Enrollment, index: number) => (
                          <Card
                            key={enrollment.id || index}
                            className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
                              !enrollment.is_enrollment_valid
                                ? 'border-destructive/50 bg-destructive/5'
                                : 'hover:border-primary/30'
                            }`}
                          >
                            <CardContent className="p-5">
                              <div className="flex items-start justify-between gap-4">
                                {/* Course Info */}
                                <div className="flex-1 space-y-3">
                                  {/* Course Title */}
                                  <div className="flex items-start gap-2">
                                    <BookOpenIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 space-y-2">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="font-semibold text-base leading-tight">
                                          {enrollment.section?.curriculum_detail?.course
                                            ?.course_title ||
                                            enrollment.section?.curriculum_detail?.course
                                              ?.course_code ||
                                            'Unknown Course'}
                                        </h4>
                                        {enrollment.is_enrollment_valid ? (
                                          <CheckCircle2Icon className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                        ) : (
                                          <AlertCircleIcon className="h-4 w-4 text-destructive flex-shrink-0" />
                                        )}
                                      </div>

                                      {/* Course Details */}
                                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                                        <span className="text-xs bg-muted px-2.5 py-1 rounded-md font-medium">
                                          {enrollment.section?.curriculum_detail?.course
                                            ?.course_code || 'N/A'}
                                        </span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                          <span className="font-medium text-foreground">
                                            Section:
                                          </span>
                                          {enrollment.section?.section_name || 'N/A'}
                                        </span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                          {enrollment.section?.curriculum_detail?.year_label ||
                                            'N/A'}
                                          <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                                          {enrollment.section?.curriculum_detail?.term_label ||
                                            'N/A'}
                                        </span>
                                      </div>

                                      {/* Validation Warning */}
                                      {!enrollment.is_enrollment_valid && (
                                        <div className="flex items-center gap-2 mt-3 p-2.5 bg-destructive/10 border border-destructive/20 rounded-md">
                                          <AlertCircleIcon className="h-4 w-4 text-destructive flex-shrink-0" />
                                          <span className="text-xs text-destructive font-medium">
                                            This enrollment does not meet the requirements
                                          </span>
                                        </div>
                                      )}
                                      <Badge
                                        variant={getEnrollmentBadgeVariant(enrollment)}
                                        className="whitespace-nowrap text-xs px-2 py-0.5 font-medium"
                                      >
                                        {enrollment.latest_status_label}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                {/* Actions */}
                                {needsAction === true && (
                                  <div className="flex items-center gap-2 min-w-[120px]">
                                    <Button
                                      onClick={() => programChairApproveSingleCallback(enrollment)}
                                      disabled={
                                        isApprovingSingle || !enrollment.is_enrollment_valid
                                      }
                                      size="sm"
                                      className="gap-1.5 h-8 px-3"
                                    >
                                      {isApprovingSingle ? (
                                        <>
                                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                          <span className="text-xs">Approving...</span>
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle2Icon className="h-3.5 w-3.5" />
                                          <span className="text-xs">Approve</span>
                                        </>
                                      )}
                                    </Button>
                                    <Button
                                      onClick={() => registrarRejectSingleCallback(enrollment)}
                                      disabled={
                                        isRejectingSingle || !enrollment.is_enrollment_valid
                                      }
                                      size="sm"
                                      variant="destructive"
                                      className="gap-1.5 h-8 px-3"
                                    >
                                      {isRejectingSingle ? (
                                        <>
                                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                          <span className="text-xs">Rejecting...</span>
                                        </>
                                      ) : (
                                        <>
                                          <XCircleIcon className="h-3.5 w-3.5" />
                                          <span className="text-xs">Reject</span>
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            }
          )}
        </Accordion>

        {/* Empty State */}
        {Object.keys(groupedData).length === 0 && (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6">
              <div className="rounded-full bg-muted/50 p-6 mb-4">{getEmptyStateContent().icon}</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {getEmptyStateContent().title}
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-md leading-relaxed">
                {getEmptyStateContent().description}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
