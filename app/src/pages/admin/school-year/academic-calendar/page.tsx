import { useConfirm } from '@/components/confirm.provider';
import { useModal } from '@/components/custom/modal.component';
import Select from '@/components/custom/select.component';
import TitledPage from '@/components/pages/titled.page';
import AcademicCalendarModal from '@/components/school-year/academic-calendar.modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarEventEnum } from '@/enums/calendar-event-enum';
import { decryptId } from '@/lib/hash';
import { cn } from '@/lib/utils';
import {
  useDeleteAcademicCalendar,
  useGetAcademicCalendarPaginated,
  useGetSchoolYearById,
} from '@rest/api';
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
  CalendarEventEnum,
  { color: string; bgColor: string; icon: React.ReactNode; label: string }
> = {
  [CalendarEventEnum.REGISTRATION]: {
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    icon: <EditIcon className="h-4 w-4" />,
    label: 'Registration',
  },
  [CalendarEventEnum.ENROLLMENT]: {
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
    icon: <BookOpenIcon className="h-4 w-4" />,
    label: 'Enrollment',
  },
  [CalendarEventEnum.ORIENTATION]: {
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800',
    icon: <GraduationCapIcon className="h-4 w-4" />,
    label: 'Orientation',
  },
  [CalendarEventEnum.START_OF_CLASSES]: {
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
    icon: <CalendarIcon className="h-4 w-4" />,
    label: 'Start of Classes',
  },
  [CalendarEventEnum.HOLIDAY]: {
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    icon: <StarIcon className="h-4 w-4" />,
    label: 'Holiday',
  },
  [CalendarEventEnum.UNIVERSITY_EVENT]: {
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800',
    icon: <TrophyIcon className="h-4 w-4" />,
    label: 'University Event',
  },
  [CalendarEventEnum.DEADLINE]: {
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
    icon: <BellIcon className="h-4 w-4" />,
    label: 'Deadline',
  },
  [CalendarEventEnum.PERIODIC_EXAM]: {
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800',
    icon: <BookOpenIcon className="h-4 w-4" />,
    label: 'Periodic Exam',
  },
  [CalendarEventEnum.END_OF_CLASSES]: {
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800',
    icon: <CalendarIcon className="h-4 w-4" />,
    label: 'End of Classes',
  },
  [CalendarEventEnum.GRADE_SUBMISSION]: {
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800',
    icon: <EditIcon className="h-4 w-4" />,
    label: 'Grade Submission',
  },
  [CalendarEventEnum.GRADUATION]: {
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800',
    icon: <GraduationCapIcon className="h-4 w-4" />,
    label: 'Graduation',
  },
  [CalendarEventEnum.FACULTY_EVALUATION]: {
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800',
    icon: <EditIcon className="h-4 w-4" />,
    label: 'Faculty Evaluation',
  },
  [CalendarEventEnum.ACADEMIC_TRANSITION]: {
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
    icon: <CalendarIcon className="h-4 w-4" />,
    label: 'Academic Transition',
  },
  [CalendarEventEnum.OTHER]: {
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-800',
    icon: <CalendarIcon className="h-4 w-4" />,
    label: 'Other',
  },
};

// Minimalistic and catchy SchoolYear info banner
function SchoolYearDisplay({ data }: { data: any }) {
  return (
    <div className="mb-6 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <CalendarIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{data.name}</h3>
            <p className="text-sm text-muted-foreground">{data.school_year_code}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {data.is_current && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-950 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
              <StarIcon className="h-3 w-3 fill-current" />
              Current
            </span>
          )}
          {data.is_locked ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
              <LockIcon className="h-3 w-3" />
              Locked
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-950 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-300">
              <UnlockIcon className="h-3 w-3" />
              Open
            </span>
          )}
          {data.is_active ? (
            <span className="inline-flex rounded-full bg-green-100 dark:bg-green-950 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-300">
              Active
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-red-100 dark:bg-red-950 px-2.5 py-1 text-xs font-medium text-red-700 dark:text-red-300">
              Inactive
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-6 text-sm text-muted-foreground border-t pt-3">
        <span>
          <strong className="text-foreground">Start:</strong>{' '}
          {data.start_date
            ? new Date(data.start_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : '-'}
        </span>
        <span>
          <strong className="text-foreground">End:</strong>{' '}
          {data.end_date
            ? new Date(data.end_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : '-'}
        </span>
      </div>
    </div>
  );
}

// Calendar Event Card Component
function CalendarEventCard({
  event,
  onEdit,
  onDelete,
}: {
  event: any;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const config =
    EVENT_CONFIG[event.event as CalendarEventEnum] || EVENT_CONFIG[CalendarEventEnum.OTHER];
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

  const getDuration = () => {
    if (!startDate || !endDate) return null;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Same day';
    if (diffDays === 1) return '1 day';
    return `${diffDays} days`;
  };

  return (
    <div
      className={cn(
        'group relative rounded-lg border-l-4 p-4 transition-all hover:shadow-md border',
        config.bgColor
      )}
    >
      {/* Event Type Badge */}
      <div className="mb-3 flex items-center justify-between">
        <Badge variant="outline" className={cn('gap-1.5', config.color)}>
          {config.icon}
          {config.label}
        </Badge>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
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

      {/* Event Name */}
      <h3 className="mb-2 font-semibold text-foreground">{event.name}</h3>

      {/* Date Information */}
      <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-3.5 w-3.5" />
          <span>
            {formatDate(startDate)}
            {endDate && startDate?.getTime() !== endDate?.getTime() && (
              <> → {formatDate(endDate)}</>
            )}
          </span>
        </div>
        {getDuration() && (
          <div className="flex items-center gap-2">
            <ClockIcon className="h-3.5 w-3.5" />
            <span>{getDuration()}</span>
          </div>
        )}
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
    include: 'schoolYear',
    page: 1,
    rows: 50,
  });

  const { mutateAsync: deleteAcademicCalendar } = useDeleteAcademicCalendar();

  const controller = useModal<any>();

  // Get all events and sort by start_date
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
    const types = new Set<CalendarEventEnum>();
    allEvents.forEach((event: any) => {
      if (event.event && Object.values(CalendarEventEnum).includes(event.event)) {
        types.add(event.event as CalendarEventEnum);
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
        const config = EVENT_CONFIG[type] || EVENT_CONFIG[CalendarEventEnum.OTHER];
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

  // Minimalistic skeleton loader for school year details
  const SchoolYearSkeleton = (
    <div className="mb-6 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-6 border-t pt-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-32" />
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
        <div className="mb-6 py-8 px-6 rounded-xl border border-dashed bg-muted/20 text-center">
          <p className="text-muted-foreground font-medium">No school year data found.</p>
        </div>
      );
    }
    return <SchoolYearDisplay data={schoolYearData.data} />;
  }

  return (
    <TitledPage
      title="Academic Calendar"
      description="Manage all academic calendar events for the selected school year."
    >
      <SchoolYearDetails />

      {/* Action Bar with Filters and Add Button */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FilterIcon className="h-4 w-4" />
            <span className="font-medium text-nowrap">Filter by:</span>
          </div>
          <Select
            options={filterOptions}
            value={selectedFilter}
            onValueChange={(val) => setSelectedFilter(val as CalendarEventEnum)}
            placeholder="Select event type"
          />
        </div>
        <Button className="gap-2" onClick={() => controller.openFn()}>
          <PlusIcon className="h-4 w-4" />
          Add Calendar Entry
        </Button>
      </div>

      {/* Events Grid */}
      {isLoadingCalendars ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-36 rounded-lg" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="py-12 text-center">
          <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No events found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {selectedFilter === 'ALL'
              ? 'Get started by adding your first calendar entry.'
              : `No ${EVENT_CONFIG[selectedFilter as CalendarEventEnum]?.label || selectedFilter} events found.`}
          </p>
          <Button className="mt-4 gap-2" onClick={() => controller.openFn()}>
            <PlusIcon className="h-4 w-4" />
            Add Calendar Entry
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event: any) => (
            <CalendarEventCard
              key={event.id}
              event={event}
              onEdit={() => controller.openFn(event)}
              onDelete={() => handleDelete(event)}
            />
          ))}
        </div>
      )}

      {/* Pagination Info */}
      {filteredEvents.length > 0 && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
          {selectedFilter !== 'ALL' &&
            ` (${EVENT_CONFIG[selectedFilter as CalendarEventEnum]?.label || selectedFilter})`}
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
