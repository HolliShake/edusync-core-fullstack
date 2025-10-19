import Modal, { type ModalState } from '@/components/custom/modal.component';
import CustomSelect from '@/components/custom/select.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateAcademicCalendar,
  useGetSchoolYearPaginated,
  useUpdateAcademicCalendar,
} from '@rest/api';
import type { SchoolYear } from '@rest/models';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Accept a nullable schoolYear prop. Do not fetch the list here.
const events = [
  'REGISTRATION',
  'ENROLLMENT',
  'ORIENTATION',
  'START_OF_CLASSES',
  'HOLIDAY',
  'UNIVERSITY_EVENT',
  'DEADLINE',
  'PERIODIC_EXAM',
  'END_OF_CLASSES',
  'GRADE_SUBMISSION',
  'GRADUATION',
  'FACULTY_EVALUATION',
  'ACADEMIC_TRANSITION',
  'OTHER',
] as const;

// z.enum fix: must not pass config object, just the enum values
const academicCalendarSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  description: z
    .string()
    .max(4096, 'Description too long')
    .optional()
    .or(z.literal(''))
    .or(z.null()),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  school_year_id: z
    .number({
      error: 'School Year is required',
    })
    .min(1, 'School Year is required'),
  event: z.enum(events),
});

type AcademicCalendarFormData = z.infer<typeof academicCalendarSchema>;

interface AcademicCalendarModalProps {
  controller: ModalState<any>;
  onSubmit: (data: AcademicCalendarFormData) => void;
  // Accept a nullable schoolYear prop
  schoolYear?: SchoolYear | null;
}

export default function AcademicCalendarModal({
  controller,
  onSubmit,
  schoolYear,
}: AcademicCalendarModalProps) {
  // If editing, prefer the row's value, otherwise prefer prop
  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);
  const getDefaultSchoolYearId = () => {
    if (isEdit) return controller.data.school_year_id ?? schoolYear?.id ?? 0;
    return schoolYear?.id ?? 0;
  };

  const { data: allYearPaginated } = useGetSchoolYearPaginated({
    page: 1,
    rows: Number.MAX_SAFE_INTEGER,
  });

  const allSchoolYears = useMemo(() => allYearPaginated?.data?.data ?? [], [allYearPaginated]);
  // console.log(allSchoolYears);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AcademicCalendarFormData>({
    resolver: zodResolver(academicCalendarSchema),
    defaultValues: {
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      school_year_id: getDefaultSchoolYearId(),
      event: undefined,
    },
  });

  const { mutateAsync: createAcademicCalendar, isPending } = useCreateAcademicCalendar();
  const { mutateAsync: updateAcademicCalendar, isPending: isUpdating } =
    useUpdateAcademicCalendar();

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);

  const onFormSubmit = async (data: AcademicCalendarFormData) => {
    try {
      if (isEdit) {
        await updateAcademicCalendar({
          id: controller.data.id,
          data,
        });
        toast.success('Calendar entry updated successfully');
      } else {
        await createAcademicCalendar({
          data,
        });
        toast.success('Calendar entry created successfully');
      }
      controller.closeFn();
      onSubmit(data);
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} calendar entry`);
    }
  };

  useEffect(() => {
    if (!controller.data) {
      return reset({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        school_year_id: getDefaultSchoolYearId(),
        event: undefined,
      });
    }
    // Patch values from edit row
    reset({
      name: controller.data.name ?? '',
      description:
        typeof controller.data.description === 'string' ? controller.data.description : '',
      start_date: controller.data.start_date ?? '',
      end_date: controller.data.end_date ?? '',
      school_year_id: controller.data.school_year_id ?? schoolYear?.id ?? 0,
      event: controller.data.event ?? undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controller.isOpen, reset, schoolYear, controller.data]);

  // For Select component: options for event
  const eventSelectOptions = events.map((ev) => ({
    value: ev,
    label: ev.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
  }));

  // For Select component: options for school year (if needed)
  // FIX: Do not push an option with value: ''
  const schoolYearOptions =
    allSchoolYears?.map((sy: SchoolYear) => ({
      value: sy.id?.toString() ?? '[invalid]',
      label: sy.name ?? '[invalid]',
    })) ?? [];

  // Get selected event value for select (as string/null)
  const selectedEvent = watch('event') ?? '';

  // Get selected school_year_id value for select (as string/null)
  const selectedSchoolYearId =
    watch('school_year_id') !== undefined && watch('school_year_id') !== null
      ? String(watch('school_year_id'))
      : '';

  return (
    <Modal controller={controller} title="Academic Calendar Entry" size="md" closable>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Enter description (optional)"
            {...register('description')}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <Input id="start_date" type="date" {...register('start_date')} />
            {errors.start_date && (
              <p className="text-sm text-destructive">{errors.start_date.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">End Date</Label>
            <Input id="end_date" type="date" {...register('end_date')} />
            {errors.end_date && (
              <p className="text-sm text-destructive">{errors.end_date.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="event">Event Type</Label>
          <CustomSelect
            options={eventSelectOptions}
            value={selectedEvent}
            onValueChange={(val: string) =>
              setValue('event', val as AcademicCalendarFormData['event'], { shouldValidate: true })
            }
            placeholder="Select event type"
            disabled={isSaving}
          />
          {errors.event && <p className="text-sm text-destructive">{errors.event.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="school_year_id">School Year</Label>
          {schoolYear ? (
            // If a schoolYear is provided, just show the name and use hidden field
            <>
              <Input
                type="text"
                id="school_year_display"
                value={schoolYear.name}
                disabled
                className="w-full"
              />
              {/* Hidden input to maintain field in form */}
              <input
                type="hidden"
                {...register('school_year_id', { valueAsNumber: true })}
                value={schoolYear.id}
              />
            </>
          ) : (
            <CustomSelect
              options={schoolYearOptions}
              value={selectedSchoolYearId}
              onValueChange={(val: string) => {
                // val could be a number string or undefined
                if (val === undefined || val === null || val === '') {
                  setValue('school_year_id', undefined as any, {
                    shouldValidate: true,
                  });
                } else {
                  setValue('school_year_id', Number(val), {
                    shouldValidate: true,
                  });
                }
              }}
              placeholder="Select school year"
              disabled={isSaving}
            />
          )}
          {errors.school_year_id && (
            <p className="text-sm text-destructive">{errors.school_year_id.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update Entry' : 'Create Entry'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
