import Modal, { type ModalState } from '@/components/custom/modal.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateGradeBookGradingPeriod, useUpdateGradeBookGradingPeriod } from '@rest/api';
import type { GradeBookGradingPeriod } from '@rest/models';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const gradingPeriodSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  weight: z
    .number({ error: 'Weight must be a number' })
    .min(0, 'Weight must be at least 0')
    .max(100, 'Weight cannot exceed 100'),
});

type GradingPeriodFormData = z.infer<typeof gradingPeriodSchema>;

interface GradebookGradingPeriodModalProps {
  controller: ModalState<GradeBookGradingPeriod>;
  onSubmit: () => void;
}

export default function GradebookGradingPeriodModal({
  controller,
  onSubmit,
}: GradebookGradingPeriodModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<GradingPeriodFormData>({
    resolver: zodResolver(gradingPeriodSchema),
    defaultValues: {
      title: '',
      weight: 0,
    },
  });

  const { mutateAsync: createGradingPeriod, isPending } = useCreateGradeBookGradingPeriod();
  const { mutateAsync: updateGradingPeriod, isPending: isUpdating } =
    useUpdateGradeBookGradingPeriod();

  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);
  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);

  const onFormSubmit = async (data: GradingPeriodFormData) => {
    try {
      const payload: GradeBookGradingPeriod = {
        title: data.title,
        weight: data.weight,
        gradebook_id: controller.data?.gradebook_id || 0,
      };
      if (isEdit && controller.data?.id) {
        await updateGradingPeriod({
          id: controller.data.id,
          data: payload,
        });
        toast.success('Grading period updated successfully');
      } else {
        await createGradingPeriod({
          data: payload,
        });
        toast.success('Grading period created successfully');
      }
      controller.closeFn();
      onSubmit();
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} grading period`);
    }
  };

  useEffect(() => {
    if (!controller.data) {
      reset({
        title: '',
        weight: 0,
      });
      return;
    }
    reset({
      title: controller.data.title ?? '',
      weight: Number(controller.data.weight ?? 0),
    });
  }, [controller.isOpen, controller.data, reset]);

  return (
    <Modal
      controller={controller}
      title={`${isEdit ? 'Edit' : 'Create'} Grading Period`}
      size="md"
      closable
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter grading period title"
            {...register('title')}
            autoFocus
            autoComplete="off"
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (%)</Label>
          <Input
            id="weight"
            type="number"
            min={0}
            max={100}
            step={0.01}
            placeholder="E.g., 20"
            {...register('weight', { valueAsNumber: true })}
          />
          {errors.weight && <p className="text-sm text-destructive">{errors.weight.message}</p>}
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update Grading Period' : 'Create Grading Period'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
