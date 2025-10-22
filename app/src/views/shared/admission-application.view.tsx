import AdmissionApplicationLogModal from '@/components/admission-application-log/admission-application-log.modal';
import { useModal } from '@/components/custom/modal.component';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/auth.context';
import { AdmissionApplicationLogTypeEnum } from '@/enums/admission-application-log-type-enum';
import { UserRoleEnum, type UserRole } from '@/enums/role-enum';
import { decryptIdFromUrl } from '@/lib/hash';
import { can } from '@/lib/role';
import { useCreateAdmissionApplicationLog, useGetAdmissionApplicationById } from '@rest/api';
import { type AdmissionApplicationLog } from '@rest/models';
import {
  CheckCircleIcon,
  ClockIcon,
  FileTextIcon,
  InfoIcon,
  UserIcon,
  XCircleIcon,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function AdmissionApplicationStatusView(): React.ReactNode {
  const { session } = useAuth();

  const { admissionApplicationId } = useParams<{ admissionApplicationId: string }>();
  const { data: applicationData, refetch } = useGetAdmissionApplicationById(
    Number(decryptIdFromUrl(admissionApplicationId as string))
  );

  const controller = useModal<AdmissionApplicationLog>();

  const { mutateAsync: createAction, isPending: isCreatingAction } =
    useCreateAdmissionApplicationLog();

  const [selectedLog, setSelectedLog] = useState<AdmissionApplicationLog | null>(null);

  const application = useMemo(() => applicationData?.data, [applicationData]);

  const latestLog = useMemo(() => {
    if (!application?.logs || application.logs.length === 0) return null;
    const sortedLogs = [...application.logs].sort(
      (a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
    );
    return sortedLogs[0];
  }, [application]);

  // Automatically select the latest log when application loads
  useEffect(() => {
    if (latestLog && !selectedLog) {
      setSelectedLog(latestLog);
    }
  }, [latestLog, selectedLog]);

  const actionEnabled = useMemo(() => {
    if (!application) return false;
    if (application.latest_status !== AdmissionApplicationLogTypeEnum.SUBMITTED) return false;
    return (
      can(
        UserRoleEnum.PROGRAM_CHAIR /* only program chair can action */,
        (session?.roles ?? []) as UserRole[]
      ) && session?.is_program_chair
    );
  }, [application, session]);

  const handleSubmitLog = async (data: AdmissionApplicationLog) => {
    try {
      await createAction({
        data: {
          ...data,
        },
      });
      refetch();
      toast.success('Log created successfully');
    } catch (error) {
      toast.error('Failed to create log');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'submitted':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <FileTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      approved: 'default',
      rejected: 'destructive',
      submitted: 'secondary',
      cancelled: 'outline',
    };

    return (
      <Badge variant={variants[status] || 'outline'} className="text-xs">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'submitted':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const latestStatus = useMemo(() => {
    if (!application?.logs || application.logs.length === 0) return 'submitted';
    const sortedLogs = [...application.logs].sort(
      (a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
    );
    return sortedLogs[0].type;
  }, [application]);

  if (!application) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <FileTextIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading application...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Timeline */}
        <div className="lg:col-span-4">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-primary" />
                Application Logs
              </CardTitle>
              <CardDescription>Click on any event to view details</CardDescription>
            </CardHeader>
            <CardContent>
              {application.logs && application.logs.length > 0 ? (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                  <div className="space-y-6">
                    {[...application.logs]
                      .sort(
                        (a, b) =>
                          new Date(b.created_at || '').getTime() -
                          new Date(a.created_at || '').getTime()
                      )
                      .map((log) => (
                        <div key={log.id} className="relative pl-10">
                          {/* Timeline dot */}
                          <div
                            className={`absolute left-2 top-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(log.type)} cursor-pointer hover:scale-110 transition-transform ${
                              selectedLog?.id === log.id ? 'ring-2 ring-primary ring-offset-2' : ''
                            }`}
                            onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                          />

                          <div
                            className={`cursor-pointer transition-all p-3 rounded-lg hover:bg-muted/50 ${
                              selectedLog?.id === log.id ? 'bg-muted border border-primary' : ''
                            }`}
                            onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {getStatusBadge(log.type)}
                            </div>
                            <span className="text-xs text-muted-foreground block mt-1">
                              {log.created_at &&
                                new Date(log.created_at).toLocaleString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                            </span>
                            {log.user && (
                              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                <UserIcon className="h-3 w-3" />
                                <span>{log.user.name}</span>
                              </div>
                            )}
                            {log.note && (
                              <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                                <InfoIcon className="h-3 w-3" />
                                <span>Click to view details</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <ClockIcon className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground font-medium">No timeline events yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Updates will appear here as your application progresses
                  </p>
                </div>
              )}
              {/*  */}
              {actionEnabled && (
                <div className="space-y-3 mt-6 pt-4 border-t border-border">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="default"
                      className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all hover:shadow-md"
                      disabled={isCreatingAction}
                      onClick={() =>
                        controller.openFn({
                          admission_application_id: application?.id as number,
                          user_id: session?.id as number,
                          type: AdmissionApplicationLogTypeEnum.APPROVED,
                          note: 'Application accepted',
                        })
                      }
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      Accept
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full gap-2 shadow-sm transition-all hover:shadow-md"
                      disabled={isCreatingAction}
                      onClick={() =>
                        controller.openFn({
                          admission_application_id: application?.id as number,
                          user_id: session?.id as number,
                          type: AdmissionApplicationLogTypeEnum.REJECTED,
                          note: 'Application rejected',
                        })
                      }
                    >
                      <XCircleIcon className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Application Details & Notes */}
        <div className="lg:col-span-8 space-y-6">
          {/* Application Details Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(latestStatus)}
                  <div>
                    <CardTitle className="text-xl">
                      {application.first_name} {application.last_name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Application ID: {application.pool_no} • Year: {application.year}
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(latestStatus)}
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="grid gap-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground block mb-1">Program</span>
                    <span className="font-medium">{application.academicProgram?.program_name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">School Year</span>
                    <span className="font-medium">{application.schoolYear?.name}</span>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground block mb-1">Email</span>
                    <span className="font-medium">{application.email}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">Phone</span>
                    <span className="font-medium">{application.phone}</span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Address</span>
                  <span className="font-medium">{application.address}</span>
                </div>
                <Separator />
                <div>
                  <span className="text-muted-foreground block mb-1">Submitted On</span>
                  <span className="font-medium">
                    {application.created_at &&
                      new Date(application.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes/Details Card */}
          {selectedLog && selectedLog.note ? (
            <Card className="border-primary/50 shadow-lg animate-in slide-in-from-bottom-4 duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <InfoIcon className="h-5 w-5 text-primary" />
                      Update Details
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {selectedLog.created_at &&
                        new Date(selectedLog.created_at).toLocaleString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                    </CardDescription>
                    {selectedLog.user && (
                      <CardDescription className="mt-1 flex items-center gap-1">
                        <UserIcon className="h-3 w-3" />
                        <span>Updated by {selectedLog.user.name}</span>
                      </CardDescription>
                    )}
                  </div>
                  {getStatusBadge(selectedLog.type)}
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: selectedLog.note }}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <InfoIcon className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground font-medium">No update selected</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click on a timeline event to view its details here
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <AdmissionApplicationLogModal
        controller={controller}
        onSubmit={(data) => handleSubmitLog(data as AdmissionApplicationLog)}
      />
    </>
  );
}
