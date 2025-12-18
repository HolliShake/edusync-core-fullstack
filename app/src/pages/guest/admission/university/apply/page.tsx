import TitledPage from '@/components/pages/titled.page';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/auth.context';
import {
  useGetCurrentUserInvitation,
  useGetUserById,
  useSubmitUniversityAdmissionApplicationForm,
} from '@rest/api';
import type { UniversityAdmissionApplicationForm } from '@rest/models';
import { format } from 'date-fns';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  FileText,
  GraduationCap,
  Info,
  Send,
  Upload,
  User,
  X,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface UploadedFile {
  file: File;
  preview?: string;
}

export default function GuestAdmissionUniversityApply(): React.ReactNode {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { data: myInvitation, isLoading } = useGetCurrentUserInvitation(Number(session?.id), {
    query: {
      enabled: !!session?.id,
    },
  });

  const myProfile = useGetUserById(Number(session?.id), {
    query: {
      enabled: !!session?.id,
    },
  });

  const { mutateAsync: submitApplicationForm, isPending: isSubmitting } =
    useSubmitUniversityAdmissionApplicationForm();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [criteriaFiles, setCriteriaFiles] = useState<Record<number, UploadedFile>>({});
  const [draggedOver, setDraggedOver] = useState<number | null>(null);

  const invitationData = myInvitation?.data;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (criteriaId: number, file: File) => {
    let finalFile = file;
    const criteria = invitationData?.university_admission_criterias?.find(
      (c) => c.id === criteriaId
    );

    if (criteria && (criteria as any).file_suffix && formData.lastName) {
      const lastDotIndex = file.name.lastIndexOf('.');
      const extension = lastDotIndex !== -1 ? file.name.substring(lastDotIndex) : '';
      const newName = `${formData.lastName}_${(criteria as any).file_suffix}${extension}`;
      finalFile = new File([file], newName, { type: file.type });
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCriteriaFiles((prev) => ({
        ...prev,
        [criteriaId]: {
          file: finalFile,
          preview: reader.result as string,
        },
      }));
    };
    reader.readAsDataURL(finalFile);
  };

  const handleDragOver = (e: React.DragEvent, criteriaId: number) => {
    e.preventDefault();
    setDraggedOver(criteriaId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(null);
  };

  const handleDrop = (e: React.DragEvent, criteriaId: number) => {
    e.preventDefault();
    setDraggedOver(null);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(criteriaId, file);
    }
  };

  const handleFileInputChange = (criteriaId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(criteriaId, file);
    }
  };

  const removeFile = (criteriaId: number) => {
    setCriteriaFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[criteriaId];
      return newFiles;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: UniversityAdmissionApplicationForm[] = Object.entries(criteriaFiles).map(
      ([criteriaId, uploadedFile]) => ({
        user_id: Number(session?.id),
        university_admission_id: Number(invitationData?.id),
        university_admission_criteria_id: Number(criteriaId),
        file: uploadedFile.file as Blob,
      })
    );

    console.log(JSON.stringify(payload));

    try {
      await submitApplicationForm({
        data: {
          'user_id[]': payload.map((item) => item.user_id),
          'university_admission_id[]': payload.map((item) => item.university_admission_id),
          'university_admission_criteria_id[]': payload.map(
            (item) => item.university_admission_criteria_id
          ),
          'file[]': payload.map((item) => item.file),
        },
      });
      toast.success('Application submitted');
      navigate(-1);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!myProfile.data?.data) return;
    const fullname = myProfile.data.data.name ?? '';
    const nameParts = fullname.trim().split(' ');
    const firstname = nameParts[0] ?? '';
    const lastname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
    const middlename = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';

    const data = myProfile.data.data!;

    setFormData((old) => ({
      ...old,
      firstName: firstname,
      lastName: lastname,
      middleName: middlename,
      email: data.email,
      phone: data.contactno ?? '',
      address: data.address ?? '',
    }));
  }, [myProfile.data?.data]);

  if (isLoading) {
    return (
      <TitledPage
        title="Apply for Admission"
        description="Complete your application to join our university"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="h-8 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </TitledPage>
    );
  }

  if (!invitationData?.is_ongoing) {
    return (
      <TitledPage
        title="Apply for Admission"
        description="Complete your application to join our university"
      >
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Admission Not Available</AlertTitle>
            <AlertDescription>
              The admission period is currently closed. Please check back when applications open.
            </AlertDescription>
          </Alert>
          <div className="mt-6">
            <Button variant="outline" onClick={() => navigate('/guest/admission/university')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admission Info
            </Button>
          </div>
        </div>
      </TitledPage>
    );
  }

  return (
    <TitledPage
      title="Apply for Admission"
      description="Complete your application to join our university"
    >
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Button variant="ghost" onClick={() => navigate('/guest/admission/university')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admission Info
        </Button>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Application Information</AlertTitle>
          <AlertDescription>
            Please fill out all required fields carefully. Your application will be reviewed by our
            admissions committee.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Admission Period Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Admission Period
              </CardTitle>
              <CardDescription>Current admission period information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">University Admission</h4>
                    <p className="text-sm text-muted-foreground">
                      School Year {invitationData?.school_year?.name}
                    </p>
                  </div>
                  <Badge>Open</Badge>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Application Period:</span>
                  </div>
                  <div className="font-medium">
                    {invitationData?.open_date &&
                      format(new Date(invitationData.open_date), 'MMM d, yyyy')}{' '}
                    -{' '}
                    {invitationData?.close_date &&
                      format(new Date(invitationData.close_date), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>Provide your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                    required
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
                    required
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  value={formData.middleName}
                  onChange={(e) => handleInputChange('middleName', e.target.value)}
                  placeholder="Enter your middle name (optional)"
                  readOnly
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    required
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter your complete address"
                  rows={3}
                  required
                  readOnly
                />
              </div>
            </CardContent>
          </Card>

          {/* Requirements Checklist with File Upload */}
          {invitationData?.university_admission_criterias &&
            invitationData.university_admission_criterias.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Admission Requirements
                  </CardTitle>
                  <CardDescription>
                    Upload required documents for each criterion. You can drag and drop files or
                    click to browse.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invitationData.university_admission_criterias.map((criteria) => (
                      <div
                        key={criteria.id}
                        className="rounded-lg border p-4 space-y-3 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium">{criteria.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {criteria.requirement?.requirement_name}
                            </p>
                          </div>
                        </div>

                        {/* File Upload Area */}
                        <div
                          className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
                            draggedOver === criteria.id
                              ? 'border-primary bg-primary/5'
                              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                          }`}
                          onDragOver={(e) => criteria.id && handleDragOver(e, criteria.id)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => criteria.id && handleDrop(e, criteria.id)}
                        >
                          {criteria.id && criteriaFiles[criteria.id] ? (
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="bg-primary/10 p-2 rounded">
                                  <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-sm truncate">
                                    {criteriaFiles[criteria.id].file.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {(criteriaFiles[criteria.id].file.size / 1024).toFixed(2)} KB
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => criteria.id && removeFile(criteria.id)}
                                className="flex-shrink-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                              <div className="space-y-1">
                                <p className="text-sm font-medium">
                                  Drag and drop your file here, or click to browse
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                                </p>
                              </div>
                              <input
                                type="file"
                                id={`file-${criteria.id}`}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) =>
                                  criteria.id && handleFileInputChange(criteria.id, e)
                                }
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Submit Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Ready to submit your application?</p>
                  <p className="text-sm text-muted-foreground">
                    Please review all information before submitting
                  </p>
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  <Send className="mr-2 h-4 w-4" />
                  Submit Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </TitledPage>
  );
}
