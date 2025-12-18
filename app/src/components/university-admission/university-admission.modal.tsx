import Modal, { type ModalState } from '@/components/custom/modal.component';
import Select from '@/components/custom/select.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateUniversityAdmission,
  useGetSchoolYearPaginated,
  useUpdateUniversityAdmission,
} from '@rest/api';
import type { UniversityAdmission } from '@rest/models';
import { useEffect, useMemo, type ChangeEvent } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const universityAdmissionSchema = z.object({
  school_year_id: z.number().min(1, 'School year is required'),
  title: z.string().min(1, 'Title is required'),
  open_date: z.string().min(1, 'Open date is required'),
  close_date: z.string().min(1, 'Close date is required'),
  is_open_override: z.boolean(),
});

type UniversityAdmissionFormData = z.infer<typeof universityAdmissionSchema>;

interface UniversityAdmissionModalProps {
  controller: ModalState<UniversityAdmission>;
  onSubmit: () => void;
}

export default function UniversityAdmissionModal({
  controller,
  onSubmit,
}: UniversityAdmissionModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    control,
    formState: { errors },
  } = useForm<UniversityAdmissionFormData>({
    resolver: zodResolver(universityAdmissionSchema),
    defaultValues: {
      school_year_id: 0,
      title: '',
      open_date: '',
      close_date: '',
      is_open_override: false,
    },
  });

  const { data: schoolYears } = useGetSchoolYearPaginated({
    sort: '-start_date',
    page: 1,
    rows: Number.MAX_SAFE_INTEGER,
  });

  const { mutateAsync: createAdmission, isPending } = useCreateUniversityAdmission();
  const { mutateAsync: updateAdmission, isPending: isUpdating } = useUpdateUniversityAdmission();

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);

  const isEdit = useMemo(() => !!controller.data?.school_year_id, [controller.data]);

  const schoolYearOptions = useMemo(
    () =>
      schoolYears?.data?.data?.map((year) => ({
        label: year.name,
        value: String(year.id),
      })) ?? [],
    [schoolYears]
  );

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const digits = inputValue.replace(/\D/g, '').slice(0, 8);

    if (digits.length === 0) {
      setValue('title', '');
      return;
    }

    let formatted = 'ADMISSION SY ' + digits.slice(0, 4);
    if (digits.length > 4) {
      formatted += '-' + digits.slice(4);
    }
    setValue('title', formatted);
  };

  const onFormSubmit = async (data: UniversityAdmissionFormData) => {
    try {
      if (isEdit && controller.data?.school_year_id) {
        await updateAdmission({
          id: Number(controller.data?.id),
          data: {
            ...controller.data,
            ...data,
          },
        });
      } else {
        await createAdmission({
          data,
        });
      }
      toast.success(`University admission ${isEdit ? 'updated' : 'created'} successfully`);
      controller.closeFn();
      onSubmit();
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} university admission`);
    }
  };

  useEffect(() => {
    if (!controller.data) {
      return reset({
        school_year_id: 0,
        title: '',
        open_date: '',
        close_date: '',
        is_open_override: false,
      });
    }
    reset({
      ...controller.data,
      school_year_id: controller.data.school_year_id,
      title: controller.data.title,
      open_date: controller.data.open_date.split('T')[0],
      close_date: controller.data.close_date.split('T')[0],
      is_open_override: controller.data.is_open_override,
    });
  }, [controller.isOpen, controller.data, reset]);

  return (
    <Modal
      controller={controller}
      title={`${isEdit ? 'Edit' : 'Create'} University Admission`}
      size="md"
      closable
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="school_year_id">School Year</Label>
          <Controller
            name="school_year_id"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value?.toString()}
                onValueChange={(value) => field.onChange(Number(value))}
                options={schoolYearOptions}
                placeholder="Select school year"
              />
            )}
          />
          {errors.school_year_id && (
            <p className="text-sm text-destructive">{errors.school_year_id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="ADMISSION SY YYYY-YYYY"
            {...register('title', {
              onChange: handleTitleChange,
            })}
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="open_date">Open Date</Label>
          <Input id="open_date" type="date" {...register('open_date')} />
          {errors.open_date && (
            <p className="text-sm text-destructive">{errors.open_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="close_date">Close Date</Label>
          <Input id="close_date" type="date" {...register('close_date')} />
          {errors.close_date && (
            <p className="text-sm text-destructive">{errors.close_date.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="is_open_override"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300"
            {...register('is_open_override')}
          />
          <Label htmlFor="is_open_override" className="cursor-pointer">
            Override Status (Force Open)
          </Label>
        </div>
        {errors.is_open_override && (
          <p className="text-sm text-destructive">{errors.is_open_override.message}</p>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update Admission' : 'Create Admission'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
