import Menu from '@/components/custom/menu.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import { Timeline } from '@/components/custom/timeline.component';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useAuth } from '@/context/auth.context';
import { dateToWord } from '@/lib/formatter';
import { useGetUniversityAdmissionApplicationPaginated } from '@rest/api';
import {
  AdmissionApplicationLogTypeEnum,
  UniversityAdmissionStepEnum,
  type UniversityAdmissionApplication,
} from '@rest/models';
import {
  AlertCircleIcon,
  CalendarIcon,
  ClockIcon,
  DownloadIcon,
  EllipsisIcon,
  EyeIcon,
  FileIcon,
  MapPinIcon,
} from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';

type GuestAdmissionViewStep1Props = {
  onSelectApplication?: (application: UniversityAdmissionApplication) => void;
};

export default function GuestAdmissionViewStep1({
  onSelectApplication = undefined,
}: GuestAdmissionViewStep1Props): React.ReactNode {
  const { session } = useAuth();
  const [page, setPage] = useState(1);
  const [rows] = useState(10);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<UniversityAdmissionApplication | null>(null);

  const { data: applicationsResponse } = useGetUniversityAdmissionApplicationPaginated({
    'filter[user_id]': Number(session?.id),
    page,
    rows,
  });

  const handleViewDetails = (application: UniversityAdmissionApplication) => {
    setSelectedApplication(application);
    setIsSheetOpen(true);
  };

  const columns = useMemo<TableColumn<UniversityAdmissionApplication>[]>(
    () => [
      {
        key: 'temporary_id',
        title: 'Application ID',
      },
      {
        key: 'latest_status_label',
        title: 'Status',
      },
      {
        key: 'is_passed',
        title: 'Exam Result',
        render: (value) => {
          if (value === null || value === undefined) return 'NOT TAKEN';
          return value ? 'Passed' : 'Failed';
        },
      },
      {
        key: 'score',
        title: 'Score',
        render: (value) => (value !== null && value !== undefined ? String(value) : 'N/A'),
      },
      {
        key: 'created_at',
        title: 'Date Applied',
        render: (value) => dateToWord(value as string),
      },
      {
        key: 'menu',
        title: 'Actions',
        render: (_value, row) => {
          return (
            <div>
              <Menu
                items={[
                  {
                    label: 'Details',
                    icon: <EyeIcon className="h-4 w-4" />,
                    onClick: () => handleViewDetails(row),
                  },
                ]}
                trigger={
                  <Button variant="outline" size="icon">
                    <EllipsisIcon />
                  </Button>
                }
              />
            </div>
          );
        },
      },
    ],
    []
  );

  const tableItems = useMemo(() => applicationsResponse?.data?.data ?? [], [applicationsResponse]);

  const paginationMeta = useMemo(() => {
    return applicationsResponse?.data;
  }, [applicationsResponse]);

  const getStatusColor = (color?: string) => {
    switch (color) {
      case AdmissionApplicationLogTypeEnum.accepted:
        return 'text-green-500';
      case AdmissionApplicationLogTypeEnum.approved:
        return 'text-green-500';
      case AdmissionApplicationLogTypeEnum.rejected:
        return 'text-red-500';
      case AdmissionApplicationLogTypeEnum.cancelled:
        return 'text-gray-500';
      case AdmissionApplicationLogTypeEnum.submitted:
        return 'text-blue-500';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBackground = (color?: string) => {
    switch (color) {
      case AdmissionApplicationLogTypeEnum.accepted:
        return 'bg-green-500';
      case AdmissionApplicationLogTypeEnum.rejected:
        return 'bg-red-500';
      case AdmissionApplicationLogTypeEnum.cancelled:
        return 'bg-gray-500';
      case AdmissionApplicationLogTypeEnum.submitted:
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  };

  const timelineLogs = useMemo(() => {
    if (!selectedApplication?.logs) return [];
    return selectedApplication.logs.map((log) => ({
      key: String(log.id),
      dateTime: log.created_at ?? '',
      label: log.type_label ?? '',
      description: log.note ?? '',
      user: log.user?.name ?? '',
      color: getStatusColor(log.type),
      background: getStatusBackground(log.type),
    }));
  }, [selectedApplication]);

  return (
    <div>
      <Table
        columns={columns}
        rows={tableItems}
        itemsPerPage={rows}
        pagination={paginationMeta}
        onPageChange={setPage}
        showPagination={true}
        onClickRow={(row) => {
          (row.next_step == UniversityAdmissionStepEnum.not_eligible && handleViewDetails(row)) ||
            onSelectApplication?.(row);
        }}
      />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
          <SheetHeader className="space-y-3 pb-6 border-b px-6 pt-6 bg-muted/10">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold">Application Details</SheetTitle>
              {selectedApplication && (
                <Badge
                  variant={selectedApplication?.is_passed ? 'default' : 'secondary'}
                  className="bg-background"
                >
                  {selectedApplication?.latest_status_label}
                </Badge>
              )}
            </div>
            <SheetDescription>
              Application ID:{' '}
              <span className="font-mono text-foreground font-medium">
                {selectedApplication?.temporary_id}
              </span>
            </SheetDescription>
          </SheetHeader>

          {selectedApplication && (
            <ScrollArea className="flex-1 h-full">
              <div className="p-6 space-y-6">
                {/* Application Status */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Status</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2">
                      <Badge variant={selectedApplication?.is_passed ? 'default' : 'secondary'}>
                        {selectedApplication?.latest_status_label}
                      </Badge>
                      {selectedApplication?.is_passed !== null &&
                        selectedApplication?.is_passed !== undefined && (
                          <Badge
                            variant={selectedApplication.is_passed ? 'default' : 'destructive'}
                          >
                            {selectedApplication.is_passed ? 'Passed' : 'Failed'}
                          </Badge>
                        )}
                    </div>
                    {selectedApplication?.score !== null &&
                      selectedApplication?.score !== undefined && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Score: {selectedApplication.score}
                        </p>
                      )}
                  </CardContent>
                </Card>

                {/* University Admission Details */}
                {selectedApplication?.university_admission && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Admission Details</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3 text-sm">
                      <div>
                        <p className="font-medium">
                          {selectedApplication.university_admission.title}
                        </p>
                        <p className="text-muted-foreground">
                          School Year: {selectedApplication.university_admission.school_year?.name}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CalendarIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Admission Period</p>
                          <p>
                            {dateToWord(selectedApplication.university_admission.open_date)} -{' '}
                            {dateToWord(selectedApplication.university_admission.close_date)}
                          </p>
                        </div>
                      </div>

                      {/* Testing Center Details */}
                      {selectedApplication.university_admission_schedule_id &&
                      selectedApplication.university_admission_schedule ? (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Testing Schedule</h4>
                          <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                            <div className="flex items-start gap-2">
                              <ClockIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <div>
                                <p className="text-muted-foreground text-xs">Date & Time</p>
                                <p className="text-sm">
                                  {dateToWord(
                                    selectedApplication.university_admission_schedule.start_date
                                  )}
                                </p>
                              </div>
                            </div>
                            {selectedApplication.university_admission_schedule.testing_center
                              ?.room && (
                              <div className="flex items-start gap-2">
                                <MapPinIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                <div>
                                  <p className="text-muted-foreground text-xs">Location</p>
                                  <p className="text-sm">
                                    {
                                      selectedApplication.university_admission_schedule
                                        .testing_center.room.name
                                    }{' '}
                                    (
                                    {
                                      selectedApplication.university_admission_schedule
                                        .testing_center.room.room_code
                                    }
                                    )
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {
                                      selectedApplication.university_admission_schedule
                                        .testing_center.room.building?.name
                                    }
                                    ,{' '}
                                    {
                                      selectedApplication.university_admission_schedule
                                        .testing_center.room.building?.campus?.name
                                    }
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Testing Schedule</h4>
                          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
                            <AlertCircleIcon className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                            <AlertTitle className="text-amber-800 dark:text-amber-200">
                              Schedule Not Selected
                            </AlertTitle>
                            <AlertDescription className="text-amber-700 dark:text-amber-300">
                              Testing schedule has not been selected yet. Please select a schedule
                              to proceed with your application.
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Submitted Files */}
                {selectedApplication?.university_admission_criteria_submissions &&
                  selectedApplication.university_admission_criteria_submissions.length > 0 && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Submitted Files</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-3">
                        {selectedApplication.university_admission_criteria_submissions.map(
                          (submission) =>
                            submission.files?.map((file) => (
                              <div
                                key={file.id}
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <FileIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {file.mime_type} •{' '}
                                      {file.size ? (file.size / 1024).toFixed(2) : '0'} KB
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="shrink-0"
                                  onClick={() => {
                                    const url = `/storage/${file.model_id}/${file.file_name}`;
                                    window.open(url, '_blank');
                                  }}
                                >
                                  <DownloadIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            ))
                        )}
                      </CardContent>
                    </Card>
                  )}

                {/* Timeline of Logs */}
                {selectedApplication?.logs && selectedApplication.logs.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <ClockIcon className="h-4 w-4" /> Timeline History
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Timeline logs={timelineLogs} />
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
