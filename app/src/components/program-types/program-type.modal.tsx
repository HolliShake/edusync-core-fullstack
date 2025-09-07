import Modal, { type ModalState } from '@/components/custom/modal.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateProgramType, useUpdateProgramType } from '@rest/api';
import type { ProgramType } from '@rest/models';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const programTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type ProgramTypeFormData = z.infer<typeof programTypeSchema>;

interface ProgramTypeModalProps {
  controller: ModalState<any>;
  onSubmit: (data: ProgramType) => void;
}

export default function ProgramTypeModal({ controller, onSubmit }: ProgramTypeModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProgramTypeFormData>({
    resolver: zodResolver(programTypeSchema),
    defaultValues: {
      name: '',
    },
  });

  const { mutateAsync: createProgramType, isPending } = useCreateProgramType();
  const { mutateAsync: updateProgramType, isPending: isUpdating } = useUpdateProgramType();

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);

  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);

  const onFormSubmit = async (data: ProgramTypeFormData) => {
    try {
      if (isEdit && controller.data) {
        await updateProgramType({
          id: controller.data.id,
          data,
        });
        toast.success('Program Type updated successfully');
      } else {
        await createProgramType({
          data,
        });
        toast.success('Program Type created successfully');
      }
      controller.closeFn();
      onSubmit(data);
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} program type`);
    }
  };

  useEffect(() => {
    if (!controller.data) {
      return reset({
        name: '',
      });
    }
    reset({
      name: controller.data.name,
    });
  }, [controller.isOpen, controller.data, reset]);

  return (
    <Modal
      controller={controller}
      title={`${isEdit ? 'Edit' : 'Create'} Program Type`}
      size="md"
      closable
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter program type name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update Program Type' : 'Create Program Type'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
