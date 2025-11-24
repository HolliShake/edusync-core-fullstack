import { useConfirm } from '@/components/confirm.provider';
import { useModal } from '@/components/custom/modal.component';
import Select from '@/components/custom/select.component';
import TitledPage from '@/components/pages/titled.page';
import AcademicCalendarModal from '@/components/school-year/academic-calendar.modal';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { decryptId } from '@/lib/hash';
import { cn } from '@/lib/utils';
import {
  useDeleteAcademicCalendar,
  useGetAcademicCalendarPaginated,
  useGetSchoolYearById,
  useUpdateAcademicCalendarMultiple,
} from '@rest/api';
import { AcademicCalendarEventEnum } from '@rest/models';
import {
  ArrowRightIcon,
  CalendarIcon,
  CalendarRangeIcon,
  DeleteIcon,
  EditIcon,
  FilterIcon,
  GripVerticalIcon,
  InfoIcon,
  PlusIcon,
} from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

// Event type configurations
const EVENT_CONFIG: Record<AcademicCalendarEventEnum, { label: string; color: string }> = {
  [AcademicCalendarEventEnum.REGISTRATION]: {
    label: 'Registration',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
  },
  [AcademicCalendarEventEnum.ENROLLMENT]: {
    label: 'Enrollment',
    color: 'bg-purple-100 text-purple-700 border-purple-300',
  },
  [AcademicCalendarEventEnum.ADDING_DROPPING_OF_SUBJECTS]: {
    label: 'Adding/Dropping',
    color: 'bg-sky-100 text-sky-700 border-sky-300',
  },
  [AcademicCalendarEventEnum.ORIENTATION]: {
    label: 'Orientation',
    color: 'bg-cyan-100 text-cyan-700 border-cyan-300',
  },
  [AcademicCalendarEventEnum.START_OF_CLASSES]: {
    label: 'Start of Classes',
    color: 'bg-green-100 text-green-700 border-green-300',
  },
  [AcademicCalendarEventEnum.ACADEMIC_TRANSITION]: {
    label: 'Academic Transition',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  },
  [AcademicCalendarEventEnum.PERIODIC_EXAM]: {
    label: 'Periodic Exam',
    color: 'bg-orange-100 text-orange-700 border-orange-300',
  },
  [AcademicCalendarEventEnum.END_OF_CLASSES]: {
    label: 'End of Classes',
    color: 'bg-rose-100 text-rose-700 border-rose-300',
  },
  [AcademicCalendarEventEnum.FACULTY_EVALUATION]: {
    label: 'Faculty Evaluation',
    color: 'bg-pink-100 text-pink-700 border-pink-300',
  },
  [AcademicCalendarEventEnum.GRADE_SUBMISSION]: {
    label: 'Grade Submission',
    color: 'bg-teal-100 text-teal-700 border-teal-300',
  },
  [AcademicCalendarEventEnum.GRADUATION]: {
    label: 'Graduation',
    color: 'bg-violet-100 text-violet-700 border-violet-300',
  },
  [AcademicCalendarEventEnum.UNIVERSITY_EVENT]: {
    label: 'University Event',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  },
  [AcademicCalendarEventEnum.HOLIDAY]: {
    label: 'Holiday',
    color: 'bg-amber-100 text-amber-700 border-amber-300',
  },
  [AcademicCalendarEventEnum.OTHER]: {
    label: 'Other',
    color: 'bg-gray-100 text-gray-700 border-gray-300',
  },
};

const ITEM_TYPE = 'CALENDAR_EVENT';

// Simple SchoolYear info
function SchoolYearDisplay({ data }: { data: any }) {
  return (
    <div className="rounded-md border bg-card p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CalendarRangeIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate font-semibold text-base leading-tight">{data.name}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{data.school_year_code}</p>
            <div className="mt-2 flex gap-3 text-xs">
              <div className="flex items-center gap-1.5 rounded-sm bg-muted/50 px-1.5 py-0.5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Start
                </span>
                <span className="font-medium">
                  {data.start_date ? new Date(data.start_date).toLocaleDateString() : '-'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-sm bg-muted/50 px-1.5 py-0.5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  End
                </span>
                <span className="font-medium">
                  {data.end_date ? new Date(data.end_date).toLocaleDateString() : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="ml-2 flex flex-col items-end gap-1.5">
          {data.is_current && (
            <Badge variant="default" className="text-[10px] px-1.5 py-0.5 h-5">
              Current
            </Badge>
          )}
          {data.is_active ? (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0.5 h-5 border-green-200 bg-green-50 text-green-700"
            >
              Active
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 h-5">
              Inactive
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

// Modern, compact Event Card with Google Material Design principles
function EventCard({
  event,
  index,
  onEdit,
  onDelete,
  onMove,
  onDragStart,
  onDragEnd,
  canDrag = true,
}: {
  event: any;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  canDrag?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config =
    EVENT_CONFIG[event.event as AcademicCalendarEventEnum] ||
    EVENT_CONFIG[AcademicCalendarEventEnum.OTHER];
  const startDate = event.start_date ? new Date(event.start_date) : null;
  const endDate = event.end_date ? new Date(event.end_date) : null;

  // Compact date formatting for modern UI
  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    const today = new Date();
    const isCurrentYear = date.getFullYear() === today.getFullYear();
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: isCurrentYear ? undefined : 'numeric',
    });
  };

  // Calculate duration for better UX
  const getDuration = () => {
    if (!startDate || !endDate || startDate.getTime() === endDate.getTime()) return null;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return days === 1 ? '1 day' : `${days} days`;
  };

  const ref = useRef<HTMLDivElement>(null);
  const prevDraggingRef = useRef(false);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ITEM_TYPE,
      item: { index, id: event.id },
      canDrag: canDrag,
      end: () => {
        onDragEnd();
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [index, event.id, canDrag, onDragEnd]
  );

  useEffect(() => {
    if (isDragging && !prevDraggingRef.current && canDrag) {
      onDragStart();
    }
    prevDraggingRef.current = isDragging;
  }, [isDragging, canDrag, onDragStart]);

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    canDrop: () => canDrag,
    hover: (item: { index: number; id: number }) => {
      if (!ref.current || !canDrag) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  const duration = getDuration();

  return (
    <div
      ref={ref}
      className={cn(
        'group relative rounded-lg border bg-card transition-all duration-200',
        'hover:border-primary/30',
        isDragging && 'opacity-40 scale-95 shadow-lg',
        isOver && 'ring-2 ring-primary/50 bg-primary/5 border-primary/50'
      )}
    >
      <div
        className="flex items-center gap-2 px-3 py-2.5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Drag handle - only visible when draggable */}
        {canDrag && (
          <div
            className={cn(
              'shrink-0 -ml-1 mr-0.5 cursor-grab active:cursor-grabbing',
              'opacity-0 group-hover:opacity-40 hover:!opacity-70 transition-opacity duration-150'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVerticalIcon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}

        {/* Badge - more compact */}
        <Badge
          className={cn(
            'text-[10px] font-medium px-2 py-0.5 leading-none shrink-0 rounded-md border-0',
            config.color
          )}
        >
          {config.label}
        </Badge>

        {/* Event content - optimized layout */}
        <div className="min-w-0 flex-1 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-medium text-sm text-foreground">{event.name}</h3>
          </div>

          {/* Date info - inline and compact */}
          <div className="flex items-center gap-2 shrink-0 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CalendarIcon className="h-3 w-3" />
              <span className="font-medium whitespace-nowrap">{formatDate(startDate)}</span>
              {endDate && startDate?.getTime() !== endDate?.getTime() && (
                <>
                  <ArrowRightIcon className="h-2.5 w-2.5 text-muted-foreground/60" />
                  <span className="font-medium whitespace-nowrap">{formatDate(endDate)}</span>
                </>
              )}
            </div>

            {/* Duration badge - only if multi-day */}
            {duration && (
              <span className="text-[10px] text-muted-foreground/70 bg-muted/50 px-1.5 py-0.5 rounded whitespace-nowrap">
                {duration}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons - always visible */}
        <div className="flex shrink-0 gap-0.5" onClick={(e) => e.stopPropagation()}>
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              'h-8 w-8 rounded-md',
              'text-muted-foreground hover:text-primary hover:bg-primary/10',
              'transition-all duration-150'
            )}
            onClick={onEdit}
            aria-label="Edit event"
          >
            <EditIcon className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              'h-8 w-8 rounded-md',
              'text-muted-foreground hover:text-destructive hover:bg-destructive/10',
              'transition-all duration-150'
            )}
            onClick={onDelete}
            aria-label="Delete event"
          >
            <DeleteIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Expanded description section */}
      {isExpanded && event.description && (
        <div className="px-3 pb-2.5 pt-0">
          <div className="border-t pt-2">
            <p className="text-xs text-muted-foreground whitespace-pre-wrap">{event.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminAcademicCalendarPageContent(): React.ReactNode {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [localEvents, setLocalEvents] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragOperationRef = useRef<{
    originalDragIndex: number;
    originalDropIndex: number;
    draggedEventId: number;
  } | null>(null);
  const originalEventsRef = useRef<any[]>([]);

  const { mutateAsync: updateAcademicCalendarMultiple } = useUpdateAcademicCalendarMultiple();

  const { schoolYearId } = useParams();
  const navigate = useNavigate();
  const confirm = useConfirm();

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

  useEffect(() => {
    if (isSchoolYearError) {
      navigate(-1);
    }
  }, [isSchoolYearError, navigate]);

  const {
    data: calendars,
    refetch,
    isLoading: isLoadingCalendars,
  } = useGetAcademicCalendarPaginated({
    'filter[school_year_id]': Number(decryptId(schoolYearId as string)),
    sort: 'order',
    page: 1,
    rows: 50,
  });

  const { mutateAsync: deleteAcademicCalendar } = useDeleteAcademicCalendar();

  const controller = useModal<any>();

  const allEvents = useMemo(() => {
    const events = calendars?.data?.data ?? [];
    return events.sort((a: any, b: any) => {
      return (a.order ?? 0) - (b.order ?? 0);
    });
  }, [calendars]);

  useEffect(() => {
    setLocalEvents(allEvents);
  }, [allEvents]);

  const filteredEvents = useMemo(() => {
    if (selectedFilter === 'ALL') return localEvents;
    return localEvents.filter((event: any) => event.event === selectedFilter);
  }, [localEvents, selectedFilter]);

  const eventTypes = useMemo(() => {
    const types = new Set<AcademicCalendarEventEnum>();
    allEvents.forEach((event: any) => {
      if (event.event && Object.values(AcademicCalendarEventEnum).includes(event.event)) {
        types.add(event.event as AcademicCalendarEventEnum);
      }
    });
    return Array.from(types);
  }, [allEvents]);

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

  const moveEvent = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (selectedFilter !== 'ALL') return;

      if (!dragOperationRef.current) {
        originalEventsRef.current = [...localEvents];
        const draggedEvent = localEvents[dragIndex];
        dragOperationRef.current = {
          originalDragIndex: dragIndex,
          originalDropIndex: hoverIndex,
          draggedEventId: draggedEvent.id,
        };
      } else {
        dragOperationRef.current.originalDropIndex = hoverIndex;
      }

      const draggedEvent = localEvents[dragIndex];
      const newEvents = [...localEvents];
      newEvents.splice(dragIndex, 1);
      newEvents.splice(hoverIndex, 0, draggedEvent);
      setLocalEvents(newEvents);
    },
    [localEvents, selectedFilter]
  );

  const handleDragEnd = useCallback(async () => {
    if (!isDragging || selectedFilter !== 'ALL') {
      dragOperationRef.current = null;
      originalEventsRef.current = [];
      setIsDragging(false);
      return;
    }

    try {
      const dragOp = dragOperationRef.current;
      const originalEvents = originalEventsRef.current;

      if (!dragOp || originalEvents.length === 0) {
        const updatedEvents = localEvents.map((event, index) => ({
          ...event,
          order: index + 1,
        }));
        await updateAcademicCalendarMultiple({ data: updatedEvents });
        await refetch();
        toast.success('Order updated successfully.');
        return;
      }

      const originalDraggedEvent = originalEvents[dragOp.originalDragIndex];
      const originalDroppedEvent = originalEvents[dragOp.originalDropIndex];

      const updatedEvents = localEvents.map((event, index) => {
        const updateData: any = {
          ...event,
          order: index + 1,
        };

        if (event.id === originalDraggedEvent.id) {
          updateData.start_date = originalDroppedEvent.start_date;
          updateData.end_date = originalDroppedEvent.end_date;
        } else if (event.id === originalDroppedEvent.id) {
          updateData.start_date = originalDraggedEvent.start_date;
          updateData.end_date = originalDraggedEvent.end_date;
        }

        return updateData;
      });

      await updateAcademicCalendarMultiple({ data: updatedEvents });
      await refetch();
      toast.success('Order and dates updated successfully.');
    } catch (e: any) {
      toast.error('Failed to update order.');
      setLocalEvents(allEvents);
    } finally {
      dragOperationRef.current = null;
      originalEventsRef.current = [];
      setIsDragging(false);
    }
  }, [localEvents, allEvents, updateAcademicCalendarMultiple, refetch, isDragging, selectedFilter]);

  function SchoolYearDetails() {
    if (isSchoolYearLoading) {
      return (
        <div className="block rounded-md border bg-card p-2.5">
          <Skeleton className="mb-1.5 h-4 w-48" />
          <Skeleton className="h-3 w-32" />
          <div className="mt-2 flex gap-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      );
    }
    if (!schoolYearData?.data) {
      return (
        <div className="rounded-md border border-dashed bg-muted/20 p-2.5 text-center">
          <p className="text-xs text-muted-foreground">No school year data found.</p>
        </div>
      );
    }
    return <SchoolYearDisplay data={schoolYearData.data} />;
  }

  return (
    <TitledPage
      title="Academic Calendar"
      description="Manage academic events for the selected school year."
    >
      <div className="block space-y-2">
        <SchoolYearDetails />

        {/* Instruction Alert */}
        <Alert className="block">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Event Ordering Guidelines</AlertTitle>
          <AlertDescription>
            Events should typically be ordered chronologically: Registration → Enrollment →
            Orientation → Start of Classes → Adding/Dropping of Subjects → Academic Transition →
            Periodic Exam → End of Classes → Faculty Evaluation → Grade Submission → Graduation.
          </AlertDescription>
        </Alert>

        {/* Action Bar */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-md border bg-card p-2">
          <div className="flex items-center gap-1.5">
            <FilterIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Filter:</span>
            <Select
              options={filterOptions}
              value={selectedFilter}
              onValueChange={(val) => setSelectedFilter(val as AcademicCalendarEventEnum)}
              placeholder="Select event type"
            />
          </div>
          <Button size="sm" className="h-8 text-xs" onClick={() => controller.openFn()}>
            <PlusIcon className="mr-1 h-3.5 w-3.5" />
            Add Entry
          </Button>
        </div>

        {/* Events List */}
        {isLoadingCalendars ? (
          [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16 w-full rounded-md" />)
        ) : filteredEvents.length === 0 ? (
          <div className="rounded-md border border-dashed bg-muted/20 py-8 text-center">
            <CalendarIcon className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-3 font-semibold text-sm">No events found</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {selectedFilter === 'ALL'
                ? 'Start building your academic calendar by adding your first event.'
                : `No ${EVENT_CONFIG[selectedFilter as AcademicCalendarEventEnum]?.label || selectedFilter} events scheduled yet.`}
            </p>
            <Button size="sm" className="mt-3 h-8 text-xs" onClick={() => controller.openFn()}>
              <PlusIcon className="mr-1 h-3.5 w-3.5" />
              Add Entry
            </Button>
          </div>
        ) : (
          [
            ...filteredEvents.map((event: any, index: number) => {
              const actualIndex = localEvents.findIndex((e) => e.id === event.id);
              return (
                <EventCard
                  key={event.id}
                  event={event}
                  index={actualIndex >= 0 ? actualIndex : index}
                  onEdit={() => controller.openFn(event)}
                  onDelete={() => handleDelete(event)}
                  onMove={moveEvent}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={handleDragEnd}
                  canDrag={selectedFilter === 'ALL'}
                />
              );
            }),
            <div className="mt-2.5 rounded-md border bg-card p-1.5 text-center">
              <p className="text-[10px] text-muted-foreground">
                Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                {selectedFilter !== 'ALL' &&
                  ` in ${EVENT_CONFIG[selectedFilter as AcademicCalendarEventEnum]?.label || selectedFilter}`}
              </p>
            </div>,
          ]
        )}
      </div>

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

export default function AdminAcademicCalendarPage(): React.ReactNode {
  return (
    <DndProvider backend={HTML5Backend}>
      <AdminAcademicCalendarPageContent />
    </DndProvider>
  );
}
