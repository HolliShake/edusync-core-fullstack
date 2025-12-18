import Modal, { type ModalState } from '@/components/custom/modal.component';
import SelectUniversityAdmission from '@/components/shared/university-admission.select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth.context';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateAdmissionSchedule,
  useGetAcademicCalendarPaginated,
  useGetAcademicProgramById,
  useGetUniversityAdmissionPaginated,
  useUpdateAdmissionSchedule,
} from '@rest/api';
import { AcademicCalendarEventEnum } from '@rest/models';
import type { AdmissionSchedule } from '@rest/models/admissionSchedule';
import { format } from 'date-fns';
import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const admissionScheduleSchema = z
  .object({
    university_admission_id: z.number().min(1, 'University admission is required'),
    title: z.string().min(1, 'Title is required'),
    intake_limit: z.number().min(1, 'Intake limit must be at least 1'),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),
  })
  .refine((data) => new Date(data.start_date) <= new Date(data.end_date), {
    message: 'End date must be after or equal to start date',
    path: ['end_date'],
  });

type AdmissionScheduleFormData = z.infer<typeof admissionScheduleSchema>;

interface AdmissionScheduleModalProps {
  controller: ModalState<AdmissionSchedule>;
  onSubmit: (data: AdmissionScheduleFormData) => void;
}

export default function AdmissionScheduleModal({
  controller,
  onSubmit,
}: AdmissionScheduleModalProps) {
  const { session } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AdmissionScheduleFormData>({
    resolver: zodResolver(admissionScheduleSchema),
    defaultValues: {
      university_admission_id: 0,
      title: '',
      intake_limit: 1,
      start_date: '',
      end_date: '',
    },
  });

  const [timeFrameSuggestion, setTimeFrameSuggestion] = useState<{
    event: string;
    suggestedStart: string;
    suggestedEnd: string;
  } | null>(null);

  const { data: academicProgramsResponse } = useGetAcademicProgramById(
    Number(session?.active_academic_program),
    {
      query: {
        enabled: !!session?.active_academic_program,
      },
    }
  );

  const { data: universityAdmissionsResponse, isLoading: isLoadingUniversityAdmissions } =
    useGetUniversityAdmissionPaginated({
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
      sort: '-open_date',
    });

  const { data: academicCalendarResponse } = useGetAcademicCalendarPaginated(
    {
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
      'filter[school_year_id]': Number(
        universityAdmissionsResponse?.data?.data?.find(
          (ua) => ua.id === watch('university_admission_id')
        )?.school_year_id
      ),
      'filter[event]': AcademicCalendarEventEnum.ENROLLMENT,
    },
    {
      query: {
        enabled: !!watch('university_admission_id'),
        queryKey: ['/api/AcademicCalendar', watch('university_admission_id')],
      },
    }
  );

  const { mutateAsync: createAdmissionSchedule, isPending } = useCreateAdmissionSchedule();
  const { mutateAsync: updateAdmissionSchedule, isPending: isUpdating } =
    useUpdateAdmissionSchedule();

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);
  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);

  const programShortName = useMemo(
    () => academicProgramsResponse?.data?.short_name,
    [academicProgramsResponse]
  );

  useEffect(() => {
    if (isEdit) return; // disable time frame suggestion for edit
    const enrollment = academicCalendarResponse?.data?.data?.find(
      (ac) =>
        ac.event === AcademicCalendarEventEnum.ENROLLMENT &&
        new Date(ac.end_date) >= new Date(Date.now())
    );

    setTimeFrameSuggestion(
      enrollment
        ? {
            event: enrollment.name,
            suggestedStart: enrollment.start_date,
            suggestedEnd: enrollment.end_date,
          }
        : null
    );
  }, [academicCalendarResponse, watch('university_admission_id'), isEdit]);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const digits = inputValue.replace(/\D/g, '').slice(0, 8);

    if (digits.length === 0) {
      setValue('title', '');
      return;
    }

    let formatted = `${programShortName ? programShortName + ' ' : ''}SY ` + digits.slice(0, 4);
    if (digits.length > 4) {
      formatted += '-' + digits.slice(4);
    }
    setValue('title', formatted);
  };

  const onFormSubmit = async (data: AdmissionScheduleFormData) => {
    const payload: AdmissionSchedule = {
      ...data,
      academic_program_id: Number(session?.active_academic_program) ?? 0,
    };
    try {
      if (isEdit) {
        await updateAdmissionSchedule({
          id: controller.data?.id ?? 0,
          data: payload,
        });
      } else {
        await createAdmissionSchedule({
          data: payload,
        });
      }
      toast.success(`Admission schedule ${isEdit ? 'updated' : 'created'} successfully`);
      controller.closeFn();
      onSubmit(data);
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} admission schedule`);
    }
  };

  const applySuggestedDates = () => {
    if (timeFrameSuggestion) {
      setValue('start_date', format(new Date(timeFrameSuggestion.suggestedStart), 'yyyy-MM-dd'));
      setValue('end_date', format(new Date(timeFrameSuggestion.suggestedEnd), 'yyyy-MM-dd'));
    }
  };

  useEffect(() => {
    if (isEdit) {
      if (controller.data?.start_date) {
        setValue('start_date', format(new Date(controller.data.start_date), 'yyyy-MM-dd'));
      }
      if (controller.data?.end_date) {
        setValue('end_date', format(new Date(controller.data.end_date), 'yyyy-MM-dd'));
      }
    } else {
      setTimeFrameSuggestion(null);
      reset({
        university_admission_id: 0,
        title: '',
        intake_limit: 1,
        start_date: '',
        end_date: '',
      });
    }

    if (!isEdit && !controller.data) {
      // reset called above
    } else if (controller.data) {
      setValue('university_admission_id', controller.data.university_admission_id);
      setValue('title', controller.data.title || '');
      setValue('intake_limit', controller.data.intake_limit);
      // start_date and end_date handled above
    }
  }, [controller.isOpen, controller.data, reset, isEdit, setValue]);

  return (
    <Modal
      controller={controller}
      title={`${isEdit ? 'Edit' : 'Create'} Admission Schedule`}
      size="md"
      closable
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="university_admission_id">University Admission</Label>
          <Controller
            name="university_admission_id"
            control={control}
            render={({ field }) => (
              <SelectUniversityAdmission
                placeholder="Select university admission"
                value={String(field.value || '')}
                onValueChange={(value) => field.onChange(Number(value))}
                disabled={isLoadingUniversityAdmissions}
              />
            )}
          />
          {errors.university_admission_id && (
            <p className="text-sm text-destructive">{errors.university_admission_id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder={`${programShortName ? programShortName + ' ' : ''}SY YYYY-YYYY`}
            {...register('title', {
              onChange: handleTitleChange,
            })}
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="intake_limit">Intake Limit</Label>
          <Input
            id="intake_limit"
            type="number"
            placeholder="Enter intake limit"
            {...register('intake_limit', { valueAsNumber: true })}
          />
          {errors.intake_limit && (
            <p className="text-sm text-destructive">{errors.intake_limit.message}</p>
          )}
        </div>

        {timeFrameSuggestion && (
          <div className="rounded-md bg-blue-50 p-3 border border-blue-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">Suggested Enrollment Period</p>
                <p className="text-xs text-blue-700 mt-1">{timeFrameSuggestion.event}</p>
                <p className="text-xs text-blue-700 mt-1">
                  {new Date(timeFrameSuggestion.suggestedStart).toLocaleDateString()} -{' '}
                  {new Date(timeFrameSuggestion.suggestedEnd).toLocaleDateString()}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={applySuggestedDates}
                className="ml-2 text-xs"
              >
                Apply
              </Button>
            </div>
          </div>
        )}

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
          {errors.end_date && <p className="text-sm text-destructive">{errors.end_date.message}</p>}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update Schedule' : 'Create Schedule'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
