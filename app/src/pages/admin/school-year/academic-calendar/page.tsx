import { useConfirm } from '@/components/confirm.provider';
import { useModal } from '@/components/custom/modal.component';
import Select from '@/components/custom/select.component';
import TitledPage from '@/components/pages/titled.page';
import AcademicCalendarModal from '@/components/school-year/academic-calendar.modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { decryptId } from '@/lib/hash';
import { cn } from '@/lib/utils';
import {
  useDeleteAcademicCalendar,
  useGetAcademicCalendarPaginated,
  useGetSchoolYearById,
} from '@rest/api';
import { AcademicCalendarEventEnum } from '@rest/models';
import {
  BellIcon,
  BookOpenIcon,
  CalendarIcon,
  ClockIcon,
  DeleteIcon,
  EditIcon,
  FilterIcon,
  GraduationCapIcon,
  LockIcon,
  PlusIcon,
  StarIcon,
  TrophyIcon,
  UnlockIcon,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

// Event type configurations with colors and icons
const EVENT_CONFIG: Record<
  AcademicCalendarEventEnum,
  { color: string; bgColor: string; icon: React.ReactNode; label: string }
> = {
  [AcademicCalendarEventEnum.REGISTRATION]: {
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    icon: <EditIcon className="h-3.5 w-3.5" />,
    label: 'Registration',
  },
  [AcademicCalendarEventEnum.ENROLLMENT]: {
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
    icon: <BookOpenIcon className="h-3.5 w-3.5" />,
    label: 'Enrollment',
  },
  [AcademicCalendarEventEnum.ORIENTATION]: {
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800',
    icon: <GraduationCapIcon className="h-3.5 w-3.5" />,
    label: 'Orientation',
  },
  [AcademicCalendarEventEnum.START_OF_CLASSES]: {
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
    icon: <CalendarIcon className="h-3.5 w-3.5" />,
    label: 'Start of Classes',
  },
  [AcademicCalendarEventEnum.HOLIDAY]: {
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    icon: <StarIcon className="h-3.5 w-3.5" />,
    label: 'Holiday',
  },
  [AcademicCalendarEventEnum.UNIVERSITY_EVENT]: {
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800',
    icon: <TrophyIcon className="h-3.5 w-3.5" />,
    label: 'University Event',
  },
  [AcademicCalendarEventEnum.DEADLINE]: {
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
    icon: <BellIcon className="h-3.5 w-3.5" />,
    label: 'Deadline',
  },
  [AcademicCalendarEventEnum.PERIODIC_EXAM]: {
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800',
    icon: <BookOpenIcon className="h-3.5 w-3.5" />,
    label: 'Periodic Exam',
  },
  [AcademicCalendarEventEnum.END_OF_CLASSES]: {
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800',
    icon: <CalendarIcon className="h-3.5 w-3.5" />,
    label: 'End of Classes',
  },
  [AcademicCalendarEventEnum.GRADE_SUBMISSION]: {
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800',
    icon: <EditIcon className="h-3.5 w-3.5" />,
    label: 'Grade Submission',
  },
  [AcademicCalendarEventEnum.GRADUATION]: {
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800',
    icon: <GraduationCapIcon className="h-3.5 w-3.5" />,
    label: 'Graduation',
  },
  [AcademicCalendarEventEnum.FACULTY_EVALUATION]: {
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800',
    icon: <EditIcon className="h-3.5 w-3.5" />,
    label: 'Faculty Evaluation',
  },
  [AcademicCalendarEventEnum.ACADEMIC_TRANSITION]: {
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
    icon: <CalendarIcon className="h-3.5 w-3.5" />,
    label: 'Academic Transition',
  },
  [AcademicCalendarEventEnum.OTHER]: {
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-800',
    icon: <CalendarIcon className="h-3.5 w-3.5" />,
    label: 'Other',
  },
};

// Compact SchoolYear info banner
function SchoolYearDisplay({ data }: { data: any }) {
  return (
    <div className="mb-6 overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <CalendarIcon className="h-4 w-4 text-primary" />
              </div>
              {data.is_current && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
                  <StarIcon className="h-2.5 w-2.5 fill-current" />
                  CURRENT
                </span>
              )}
            </div>

            <h2 className="mb-0.5 font-bold text-xl tracking-tight">{data.name}</h2>
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
              {data.school_year_code}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            {data.is_locked ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive">
                <LockIcon className="h-3 w-3" />
                LOCKED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-600 dark:text-green-400">
                <UnlockIcon className="h-3 w-3" />
                OPEN
              </span>
            )}
            {data.is_active ? (
              <span className="inline-flex justify-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-600 dark:text-green-400">
                ACTIVE
              </span>
            ) : (
              <span className="inline-flex justify-center rounded-md bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-600 dark:text-red-400">
                INACTIVE
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-3">
          <div className="space-y-0.5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Start Date
            </p>
            <p className="font-semibold text-sm">
              {data.start_date
                ? new Date(data.start_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : '-'}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              End Date
            </p>
            <p className="font-semibold text-sm">
              {data.end_date
                ? new Date(data.end_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact Timeline Event Card Component
function TimelineEventCard({
  event,
  onEdit,
  onDelete,
  isFirst,
  isLast,
}: {
  event: any;
  onEdit: () => void;
  onDelete: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const config =
    EVENT_CONFIG[event.event as AcademicCalendarEventEnum] ||
    EVENT_CONFIG[AcademicCalendarEventEnum.OTHER];
  const startDate = event.start_date ? new Date(event.start_date) : null;
  const endDate = event.end_date ? new Date(event.end_date) : null;

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatMonthYear = (date: Date | null) => {
    if (!date) return '-';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  const getDuration = () => {
    if (!startDate || !endDate) return null;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Same day';
    if (diffDays === 1) return '1 day';
    return `${diffDays} days`;
  };

  return (
    <div className="group relative flex gap-4">
      {/* Timeline connector */}
      <div className="relative flex flex-col items-center">
        {/* Top line */}
        {!isFirst && (
          <div className="absolute top-0 h-4 w-0.5 bg-gradient-to-b from-transparent to-border" />
        )}

        {/* Icon circle */}
        <div
          className={cn(
            'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background shadow-sm transition-all group-hover:scale-110',
            config.bgColor
          )}
        >
          <div className={config.color}>{config.icon}</div>
        </div>

        {/* Bottom line */}
        {!isLast && (
          <div className="absolute bottom-0 top-8 w-0.5 bg-gradient-to-b from-border to-transparent" />
        )}
      </div>

      {/* Content card */}
      <div className="flex-1 pb-6">
        {/* Date label */}
        <div className="mb-1.5 inline-block rounded-md bg-muted px-2 py-0.5">
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {formatMonthYear(startDate)}
          </p>
        </div>

        {/* Main card */}
        <div
          className={cn(
            'overflow-hidden rounded-lg border-l-2 bg-card shadow-sm transition-all hover:shadow-md',
            config.bgColor
          )}
        >
          <div className="p-3">
            {/* Header */}
            <div className="mb-2 flex items-start justify-between">
              <div className="flex-1">
                <Badge variant="outline" className={cn('mb-1.5 gap-1 text-xs', config.color)}>
                  {config.icon}
                  <span className="font-semibold">{config.label}</span>
                </Badge>
                <h3 className="font-bold text-base leading-tight text-foreground">{event.name}</h3>
              </div>

              <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onEdit}>
                  <EditIcon className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={onDelete}
                >
                  <DeleteIcon className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Date details */}
            <div className="space-y-1 border-t pt-2">
              <div className="flex items-center gap-2 text-xs">
                <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium">
                  {formatDate(startDate)}
                  {endDate && startDate?.getTime() !== endDate?.getTime() && (
                    <span className="text-muted-foreground"> → {formatDate(endDate)}</span>
                  )}
                </span>
              </div>
              {getDuration() && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ClockIcon className="h-3.5 w-3.5" />
                  <span>{getDuration()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminAcademicCalendarPage(): React.ReactNode {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const { schoolYearId } = useParams();
  const navigate = useNavigate();
  const confirm = useConfirm();

  // fetch school year data
  const {
    data: schoolYearData,
    isLoading: isSchoolYearLoading,
    isError: isSchoolYearError,
  } = useGetSchoolYearById(
    (() => {
      const decrypted = decryptId(schoolYearId as string);
      const asNum = Number(decrypted);
      return Number.isNaN(asNum) ? 0 : asNum;
    })(),
    {
      query: {
        enabled: !!schoolYearId && !Number.isNaN(Number(decryptId(schoolYearId as string))),
      },
    }
  );

  // Pop back if error in fetching schoolYearData
  useEffect(() => {
    if (isSchoolYearError) {
      navigate(-1);
    }
  }, [isSchoolYearError, navigate]);

  // fetch calendar data
  const {
    data: calendars,
    refetch,
    isLoading: isLoadingCalendars,
  } = useGetAcademicCalendarPaginated({
    'filter[school_year_id]': Number(decryptId(schoolYearId as string)),
    page: 1,
    rows: 50,
  });

  const { mutateAsync: deleteAcademicCalendar } = useDeleteAcademicCalendar();

  const controller = useModal<any>();

  // Get all events and sort by start_date (chronological order)
  const allEvents = useMemo(() => {
    const events = calendars?.data?.data ?? [];
    return events.sort((a: any, b: any) => {
      const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
      const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
      return dateA - dateB;
    });
  }, [calendars]);

  // Filter events based on selected filter
  const filteredEvents = useMemo(() => {
    if (selectedFilter === 'ALL') return allEvents;
    return allEvents.filter((event: any) => event.event === selectedFilter);
  }, [allEvents, selectedFilter]);

  // Get unique event types from data
  const eventTypes = useMemo(() => {
    const types = new Set<AcademicCalendarEventEnum>();
    allEvents.forEach((event: any) => {
      if (event.event && Object.values(AcademicCalendarEventEnum).includes(event.event)) {
        types.add(event.event as AcademicCalendarEventEnum);
      }
    });
    return Array.from(types);
  }, [allEvents]);

  // Prepare options for Select component
  const filterOptions = useMemo(() => {
    const options = [
      {
        value: 'ALL',
        label: 'All Events',
        icon: <CalendarIcon className="h-4 w-4" />,
      },
      ...eventTypes.map((type) => {
        const config = EVENT_CONFIG[type] || EVENT_CONFIG[AcademicCalendarEventEnum.OTHER];
        return {
          value: type,
          label: config.label,
          icon: config.icon,
        };
      }),
    ];
    return options;
  }, [eventTypes]);

  const handleDelete = (event: any) => {
    confirm.confirm(async () => {
      try {
        await deleteAcademicCalendar({ id: event.id });
        toast.success('Academic Calendar entry deleted.');
        refetch();
      } catch (e: any) {
        toast.error('Failed to delete entry.');
      }
    });
  };

  // Compact skeleton loader
  const SchoolYearSkeleton = (
    <div className="mb-6 overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <Skeleton className="mb-1 h-6 w-48" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-6 w-16 rounded-md" />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );

  // Render school year details
  function SchoolYearDetails() {
    if (isSchoolYearLoading) {
      return SchoolYearSkeleton;
    }
    if (!schoolYearData?.data) {
      return (
        <div className="mb-6 rounded-lg border border-dashed bg-muted/20 py-8 px-4 text-center">
          <p className="font-medium text-sm text-muted-foreground">No school year data found.</p>
        </div>
      );
    }
    return <SchoolYearDisplay data={schoolYearData.data} />;
  }

  return (
    <TitledPage
      title="Academic Calendar"
      description="A chronological timeline of all academic events for the selected school year."
    >
      <SchoolYearDetails />

      {/* Compact Action Bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
            <FilterIcon className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-nowrap">Filter:</span>
            <Select
              options={filterOptions}
              value={selectedFilter}
              onValueChange={(val) => setSelectedFilter(val as AcademicCalendarEventEnum)}
              placeholder="Select event type"
            />
          </div>
        </div>
        <Button size="sm" className="gap-1.5 shadow-sm" onClick={() => controller.openFn()}>
          <PlusIcon className="h-3.5 w-3.5" />
          Add Entry
        </Button>
      </div>

      {/* Timeline View */}
      {isLoadingCalendars ? (
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-20 rounded-md" />
                <Skeleton className="h-28 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/20 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <CalendarIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 font-bold text-base">No events found</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
            {selectedFilter === 'ALL'
              ? 'Start building your academic calendar by adding your first event.'
              : `No ${EVENT_CONFIG[selectedFilter as AcademicCalendarEventEnum]?.label || selectedFilter} events scheduled yet.`}
          </p>
          <Button size="sm" className="mt-4 gap-1.5 shadow-sm" onClick={() => controller.openFn()}>
            <PlusIcon className="h-3.5 w-3.5" />
            Add Entry
          </Button>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline container */}
          <div className="space-y-0">
            {filteredEvents.map((event: any, index: number) => (
              <TimelineEventCard
                key={event.id}
                event={event}
                onEdit={() => controller.openFn(event)}
                onDelete={() => handleDelete(event)}
                isFirst={index === 0}
                isLast={index === filteredEvents.length - 1}
              />
            ))}
          </div>

          {/* Timeline summary */}
          <div className="mt-6 rounded-lg border bg-card p-3 text-center shadow-sm">
            <p className="font-medium text-xs text-muted-foreground">
              Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
              {selectedFilter !== 'ALL' &&
                ` in ${EVENT_CONFIG[selectedFilter as AcademicCalendarEventEnum]?.label || selectedFilter}`}
            </p>
          </div>
        </div>
      )}

      <AcademicCalendarModal
        schoolYear={schoolYearData?.data}
        controller={controller}
        onSubmit={() => {
          refetch();
        }}
      />
    </TitledPage>
  );
}
