import Modal, { type ModalState } from '@/components/custom/modal.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateGradeBookItem, useUpdateGradeBookItem } from '@rest/api';
import type { GradeBookItem } from '@rest/models';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const gradebookItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  weight: z.number().min(0, 'Weight must be at least 0').max(100, 'Weight cannot exceed 100'),
});

type GradebookItemFormData = z.infer<typeof gradebookItemSchema>;

interface GradebookItemModalProps {
  controller: ModalState<GradeBookItem>;
  gradebookId: number;
  onSubmit: () => void;
}

export default function GradebookItemModal({
  controller,
  gradebookId,
  onSubmit,
}: GradebookItemModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<GradebookItemFormData>({
    resolver: zodResolver(gradebookItemSchema),
    defaultValues: {
      title: '',
      weight: 0,
    },
  });

  const { mutateAsync: createGradeBookItem, isPending } = useCreateGradeBookItem();
  const { mutateAsync: updateGradeBookItem, isPending: isUpdating } = useUpdateGradeBookItem();

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);
  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);

  const onFormSubmit = async (data: GradebookItemFormData) => {
    try {
      const payload: GradeBookItem = {
        title: data.title,
        weight: data.weight,
        gradebook_id: gradebookId,
      };

      if (isEdit && controller.data?.id) {
        await updateGradeBookItem({
          id: controller.data.id,
          data: payload,
        });
        toast.success('Gradebook item updated successfully');
      } else {
        await createGradeBookItem({
          data: payload,
        });
        toast.success('Gradebook item created successfully');
      }
      controller.closeFn();
      onSubmit();
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} gradebook item`);
    }
  };

  useEffect(() => {
    if (!controller.data) {
      return reset({
        title: '',
        weight: 0,
      });
    }
    reset({
      title: controller.data.title || '',
      weight: controller.data.weight || 0,
    });
  }, [controller.isOpen, controller.data, reset]);

  return (
    <Modal
      controller={controller}
      title={`${isEdit ? 'Edit' : 'Add'} Gradebook Item`}
      size="md"
      closable
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="e.g., Midterm Exam, Quizzes, Projects"
            {...register('title')}
            disabled={isSaving}
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (%)</Label>
          <Input
            id="weight"
            type="number"
            step="0.01"
            placeholder="e.g., 30"
            {...register('weight', { valueAsNumber: true })}
            disabled={isSaving}
          />
          {errors.weight && <p className="text-sm text-destructive">{errors.weight.message}</p>}
          <p className="text-xs text-muted-foreground">
            Total weight of all items should equal 100%
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
