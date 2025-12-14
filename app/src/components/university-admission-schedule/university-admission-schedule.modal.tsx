import Modal, { type ModalState } from '@/components/custom/modal.component';
import Select from '@/components/custom/select.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateUniversityAdmissionSchedule,
  useGetTestingCenterPaginated,
  useUpdateUniversityAdmissionSchedule,
} from '@rest/api';
import type { UniversityAdmissionSchedule } from '@rest/models';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const universityAdmissionScheduleSchema = z
  .object({
    university_admission_id: z.number().min(1, 'University admission is required'),
    testing_center_id: z.number().min(1, 'Testing center is required'),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),
  })
  .refine(
    (data) => {
      const startDateTime = new Date(data.start_date);
      const endDateTime = new Date(data.end_date);
      return endDateTime >= startDateTime;
    },
    {
      message: 'End date must be after or equal to start date',
      path: ['end_date'],
    }
  );

type UniversityAdmissionScheduleFormData = z.infer<typeof universityAdmissionScheduleSchema>;

interface UniversityAdmissionScheduleModalProps {
  controller: ModalState<UniversityAdmissionSchedule>;
  universityAdmissionId: number;
  onSubmit: () => void;
}

export default function UniversityAdmissionScheduleModal({
  controller,
  universityAdmissionId,
  onSubmit,
}: UniversityAdmissionScheduleModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UniversityAdmissionScheduleFormData>({
    resolver: zodResolver(universityAdmissionScheduleSchema),
    defaultValues: {
      university_admission_id: universityAdmissionId,
      testing_center_id: 0,
      start_date: '',
      end_date: '',
    },
  });

  const startDate = watch('start_date');
  const endDate = watch('end_date');

  const [timeHour12, setTimeHour12] = useState(8);
  const [timeMinute, setTimeMinute] = useState(0);
  const [timePeriod, setTimePeriod] = useState<'AM' | 'PM'>('AM');

  // Convert 24-hour to 12-hour format
  const convert24To12 = (hour24: number): { hour12: number; period: 'AM' | 'PM' } => {
    if (hour24 === 0) return { hour12: 12, period: 'AM' };
    if (hour24 < 12) return { hour12: hour24, period: 'AM' };
    if (hour24 === 12) return { hour12: 12, period: 'PM' };
    return { hour12: hour24 - 12, period: 'PM' };
  };

  // Convert 12-hour to 24-hour format
  const convert12To24 = (hour12: number, period: 'AM' | 'PM'): number => {
    if (period === 'AM') {
      return hour12 === 12 ? 0 : hour12;
    } else {
      return hour12 === 12 ? 12 : hour12 + 12;
    }
  };

  // Update time states when startDate changes
  useEffect(() => {
    if (!startDate) {
      setTimeHour12(8);
      setTimeMinute(0);
      setTimePeriod('AM');
      return;
    }
    const date = new Date(startDate);
    const hours24 = date.getHours();
    const minutes = date.getMinutes();
    const { hour12, period } = convert24To12(hours24);
    setTimeHour12(hour12);
    setTimeMinute(minutes);
    setTimePeriod(period);
  }, [startDate]);

  const { data: testingCentersData, isLoading: isLoadingTestingCenters } =
    useGetTestingCenterPaginated({
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
    });

  const { mutateAsync: createSchedule, isPending } = useCreateUniversityAdmissionSchedule();
  const { mutateAsync: updateSchedule, isPending: isUpdating } =
    useUpdateUniversityAdmissionSchedule();

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);

  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);

  const testingCenterOptions = useMemo(() => {
    return (
      testingCentersData?.data?.data?.map((center) => ({
        label: `${center.room?.building?.name ?? ''} - ${center.room?.room_code ?? center.code ?? `Center #${center.id}`}`,
        value: String(center.id),
      })) ?? []
    );
  }, [testingCentersData]);

  const updateTimeForDate = (dateString: string, hour24: number, minute: number) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    date.setHours(hour24);
    date.setMinutes(minute);
    date.setSeconds(0);
    return date.toISOString().slice(0, 16);
  };

  const handleHourChange = (hour12: number) => {
    setTimeHour12(hour12);
    const hour24 = convert12To24(hour12, timePeriod);
    if (startDate) {
      setValue('start_date', updateTimeForDate(startDate, hour24, timeMinute));
    }
    if (endDate) {
      setValue('end_date', updateTimeForDate(endDate, hour24, timeMinute));
    }
  };

  const handleMinuteChange = (minute: number) => {
    setTimeMinute(minute);
    const hour24 = convert12To24(timeHour12, timePeriod);
    if (startDate) {
      setValue('start_date', updateTimeForDate(startDate, hour24, minute));
    }
    if (endDate) {
      setValue('end_date', updateTimeForDate(endDate, hour24, minute));
    }
  };

  const handlePeriodChange = (period: 'AM' | 'PM') => {
    setTimePeriod(period);
    const hour24 = convert12To24(timeHour12, period);
    if (startDate) {
      setValue('start_date', updateTimeForDate(startDate, hour24, timeMinute));
    }
    if (endDate) {
      setValue('end_date', updateTimeForDate(endDate, hour24, timeMinute));
    }
  };

  const onFormSubmit = async (data: UniversityAdmissionScheduleFormData) => {
    try {
      const startDateTime = new Date(data.start_date).toISOString().slice(0, 19).replace('T', ' ');
      const endDateTime = new Date(data.end_date).toISOString().slice(0, 19).replace('T', ' ');

      if (isEdit && controller.data?.id) {
        await updateSchedule({
          id: controller.data.id,
          data: {
            university_admission_id: universityAdmissionId,
            testing_center_id: data.testing_center_id,
            start_date: startDateTime,
            end_date: endDateTime,
          },
        });
      } else {
        await createSchedule({
          data: {
            university_admission_id: universityAdmissionId,
            testing_center_id: data.testing_center_id,
            start_date: startDateTime,
            end_date: endDateTime,
          },
        });
      }
      toast.success(`Schedule ${isEdit ? 'updated' : 'created'} successfully`);
      controller.closeFn();
      onSubmit();
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} schedule`);
    }
  };

  useEffect(() => {
    if (!controller.data) {
      return reset({
        university_admission_id: universityAdmissionId,
        testing_center_id: 0,
        start_date: '',
        end_date: '',
      });
    }

    const startDateTime = controller.data.start_date ? new Date(controller.data.start_date) : null;
    const endDateTime = controller.data.end_date ? new Date(controller.data.end_date) : null;

    reset({
      university_admission_id: universityAdmissionId,
      testing_center_id: controller.data.testing_center_id,
      start_date: startDateTime ? startDateTime.toISOString().slice(0, 16) : '',
      end_date: endDateTime ? endDateTime.toISOString().slice(0, 16) : '',
    });
  }, [controller.isOpen, controller.data, reset, universityAdmissionId]);

  return (
    <Modal
      controller={controller}
      title={`${isEdit ? 'Edit' : 'Create'} Admission Schedule`}
      size="md"
      closable
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="testing_center_id">Testing Center</Label>
          <Controller
            name="testing_center_id"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : ''}
                onValueChange={(value) => field.onChange(Number(value))}
                options={testingCenterOptions}
                placeholder="Select testing center"
                disabled={isLoadingTestingCenters}
              />
            )}
          />
          {errors.testing_center_id && (
            <p className="text-sm text-destructive">{errors.testing_center_id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input id="start_date" type="datetime-local" {...register('start_date')} />
          {errors.start_date && (
            <p className="text-sm text-destructive">{errors.start_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">End Date</Label>
          <Input id="end_date" type="datetime-local" {...register('end_date')} />
          {errors.end_date && <p className="text-sm text-destructive">{errors.end_date.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Time</Label>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Hour</span>
                <span className="text-sm font-medium">
                  {String(timeHour12).padStart(2, '0')}:{String(timeMinute).padStart(2, '0')}{' '}
                  {timePeriod}
                </span>
              </div>
              <Slider
                value={[timeHour12]}
                onValueChange={(value) => handleHourChange(value[0])}
                min={1}
                max={12}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Minute</span>
                <span className="text-sm font-medium">{String(timeMinute).padStart(2, '0')}</span>
              </div>
              <Slider
                value={[timeMinute]}
                onValueChange={(value) => handleMinuteChange(value[0])}
                min={0}
                max={59}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Period</span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={timePeriod === 'AM' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePeriodChange('AM')}
                    className="w-16"
                  >
                    AM
                  </Button>
                  <Button
                    type="button"
                    variant={timePeriod === 'PM' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePeriodChange('PM')}
                    className="w-16"
                  >
                    PM
                  </Button>
                </div>
              </div>
            </div>
          </div>
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
