import Select from '@/components/custom/select.component';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth.context';
import { cn } from '@/lib/utils';
import {
  useGetAdmissionCriteriaPaginated,
  useGetAdmissionSchedulePaginated,
  useSubmitAdmissionApplicationForm,
} from '@rest/api';
import type { UniversityAdmissionApplication } from '@rest/models';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
  X,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface GuestAdmissionSelectProgramStep3Props {
  selectedApplication: UniversityAdmissionApplication | null;
}

export default function GuestAdmissionSelectProgramStep4({
  selectedApplication,
}: GuestAdmissionSelectProgramStep3Props): React.ReactNode {
  const { session } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProgramId, setSelectedProgramId] = useState<number>(0);
  const [admissionScheduleId, setAdmissionScheduleId] = useState<number>(0);

  const { mutateAsync: submitApplicationForm, isPending: isSubmitting } =
    useSubmitAdmissionApplicationForm();

  const [uploadedFiles, setUploadedFiles] = useState<Record<number, File>>({});

  const { data: activeAdmissionSchedulesResponse, isLoading: isLoadingActiveAdmissionSchedules } =
    useGetAdmissionSchedulePaginated(
      {
        'filter[university_admission_id]': selectedApplication?.university_admission_id ?? 0,
      },
      { query: { enabled: !!selectedApplication?.university_admission_id } }
    );

  const { data: admissionCriteriaResponse, isLoading: isLoadingRequirements } =
    useGetAdmissionCriteriaPaginated(
      {
        'filter[admission_schedule_id]': admissionScheduleId,
      },
      { query: { enabled: !!admissionScheduleId } }
    );

  const admissionSchedules = useMemo(
    () => activeAdmissionSchedulesResponse?.data?.data ?? [],
    [activeAdmissionSchedulesResponse]
  );

  const uniquePrograms = useMemo(() => {
    const map = new Map<number, NonNullable<(typeof admissionSchedules)[0]['academic_program']>>();
    admissionSchedules.forEach((schedule) => {
      const prog = schedule.academic_program;
      if (prog && prog.id && !map.has(prog.id)) {
        map.set(prog.id, prog);
      }
    });
    return Array.from(map.values());
  }, [admissionSchedules]);

  const handleProgramChange = (value: string) => {
    const progId = Number(value);
    setSelectedProgramId(progId);
    setAdmissionScheduleId(0);
  };

  const availableSchedules = useMemo(() => {
    if (!selectedProgramId) return [];
    return admissionSchedules.filter((s) => s.academic_program?.id === selectedProgramId);
  }, [admissionSchedules, selectedProgramId]);

  const academicProgramRequirements = useMemo(
    () => admissionCriteriaResponse?.data?.data ?? [],
    [admissionCriteriaResponse]
  );

  const mandatoryRequirements = useMemo(
    () => academicProgramRequirements.filter((req) => req.requirement?.is_mandatory),
    [academicProgramRequirements]
  );

  const handleFileUpload = (requirementId: number, file: File | null) => {
    setUploadedFiles((prev) => {
      if (file === null) {
        const newFiles = { ...prev };
        delete newFiles[requirementId];
        return newFiles;
      }
      return { ...prev, [requirementId]: file };
    });
  };

  // ✅ FIX: Guard against submission outside of step 2
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only allow submission when the user is explicitly on step 2
    if (currentStep !== 2) return;
    if (!admissionScheduleId || !selectedApplication) return;

    try {
      const criteriaIds = Object.keys(uploadedFiles).map(Number);
      const files = Object.values(uploadedFiles);

      await submitApplicationForm({
        data: {
          'admission_schedule_id[]': [admissionScheduleId],
          'user_id[]': [session?.id ?? 0],
          // @ts-ignore
          'admission_criteria_id[]': criteriaIds.length ? criteriaIds : undefined,
          // @ts-ignore
          'file[]': files.length ? files : undefined,
        },
      });

      setSelectedProgramId(0);
      setAdmissionScheduleId(0);
      setUploadedFiles({});
      setCurrentStep(1);
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit admission application form');
    }
  };

  const steps = [
    {
      number: 1,
      title: 'Admission Schedule',
      description: 'Select your program & schedule',
      icon: CalendarDays,
    },
    {
      number: 2,
      title: 'Requirements',
      description: 'Upload required documents',
      icon: Upload,
    },
  ];

  const isStep1Complete = admissionScheduleId > 0;

  // ✅ FIX: Only consider step 2 complete when requirements have actually loaded
  const isStep2Complete =
    !isLoadingRequirements && mandatoryRequirements.every((req) => uploadedFiles[req.id!]);

  const uploadedCount = Object.keys(uploadedFiles).length;
  const totalRequirements = academicProgramRequirements.length;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  if (!selectedApplication) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 mt-6">
      {/* ── Stepper ── */}
      <div className="relative flex items-center justify-center gap-0">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <div key={step.number} className="flex items-center">
              {/* Step pill */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    'relative flex items-center justify-center w-11 h-11 rounded-full border-2 transition-all duration-300',
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-110'
                      : isCompleted
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-border bg-background text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <Icon className="w-4.5 h-4.5" />
                  )}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-primary opacity-20 animate-ping" />
                  )}
                </div>
                <div className="text-center">
                  <p
                    className={cn(
                      'text-xs font-semibold leading-tight',
                      isActive
                        ? 'text-foreground'
                        : isCompleted
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-muted-foreground'
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground hidden sm:block leading-tight mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="relative mx-3 mb-7 sm:mb-8 w-24 sm:w-32 h-[2px] bg-border overflow-hidden rounded-full">
                  <div
                    className={cn(
                      'absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-500 ease-out',
                      isCompleted ? 'w-full' : 'w-0'
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Form Card ── */}
      <form
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.preventDefault();
        }}
        className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
      >
        {/* Card body */}
        <div className="p-6 sm:p-8 min-h-[360px]">
          {/* ── Step 1: Schedule Selection ── */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
                  Step 1 of 2
                </p>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Choose Your Program & Schedule
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Select the academic program and the admission schedule you want to apply for.
                </p>
              </div>

              <div className="space-y-5 pt-2">
                {/* Academic Program */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Academic Program
                    <span className="text-destructive ml-1">*</span>
                  </Label>
                  <Select
                    value={selectedProgramId ? String(selectedProgramId) : ''}
                    onValueChange={handleProgramChange}
                    disabled={isLoadingActiveAdmissionSchedules}
                    placeholder={
                      isLoadingActiveAdmissionSchedules
                        ? 'Loading programs...'
                        : 'Select an Academic Program'
                    }
                    options={uniquePrograms.map((prog) => ({
                      label: prog.program_name,
                      value: String(prog.id),
                    }))}
                    className="h-11"
                  />
                </div>

                {/* Schedule — shown after program chosen */}
                {selectedProgramId > 0 && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Label className="text-sm font-medium">
                      Admission Schedule / Term
                      <span className="text-destructive ml-1">*</span>
                    </Label>
                    <Select
                      value={admissionScheduleId ? String(admissionScheduleId) : ''}
                      onValueChange={(val) => setAdmissionScheduleId(Number(val))}
                      disabled={
                        isLoadingActiveAdmissionSchedules || availableSchedules.length === 0
                      }
                      placeholder={
                        availableSchedules.length === 0
                          ? 'No schedules available for this program'
                          : 'Select a Schedule'
                      }
                      options={availableSchedules.map((schedule) => ({
                        label: schedule.title ?? '',
                        value: String(schedule.id),
                      }))}
                      className="h-11"
                    />
                    {availableSchedules.length === 0 && !isLoadingActiveAdmissionSchedules && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mt-1.5">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
                        No active schedules found for this program at this time.
                      </p>
                    )}
                  </div>
                )}

                {/* Confirmation chip when both selected */}
                {isStep1Complete && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 animate-in fade-in duration-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                      Ready to continue — click <span className="font-semibold">Next</span> to
                      upload your documents.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Step 2: Requirements Upload ── */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">
                    Step 2 of 2
                  </p>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
                    Upload Your Documents
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Items marked <span className="text-destructive font-semibold">*</span> are
                    required before submission.
                  </p>
                </div>

                {/* Progress badge */}
                {totalRequirements > 0 && !isLoadingRequirements && (
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {uploadedCount} / {totalRequirements} uploaded
                    </span>
                    <div className="w-20 h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${(uploadedCount / totalRequirements) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Loading state */}
              {isLoadingRequirements ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                  <Loader2 className="w-7 h-7 animate-spin text-primary" />
                  <p className="text-sm">Loading requirements…</p>
                </div>
              ) : academicProgramRequirements.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center gap-3 py-12 border border-dashed rounded-xl bg-muted/20 text-center px-6">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <FileText className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">No Documents Required</p>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                      This schedule has no file requirements. You can go ahead and submit your
                      application.
                    </p>
                  </div>
                </div>
              ) : (
                /* Requirements list */
                <div className="space-y-3">
                  {academicProgramRequirements.map((req) => {
                    const file = uploadedFiles[req.id!] || null;
                    const isMandatory = req.requirement?.is_mandatory;

                    return (
                      <div
                        key={req.id}
                        className={cn(
                          'rounded-xl border transition-all duration-200',
                          file
                            ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/40 dark:bg-emerald-950/20'
                            : 'border-border bg-card hover:border-primary/40'
                        )}
                      >
                        {/* Requirement header */}
                        <div className="px-4 pt-4 pb-2 flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-foreground leading-snug">
                              {req.title}
                              {isMandatory && (
                                <span className="text-destructive ml-1 font-bold">*</span>
                              )}
                            </p>
                            {req.description && (
                              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                {req.description}
                              </p>
                            )}
                          </div>
                          {file && (
                            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3" /> Uploaded
                            </span>
                          )}
                        </div>

                        {/* Drop zone */}
                        <div className="px-4 pb-4">
                          <label
                            className={cn(
                              'group relative flex flex-col items-center justify-center w-full min-h-[88px] rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200',
                              file
                                ? 'border-emerald-400/60 dark:border-emerald-600/50 bg-transparent'
                                : 'border-border hover:border-primary/50 hover:bg-muted/30'
                            )}
                          >
                            {file ? (
                              <div className="flex items-center gap-3 px-4 py-3 w-full">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 truncate">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleFileUpload(req.id!, null);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-5 text-center px-4">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
                                  <Upload className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-semibold text-primary">
                                    Click to upload
                                  </span>{' '}
                                  or drag and drop
                                </p>
                                {req.file_suffix && (
                                  <p className="text-xs text-muted-foreground/70 mt-1">
                                    {req.file_suffix.toUpperCase()} files only
                                  </p>
                                )}
                              </div>
                            )}
                            <input
                              type="file"
                              className="hidden"
                              accept={req.file_suffix ? `.${req.file_suffix}` : undefined}
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleFileUpload(req.id!, e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer Navigation ── */}
        <div className="bg-muted/30 px-6 sm:px-8 py-4 border-t border-border flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            className={cn(
              'gap-1.5 text-muted-foreground hover:text-foreground',
              currentStep === 1 && 'invisible pointer-events-none'
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {currentStep === 1 ? (
            <Button
              type="button"
              onClick={() => setCurrentStep((s) => Math.min(2, s + 1))}
              disabled={!isStep1Complete}
              size="sm"
              className="gap-1.5 px-5"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!isStep2Complete || isSubmitting}
              size="sm"
              className="gap-1.5 px-5 relative overflow-hidden"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit Application
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
