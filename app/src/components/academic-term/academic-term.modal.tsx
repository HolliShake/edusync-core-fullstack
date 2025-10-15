import Modal, { type ModalState } from '@/components/custom/modal.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateAcademicTerm, useUpdateAcademicTerm } from '@rest/api';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const academicTermSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().nullable().optional(),
  number_of_terms: z.number().int().min(1, 'Number of terms must be at least 1'),
});

type AcademicTermFormData = z.infer<typeof academicTermSchema>;

interface AcademicTermModalProps {
  controller: ModalState<any>;
  onSubmit: (data: AcademicTermFormData) => void;
}

export default function AcademicTermModal({ controller, onSubmit }: AcademicTermModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<AcademicTermFormData>({
    resolver: zodResolver(academicTermSchema),
    defaultValues: {
      name: '',
      description: '',
      number_of_terms: 1,
    },
  });

  const { mutateAsync: createAcademicTerm, isPending } = useCreateAcademicTerm();
  const { mutateAsync: updateAcademicTerm, isPending: isUpdating } = useUpdateAcademicTerm();

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);

  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);

  const onFormSubmit = async (data: AcademicTermFormData) => {
    try {
      const payload = {
        name: data.name,
        description: data.description ?? null,
        number_of_terms: Number(data.number_of_terms),
      };

      if (isEdit) {
        await updateAcademicTerm({
          id: controller.data.id,
          data: payload,
        });
      } else {
        await createAcademicTerm({
          data: payload,
        });
      }
      toast.success(`Academic Term ${isEdit ? 'updated' : 'created'} successfully`);
      controller.closeFn();
      onSubmit(data);
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} academic term`);
    }
  };

  useEffect(() => {
    if (!controller.data) {
      return reset({
        name: '',
        description: '',
        number_of_terms: 1,
      });
    }
    reset({
      ...controller.data,
    });
  }, [controller.isOpen, controller.data, reset]);

  return (
    <Modal
      controller={controller}
      title={`${isEdit ? 'Edit' : 'Create'} Academic Term`}
      size="md"
      closable
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter academic term name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter description (optional)"
            {...register('description')}
            rows={3}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="number_of_terms">Number of Terms</Label>
          <Input
            id="number_of_terms"
            type="number"
            placeholder="Enter number of terms"
            {...register('number_of_terms', { valueAsNumber: true })}
            min={1}
          />
          {errors.number_of_terms && (
            <p className="text-sm text-destructive">{errors.number_of_terms.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update Academic Term' : 'Create Academic Term'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
