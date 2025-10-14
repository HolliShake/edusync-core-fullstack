import Modal, { type ModalState } from '@/components/custom/modal.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateSchoolYear, useUpdateSchoolYear } from '@rest/api';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// MASKED INPUT UTILITIES FOR 2024-2025 FORMAT
function formatSchoolYearCode(value: string) {
  // Remove all non-digits
  const numbers = value.replace(/\D/g, '');
  const part1 = numbers.substring(0, 4);
  const part2 = numbers.substring(4, 8);

  if (part1 && part2) {
    return `${part1}-${part2}`;
  }
  if (part1) {
    return part1;
  }
  return '';
}

// --- MASKED INPUT HANDLER FOR AY NAME FORMAT e.g. "AY 2024-2025" ---
function formatSchoolYearName(value: string) {
  // Remove all non-digits
  let clean = value.replace(/[^0-9]/g, '');
  const year1 = clean.substring(0, 4);
  const year2 = clean.substring(4, 8);

  if (year1 && year2) {
    return `AY ${year1}-${year2}`;
  }
  if (year1 && year1.length === 4) {
    return `AY ${year1}-`;
  }
  if (year1) {
    return `AY ${year1}`;
  }
  return 'AY ';
}

const schoolYearSchema = z.object({
  // Regex for strict "YYYY-YYYY" format, e.g. 2024-2025
  school_year_code: z
    .string()
    .min(9, 'Code is required')
    .regex(/^\d{4}-\d{4}$/, 'Code must be in "2024-2025" format'),
  name: z
    .string()
    .min(12, 'Name is required')
    .regex(/^AY \d{4}-\d{4}$/, 'Name must be in "AY 2024-2025" format'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  is_active: z.boolean(),
});

type SchoolYearFormData = z.infer<typeof schoolYearSchema>;

interface SchoolYearModalProps {
  controller: ModalState<any>;
  onSubmit: () => void;
}

export default function SchoolYearModal({ controller, onSubmit }: SchoolYearModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    setValue,
    formState: { errors },
  } = useForm<SchoolYearFormData>({
    resolver: zodResolver(schoolYearSchema),
    defaultValues: {
      school_year_code: '',
      name: '',
      start_date: '',
      end_date: '',
      is_active: false,
    },
  });

  const { mutateAsync: createSchoolYear, isPending } = useCreateSchoolYear();
  const { mutateAsync: updateSchoolYear, isPending: isUpdating } = useUpdateSchoolYear();

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);
  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);

  useEffect(() => {
    if (!controller.data) {
      reset({
        school_year_code: '',
        name: '',
        start_date: '',
        end_date: '',
        is_active: false,
      });
    } else {
      reset({
        ...controller.data,
        start_date: controller.data.start_date
          ? String(controller.data.start_date).substring(0, 10)
          : '',
        end_date: controller.data.end_date ? String(controller.data.end_date).substring(0, 10) : '',
        is_active:
          typeof controller.data.is_active === 'boolean'
            ? controller.data.is_active
            : controller.data.is_active === '1' || controller.data.is_active === 'true',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controller.isOpen, reset, controller.data]);

  const onFormSubmit = async (data: SchoolYearFormData) => {
    try {
      const submitData = {
        ...data,
        is_active: !!data.is_active,
      };
      if (isEdit) {
        await updateSchoolYear({
          id: controller.data.id,
          data: submitData,
        });
      } else {
        await createSchoolYear({
          data: submitData,
        });
      }
      toast.success(`School Year ${isEdit ? 'updated' : 'created'} successfully`);
      controller.closeFn();
      onSubmit();
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} School Year`);
    }
  };

  // --- MASKED INPUT HANDLER FOR SCHOOL-YEAR-CODE ---
  const handleSchoolYearCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSchoolYearCode(e.target.value);
    setValue('school_year_code', formatted, { shouldValidate: true });
  };

  // --- MASKED INPUT HANDLER FOR AY NAME ---
  const handleSchoolYearNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSchoolYearName(e.target.value);
    setValue('name', formatted, { shouldValidate: true });
  };

  return (
    <Modal
      controller={controller}
      title={`${isEdit ? 'Edit' : 'Create'} School Year`}
      size="md"
      closable
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="school_year_code">Code</Label>
          <Input
            id="school_year_code"
            placeholder="2024-2025"
            maxLength={9}
            inputMode="numeric"
            autoComplete="off"
            {...register('school_year_code', {
              onChange: isEdit
                ? undefined
                : (e) => {
                    handleSchoolYearCodeChange(e);
                  },
            })}
            disabled={isEdit}
          />
          {errors.school_year_code && (
            <p className="text-sm text-destructive">{errors.school_year_code.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="AY 2024-2025"
            maxLength={14}
            autoComplete="off"
            {...register('name', {
              onChange: isEdit
                ? undefined
                : (e) => {
                    handleSchoolYearNameChange(e);
                  },
            })}
            disabled={isEdit}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <Input id="start_date" type="date" {...register('start_date')} autoComplete="off" />
            {errors.start_date && (
              <p className="text-sm text-destructive">{errors.start_date.message}</p>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="end_date">End Date</Label>
            <Input id="end_date" type="date" {...register('end_date')} autoComplete="off" />
            {errors.end_date && (
              <p className="text-sm text-destructive">{errors.end_date.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Controller
            name="is_active"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Switch
                id="is_active"
                checked={!!value}
                onCheckedChange={onChange}
                className="data-[state=checked]:bg-green-600"
              />
            )}
          />
          <Label htmlFor="is_active" className="cursor-pointer select-none">
            Active
          </Label>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update School Year' : 'Create School Year'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
