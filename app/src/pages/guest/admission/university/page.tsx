// Admission to the university!

import TitledPage from '@/components/pages/titled.page';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth.context';
import AppConfig from '@/lib/app.config';
import { useGetCurrentUserInvitation } from '@rest/api';
import { format, formatDistanceToNow } from 'date-fns';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Info,
  Mail,
  Users,
} from 'lucide-react';
import type React from 'react';
import { useNavigate } from 'react-router';

export default function GuestAdmissionUniversity(): React.ReactNode {
  const navigate = useNavigate();
  const { session, isLoading: isAuthLoading } = useAuth();
  const { data: myInvitation, isLoading: isInvitationLoading } = useGetCurrentUserInvitation(
    Number(session?.id),
    {
      query: {
        enabled: !!session?.id,
      },
    }
  );

  const invitationData = myInvitation?.data;

  // Calculate status helpers
  const today = new Date();
  const startDate = invitationData ? new Date(invitationData.open_date) : null;
  const endDate = invitationData ? new Date(invitationData.close_date) : null;

  const isOpen = invitationData?.is_ongoing;
  const isUpcoming = startDate && today < startDate;

  const onStartApplication = () => {
    navigate('/guest/admission/invitation/apply');
  };

  if (isAuthLoading || isInvitationLoading) {
    return (
      <TitledPage title="University Admission" description="Begin your academic journey with us.">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Hero Section Skeleton */}
          <div className="relative overflow-hidden rounded-xl border bg-card shadow p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-6 max-w-2xl w-full">
                <Skeleton className="h-6 w-32 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-10 w-1/2" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="flex gap-4 pt-4">
                  <Skeleton className="h-12 w-32 rounded-md" />
                  <Skeleton className="h-12 w-40 rounded-md" />
                </div>
              </div>
              <div className="min-w-[240px] space-y-4">
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Requirements Skeleton */}
            <div className="md:col-span-2 space-y-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 rounded-lg border p-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <div className="flex justify-between">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </TitledPage>
    );
  }

  return (
    <TitledPage title="University Admission" description="Begin your academic journey with us.">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {invitationData ? (
          <>
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow">
              <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />

              <div className="relative p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4 max-w-2xl">
                    <div className="space-y-2">
                      <Badge
                        variant={isOpen ? 'default' : 'secondary'}
                        className="text-sm px-3 py-1"
                      >
                        {invitationData.school_year?.school_year_code} Academic Year
                      </Badge>
                      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                        {invitationData.school_year?.name} Admission
                      </h1>
                      <p className="text-muted-foreground text-lg">
                        We are looking for exceptional students to join our community. Review the
                        requirements below and submit your application before the deadline.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                      {isOpen && (
                        <Button
                          size="lg"
                          className="font-semibold shadow-lg shadow-primary/20"
                          onClick={onStartApplication}
                        >
                          Start Application <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                      {!isOpen && (
                        <Button size="lg" variant="outline" disabled>
                          {isUpcoming ? 'Opening Soon' : 'Admission Closed'}
                        </Button>
                      )}
                      <Button variant="outline" size="lg">
                        Download Course Catalog
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 min-w-[240px] bg-background/50 backdrop-blur-sm p-6 rounded-xl border">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Opening Date
                      </div>
                      <div className="font-semibold text-lg">
                        {startDate ? format(startDate, 'MMMM do, yyyy') : 'TBA'}
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" /> Deadline
                      </div>
                      <div className={`font-semibold text-lg ${isOpen ? 'text-primary' : ''}`}>
                        {endDate ? format(endDate, 'MMMM do, yyyy') : 'TBA'}
                      </div>
                      {isOpen && endDate && (
                        <p className="text-xs text-muted-foreground">
                          Closes {formatDistanceToNow(endDate, { addSuffix: true })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Requirements Column */}
              <div className="md:col-span-2 space-y-6">
                {/* Available Programs */}
                <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      Available Programs
                    </CardTitle>
                    <CardDescription>
                      Explore the academic programs accepting applications for this admission cycle.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {invitationData.admission_schedules &&
                    invitationData.admission_schedules.length > 0 ? (
                      <div className="grid gap-4">
                        {invitationData.admission_schedules.map((schedule) => {
                          const scheduleStartDate = new Date(schedule.start_date);
                          const scheduleEndDate = new Date(schedule.end_date);
                          const isProgramOpen =
                            today >= scheduleStartDate && today <= scheduleEndDate;

                          return (
                            <div
                              key={schedule.id}
                              className="group flex items-start gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50 hover:shadow-sm"
                            >
                              <div
                                className={`mt-1 rounded-full p-2 ${
                                  isProgramOpen
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                <BookOpen className="h-4 w-4" />
                              </div>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <h4 className="font-semibold">
                                      {schedule.academic_program?.program_name}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {schedule.academic_program?.program_name}
                                    </p>
                                  </div>
                                  <Badge variant={isProgramOpen ? 'default' : 'secondary'}>
                                    {isProgramOpen ? 'Open' : 'Closed'}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>
                                      {format(scheduleStartDate, 'MMM d')} -{' '}
                                      {format(scheduleEndDate, 'MMM d, yyyy')}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3.5 w-3.5" />
                                    <span>Intake Limit: {schedule.intake_limit}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>No programs available</AlertTitle>
                        <AlertDescription>
                          Program schedules have not been announced yet. Please check back later.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Admission Requirements */}
                <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Admission Requirements
                    </CardTitle>
                    <CardDescription>
                      Review the criteria below. Your application will be evaluated based on these
                      weighted components.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {invitationData.university_admission_criterias &&
                    invitationData.university_admission_criterias.length > 0 ? (
                      <div className="grid gap-4">
                        {invitationData.university_admission_criterias.map((criteria) => (
                          <div
                            key={criteria.id}
                            className="group flex items-start gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50 hover:shadow-sm"
                          >
                            <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold">{criteria.title}</h4>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {criteria.requirement?.requirement_name}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>No specific requirements listed</AlertTitle>
                        <AlertDescription>
                          Please contact the admissions office for detailed requirements.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <Card className="bg-primary text-primary-foreground border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <GraduationCap className="h-5 w-5" />
                      Why Apply?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm opacity-90">
                      Join a diverse community of scholars and leaders. Our curriculum is designed
                      to challenge and inspire.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 opacity-75" />
                        <span>World-class faculty</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 opacity-75" />
                        <span>Modern facilities</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 opacity-75" />
                        <span>Global alumni network</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="secondary"
                      className="w-full text-primary font-semibold hover:bg-white/90"
                    >
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Need Assistance?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>
                      If you have any questions about the application process, our admissions team
                      is here to help.
                    </p>
                    <div className="font-medium">{AppConfig.Email}</div>
                    <div className="font-medium">{AppConfig.Telephone}</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="relative mb-8 group cursor-default">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
              <div className="relative bg-card p-8 rounded-full border shadow-xl ring-1 ring-border/50">
                <Calendar className="h-16 w-16 text-muted-foreground/80" />
                <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-2 border shadow-sm">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Admissions Are Currently Closed
            </h2>
            <p className="max-w-[600px] text-muted-foreground text-lg mb-12">
              We appreciate your interest in joining our academic community. The application window
              for the next academic year has not opened yet.
            </p>

            {/* Infographic / Timeline */}
            <div className="w-full max-w-4xl mb-12">
              <div className="relative">
                {/* Line */}
                <div className="absolute top-6 left-0 w-full h-1 bg-gradient-to-r from-muted via-primary/20 to-muted rounded-full" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-background border-2 border-muted shadow-sm">
                      <CheckCircle2 className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-muted-foreground">Previous Cycle</h4>
                      <p className="text-xs text-muted-foreground">Closed</p>
                    </div>
                  </div>

                  {/* Step 2 (Current) */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-primary/10">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-foreground">Awaiting Announcement</h4>
                      <p className="text-xs text-muted-foreground">Current Status</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-background border-2 border-dashed border-muted shadow-sm">
                      <BookOpen className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-muted-foreground">Next Cycle</h4>
                      <p className="text-xs text-muted-foreground">Opening Soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="max-w-md w-full border-dashed">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-left">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Stay Updated</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when admissions open
                      </p>
                    </div>
                  </div>
                  <Button className="w-full">Notify Me</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </TitledPage>
  );
}
