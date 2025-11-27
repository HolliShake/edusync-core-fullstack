import Select from '@/components/custom/select.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth.context';
import { cn } from '@/lib/utils';
import {
  useCreateAdmissionApplication,
  useGetAcademicProgramRequirementPaginated,
  useGetActiveCampuses,
  useGetActiveColleges,
  useGetActiveSchoolYears,
  useGetAdmissionSchedulePaginated,
} from '@rest/api';
import type { AdmissionApplication } from '@rest/models';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Upload,
  User,
  X,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function GuestAdmissionPage(): React.ReactNode {
  const { session } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [fields, setFields] = useState({
    campusId: 0,
    schoolYearId: 0,
    collegeId: 0,
    admissionScheduleId: 0,
  });

  const { mutateAsync: createAdmissionApplication, isPending: isSubmitting } =
    useCreateAdmissionApplication();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<Record<number, File>>({});

  const { data: activeSchoolYearResponse, isLoading: isLoadingActiveSchoolYear } =
    useGetActiveSchoolYears();

  const { data: activeCampusesResponse, isLoading: isLoadingActiveCampuses } = useGetActiveCampuses(
    {
      'filter[school_year_id]': fields.schoolYearId,
    },
    { query: { enabled: !!fields.schoolYearId } }
  );

  const { data: activeCollegesResponse, isLoading: isLoadingActiveColleges } = useGetActiveColleges(
    {
      'filter[campus_id]': fields.campusId,
    },
    { query: { enabled: !!fields.campusId } }
  );

  const { data: activeAdmissionSchedulesResponse, isLoading: isLoadingActiveAdmissionSchedules } =
    useGetAdmissionSchedulePaginated(
    {
      'filter[college_id]': fields.collegeId,
    },
    { query: { enabled: !!fields.collegeId } }
  );

  const { data: academicProgramRequirementResponse, isLoading: isLoadingRequirements } =
    useGetAcademicProgramRequirementPaginated(
    {
      'filter[academic_program_id]': (() => {
        const data = activeAdmissionSchedulesResponse?.data?.data?.find(
          (schedule) => schedule.id === fields.admissionScheduleId
        );
        if (!data) return undefined;
        return data.academic_program_id;
      })(),
      'filter[school_year_id]': fields.schoolYearId,
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
    },
    { query: { enabled: !!fields.admissionScheduleId } }
  );

  const schoolYears = useMemo(
    () => activeSchoolYearResponse?.data ?? [],
    [activeSchoolYearResponse]
  );

  const campuses = useMemo(() => activeCampusesResponse?.data ?? [], [activeCampusesResponse]);

  const colleges = useMemo(() => activeCollegesResponse?.data ?? [], [activeCollegesResponse]);

  const admissionSchedules = useMemo(
    () => activeAdmissionSchedulesResponse?.data?.data ?? [],
    [activeAdmissionSchedulesResponse]
  );

  const academicProgramRequirements = useMemo(
    () => academicProgramRequirementResponse?.data?.data ?? [],
    [academicProgramRequirementResponse]
  );

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedSchedule = admissionSchedules.find(
        (schedule) => schedule.id === fields.admissionScheduleId
      );

      await createAdmissionApplication({
        data: {
          ...formData,
          admission_schedule_id: fields.admissionScheduleId,
          academic_program_id: selectedSchedule?.academic_program_id ?? 0,
          school_year_id: fields.schoolYearId,
          user_id: session?.id ?? 0,
          uploadedFiles,
        } as AdmissionApplication,
      });
      // reset
      setFormData({
        first_name: '',
        last_name: '',
        middle_name: '',
        email: '',
        phone: '',
        address: '',
      });
      setFields({
        campusId: 0,
        schoolYearId: 0,
        collegeId: 0,
        admissionScheduleId: 0,
      });
      setUploadedFiles({});
      setCurrentStep(1);
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create admission application');
    }
  };

  const steps = [
    {
      number: 1,
      title: 'Academic Selection',
      description: 'Choose your path',
      icon: GraduationCap,
    },
    {
      number: 2,
      title: 'Personal Details',
      description: 'Tell us about you',
      icon: User,
    },
    {
      number: 3,
      title: 'Contact Information',
      description: 'How to reach you',
      icon: Mail,
    },
  ];

  const mandatoryRequirements = academicProgramRequirements.filter((req) => req.is_mandatory);
  const allMandatoryFilesUploaded = mandatoryRequirements.every((req) => uploadedFiles[req.id!]);

  const isStep1Complete =
    fields.campusId &&
    fields.schoolYearId &&
    fields.collegeId &&
    fields.admissionScheduleId &&
    allMandatoryFilesUploaded;
  const isStep2Complete = formData.first_name && formData.last_name;
  const isStep3Complete = formData.email && formData.phone && formData.address;

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background font-sans">
      {/* Sidebar / Progress Panel */}
      <div className="lg:w-[400px] xl:w-[480px] bg-zinc-900 text-white flex flex-col justify-between p-8 lg:p-12 relative overflow-hidden shrink-0 transition-all duration-300">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-primary-foreground/80 font-medium tracking-wide text-sm uppercase">
            <Sparkles className="w-4 h-4" />
            Admission Portal
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Begin Your <br />
            <span className="text-primary">Journey</span>
          </h1>
          <p className="text-zinc-400 max-w-xs mt-4 leading-relaxed">
            Transform your future with world-class education. Complete the steps to submit your
            application.
          </p>
        </div>

        {/* Desktop Steps */}
        <div className="relative z-10 hidden lg:flex flex-col gap-8 mt-12">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <div
                key={step.number}
                className={cn(
                  'group flex items-start gap-4 transition-all duration-300',
                  isActive ? 'opacity-100 translate-x-2' : 'opacity-50 hover:opacity-80'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-500',
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.5)]'
                      : isCompleted
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-white/20 bg-transparent text-white/50'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="pt-1">
                  <h3
                    className={cn(
                      'font-semibold text-lg leading-none mb-1 transition-colors',
                      isActive ? 'text-white' : 'text-zinc-300'
                    )}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-zinc-500">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile/Tablet Steps Footer indicator */}
        <div className="relative z-10 lg:hidden mt-8 flex justify-between items-center text-sm text-zinc-400">
          <span>
            Step {currentStep} of {steps.length}
          </span>
          <span className="font-medium text-white">{steps[currentStep - 1].title}</span>
        </div>
        
         <div className="relative z-10 hidden lg:block text-xs text-zinc-500">
           © {new Date().getFullYear()} EduSync. All rights reserved.
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-muted/10 h-full overflow-y-auto">
        {/* Mobile Header Progress Bar */}
        <div className="lg:hidden h-1.5 bg-zinc-200 w-full">
          <div 
             className="h-full bg-primary transition-all duration-500 ease-out"
             style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>

        <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-12 lg:p-16 flex flex-col justify-center min-h-[calc(100vh-4rem)]">
          <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
            
            <div className="mb-8">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                  Step {currentStep}
               </div>
               <h2 className="text-3xl font-bold tracking-tight text-foreground">
                 {steps[currentStep - 1].title}
               </h2>
               <p className="text-muted-foreground mt-2 text-lg">
                 {steps[currentStep - 1].number === 1 && "Select your academic preferences and upload requirements."}
                 {steps[currentStep - 1].number === 2 && "Provide your personal details for your student record."}
                 {steps[currentStep - 1].number === 3 && "Help us stay in touch with you regarding your application."}
               </p>
            </div>

            {/* Form Steps */}
            <div className="bg-card rounded-2xl shadow-sm border p-6 md:p-8 space-y-8">
              {/* Step 1: Academic Selection */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Academic Year</Label>
                      <Select
                        value={fields.schoolYearId ? String(fields.schoolYearId) : ''}
                        onValueChange={(value) =>
                          setFields((prev) => ({
                            ...prev,
                            schoolYearId: Number(value),
                            campusId: 0,
                            collegeId: 0,
                            admissionScheduleId: 0,
                          }))
                        }
                        disabled={isLoadingActiveSchoolYear}
                        placeholder={
                          isLoadingActiveSchoolYear
                            ? 'Loading academic years...'
                            : 'Select academic year'
                        }
                        options={schoolYears.map((year) => ({
                          label: year.name ?? '',
                          value: String(year.id),
                        }))}
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-medium">Campus Location</Label>
                      <Select
                        value={fields.campusId ? String(fields.campusId) : ''}
                        onValueChange={(value) =>
                          setFields((prev) => ({
                            ...prev,
                            campusId: Number(value),
                            collegeId: 0,
                            admissionScheduleId: 0,
                          }))
                        }
                        disabled={!fields.schoolYearId || isLoadingActiveCampuses}
                        placeholder={
                          !fields.schoolYearId
                            ? 'Select academic year first'
                            : isLoadingActiveCampuses
                              ? 'Loading campuses...'
                              : 'Choose your campus'
                        }
                        options={campuses.map((campus) => ({
                          label: campus.name ?? '',
                          value: String(campus.id),
                        }))}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-medium">College or Faculty</Label>
                    <Select
                      value={fields.collegeId ? String(fields.collegeId) : ''}
                      onValueChange={(value) =>
                        setFields((prev) => ({
                          ...prev,
                          collegeId: Number(value),
                          admissionScheduleId: 0,
                        }))
                      }
                      disabled={!fields.campusId || isLoadingActiveColleges}
                      placeholder={
                        !fields.campusId
                          ? 'Select campus first'
                          : isLoadingActiveColleges
                            ? 'Loading colleges...'
                            : 'Choose your college'
                      }
                      options={colleges.map((college) => ({
                        label: college.college_name ?? '',
                        value: String(college.id),
                      }))}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-medium">Admission Schedule</Label>
                    <Select
                      value={fields.admissionScheduleId ? String(fields.admissionScheduleId) : ''}
                      onValueChange={(value) =>
                        setFields((prev) => ({ ...prev, admissionScheduleId: Number(value) }))
                      }
                      disabled={!fields.collegeId || isLoadingActiveAdmissionSchedules}
                      placeholder={
                        !fields.collegeId
                          ? 'Select college first'
                          : isLoadingActiveAdmissionSchedules
                            ? 'Loading admission schedules...'
                            : 'Choose admission schedule'
                      }
                      options={admissionSchedules.map((schedule) => ({
                        label: schedule.academic_program?.program_name ?? '',
                        value: String(schedule.id),
                      }))}
                      className="h-12"
                    />
                  </div>

                  {/* Requirements Section */}
                  {fields.admissionScheduleId > 0 && (
                    <div className="pt-6 animate-in fade-in slide-in-from-bottom-2">
                       <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                               <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">Program Requirements</h3>
                              <p className="text-sm text-muted-foreground">Please upload the following documents.</p>
                            </div>
                          </div>
                          
                          {/* Progress Indicator */}
                          {!isLoadingRequirements && academicProgramRequirements.length > 0 && (
                             <div className="hidden sm:flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full">
                                <span className="text-xs font-medium text-muted-foreground">
                                   Required Files:
                                </span>
                                <span className={cn(
                                   "text-xs font-bold",
                                   mandatoryRequirements.filter(req => uploadedFiles[req.id!]).length === mandatoryRequirements.length 
                                      ? "text-green-600 dark:text-green-500" 
                                      : "text-primary"
                                )}>
                                   {mandatoryRequirements.filter(req => uploadedFiles[req.id!]).length} / {mandatoryRequirements.length}
                                </span>
                             </div>
                          )}
                       </div>

                      {isLoadingRequirements ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                          <Loader2 className="w-8 h-8 animate-spin mb-2" />
                          <p>Loading requirements...</p>
                        </div>
                      ) : academicProgramRequirements.length > 0 ? (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                          {academicProgramRequirements.map((req) => {
                             const isUploaded = !!uploadedFiles[req.id!];
                             return (
                            <div
                              key={req.id}
                              className={cn(
                                "group border rounded-lg p-3 transition-all duration-200 flex items-center gap-3",
                                isUploaded
                                  ? "bg-primary/5 border-primary/20"
                                  : "bg-card hover:border-primary/50 border-border"
                              )}
                            >
                              {/* Icon */}
                              <div className={cn(
                                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
                                  isUploaded
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                              )}>
                                   {isUploaded ? <Check className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                      <h4 className={cn("font-medium text-sm truncate", isUploaded && "text-primary")}>
                                          {req.requirement?.requirement_name}
                                      </h4>
                                       {req.is_mandatory && !isUploaded && (
                                          <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded-full">
                                              Required
                                          </span>
                                      )}
                                  </div>
                                  
                                   {isUploaded ? (
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                          <span className="truncate max-w-[120px]">{uploadedFiles[req.id!].name}</span>
                                          <span className="text-zinc-300 dark:text-zinc-700">•</span>
                                          <span>{(uploadedFiles[req.id!].size / 1024).toFixed(0)} KB</span>
                                      </div>
                                   ) : (
                                       <p className="text-xs text-muted-foreground line-clamp-1">
                                           {req.requirement?.description || "Upload required document"}
                                       </p>
                                   )}
                              </div>

                              {/* Action */}
                              <div className="shrink-0">
                                  {isUploaded ? (
                                      <Button 
                                          type="button"
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30" 
                                          onClick={() => handleFileUpload(req.id!, null)}
                                      >
                                         <X className="w-4 h-4" />
                                      </Button>
                                  ) : (
                                      <div className="relative">
                                          <Input
                                              type="file"
                                              id={`file-${req.id}`}
                                              onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleFileUpload(req.id!, file);
                                              }}
                                              className="hidden"
                                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                          />
                                          <Button 
                                              type="button"
                                              variant={req.is_mandatory ? "default" : "outline"} 
                                              size="sm" 
                                              asChild
                                              className={cn(
                                                "h-8 text-xs px-3 shadow-none transition-all",
                                                req.is_mandatory ? "bg-primary hover:bg-primary/90" : "hover:bg-primary/5 hover:text-primary hover:border-primary/50"
                                              )}
                                          >
                                              <Label htmlFor={`file-${req.id}`} className="cursor-pointer gap-1.5">
                                                  <Upload className="w-3.5 h-3.5" />
                                                  Upload
                                              </Label>
                                          </Button>
                                      </div>
                                  )}
                              </div>
                            </div>
                           );
                          })}
                        </div>
                      ) : (
                         <div className="text-center py-12 px-4 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                            <div className="mx-auto h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3">
                               <Sparkles className="w-5 h-5 text-zinc-400" />
                            </div>
                            <h4 className="font-semibold text-foreground">No Requirements</h4>
                            <p className="text-sm mt-1 max-w-xs mx-auto">There are no specific documents required for this program at this time.</p>
                         </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Personal Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Label className="font-medium" htmlFor="first_name">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="first_name"
                        placeholder="e.g. Juan"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-medium" htmlFor="middle_name">Middle Name</Label>
                      <Input
                        id="middle_name"
                        placeholder="e.g. Santos"
                        value={formData.middle_name}
                        onChange={(e) => handleInputChange('middle_name', e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-medium" htmlFor="last_name">
                         Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="last_name"
                        placeholder="e.g. Dela Cruz"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Information */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="font-medium" htmlFor="email">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                         <Mail className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="juan@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-10 h-12"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="font-medium" htmlFor="phone">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                         <Phone className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+63 900 000 0000"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="pl-10 h-12"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="font-medium" htmlFor="address">
                      Complete Address <span className="text-red-500">*</span>
                    </Label>
                     <div className="relative">
                         <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="address"
                          placeholder="House No., Street, Barangay, City, Province"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="pl-10 h-12"
                        />
                      </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1 || isSubmitting}
                className={cn("h-12 px-6", currentStep === 1 && "invisible")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={
                    (currentStep === 1 && !isStep1Complete) ||
                    (currentStep === 2 && !isStep2Complete) ||
                    isSubmitting
                  }
                  className="h-12 px-8 rounded-full shadow-lg shadow-primary/20"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!isStep3Complete || isSubmitting}
                  className="h-12 px-8 rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <CheckCircle2 className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
