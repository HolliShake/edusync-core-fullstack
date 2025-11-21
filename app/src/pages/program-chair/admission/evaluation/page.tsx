import Select from '@/components/custom/select.component';
import TitledPage from '@/components/pages/titled.page';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/auth.context';
import {
  AdmissionApplicationLogTypeEnum,
  type AdmissionApplicationLogType,
} from '@/enums/admission-application-log-type-enum';
import { formatId } from '@/lib/formatter';
import { cn } from '@/lib/utils';
import {
  useCreateOrUpdateMultipleAdmissionApplicationScores,
  useGetAcademicProgramCriteriaPaginated,
  useGetAdmissionApplicationPaginated,
  useGetAdmissionApplicationScorePaginated,
} from '@rest/api';
import type {
  AcademicProgramCriteria,
  AdmissionApplication,
  AdmissionApplicationScore,
} from '@rest/models';
import {
  CheckCircleIcon,
  FileTextIcon,
  SaveIcon,
  SearchIcon,
  UserIcon,
  XCircleIcon,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function ProgramChairAdmissionEvaluation(): React.ReactNode {
  const { session } = useAuth();
  const [selectedApplication, setSelectedApplication] = useState<AdmissionApplication | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [field, setField] = useState<AdmissionApplicationScore[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<number, string>>({});
  const [selectedStatus, setSelectedStatus] = useState<AdmissionApplicationLogType>(
    AdmissionApplicationLogTypeEnum.APPROVED
  );
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { mutateAsync: submitScores, isPending: isSubmittingScores } =
    useCreateOrUpdateMultipleAdmissionApplicationScores();

  const { data: applicationsResponse, isLoading: isLoadingApplications } =
    useGetAdmissionApplicationPaginated(
      {
        'filter[name]': debouncedSearchQuery,
        'filter[latest_status]': selectedStatus,
        'filter[academic_program_id]': Number(session?.active_academic_program),
        page: 1,
        rows: Number.MAX_SAFE_INTEGER,
      },
      { query: { enabled: !!debouncedSearchQuery || !!selectedStatus || !session } }
    );

  const { data: admissionProgramCriteriaResponse, isLoading: isLoadingCriteria } =
    useGetAcademicProgramCriteriaPaginated(
      {
        'filter[academic_program_id]': selectedApplication?.admission_schedule?.academic_program_id,
        'filter[school_year_id]': selectedApplication?.admission_schedule?.school_year_id,
        page: 1,
        rows: Number.MAX_SAFE_INTEGER,
      },
      { query: { enabled: !!selectedApplication } }
    );

  const { data: admissionApplicationScoreResponse } = useGetAdmissionApplicationScorePaginated({
    'filter[admission_application_id]': selectedApplication?.id,
    page: 1,
    rows: Number.MAX_SAFE_INTEGER,
  });

  const applicationsList = useMemo(
    () => applicationsResponse?.data?.data ?? [],
    [applicationsResponse]
  );

  const filteredApplications = useMemo(() => {
    return applicationsList;
  }, [applicationsList]);

  const admissionProgramCriteriaList = useMemo(
    () => admissionProgramCriteriaResponse?.data?.data ?? [],
    [admissionProgramCriteriaResponse]
  );

  const isPostedAll = useMemo(() => {
    return field.every((score: AdmissionApplicationScore) => score.is_posted);
  }, [field]);

  const selectOptions = useMemo(() => {
    return [
      {
        label: 'Pending', // Show as "Pending", if already approved by ProgramChair
        value: AdmissionApplicationLogTypeEnum.APPROVED,
      },
      {
        label: 'Accepted',
        value: AdmissionApplicationLogTypeEnum.ACCEPTED,
      },
    ];
  }, []);

  // Build form
  useEffect(() => {
    const scores = admissionApplicationScoreResponse?.data?.data;

    let fieldScores: AdmissionApplicationScore[] = [];

    for (let i = 0; i < admissionProgramCriteriaList.length; i++) {
      const criteria: AcademicProgramCriteria = admissionProgramCriteriaList[i];
      const score: AdmissionApplicationScore | undefined = scores?.find(
        (score) => score.academic_program_criteria_id === criteria.id
      );

      fieldScores.push({
        ...(score ?? {
          score: 0,
          comments: '',
          is_posted: false,
          academic_program_criteria_id: criteria.id!,
          admission_application_id: selectedApplication?.id!,
          user_id: session?.id ?? 0,
        }),
      });
    }
    setField(fieldScores);
    setValidationErrors({});
  }, [session, admissionApplicationScoreResponse, admissionProgramCriteriaList]);

  useEffect(() => {
    if (filteredApplications.length <= 0) {
      setSelectedApplication(null);
    }
  }, [filteredApplications]);

  // Auto-select first application when applications load
  useEffect(() => {
    if (!selectedApplication && filteredApplications.length > 0) {
      setSelectedApplication(filteredApplications[0]);
    }
  }, [filteredApplications, selectedApplication]);

  const validateScore = (index: number, value: number): string | null => {
    const criteria = admissionProgramCriteriaList[index];
    if (!criteria) return null;

    if (isNaN(value)) {
      return 'Please enter a valid number';
    }

    if (value < criteria.min_score!) {
      return `Score must be at least ${criteria.min_score}`;
    }

    if (value > criteria.max_score!) {
      return `Score cannot exceed ${criteria.max_score}`;
    }

    return null;
  };

  const onChange = (index: number, key: keyof AdmissionApplicationScore, value: any) => {
    setField((prev) => {
      const newField = [...prev];
      newField[index] = {
        ...newField[index],
        [key]: value,
      };
      return newField;
    });

    // Validate score if the changed field is 'score'
    if (key === 'score') {
      const numValue = parseFloat(value);
      const error = validateScore(index, numValue);

      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[index] = error;
        } else {
          delete newErrors[index];
        }
        return newErrors;
      });
    }
  };

  const getStatusVariant = (
    status: string
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('approved') || statusLower.includes('accepted')) {
      return 'default';
    }
    if (statusLower.includes('pending') || statusLower.includes('review')) {
      return 'secondary';
    }
    if (statusLower.includes('rejected') || statusLower.includes('denied')) {
      return 'destructive';
    }
    return 'outline';
  };

  const handleSubmitScores = async () => {
    // Validate all scores before submitting
    const errors: Record<number, string> = {};

    field.forEach((score, index) => {
      const error = validateScore(index, score.score!);
      if (error) {
        errors[index] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error('Please fix all validation errors before submitting');
      return;
    }

    try {
      await submitScores({ data: field });
      toast.success('Scores saved successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save scores');
    }
  };

  const handlePostToggle = async () => {
    // Validate all scores before posting
    const errors: Record<number, string> = {};

    field.forEach((score, index) => {
      const error = validateScore(index, score.score!);
      if (error) {
        errors[index] = error;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error('Please fix all validation errors before posting');
      return;
    }

    try {
      const newIsPosted = !isPostedAll;
      const updatedField = field.map((score) => ({
        ...score,
        is_posted: newIsPosted,
      }));

      await submitScores({ data: updatedField });
      setField(updatedField);
      toast.success(newIsPosted ? 'Scores posted successfully' : 'Scores unposted successfully');
    } catch (error) {
      console.error(error);
      toast.error(isPostedAll ? 'Failed to unpost scores' : 'Failed to post scores');
    }
  };

  return (
    <TitledPage
      title="Admission Evaluation"
      description="Review and evaluate admission applications"
    >
      <div className="flex flex-row justify-end">
        <div className="w-fit">
          <Select
            options={selectOptions}
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value as AdmissionApplicationLogType)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Applications List */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3">
          <Card className="sticky top-6">
            <CardHeader className="space-y-1 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <UserIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base">Applications</CardTitle>
                  <CardDescription className="text-xs">
                    {isLoadingApplications ? (
                      <Skeleton className="h-3 w-16" />
                    ) : (
                      `${filteredApplications.length} total`
                    )}
                  </CardDescription>
                </div>
              </div>
              <div className="pt-2">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 pl-9 text-sm"
                    disabled={isLoadingApplications}
                  />
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <ScrollArea className="max-h-[calc(100vh-22rem)]">
                <div className="space-y-1 p-2">
                  {isLoadingApplications ? (
                    // Skeleton loader for applications list
                    Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="w-full rounded-lg border border-transparent p-3">
                        <div className="space-y-2">
                          <div className="flex items-start gap-3">
                            <Skeleton className="h-10 w-10 flex-shrink-0 rounded-full" />
                            <div className="min-w-0 flex-1 space-y-1">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-3 w-1/2" />
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-20" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : filteredApplications.length > 0 ? (
                    filteredApplications.map((application: AdmissionApplication) => {
                      const isSelected = selectedApplication?.id === application.id;
                      return (
                        <button
                          key={application.id}
                          onClick={() => setSelectedApplication(application)}
                          className={cn(
                            'w-full rounded-lg border p-3 text-left transition-all hover:bg-accent',
                            isSelected
                              ? 'border-primary bg-primary/5 shadow-sm'
                              : 'border-transparent hover:border-border'
                          )}
                        >
                          <div className="space-y-2">
                            <div className="flex items-start gap-3">
                              <div
                                className={cn(
                                  'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                                  isSelected
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground'
                                )}
                              >
                                {application.first_name?.charAt(0)}
                                {application.last_name?.charAt(0)}
                              </div>
                              <div className="min-w-0 flex-1 space-y-1">
                                <p className="truncate text-sm font-semibold">
                                  {application.first_name} {application.last_name}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {application.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              {application.pool_no && (
                                <Badge variant="outline" className="h-5 text-[10px] font-medium">
                                  Pool #{formatId(application.year!, application.pool_no!)}
                                </Badge>
                              )}
                              {application.latest_status && (
                                <Badge
                                  variant={getStatusVariant(application.latest_status)}
                                  className="h-5 text-[10px]"
                                >
                                  {application.latest_status}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <FileTextIcon className="h-12 w-12 text-muted-foreground/40" />
                      <p className="mt-2 text-sm font-medium text-muted-foreground">
                        No applications found
                      </p>
                      <p className="text-xs text-muted-foreground">Try adjusting your search</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Application Details */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileTextIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  {isLoadingApplications ? (
                    <>
                      <Skeleton className="h-6 w-48 mb-1" />
                      <Skeleton className="h-4 w-64" />
                    </>
                  ) : (
                    <>
                      <CardTitle className="text-lg">
                        {selectedApplication
                          ? `${selectedApplication.first_name} ${selectedApplication.last_name}`
                          : 'Application Details'}
                      </CardTitle>
                      <CardDescription>
                        {selectedApplication
                          ? 'Review and evaluate this application'
                          : 'Select an application to view details'}
                      </CardDescription>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              {isLoadingApplications ? (
                // Skeleton loader for application details
                <div className="space-y-6 p-6">
                  {/* Application Info Skeleton */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>

                  <Separator />

                  {/* Evaluation Criteria Skeleton */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-64" />
                      </div>
                      <Skeleton className="h-9 w-32" />
                    </div>

                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 space-y-1">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-3 w-full" />
                              </div>
                              <Skeleton className="h-6 w-20 flex-shrink-0" />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <div className="flex items-center gap-3">
                                <Skeleton className="h-10 flex-1" />
                                <Skeleton className="h-3 w-8" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ) : selectedApplication ? (
                <div className="space-y-6 p-6">
                  {/* Application Info */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Email Address
                      </Label>
                      <p className="text-sm font-medium">{selectedApplication.email}</p>
                    </div>
                    {selectedApplication.pool_no && (
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Pool Number
                        </Label>
                        <p className="text-sm font-medium">
                          #{formatId(selectedApplication.year!, selectedApplication.pool_no!)}
                        </p>
                      </div>
                    )}
                    {selectedApplication.latest_status && (
                      <div className="space-y-2 space-x-3">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Application Status
                        </Label>
                        <Badge
                          variant={getStatusVariant(selectedApplication.latest_status)}
                          className="w-fit"
                        >
                          {selectedApplication.latest_status}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Evaluation Criteria */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-semibold">Evaluation Criteria</h3>
                        <p className="text-sm text-muted-foreground">
                          Score each criterion based on the application
                        </p>
                      </div>
                      {admissionProgramCriteriaList.length > 0 && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            disabled={
                              isSubmittingScores || Object.keys(validationErrors).length > 0
                            }
                            onClick={handlePostToggle}
                          >
                            {isPostedAll ? (
                              <>
                                <XCircleIcon className="h-4 w-4" />
                                Unpost
                              </>
                            ) : (
                              <>
                                <CheckCircleIcon className="h-4 w-4" />
                                Post
                              </>
                            )}
                          </Button>
                          {!isPostedAll && (
                            <Button
                              size="sm"
                              className="gap-2"
                              disabled={
                                isSubmittingScores ||
                                Object.keys(validationErrors).length > 0 ||
                                isPostedAll
                              }
                              onClick={handleSubmitScores}
                            >
                              <SaveIcon className="h-4 w-4" />
                              {isSubmittingScores ? 'Saving...' : 'Save Evaluation'}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    {isLoadingCriteria ? (
                      // Skeleton loader for criteria
                      <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                          <Card key={index}>
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-1">
                                  <Skeleton className="h-4 w-48" />
                                  <Skeleton className="h-3 w-full" />
                                </div>
                                <Skeleton className="h-6 w-20 flex-shrink-0" />
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <div className="flex items-center gap-3">
                                  <Skeleton className="h-10 flex-1" />
                                  <Skeleton className="h-3 w-8" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : admissionProgramCriteriaList.length > 0 ? (
                      <div className="space-y-4">
                        {admissionProgramCriteriaList.map((criteria, index) => (
                          <Card
                            key={criteria.id}
                            className={validationErrors[index] ? 'border-destructive' : ''}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-1">
                                  <CardTitle className="text-sm font-semibold">
                                    {criteria.title}
                                  </CardTitle>
                                  {criteria.description && (
                                    <CardDescription className="text-xs">
                                      {criteria.description}
                                    </CardDescription>
                                  )}
                                </div>
                                <Badge variant="secondary" className="h-6 flex-shrink-0">
                                  Weight: {criteria.weight}%
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`score-${criteria.id}`} className="text-sm">
                                    Score ({criteria.min_score} - {criteria.max_score})
                                  </Label>
                                  <div className="flex items-center justify-end gap-3">
                                    <div className="w-auto min-w-24">
                                      <Input
                                        id={`score-${criteria.id}`}
                                        type="number"
                                        min={criteria.min_score}
                                        max={criteria.max_score}
                                        step="0.01"
                                        placeholder={`Enter score (${criteria.min_score}-${criteria.max_score})`}
                                        className={cn(
                                          'flex-1 text-right',
                                          validationErrors[index] &&
                                            'border-destructive focus-visible:ring-destructive'
                                        )}
                                        value={
                                          field.find(
                                            (score) =>
                                              score.academic_program_criteria_id === criteria.id
                                          )?.score
                                        }
                                        onChange={(e) => onChange(index, 'score', e.target.value)}
                                        readOnly={isPostedAll}
                                      />
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      / {criteria.max_score}
                                    </span>
                                  </div>
                                  {validationErrors[index] && (
                                    <p className="text-xs text-destructive mt-1">
                                      {validationErrors[index]}
                                    </p>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`comments-${criteria.id}`} className="text-sm">
                                    Comments
                                  </Label>
                                  <Textarea
                                    id={`comments-${criteria.id}`}
                                    placeholder="Add your evaluation comments here..."
                                    className="min-h-[80px] resize-none"
                                    value={
                                      field.find(
                                        (score) =>
                                          score.academic_program_criteria_id === criteria.id
                                      )?.comments || ''
                                    }
                                    onChange={(e) => onChange(index, 'comments', e.target.value)}
                                    readOnly={isPostedAll}
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <FileTextIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="mt-4 text-sm font-medium">
                            No evaluation criteria available
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Please configure criteria for this program
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <UserIcon className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">No Application Selected</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Select an application from the list to view and evaluate
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TitledPage>
  );
}
