import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/auth.context';
import {
  useCreateAdmissionApplication,
  useGetAcademicProgramPaginated,
  useGetAcademicProgramRequirementPaginated,
  useGetCampusPaginated,
  useGetCollegePaginated,
  useGetSchoolYearPaginated,
} from '@rest/api';
import type { AdmissionApplication } from '@rest/models';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardList,
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
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function GuestAdmissionPage(): React.ReactNode {
  const { session } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [fields, setFields] = useState({
    campusId: 0,
    schoolYearId: 0,
    collegeId: 0,
    academicProgramId: 0,
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

  const { data: campusResponse, isLoading: isLoadingCampuses } = useGetCampusPaginated({
    page: 1,
    rows: Number.MAX_SAFE_INTEGER,
  });

  const { data: schoolYearResponse, isLoading: isLoadingSchoolYears } = useGetSchoolYearPaginated({
    sort: '-start_date',
    page: 1,
    rows: Number.MAX_SAFE_INTEGER,
  });

  const { data: collegeResponse, isLoading: isLoadingColleges } = useGetCollegePaginated(
    {
      'filter[campus_id]': fields.campusId,
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
    },
    { query: { enabled: !!fields.campusId } }
  );

  const { data: academicProgramResponse, isLoading: isLoadingPrograms } =
    useGetAcademicProgramPaginated(
      {
        'filter[college_id]': fields.collegeId,
        page: 1,
        rows: Number.MAX_SAFE_INTEGER,
      },
      { query: { enabled: !!fields.collegeId } }
    );

  const { data: academicProgramRequirementResponse, isLoading: isLoadingRequirements } =
    useGetAcademicProgramRequirementPaginated(
      {
        'filter[academic_program_id]': fields.academicProgramId,
        'filter[school_year_id]': fields.schoolYearId,
        page: 1,
        rows: Number.MAX_SAFE_INTEGER,
      },
      { query: { enabled: !!fields.academicProgramId || !!fields.schoolYearId } }
    );

  const campuses = useMemo(() => campusResponse?.data?.data ?? [], [campusResponse]);

  const schoolYears = useMemo(
    () => schoolYearResponse?.data?.data?.filter((data) => data.is_active && !data.is_locked) ?? [],
    [schoolYearResponse]
  );

  const colleges = useMemo(() => collegeResponse?.data?.data ?? [], [collegeResponse]);

  const academicPrograms = useMemo(
    () => academicProgramResponse?.data?.data ?? [],
    [academicProgramResponse]
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
      await createAdmissionApplication({
        data: {
          ...formData,
          ...fields,
          academic_program_id: fields.academicProgramId,
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
        academicProgramId: 0,
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
    { number: 1, title: 'Academic Selection', icon: GraduationCap },
    { number: 2, title: 'Personal Details', icon: User },
    { number: 3, title: 'Contact & Address', icon: Mail },
  ];

  const mandatoryRequirements = academicProgramRequirements.filter((req) => req.is_mandatory);
  const allMandatoryFilesUploaded = mandatoryRequirements.every((req) => uploadedFiles[req.id!]);

  const isStep1Complete =
    fields.campusId &&
    fields.schoolYearId &&
    fields.collegeId &&
    fields.academicProgramId &&
    allMandatoryFilesUploaded;
  const isStep2Complete = formData.first_name && formData.last_name;
  const isStep3Complete = formData.email && formData.phone && formData.address;

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="bg-primary p-5 rounded-2xl shadow-lg">
              <GraduationCap className="w-14 h-14 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-foreground">
            Begin Your Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your future with world-class education. Your adventure starts here.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isComplete =
                (step.number === 1 && isStep1Complete) ||
                (step.number === 2 && isStep2Complete) ||
                (step.number === 3 && isStep3Complete);
              const isPast = currentStep > step.number;

              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 ${
                        isActive
                          ? 'bg-primary shadow-lg scale-110'
                          : isPast || isComplete
                            ? 'bg-green-600 dark:bg-green-700 shadow-lg'
                            : 'bg-muted'
                      }`}
                    >
                      {isPast || isComplete ? (
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      ) : (
                        <Icon
                          className={`w-8 h-8 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`}
                        />
                      )}
                      {isActive && (
                        <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-500 animate-pulse" />
                      )}
                    </div>
                    <span
                      className={`mt-3 text-sm font-semibold text-center ${
                        isActive
                          ? 'text-primary'
                          : isPast || isComplete
                            ? 'text-green-600 dark:text-green-500'
                            : 'text-muted-foreground'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-1 mx-4 mb-8">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isPast || (isComplete && currentStep > step.number)
                            ? 'bg-green-600 dark:bg-green-700'
                            : 'bg-muted'
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="shadow-xl border overflow-hidden">
          <div className="bg-primary p-4">
            <CardHeader className="text-primary-foreground p-0">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Application Form
              </CardTitle>
              <CardDescription className="text-primary-foreground/90 text-sm mt-1">
                Step {currentStep} of 3 - {steps[currentStep - 1].title}
              </CardDescription>
            </CardHeader>
          </div>

          <CardContent className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Academic Selection */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 group">
                      <Label
                        htmlFor="campus"
                        className="flex items-center gap-2 text-base font-bold group-hover:text-primary transition-colors"
                      >
                        <Building2 className="w-5 h-5" />
                        Campus Location
                      </Label>
                      <Select
                        value={fields.campusId ? String(fields.campusId) : ''}
                        onValueChange={(value) =>
                          setFields((prev) => ({
                            ...prev,
                            campusId: Number(value),
                            collegeId: 0,
                            academicProgramId: 0,
                          }))
                        }
                        disabled={isLoadingCampuses}
                      >
                        <SelectTrigger className="h-14 text-base border-2 hover:border-primary transition-colors disabled:opacity-50">
                          <SelectValue
                            placeholder={
                              isLoadingCampuses ? 'Loading campuses...' : 'Choose your campus'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {campuses.map((campus) => (
                            <SelectItem
                              key={campus.id}
                              value={String(campus.id)}
                              className="text-base py-3"
                            >
                              {campus.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3 group">
                      <Label
                        htmlFor="schoolYear"
                        className="flex items-center gap-2 text-base font-bold group-hover:text-primary transition-colors"
                      >
                        <Calendar className="w-5 h-5" />
                        Academic Year
                      </Label>
                      <Select
                        value={fields.schoolYearId ? String(fields.schoolYearId) : ''}
                        onValueChange={(value) =>
                          setFields((prev) => ({ ...prev, schoolYearId: Number(value) }))
                        }
                        disabled={isLoadingSchoolYears}
                      >
                        <SelectTrigger className="h-14 text-base border-2 hover:border-primary transition-colors disabled:opacity-50">
                          <SelectValue
                            placeholder={
                              isLoadingSchoolYears
                                ? 'Loading academic years...'
                                : 'Select academic year'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {schoolYears.map((year) => (
                            <SelectItem
                              key={year.id}
                              value={String(year.id)}
                              className="text-base py-3"
                            >
                              {year.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-3 group">
                    <Label
                      htmlFor="college"
                      className="flex items-center gap-2 text-base font-bold group-hover:text-primary transition-colors"
                    >
                      <GraduationCap className="w-5 h-5" />
                      College or Faculty
                    </Label>
                    <Select
                      value={fields.collegeId ? String(fields.collegeId) : ''}
                      onValueChange={(value) =>
                        setFields((prev) => ({
                          ...prev,
                          collegeId: Number(value),
                          academicProgramId: 0,
                        }))
                      }
                      disabled={!fields.campusId || isLoadingColleges}
                    >
                      <SelectTrigger className="h-14 text-base border-2 hover:border-primary transition-colors disabled:opacity-50">
                        <SelectValue
                          placeholder={
                            !fields.campusId
                              ? '← Select campus first'
                              : isLoadingColleges
                                ? 'Loading colleges...'
                                : 'Choose your college'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {colleges.map((college) => (
                          <SelectItem
                            key={college.id}
                            value={String(college.id)}
                            className="text-base py-3"
                          >
                            {college.college_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3 group">
                    <Label
                      htmlFor="program"
                      className="flex items-center gap-2 text-base font-bold group-hover:text-primary transition-colors"
                    >
                      <FileText className="w-5 h-5" />
                      Degree Program
                    </Label>
                    <Select
                      value={fields.academicProgramId ? String(fields.academicProgramId) : ''}
                      onValueChange={(value) =>
                        setFields((prev) => ({ ...prev, academicProgramId: Number(value) }))
                      }
                      disabled={!fields.collegeId || isLoadingPrograms}
                    >
                      <SelectTrigger className="h-14 text-base border-2 hover:border-primary transition-colors disabled:opacity-50">
                        <SelectValue
                          placeholder={
                            !fields.collegeId
                              ? '← Select college first'
                              : isLoadingPrograms
                                ? 'Loading programs...'
                                : 'Choose your program'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {academicPrograms.map((program) => (
                          <SelectItem
                            key={program.id}
                            value={String(program.id)}
                            className="text-base py-3"
                          >
                            {program.program_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Program Requirements Section */}
                  {fields.academicProgramId > 0 && (
                    <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl border-2 border-primary/20">
                        <div className="flex items-start gap-4">
                          <div className="bg-primary p-3 rounded-xl shadow-lg">
                            <ClipboardList className="w-6 h-6 text-primary-foreground" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-2 text-foreground">
                              Program Requirements
                            </h3>
                            <p className="text-muted-foreground text-base">
                              Please ensure you have the following documents ready for your
                              application
                            </p>
                          </div>
                        </div>
                      </div>

                      {isLoadingRequirements ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center space-y-3">
                            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                            <p className="text-muted-foreground">Loading requirements...</p>
                          </div>
                        </div>
                      ) : academicProgramRequirements.length > 0 ? (
                        <>
                          <div className="grid grid-cols-1 gap-4">
                            {academicProgramRequirements.map((req, index) => (
                              <div
                                key={req.id}
                                className="group relative bg-card hover:bg-accent/50 border-2 border-border hover:border-primary/50 rounded-xl p-5 transition-all duration-300"
                              >
                                <div className="flex items-start gap-4">
                                  <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center font-bold text-primary transition-colors">
                                      {index + 1}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                      <div className="flex-1">
                                        <h4 className="font-semibold text-base text-foreground mb-1 group-hover:text-primary transition-colors">
                                          {req.requirement?.requirement_name || 'Requirement'}
                                        </h4>
                                        {req.requirement?.description && (
                                          <p className="text-sm text-muted-foreground">
                                            {req.requirement.description}
                                          </p>
                                        )}
                                      </div>
                                      {req.is_mandatory && (
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-full text-xs font-medium flex-shrink-0">
                                          <AlertCircle className="w-3 h-3" />
                                          Required
                                        </div>
                                      )}
                                    </div>

                                    {req.is_mandatory && (
                                      <div className="mt-4">
                                        {uploadedFiles[req.id!] ? (
                                          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-900 rounded-lg">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium text-green-900 dark:text-green-100 truncate">
                                                {uploadedFiles[req.id!].name}
                                              </p>
                                              <p className="text-xs text-green-700 dark:text-green-300">
                                                {(uploadedFiles[req.id!].size / 1024).toFixed(2)} KB
                                              </p>
                                            </div>
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => handleFileUpload(req.id!, null)}
                                              className="flex-shrink-0 h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900"
                                            >
                                              <X className="w-4 h-4 text-green-700 dark:text-green-300" />
                                            </Button>
                                          </div>
                                        ) : (
                                          <div className="relative">
                                            <Input
                                              type="file"
                                              id={`file-${req.id}`}
                                              onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                  handleFileUpload(req.id!, file);
                                                }
                                              }}
                                              className="hidden"
                                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            />
                                            <Label
                                              htmlFor={`file-${req.id}`}
                                              className="flex items-center justify-center gap-2 h-12 px-4 border-2 border-dashed border-border hover:border-primary rounded-lg cursor-pointer transition-colors bg-background hover:bg-accent/50"
                                            >
                                              <Upload className="w-5 h-5 text-muted-foreground" />
                                              <span className="text-sm font-medium text-muted-foreground">
                                                Click to upload file
                                              </span>
                                            </Label>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {academicProgramRequirements.some((req) => req.is_mandatory) && (
                            <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900 rounded-xl p-4">
                              <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                                    Important Notice
                                  </p>
                                  <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                                    Items marked as "Required" must be uploaded for your application
                                    to be processed. Accepted formats: PDF, DOC, DOCX, JPG, PNG
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ) : null}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Personal Information */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-muted p-6 rounded-2xl border-2">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                      <User className="w-6 h-6 text-primary" />
                      Tell us about yourself
                    </h3>
                    <p className="text-muted-foreground">
                      Please provide your legal name as it appears on official documents
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="first_name" className="text-base font-bold">
                        First Name *
                      </Label>
                      <Input
                        id="first_name"
                        placeholder="Juan"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        className="h-14 text-base border-2 focus:border-primary"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="middle_name" className="text-base font-bold">
                        Middle Name
                      </Label>
                      <Input
                        id="middle_name"
                        placeholder="Santos"
                        value={formData.middle_name}
                        onChange={(e) => handleInputChange('middle_name', e.target.value)}
                        className="h-14 text-base border-2 focus:border-primary"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="last_name" className="text-base font-bold">
                        Last Name *
                      </Label>
                      <Input
                        id="last_name"
                        placeholder="Dela Cruz"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        className="h-14 text-base border-2 focus:border-primary"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Information */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-muted p-6 rounded-2xl border-2">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                      <Mail className="w-6 h-6 text-primary" />
                      How can we reach you?
                    </h3>
                    <p className="text-muted-foreground">
                      We'll use this information to send you important updates about your
                      application
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="email"
                        className="text-base font-bold flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="juan.delacruz@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="h-14 text-base border-2 focus:border-primary"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="phone"
                        className="text-base font-bold flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+63 912 345 6789"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="h-14 text-base border-2 focus:border-primary"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="address"
                      className="text-base font-bold flex items-center gap-2"
                    >
                      <MapPin className="w-5 h-5" />
                      Complete Address *
                    </Label>
                    <Input
                      id="address"
                      placeholder="Street, Barangay, City, Province"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="h-14 text-base border-2 focus:border-primary"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-8 border-t-2">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="h-14 px-8 text-base font-semibold border-2"
                    disabled={isSubmitting}
                  >
                    ← Previous
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={
                      (currentStep === 1 && !isStep1Complete) ||
                      (currentStep === 2 && !isStep2Complete) ||
                      isSubmitting
                    }
                    className="h-14 px-8 text-base font-semibold shadow-lg disabled:opacity-50"
                  >
                    Continue →
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!isStep3Complete || isSubmitting}
                    className="h-14 px-12 text-base font-semibold bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-card backdrop-blur-sm rounded-full shadow-lg border">
            <Sparkles className="w-5 h-5 text-primary" />
            <p className="text-sm font-medium text-foreground">
              Need assistance? Contact us at{' '}
              <a
                href="mailto:admissions@university.edu"
                className="text-primary hover:underline font-semibold"
              >
                admissions@university.edu
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
