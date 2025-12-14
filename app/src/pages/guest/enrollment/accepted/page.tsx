import TitledPage from '@/components/pages/titled.page';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth.context';
import { encryptIdForUrl } from '@/lib/hash';
import { useGetAdmissionApplicationPaginated } from '@rest/api';
import { AdmissionApplicationLogTypeEnum } from '@rest/models';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Mail,
  User,
} from 'lucide-react';
import type React from 'react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GuestAcceptedAdmission(): React.ReactNode {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { data: applicationResponse, isLoading } = useGetAdmissionApplicationPaginated(
    {
      'filter[user_id]': Number(session?.id),
      'filter[latest_status]': AdmissionApplicationLogTypeEnum.accepted,
      'filter[open_enrollment]': true,
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
    },
    { query: { enabled: !!session?.id } }
  );

  const applications = useMemo(() => applicationResponse?.data?.data ?? [], [applicationResponse]);

  const getStatusIcon = (status: AdmissionApplicationLogTypeEnum) => {
    switch (status.toLowerCase()) {
      case AdmissionApplicationLogTypeEnum.approved:
        return <CheckCircle2 className="h-4 w-4" />;
      case AdmissionApplicationLogTypeEnum.submitted:
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (
    status: string
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleApplicationClick = (applicationId: number) => {
    navigate(`/guest/enrollment/accepted/${encryptIdForUrl(applicationId)}`);
  };

  if (isLoading) {
    return (
      <TitledPage title="Enrollment" description="Complete your enrollment process">
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <div className="inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground">Loading your applications...</p>
          </div>
        </div>
      </TitledPage>
    );
  }

  return (
    <TitledPage title="Enrollment" description="Complete your enrollment process">
      {applications.length === 0 ? (
        <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-amber-900 dark:text-amber-100">
            No Enrollment Available
          </AlertTitle>
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            You don't have any approved applications eligible for enrollment at this time. Please
            check back during the enrollment period or contact the admissions office for assistance.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
          <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-900 dark:text-green-100">Enrollment Open</AlertTitle>
            <AlertDescription className="text-green-800 dark:text-green-200">
              You have {applications.length} approved application
              {applications.length > 1 ? 's' : ''} eligible for enrollment. Please complete your
              enrollment process below.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {applications.map((application) => (
              <Card
                key={application.id}
                className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/50"
              >
                <CardHeader className="space-y-3 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-2">
                        <GraduationCap className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <CardTitle className="text-lg leading-tight">
                          {application.admission_schedule?.academic_program?.program_name}
                        </CardTitle>
                      </div>
                      <CardDescription className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {application.admission_schedule?.university_admission?.school_year?.name}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={getStatusVariant(application.latest_status!)}
                      className="shrink-0"
                    >
                      <span className="flex items-center gap-1.5">
                        {getStatusIcon(application.latest_status!)}
                        {application.latest_status}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm border-t pt-4">
                    <div className="flex items-start gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-muted-foreground block text-xs mb-0.5">
                          Application ID
                        </span>
                        <span className="font-medium block truncate">{application.id}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-muted-foreground block text-xs mb-0.5">Name</span>
                        <span className="font-medium block truncate">
                          {application.first_name} {application.middle_name} {application.last_name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-muted-foreground block text-xs mb-0.5">Email</span>
                        <span className="font-medium block truncate">{application.email}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full group-hover:shadow-md transition-all"
                    size="lg"
                    disabled={!application.is_open_for_enrollment}
                    onClick={() => handleApplicationClick(application.id!)}
                  >
                    <span>Proceed to Enrollment</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </TitledPage>
  );
}
