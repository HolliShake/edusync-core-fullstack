import Modal, { type ModalState } from '@/components/custom/modal.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateGradeBookItemDetail, useUpdateGradeBookItemDetail } from '@rest/api';
import type { GradeBookItemDetail } from '@rest/models';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const gradebookItemDetailSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    min_score: z.number().min(0, 'Minimum score must be at least 0'),
    max_score: z.number().min(0, 'Maximum score must be at least 0'),
    weight: z.number().min(0, 'Weight must be at least 0').max(100, 'Weight cannot exceed 100'),
  })
  .refine((data) => data.max_score >= data.min_score, {
    message: 'Maximum score must be greater than or equal to minimum score',
    path: ['max_score'],
  });

type GradebookItemDetailFormData = z.infer<typeof gradebookItemDetailSchema>;

interface GradebookItemDetailModalProps {
  controller: ModalState<GradeBookItemDetail & { gradebook_item_id?: number }>;
  onSubmit: () => void;
}

export default function GradebookItemDetailModal({
  controller,
  onSubmit,
}: GradebookItemDetailModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<GradebookItemDetailFormData>({
    resolver: zodResolver(gradebookItemDetailSchema),
    defaultValues: {
      title: '',
      min_score: 0,
      max_score: 100,
      weight: 0,
    },
  });

  const { mutateAsync: createGradeBookItemDetail, isPending } = useCreateGradeBookItemDetail();
  const { mutateAsync: updateGradeBookItemDetail, isPending: isUpdating } =
    useUpdateGradeBookItemDetail();

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);
  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);

  const onFormSubmit = async (data: GradebookItemDetailFormData) => {
    try {
      const payload: GradeBookItemDetail = {
        title: data.title,
        min_score: data.min_score,
        max_score: data.max_score,
        weight: data.weight,
        gradebook_item_id:
          controller.data?.gradebook_item_id || controller.data?.gradebook_item_id || 0,
      };

      if (isEdit && controller.data?.id) {
        await updateGradeBookItemDetail({
          id: controller.data.id,
          data: payload,
        });
        toast.success('Item detail updated successfully');
      } else {
        await createGradeBookItemDetail({
          data: payload,
        });
        toast.success('Item detail created successfully');
      }
      controller.closeFn();
      onSubmit();
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} item detail`);
    }
  };

  useEffect(() => {
    if (!controller.data) {
      return reset({
        title: '',
        min_score: 0,
        max_score: 100,
        weight: 0,
      });
    }
    reset({
      title: controller.data.title || '',
      min_score: controller.data.min_score || 0,
      max_score: controller.data.max_score || 100,
      weight: controller.data.weight || 0,
    });
  }, [controller.isOpen, controller.data, reset]);

  return (
    <Modal
      controller={controller}
      title={`${isEdit ? 'Edit' : 'Add'} Item Detail`}
      size="md"
      closable
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="e.g., Quiz 1, Lab Report 1"
            {...register('title')}
            disabled={isSaving}
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min_score">Minimum Score</Label>
            <Input
              id="min_score"
              type="number"
              step="0.01"
              placeholder="0"
              {...register('min_score', { valueAsNumber: true })}
              disabled={isSaving}
            />
            {errors.min_score && (
              <p className="text-sm text-destructive">{errors.min_score.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_score">Maximum Score</Label>
            <Input
              id="max_score"
              type="number"
              step="0.01"
              placeholder="100"
              {...register('max_score', { valueAsNumber: true })}
              disabled={isSaving}
            />
            {errors.max_score && (
              <p className="text-sm text-destructive">{errors.max_score.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (%)</Label>
          <Input
            id="weight"
            type="number"
            step="0.01"
            placeholder="e.g., 10"
            {...register('weight', { valueAsNumber: true })}
            disabled={isSaving}
          />
          {errors.weight && <p className="text-sm text-destructive">{errors.weight.message}</p>}
          <p className="text-xs text-muted-foreground">
            Weight relative to the parent item (should sum to 100% within the item)
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update' : 'Add'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
