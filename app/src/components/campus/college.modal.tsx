import Modal, { type ModalState } from '@/components/custom/modal.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateCollege, useUpdateCollege } from '@rest/api';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const collegeSchema = z.object({
  college_name: z
    .string()
    .min(1, 'College name is required')
    .max(255, 'College name must be less than 255 characters'),
  college_shortname: z
    .string()
    .min(1, 'College short name is required')
    .max(255, 'College short name must be less than 255 characters'),
  campus_id: z.number().min(1, 'Campus ID is required'),
});

type CollegeFormData = z.infer<typeof collegeSchema>;

interface CollegeModalProps {
  controller: ModalState<any>;
  onSubmit: (data: CollegeFormData) => void;
  campus_id?: number;
}

export default function CollegeModal({ controller, onSubmit, campus_id }: CollegeModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CollegeFormData>({
    resolver: zodResolver(collegeSchema),
    defaultValues: {
      college_name: '',
      college_shortname: '',
      campus_id: campus_id || 0,
    },
  });

  const { mutateAsync: createCollege, isPending } = useCreateCollege();
  const { mutateAsync: updateCollege, isPending: isUpdating } = useUpdateCollege();

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);

  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);

  const onFormSubmit = async (data: CollegeFormData) => {
    try {
      if (isEdit) {
        await updateCollege({
          id: controller.data.id,
          data,
        });
        toast.success('College updated successfully');
      } else {
        await createCollege({
          data,
        });
        toast.success('College created successfully');
      }
      controller.closeFn();
      onSubmit(data);
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} college`);
    }
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  useEffect(() => {
    if (!controller.data) {
      return reset({
        college_name: '',
        college_shortname: '',
        campus_id: campus_id || 0,
      });
    }
    reset({
      ...controller.data,
    });
  }, [controller.isOpen, controller.data, reset, campus_id]);

  return (
    <Modal controller={controller} title="College Details" size="md" closable>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="college_name">College Name</Label>
          <Input id="college_name" placeholder="Enter college name" {...register('college_name')} />
          {errors.college_name && (
            <p className="text-sm text-destructive">{errors.college_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="college_shortname">College Short Name</Label>
          <Input
            id="college_shortname"
            placeholder="Enter college short name"
            {...register('college_shortname')}
          />
          {errors.college_shortname && (
            <p className="text-sm text-destructive">{errors.college_shortname.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update College' : 'Create College'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
