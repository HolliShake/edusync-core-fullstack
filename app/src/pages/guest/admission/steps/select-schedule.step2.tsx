import Select from '@/components/custom/select.component';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetUniversityAdmissionSchedulePaginated,
  useUpdateUniversityAdmissionApplication,
} from '@rest/api';
import type { UniversityAdmissionApplication } from '@rest/models';
import { format, isSameDay, parseISO } from 'date-fns';
import { CalendarDays, CheckCircle2, Clock, Info, MapPin } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface GuestAdmissionSelectScheduleStep2Props {
  selectedApplication: UniversityAdmissionApplication | null;
}

export default function GuestAdmissionSelectScheduleStep2({
  selectedApplication,
}: GuestAdmissionSelectScheduleStep2Props): React.ReactNode {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedCampusId, setSelectedCampusId] = useState<string>('');
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  const { data: admissionSchedules, isLoading } = useGetUniversityAdmissionSchedulePaginated(
    {
      'filter[university_admission_id]': Number(selectedApplication?.university_admission_id),
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
    },
    {
      query: {
        enabled: !!selectedApplication?.university_admission_id,
      },
    }
  );

  const { mutateAsync: updateApplication, isPending: isUpdating } =
    useUpdateUniversityAdmissionApplication();

  const allSchedules = useMemo(() => {
    return admissionSchedules?.data?.data ?? [];
  }, [admissionSchedules]);

  const campusOptions = useMemo(() => {
    const seen = new Map<number, string>();
    for (const schedule of allSchedules) {
      const campus = schedule.testing_center?.room?.building?.campus;
      if (campus?.id && campus.name && !seen.has(campus.id)) {
        seen.set(campus.id, campus.name);
      }
    }
    return [
      { label: 'All Campuses', value: 'all' },
      ...Array.from(seen, ([id, name]) => ({ label: name, value: String(id) })),
    ];
  }, [allSchedules]);

  const availableSchedules = useMemo(() => {
    if (selectedCampusId === 'all') return allSchedules;
    return allSchedules.filter(
      (s) => String(s.testing_center?.room?.building?.campus?.id) === selectedCampusId
    );
  }, [allSchedules, selectedCampusId]);

  const scheduledDates = useMemo(() => {
    return availableSchedules.map((s) => parseISO(s.start_date));
  }, [availableSchedules]);

  const firstAvailableDate = useMemo(() => {
    if (availableSchedules.length === 0) return undefined;
    const sorted = [...availableSchedules].sort(
      (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );
    const withSlots = sorted.find((s) => (s.remaining_slots ?? 0) > 0);
    return parseISO((withSlots ?? sorted[0]).start_date);
  }, [availableSchedules]);

  useEffect(() => {
    if (!selectedCampusId && campusOptions.length > 1) {
      setSelectedCampusId(campusOptions[1].value);
    }
  }, [campusOptions, selectedCampusId]);

  useEffect(() => {
    if (firstAvailableDate) {
      setSelectedDate(firstAvailableDate);
      setCalendarMonth(firstAvailableDate);
    }
  }, [firstAvailableDate]);

  const handleCampusChange = (value: string) => {
    setSelectedCampusId(value);
    setSelectedDate(undefined);
  };

  const filteredSchedules = useMemo(() => {
    if (!selectedDate) return [];
    return availableSchedules.filter((schedule) =>
      isSameDay(parseISO(schedule.start_date), selectedDate)
    );
  }, [availableSchedules, selectedDate]);

  const handleSelectSchedule = async (scheduleId: number) => {
    if (!selectedApplication?.id) return;

    try {
      await updateApplication({
        id: selectedApplication.id,
        data: {
          ...selectedApplication,
          university_admission_id: selectedApplication.university_admission_id,
          user_id: selectedApplication.user_id,
          remark: selectedApplication.remark,
          university_admission_schedule_id: scheduleId,
        },
      });
      toast.success('Schedule selected successfully');
      //   window.location.reload();
    } catch (error) {
      toast.error('Failed to select schedule');
      console.error(error);
    }
  };

  if (!selectedApplication) return null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <Skeleton className="h-[420px] w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Examination Schedule</h2>
          <p className="text-muted-foreground mt-1">
            Choose your preferred date and time for the admission examination.
          </p>
        </div>
        <div className="w-full sm:w-64 space-y-1.5">
          <Label className="text-xs text-muted-foreground">Filter by Campus</Label>
          <Select
            value={selectedCampusId}
            onValueChange={handleCampusChange}
            options={campusOptions}
            placeholder="All Campuses"
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px] items-start">
        {/* Calendar */}
        <Card className="shadow-sm">
          <CardHeader className="border-b bg-muted/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">Select a Date</CardTitle>
                <CardDescription className="text-xs">
                  Dates with available slots are highlighted.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              className="w-full [--cell-size:2.75rem] sm:[--cell-size:3.25rem]"
              classNames={{
                root: 'w-full',
                months: 'flex flex-col w-full',
                month: 'flex w-full flex-col gap-5',
                month_caption: 'flex h-10 w-full items-center justify-center px-10',
                caption_label: 'text-base font-semibold select-none',
                nav: 'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
                button_previous:
                  'inline-flex items-center justify-center h-9 w-9 rounded-lg border bg-background hover:bg-accent hover:text-accent-foreground transition-colors',
                button_next:
                  'inline-flex items-center justify-center h-9 w-9 rounded-lg border bg-background hover:bg-accent hover:text-accent-foreground transition-colors',
                weekdays: 'flex w-full',
                weekday:
                  'flex-1 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider py-2',
                week: 'flex w-full mt-1',
                day: 'group/day relative flex-1 aspect-square p-0.5',
                today: 'font-bold',
                outside: 'opacity-30',
                disabled: 'opacity-30',
                hidden: 'invisible',
              }}
              modifiers={{
                hasSchedule: scheduledDates,
              }}
              modifiersClassNames={{
                hasSchedule: 'has-schedule-dot',
              }}
              components={{
                DayButton: ({ day, modifiers, className, ...props }) => {
                  const isHasSchedule = modifiers.hasSchedule;
                  const isSelected = modifiers.selected;
                  const isToday = modifiers.today;
                  const isOutside = modifiers.outside;

                  return (
                    <button
                      type="button"
                      className={`
                        relative flex h-full w-full flex-col items-center justify-center rounded-lg
                        text-sm font-medium transition-all duration-150
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1
                        ${
                          isSelected
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : isToday
                              ? 'bg-accent text-accent-foreground'
                              : 'hover:bg-muted'
                        }
                        ${isOutside ? 'pointer-events-none opacity-30' : ''}
                      `}
                      {...props}
                    >
                      <span>{day.date.getDate()}</span>
                      {isHasSchedule && !isOutside && (
                        <span
                          className={`absolute bottom-1.5 h-1 w-1 rounded-full ${
                            isSelected ? 'bg-primary-foreground' : 'bg-primary'
                          }`}
                        />
                      )}
                    </button>
                  );
                },
              }}
            />
          </CardContent>

          <CardFooter className="border-t bg-muted/20 px-6 py-3 justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent border" />
              Today
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
              Unavailable
            </span>
          </CardFooter>
        </Card>

        {/* Schedule slots */}
        <div className="space-y-4">
          {/* Date header */}
          <Card className="shadow-sm bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                {selectedDate ? format(selectedDate, 'EEEE') : 'No date selected'}
              </p>
              <p className="text-lg font-bold">
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Pick a date'}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {filteredSchedules.length} slot{filteredSchedules.length !== 1 ? 's' : ''} available
              </p>
            </CardContent>
          </Card>

          {/* Slots list */}
          {filteredSchedules.length === 0 ? (
            <Card className="border-dashed bg-muted/10">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <CalendarDays className="h-6 w-6 text-muted-foreground/50" />
                </div>
                <p className="font-medium">No Schedules</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-[220px]">
                  Select a highlighted date to view available time slots.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 max-h-[calc(100vh-420px)] overflow-y-auto px-1 -mx-1">
              {filteredSchedules.map((schedule) => {
                const remainingSlots = schedule.remaining_slots ?? 0;
                const isFull = remainingSlots <= 0;
                const isSelected =
                  selectedApplication.university_admission_schedule_id === schedule.id;

                return (
                  <Card
                    key={schedule.id}
                    className={`transition-all duration-200 ${
                      isSelected
                        ? 'ring-2 ring-primary shadow-md'
                        : isFull
                          ? 'opacity-60'
                          : 'hover:shadow-md hover:border-primary/30'
                    }`}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">
                            {schedule.testing_center?.room?.name ?? 'Testing Center'}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">
                              {schedule.testing_center?.room?.building?.name ?? 'Building'}
                              {schedule.testing_center?.room?.floor
                                ? `, Floor ${schedule.testing_center.room.floor}`
                                : ''}
                            </span>
                          </p>
                        </div>
                        <Badge
                          variant={
                            isFull ? 'destructive' : remainingSlots <= 10 ? 'secondary' : 'default'
                          }
                          className="shrink-0 text-[10px]"
                        >
                          {isFull ? 'Full' : `${remainingSlots} slots`}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="font-medium">
                          {format(parseISO(schedule.start_date), 'h:mm a')} &ndash;{' '}
                          {format(parseISO(schedule.end_date), 'h:mm a')}
                        </span>
                      </div>

                      <Button
                        className="w-full"
                        size="sm"
                        variant={isSelected ? 'secondary' : 'default'}
                        disabled={isFull || isUpdating || isSelected}
                        onClick={() => schedule.id && handleSelectSchedule(schedule.id)}
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-1.5" />
                            Selected
                          </>
                        ) : isFull ? (
                          'Fully Booked'
                        ) : (
                          'Select This Slot'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {filteredSchedules.length > 0 && (
            <div className="flex gap-2.5 items-start rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <p>
                Please arrive at the testing center at least 30 minutes before your scheduled time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
