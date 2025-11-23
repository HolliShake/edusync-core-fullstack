import TitledPage from '@/components/pages/titled.page';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth.context';
import { formatId } from '@/lib/formatter';
import { encryptIdForUrl } from '@/lib/hash';
import { useGetAdmissionApplicationPaginated } from '@rest/api';
import type { AcademicProgram, SchoolYear } from '@rest/models';
import { format } from 'date-fns';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FileTextIcon,
  GraduationCapIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
} from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

export default function GuestAdmissionApplications(): React.ReactNode {
  const [page, setPage] = useState(1);
  const [rows] = useState(10);
  const { session } = useAuth();

  const navigate = useNavigate();

  const { data: applicationsResponse, isLoading } = useGetAdmissionApplicationPaginated(
    {
      page,
      rows,
      'filter[user_id]': session?.id ?? 0,
    },
    { query: { enabled: !!session?.id } }
  );

  const applications = useMemo(
    () => applicationsResponse?.data?.data ?? [],
    [applicationsResponse]
  );

  const getStatusBadge = (status: string = 'pending') => {
    const variants = {
      submitted: {
        variant: 'secondary' as const,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: 'Submitted',
      },
      cancelled: {
        variant: 'secondary' as const,
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        label: 'Cancelled',
      },
      approved: {
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800 border-green-200',
        label: 'Approved',
      },
      rejected: {
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800 border-red-200',
        label: 'Rejected',
      },
      accepted: {
        variant: 'default' as const,
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Accepted',
      },
    };
    const config = variants[status as keyof typeof variants] || variants.submitted;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <TitledPage
      title="My Admission Applications"
      description="View and track your admission applications"
    >
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <Separator />
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-4 w-4 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Separator className="my-2" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 rounded" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileTextIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              You haven't submitted any admission applications. Start your journey by applying to a
              program.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((application) => (
            <Card
              key={application.id}
              className="hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer group"
              onClick={() =>
                navigate(`/guest/admission/application/${encryptIdForUrl(application.id!)}`)
              }
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {formatId(application.year!, application.pool_no!)}
                    </CardTitle>
                    <CardDescription className="mt-1">Application ID</CardDescription>
                  </div>
                  {getStatusBadge(application.latest_status)}
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <GraduationCapIcon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {(application.admission_schedule?.academic_program as AcademicProgram)
                        ?.program_name ?? 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(application.admission_schedule?.school_year as SchoolYear)?.name ?? 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <UserIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-sm truncate">
                    {`${application.first_name} ${application.middle_name ? application.middle_name + ' ' : ''}${application.last_name}`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <MailIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-sm truncate text-muted-foreground">{application.email}</p>
                </div>

                <div className="flex items-center gap-3">
                  <PhoneIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{application.phone}</p>
                </div>

                <Separator className="my-2" />

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarIcon className="h-3 w-3" />
                  <span>
                    Submitted{' '}
                    {application.created_at
                      ? format(new Date(application.created_at as string), 'MMM dd, yyyy')
                      : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {applications.length > 0 && applicationsResponse?.data && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {applicationsResponse.data.from ?? 0} to {applicationsResponse.data.to ?? 0} of{' '}
            {applicationsResponse.data.total ?? 0} applications
          </p>
          {applicationsResponse.data.last_page! > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                <ChevronLeftIcon className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-1 px-3 py-1 text-sm border rounded-md bg-muted/50">
                <span className="font-medium">{page}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">{applicationsResponse.data.last_page}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage(Math.min(applicationsResponse?.data?.last_page ?? 0, page + 1))
                }
                disabled={page === applicationsResponse.data.last_page}
              >
                Next
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      )}
    </TitledPage>
  );
}
