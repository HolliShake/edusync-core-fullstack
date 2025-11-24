import { useModal } from '@/components/custom/modal.component';
import Select, { type SelectOption } from '@/components/custom/select.component';
import AssignmentModal, { type AssignmentModalData } from '@/components/schedule/assignment-modal';
import SectionDetailsModal, {
  type SectionDetailsModalData,
} from '@/components/schedule/section-details-modal';
import ViewEventModal, { type ViewEventModalData } from '@/components/schedule/view-event-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth.context';
import { cn } from '@/lib/utils';
import type { EventClickArg, EventDropArg, EventInput } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import type { EventReceiveArg, EventResizeDoneArg } from '@fullcalendar/interaction/index.js';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import {
  useGetAcademicProgramPaginated,
  useGetCollegePaginated,
  useGetScheduleAssignmentBySectionCode,
  useGetSchoolYearPaginated,
  useGetSectionPaginated,
  useUpdateScheduleAssignment,
} from '@rest/api';
import { UserRoleEnum, WeeklyScheduleEnum } from '@rest/models';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  DoorOpenIcon,
  DownloadIcon,
  EyeIcon,
  RefreshCwIcon,
  SearchIcon,
  UsersIcon,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

type ScheduleViewProps = {
  role: UserRoleEnum;
};

const SECTION_COLORS = [
  {
    bg: '#3b82f6',
    border: '#2563eb',
    tailwindBorder: 'border-blue-500',
    tailwindBg: 'bg-blue-50 dark:bg-blue-950/20',
  }, // blue-500
  {
    bg: '#22c55e',
    border: '#16a34a',
    tailwindBorder: 'border-green-500',
    tailwindBg: 'bg-green-50 dark:bg-green-950/20',
  }, // green-500
  {
    bg: '#ef4444',
    border: '#dc2626',
    tailwindBorder: 'border-red-500',
    tailwindBg: 'bg-red-50 dark:bg-red-950/20',
  }, // red-500
  {
    bg: '#a855f7',
    border: '#9333ea',
    tailwindBorder: 'border-purple-500',
    tailwindBg: 'bg-purple-50 dark:bg-purple-950/20',
  }, // purple-500
  {
    bg: '#f97316',
    border: '#ea580c',
    tailwindBorder: 'border-orange-500',
    tailwindBg: 'bg-orange-50 dark:bg-orange-950/20',
  }, // orange-500
  {
    bg: '#06b6d4',
    border: '#0891b2',
    tailwindBorder: 'border-cyan-500',
    tailwindBg: 'bg-cyan-50 dark:bg-cyan-950/20',
  }, // cyan-500
];

export default function ScheduleView({ role }: ScheduleViewProps): React.ReactNode {
  const { session } = useAuth();
  const draggableRef = useRef<HTMLDivElement>(null);

  const [schoolYearId, setSchoolYearId] = useState<number | undefined>(undefined);
  const [selectedCollegeId, setSelectedCollegeId] = useState<number | undefined>(undefined);
  const [selectedProgramId, setSelectedProgramId] = useState<number | undefined>(undefined);
  const [yearOrder, setYearOrder] = useState<string>('');
  const [termOrder, setTermOrder] = useState<string>('');
  const [selectedSectionCodes, setSelectedSectionCodes] = useState<string[]>([]);
  const [openSchoolYear, setOpenSchoolYear] = useState(false);
  const [selectedSectionCode, setSelectedSectionCode] = useState<string>('');

  const showCollegeProgramFilter = useMemo(() => {
    return role === UserRoleEnum.campus_scheduler || role === UserRoleEnum.campus_registrar;
  }, [role]);

  // Modal Controllers
  const assignmentModal = useModal<AssignmentModalData>();
  const viewEventModal = useModal<ViewEventModalData>();
  const sectionDetailsModal = useModal<SectionDetailsModalData>();

  // Queries
  const {
    data: schoolYearResponse,
    refetch: refetchSchoolYears,
    isLoading: isLoadingSchoolYears,
  } = useGetSchoolYearPaginated(
    {
      sort: '-start_date',
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
    },
    {
      query: {
        enabled: !!session?.active_academic_program,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
      },
    }
  );

  const { data: collegeResponse } = useGetCollegePaginated(
    {
      'filter[campus_id]': Number(session?.active_campus),
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
    },
    {
      query: {
        enabled:
          !!session?.active_campus &&
          (role === UserRoleEnum.campus_scheduler || role === UserRoleEnum.campus_registrar),
        refetchOnMount: true,
        refetchOnWindowFocus: true,
      },
    }
  );

  const { data: programResponse } = useGetAcademicProgramPaginated(
    {
      'filter[college_id]': Number(selectedCollegeId),
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
    },
    {
      query: {
        enabled:
          !!selectedCollegeId &&
          (role === UserRoleEnum.campus_scheduler || role === UserRoleEnum.campus_registrar),
        refetchOnMount: true,
        refetchOnWindowFocus: true,
      },
    }
  );

  const {
    data: sectionResponse,
    refetch: refetchSections,
    isLoading: isLoadingSections,
  } = useGetSectionPaginated(
    {
      'filter[academic_program_id]': selectedProgramId ?? 0,
      'filter[school_year_id]': schoolYearId,
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
    },
    {
      query: {
        enabled: !!selectedProgramId && !!schoolYearId,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
      },
    }
  );

  const {
    data: assignmentsResponse,
    refetch: refetchAssignments,
    isFetching: isFetchingAssignments,
  } = useGetScheduleAssignmentBySectionCode(selectedSectionCode, {
    query: {
      enabled: !!selectedSectionCode,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    },
  });

  // Mutations
  const { mutateAsync: updateAssignment } = useUpdateScheduleAssignment();

  // Derived Data
  const allScheduleAssignments = useMemo(
    () => assignmentsResponse?.data ?? [],
    [assignmentsResponse]
  );

  const schoolYearOptions = useMemo<SelectOption[]>(() => {
    return (
      schoolYearResponse?.data?.data?.map((schoolYear) => ({
        label: schoolYear.name ?? '',
        value: String(schoolYear.id),
      })) ?? []
    );
  }, [schoolYearResponse]);

  const collegeOptions = useMemo<SelectOption[]>(() => {
    return (
      collegeResponse?.data?.data?.map((college) => ({
        label: college.college_name ?? '',
        value: String(college.id),
      })) ?? []
    );
  }, [collegeResponse]);

  const programOptions = useMemo<SelectOption[]>(() => {
    // If the role is program chair, set the selected program id to the active academic program
    if (role === UserRoleEnum.program_chair && session?.active_academic_program) {
      return [
        {
          label: 'Default Program',
          value: String(session.active_academic_program),
        },
      ];
    }
    return (
      programResponse?.data?.data?.map((program) => ({
        label: program.program_name ?? '',
        value: String(program.id),
      })) ?? []
    );
  }, [role, session?.active_academic_program, programResponse]);

  const yearOptions = useMemo<SelectOption[]>(() => {
    const sections = sectionResponse?.data?.data ?? [];
    const yearMap = new Map<string, SelectOption>();

    sections.forEach((s) => {
      const label = s.curriculum_detail?.year_label;
      const yearOrderValue = s.curriculum_detail?.year_order;
      if (label && yearOrderValue !== undefined && yearOrderValue !== null) {
        const value = String(yearOrderValue);
        yearMap.set(value, { label, value });
      }
    });

    return Array.from(yearMap.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [sectionResponse]);

  const termOptions = useMemo<SelectOption[]>(() => {
    const sections = sectionResponse?.data?.data ?? [];
    const termMap = new Map<string, SelectOption>();

    sections
      .filter((s) => !yearOrder || String(s.curriculum_detail?.year_order) === yearOrder)
      .forEach((s) => {
        const label = s.curriculum_detail?.term_label;
        const termOrderValue = s.curriculum_detail?.term_order;
        if (label && termOrderValue !== undefined && termOrderValue !== null) {
          const value = String(termOrderValue);
          termMap.set(value, { label, value });
        }
      });

    return Array.from(termMap.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [sectionResponse, yearOrder]);

  const availableSections = useMemo(() => {
    let sections = sectionResponse?.data?.data ?? [];

    if (yearOrder) {
      sections = sections.filter(
        (section) => String(section.curriculum_detail?.year_order) === yearOrder
      );
    }

    if (termOrder) {
      sections = sections.filter(
        (section) => String(section.curriculum_detail?.term_order) === termOrder
      );
    }

    return sections;
  }, [sectionResponse, yearOrder, termOrder]);

  const filteredSections = useMemo(() => {
    let sections = availableSections;

    sections = sections.filter((section) => section.section_code === selectedSectionCode);

    return sections;
  }, [availableSections, selectedSectionCode]);

  const sectionOptions = useMemo<SelectOption[]>(() => {
    const sections = availableSections;

    const grouped = sections.reduce(
      (acc, section) => {
        const code = section.section_code ?? '';
        if (!acc[code]) {
          acc[code] = section;
        }
        return acc;
      },
      {} as Record<string, (typeof sections)[0]>
    );

    return Object.values(grouped)
      .map((section) => ({
        label: section.section_name ?? '',
        subtitle: section.section_code ?? '',
        value: section.section_code ?? '',
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [availableSections]);

  const calendarEvents = useMemo(() => {
    // Filter assignments to only those belonging to the currently filtered sections
    // This ensures we respect School Year, Year Level, Term, and Search Query filters
    const validSectionsMap = new Map(filteredSections.map((s) => [s.id, s]));

    // Map day names to ISO week day numbers (Monday = 1, Sunday = 7)
    const dayMap: Record<WeeklyScheduleEnum, number> = Object.values(WeeklyScheduleEnum).reduce(
      (acc, day, index) => {
        acc[day] = index;
        return acc;
      },
      {} as Record<WeeklyScheduleEnum, number>
    );

    return allScheduleAssignments
      .filter((assignment) => assignment.section_id && validSectionsMap.has(assignment.section_id))
      .map((assignment) => {
        const section = validSectionsMap.get(assignment.section_id!) ?? assignment.section;
        if (!section) return null;

        // Consistent color based on section ID
        const color = SECTION_COLORS[(assignment.section_id ?? 0) % SECTION_COLORS.length];

        // Convert day_schedule (e.g., "Monday") to a date in the current week
        const dayOfWeek = dayMap[assignment.day_schedule as WeeklyScheduleEnum] ?? 1;
        // Use a reference week (e.g., 2024-01-01 is a Monday)
        const now = new Date();
        const currentDayOfWeek = now.getDay() || 7; // Sunday = 7, Monday = 1, etc.
        const mondayOfCurrentWeek = new Date(now);
        mondayOfCurrentWeek.setDate(now.getDate() - currentDayOfWeek + 1);

        const baseDate = mondayOfCurrentWeek;
        const targetDate = new Date(baseDate);
        targetDate.setDate(baseDate.getDate() + (dayOfWeek - 1));

        const dateStr = targetDate.toISOString().split('T')[0];

        // Extract just the time portion from start_time and end_time
        // The API returns timestamps like "2025-11-24T07:30:00.000000Z"
        // We need to extract "07:30:00" and combine with our calculated date
        const startTime = assignment.start_time?.split('T')[1]?.substring(0, 8) ?? '00:00:00';
        const endTime = assignment.end_time?.split('T')[1]?.substring(0, 8) ?? '00:00:00';

        const courseTitle = section.curriculum_detail?.course?.course_title ?? section.section_name;
        const courseCode = section.curriculum_detail?.course?.course_code ?? '';

        return {
          id: assignment.id?.toString(),
          title: `${courseTitle} (${courseCode})`,
          start: `${dateStr}T${startTime}`,
          end: `${dateStr}T${endTime}`,
          backgroundColor: color.bg,
          borderColor: color.border,
          extendedProps: {
            room: assignment.room,
            section: section,
            daySchedule: assignment.day_schedule,
          },
        };
      })
      .filter(Boolean);
  }, [allScheduleAssignments, selectedSectionCodes, filteredSections]);

  const isLoading = isLoadingSchoolYears || (schoolYearId && isLoadingSections && !sectionResponse);

  // Effects
  // Reset all state when role changes (when switching between pages)
  useEffect(() => {
    setSchoolYearId(undefined);
    setSelectedCollegeId(undefined);
    setSelectedProgramId(undefined);
    setYearOrder('');
    setTermOrder('');
    setSelectedSectionCodes([]);
    setSelectedSectionCode('');
    setOpenSchoolYear(false);
  }, [role]);

  useEffect(() => {
    if (schoolYearOptions.length > 0) {
      setSchoolYearId(Number(schoolYearOptions[0].value));
    }
  }, [schoolYearOptions]);

  useEffect(() => {
    if (collegeOptions.length > 0) {
      setSelectedCollegeId(Number(collegeOptions[0].value));
    }
  }, [collegeOptions]);

  useEffect(() => {
    if (programOptions.length > 0) {
      setSelectedProgramId(Number(programOptions[0].value));
    }
  }, [programOptions]);

  useEffect(() => {
    if (yearOptions.length > 0) {
      setYearOrder(yearOptions[0].value);
    }
  }, [yearOptions]);

  useEffect(() => {
    if (termOptions.length > 0) {
      setTermOrder(termOptions[0].value);
    }
  }, [termOptions]);

  useEffect(() => {
    if (sectionOptions.length > 0) {
      const currentIsValid = sectionOptions.some((opt) => opt.value === selectedSectionCode);
      if (!selectedSectionCode || !currentIsValid) {
        setSelectedSectionCode(sectionOptions[0].value);
      }
    }
  }, [sectionOptions]);

  // Initialize Draggable
  useEffect(() => {
    let draggable: Draggable | null = null;
    if (draggableRef.current) {
      draggable = new Draggable(draggableRef.current, {
        itemSelector: '.fc-event-draggable',
        eventData: function (eventEl) {
          return {
            title: eventEl.getAttribute('data-title'),
            duration: '01:00', // Default duration
            extendedProps: {
              sectionId: eventEl.getAttribute('data-section-id'),
              sectionCode: eventEl.getAttribute('data-section-code'),
            },
          };
        },
      });
    }

    // Always create a new draggable instance when the list changes
    // This is important because the DOM elements are re-created when React re-renders the list
    return () => {
      draggable?.destroy();
    };
  }, [filteredSections]); // Re-init when list changes

  // Handlers
  const handleRefresh = () => {
    refetchSchoolYears();
    if (schoolYearId) {
      refetchSections();
      refetchAssignments();
    }
  };

  const handleToggleSection = (sectionCode: string) => {
    setSelectedSectionCodes((prev) => {
      if (prev.includes(sectionCode)) {
        return prev.filter((code) => code !== sectionCode);
      } else {
        return [...prev, sectionCode];
      }
    });
  };

  // Drag and Drop Handlers
  const handleEventReceive = (info: EventReceiveArg) => {
    const { start, end } = info.event;
    const { sectionId, sectionCode } = info.event.extendedProps;

    if (!start) return;

    // Remove the temporary event added by FullCalendar immediately,
    // we will add the real one after API success
    info.event.remove();

    const endDate = end || new Date(start.getTime() + 60 * 60 * 1000); // Default 1 hour
    const daySchedule = format(start, 'EEEE');

    assignmentModal.openFn({
      sectionId: Number(sectionId),
      sectionCode,
      start,
      end: endDate,
      daySchedule,
    });
  };

  const handleEventDrop = async (info: EventDropArg) => {
    const { event } = info;
    const { start, end, extendedProps } = event;
    if (!start || !end) return;

    try {
      await updateAssignment({
        id: Number(event.id),
        data: {
          section_id: extendedProps.section.id,
          room_id: extendedProps.room.id,
          day_schedule: format(start, 'EEEE'),
          start_time: format(start, 'HH:mm'),
          end_time: format(end, 'HH:mm'),
        },
      });
      toast.success('Schedule updated');
    } catch (error) {
      toast.error('Failed to update schedule');
      info.revert();
    }
  };

  const handleEventResize = async (info: EventResizeDoneArg) => {
    const { event } = info;
    const { start, end, extendedProps } = event;
    if (!start || !end) return;

    try {
      await updateAssignment({
        id: Number(event.id),
        data: {
          section_id: extendedProps.section.id,
          room_id: extendedProps.room.id,
          day_schedule: format(start, 'EEEE'), // Recalculate day on resize just in case
          start_time: format(start, 'HH:mm'),
          end_time: format(end, 'HH:mm'),
        },
      });
      toast.success('Schedule duration updated');
    } catch (error) {
      toast.error('Failed to update duration');
      info.revert();
    }
  };

  const handleEventClick = (info: EventClickArg) => {
    const { event } = info;
    const { extendedProps } = event;
    const section = extendedProps.section;
    const room = extendedProps.room;
    const course = section?.curriculum_detail?.course;

    viewEventModal.openFn({
      id: event.id,
      courseTitle: course?.course_title ?? 'Unknown Course',
      courseCode: course?.course_code ?? '',
      sectionCode: section?.section_code ?? '',
      sectionName: section?.section_name ?? '',
      buildingName: room?.building?.name ?? 'Unknown Building',
      roomName: room?.name ?? 'Unknown Room',
      time: `${format(event.start!, 'h:mm a')} - ${format(event.end!, 'h:mm a')}`,
      day: format(event.start!, 'EEEE'),
    });
  };

  const selectedSchoolYearLabel = useMemo(() => {
    return schoolYearOptions.find((sy) => Number(sy.value) === schoolYearId)?.label;
  }, [schoolYearOptions, schoolYearId]);

  return (
    <>
      <div className="space-y-6">
        {/* Controls Header */}
        <div className="flex flex-col gap-4 bg-card p-4 rounded-lg border shadow-sm">
          {/* First Row: School Year and Year/Term Filters */}
          <div
            className={cn(
              'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-end',
              !showCollegeProgramFilter && 'xl:grid-cols-2'
            )}
          >
            <div className="flex flex-col gap-2 w-full min-w-0">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                School Year
              </span>
              {isLoadingSchoolYears ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Popover open={openSchoolYear} onOpenChange={setOpenSchoolYear}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openSchoolYear}
                      className="w-full justify-between"
                    >
                      <span className="truncate">
                        {schoolYearId ? selectedSchoolYearLabel : 'Select year...'}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search year..." />
                      <CommandList>
                        <CommandEmpty>No school year found.</CommandEmpty>
                        <CommandGroup>
                          {schoolYearOptions.map((schoolYear) => (
                            <CommandItem
                              key={schoolYear.value}
                              value={schoolYear.label}
                              onSelect={() => {
                                setSchoolYearId(Number(schoolYear.value));
                                setOpenSchoolYear(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  schoolYearId === Number(schoolYear.value)
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {schoolYear.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            </div>

            {showCollegeProgramFilter && (
              <div className="flex flex-col gap-2 w-full min-w-0">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  College
                </span>
                <Select
                  placeholder="Select college..."
                  options={collegeOptions}
                  value={selectedCollegeId !== undefined ? String(selectedCollegeId) : ''}
                  onValueChange={(value) => setSelectedCollegeId(Number(value))}
                />
              </div>
            )}

            {showCollegeProgramFilter && (
              <div className="flex flex-col gap-2 w-full min-w-0">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Program
                </span>
                <Select
                  placeholder="Select program..."
                  options={programOptions}
                  value={selectedProgramId !== undefined ? String(selectedProgramId) : ''}
                  onValueChange={(value) => setSelectedProgramId(Number(value))}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 w-full min-w-0">
              {isLoadingSections ? (
                <>
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-2 min-w-0">
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                      Year Level
                    </span>
                    <Select
                      placeholder="All"
                      options={yearOptions}
                      value={yearOrder}
                      onValueChange={setYearOrder}
                    />
                  </div>
                  <div className="flex flex-col gap-2 min-w-0">
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                      Term
                    </span>
                    <Select
                      placeholder="All"
                      options={termOptions}
                      value={termOrder}
                      onValueChange={setTermOrder}
                      disabled={!yearOrder}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Second Row: Section Search and Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="relative flex-1 min-w-0">
              {isLoadingSections ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <>
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                  <Select
                    placeholder="Search sections..."
                    options={sectionOptions}
                    value={selectedSectionCode}
                    onValueChange={(value) => setSelectedSectionCode(value)}
                    className="pl-9 w-full"
                  />
                </>
              )}
            </div>

            <div className="flex gap-2 justify-end sm:justify-start shrink-0">
              {isFetchingAssignments && (
                <div className="flex items-center text-sm text-muted-foreground px-2">
                  <RefreshCwIcon className="mr-2 h-3 w-3 animate-spin" />
                  <span className="hidden sm:inline">Updating...</span>
                </div>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                title="Refresh"
                className="shrink-0"
              >
                <RefreshCwIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                // onClick={handleExport}
                title="Export Schedule"
                disabled={!schoolYearId || filteredSections.length === 0}
                className="shrink-0"
              >
                <DownloadIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Schedule Display */}
        {schoolYearId ? (
          isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar Skeleton - Left Side (2/3 width) */}
              <div className="lg:col-span-2">
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-96" />
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="h-[500px] lg:h-[850px] w-full">
                      <Skeleton className="h-full w-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sections List Skeleton - Right Side (1/3 width) */}
              <div className="lg:col-span-1">
                <Card className="h-full flex flex-col shadow-sm overflow-hidden">
                  <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-6 w-8 rounded-full" />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-hidden p-4 flex flex-col min-h-0">
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Card key={i} className="shadow-none">
                          <CardHeader className="p-4 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-3 w-20" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar View - Left Side (2/3 width) */}
              <div className="lg:col-span-2">
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle>Schedule Calendar</CardTitle>
                    <CardDescription>
                      Drag sections from the right to assign them. Click events to view or delete.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="h-[500px] lg:h-[850px] w-full">
                      <FullCalendar
                        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        headerToolbar={{
                          left: 'prev,next',
                          center: 'title',
                          right: 'timeGridWeek',
                        }}
                        initialDate={
                          calendarEvents.length > 0 && calendarEvents[0]?.start
                            ? new Date(calendarEvents[0].start as string)
                            : undefined
                        }
                        events={calendarEvents as EventInput[]}
                        height="100%"
                        allDaySlot={false}
                        slotMinTime="07:00:00"
                        slotMaxTime="22:00:00"
                        editable={true}
                        droppable={true}
                        eventReceive={handleEventReceive}
                        eventDrop={handleEventDrop}
                        eventResize={handleEventResize}
                        eventClick={handleEventClick}
                        dayHeaderFormat={{
                          weekday: 'short',
                        }}
                        slotLabelFormat={{
                          hour: 'numeric',
                          minute: '2-digit',
                          omitZeroMinute: false,
                          meridiem: 'short',
                        }}
                        eventTimeFormat={{
                          hour: 'numeric',
                          minute: '2-digit',
                          meridiem: 'short',
                        }}
                        eventContent={(arg) => {
                          const { section, room } = arg.event.extendedProps;
                          const courseTitle =
                            section?.curriculum_detail?.course?.course_title ??
                            section?.section_name ??
                            '';
                          const courseCode = section?.curriculum_detail?.course?.course_code ?? '';
                          const buildingName =
                            room?.building?.name ?? room?.building?.short_name ?? 'N/A';
                          const roomName = room?.name ?? room?.short_name ?? 'N/A';

                          return (
                            <div className="w-full h-full flex flex-col p-1.5 overflow-hidden text-white">
                              <div className="text-xs font-semibold leading-tight break-words whitespace-normal">
                                {courseCode}
                              </div>
                              <div className="text-[10px] font-medium leading-tight opacity-90 break-words whitespace-normal">
                                {courseTitle}
                              </div>
                              <div className="text-[10px] leading-tight opacity-75 mt-0.5 break-words whitespace-normal">
                                {section?.section_code}
                              </div>
                              <div className="text-[10px] leading-tight opacity-75 flex items-start gap-1 mt-auto">
                                <span className="text-xs flex-shrink-0">📍</span>
                                <span className="break-words whitespace-normal">
                                  {buildingName} - {roomName}
                                </span>
                              </div>
                            </div>
                          );
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sections List - Right Side (1/3 width) */}
              <div className="lg:col-span-1">
                <Card className="h-full flex flex-col shadow-sm overflow-hidden">
                  <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">Sections</CardTitle>
                        <CardDescription className="text-xs">
                          Drag sections to the calendar to schedule
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="rounded-full px-3 py-1 font-semibold">
                        {filteredSections.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-hidden p-4 flex flex-col min-h-0">
                    {filteredSections.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center h-full">
                        <div className="p-5 bg-gradient-to-br from-muted to-muted/50 rounded-2xl mb-5 shadow-inner">
                          <SearchIcon className="h-10 w-10 text-muted-foreground/70" />
                        </div>
                        <h4 className="text-lg font-bold mb-2 text-foreground">
                          No Sections Found
                        </h4>
                        <p className="text-sm text-muted-foreground max-w-[250px]">
                          No sections available for the selected filters
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedSectionCode('')}
                          className="mt-4"
                          size="sm"
                        >
                          Clear Selection
                        </Button>
                      </div>
                    ) : (
                      <div
                        ref={draggableRef}
                        id="external-events"
                        className="space-y-3 overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent flex-1 min-h-0 max-h-[400px] lg:max-h-[850px]"
                      >
                        {filteredSections.map((section) => {
                          const isSelected = selectedSectionCodes.includes(section.section_code);
                          const color = SECTION_COLORS[(section.id ?? 0) % SECTION_COLORS.length];

                          const borderColor = isSelected ? color.tailwindBorder : 'border-border';
                          const bgColor = isSelected ? color.tailwindBg : '';

                          return (
                            <div
                              key={section.id}
                              className="fc-event-draggable outline-none group"
                              data-section-id={section.id}
                              data-section-code={section.section_code}
                              data-title={`${section.curriculum_detail?.course?.course_title ?? ''} (${section.section_code})`}
                            >
                              <Card
                                className={cn(
                                  'cursor-grab active:cursor-grabbing transition-all duration-200 overflow-visible shadow-none',
                                  isSelected ? `${borderColor} ${bgColor}` : ''
                                )}
                                onClick={() => handleToggleSection(section.section_code ?? '')}
                              >
                                <CardHeader className="p-4 space-y-2">
                                  <div className="flex items-start justify-between gap-2">
                                    <CardTitle className="text-sm font-bold truncate select-none leading-tight flex-1">
                                      {section.curriculum_detail?.course?.course_title} (
                                      {section.curriculum_detail?.course?.course_code})
                                      <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                                        {section.section_name} • {section.section_ref}
                                      </span>
                                    </CardTitle>
                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                      <Badge
                                        variant={isSelected ? 'default' : 'secondary'}
                                        className="font-mono text-[10px] px-2 py-0.5 select-none shadow-sm"
                                      >
                                        {section.section_code}
                                      </Badge>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          sectionDetailsModal.openFn({ section });
                                        }}
                                        title="View Details"
                                      >
                                        <EyeIcon className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground select-none">
                                    <div className="flex items-center gap-1.5">
                                      <UsersIcon className="h-3.5 w-3.5" />
                                      <span className="font-medium">
                                        {section.min_students}-{section.max_students}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <DoorOpenIcon className="h-3.5 w-3.5" />
                                      <span className="font-medium">
                                        {section.available_slots ?? 0} slots
                                      </span>
                                    </div>
                                  </div>
                                </CardHeader>
                              </Card>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-lg bg-muted/5">
            <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl mb-6">
              <CalendarIcon className="h-12 w-12 text-primary/80" />
            </div>
            <h4 className="text-xl font-bold mb-2">Select an Academic Year</h4>
            <p className="text-muted-foreground text-center max-w-md">
              Please select a school year from the dropdown above to view and manage class
              schedules.
            </p>
          </div>
        )}

        {/* Assignment Modal */}
        <AssignmentModal
          controller={assignmentModal}
          role={role}
          refetchAssignments={refetchAssignments}
          onAssignmentSuccess={(sectionCode) => {
            if (!selectedSectionCodes.includes(sectionCode)) {
              setSelectedSectionCodes((prev) => [...prev, sectionCode]);
            }
          }}
        />

        {/* View/Delete Modal */}
        <ViewEventModal controller={viewEventModal} refetchAssignments={refetchAssignments} />

        {/* Section Details Modal */}
        <SectionDetailsModal controller={sectionDetailsModal} />
      </div>
    </>
  );
}
