import Modal, { type ModalState } from '@/components/custom/modal.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth.context';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateGradeBook, useUpdateGradeBook } from '@rest/api';
import type { GradeBook } from '@rest/models';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const gradebookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
});

type GradebookFormData = z.infer<typeof gradebookSchema>;

interface GradebookModalProps {
  controller: ModalState<GradeBook>;
  onSubmit: () => void;
}

export default function GradebookModal({ controller, onSubmit }: GradebookModalProps) {
  const { session } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<GradebookFormData>({
    resolver: zodResolver(gradebookSchema),
    defaultValues: {
      title: '',
    },
  });

  const { mutateAsync: createGradeBook, isPending } = useCreateGradeBook();
  const { mutateAsync: updateGradeBook, isPending: isUpdating } = useUpdateGradeBook();

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);
  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);

  const onFormSubmit = async (data: GradebookFormData) => {
    try {
      const payload: GradeBook = {
        title: data.title,
        academic_program_id: session?.active_academic_program ?? null,
        is_template: true, // Always true for program chair
        section_id: null, // Always null for program chair templates
      };

      if (isEdit && controller.data?.id) {
        await updateGradeBook({
          id: controller.data.id,
          data: payload,
        });
        toast.success('Gradebook updated successfully');
      } else {
        await createGradeBook({
          data: payload,
        });
        toast.success('Gradebook created successfully');
      }
      controller.closeFn();
      onSubmit();
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} gradebook`);
    }
  };

  useEffect(() => {
    if (!controller.data) {
      return reset({
        title: '',
      });
    }
    reset({
      title: controller.data.title || '',
    });
  }, [controller.isOpen, controller.data, reset]);

  return (
    <Modal
      controller={controller}
      title={`${isEdit ? 'Edit' : 'Create'} Gradebook`}
      size="md"
      closable
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="e.g., Midterm Assessment, Final Grades"
            {...register('title')}
            disabled={isSaving}
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div className="bg-muted/50 p-3 rounded-md text-sm text-muted-foreground">
          <p>
            This gradebook will be created as a template for your academic program. You can later
            add items and define grading criteria.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
