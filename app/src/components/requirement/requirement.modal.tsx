import Modal, { type ModalState } from '@/components/custom/modal.component';
import Select from '@/components/custom/select.component';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateRequirement, useUpdateRequirement } from '@rest/api';
import { RequirementTypeEnum } from '@rest/models';
import type { Requirement } from '@rest/models/requirement';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const requirementSchema = z.object({
  requirement_name: z.string().min(1, 'Requirement name is required'),
  description: z.string().nullable().optional(),
  requirement_type: z.enum(
    [
      RequirementTypeEnum.admission,
      RequirementTypeEnum.graduation,
      RequirementTypeEnum.enrollment,
      RequirementTypeEnum.scholarship,
      RequirementTypeEnum.transfer,
      RequirementTypeEnum.general,
    ],
    {
      message: 'Requirement type is required',
    }
  ),
  is_mandatory: z.boolean(),
  is_active: z.boolean(),
});

type RequirementFormData = z.infer<typeof requirementSchema>;

interface RequirementModalProps {
  controller: ModalState<Requirement>;
  onSubmit: (data: RequirementFormData) => void;
}

export default function RequirementModal({ controller, onSubmit }: RequirementModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors },
  } = useForm<RequirementFormData>({
    resolver: zodResolver(requirementSchema),
    defaultValues: {
      requirement_name: '',
      description: '',
      requirement_type: RequirementTypeEnum.general,
      is_mandatory: false,
      is_active: true,
    },
  });

  const { mutateAsync: createRequirement, isPending } = useCreateRequirement();
  const { mutateAsync: updateRequirement, isPending: isUpdating } = useUpdateRequirement();

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);

  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);

  const onFormSubmit = async (data: RequirementFormData) => {
    try {
      if (isEdit && controller.data?.id) {
        await updateRequirement({
          id: controller.data.id,
          data: data as unknown as Requirement,
        });
      } else {
        await createRequirement({
          data: data as unknown as Requirement,
        });
      }
      toast.success(`Requirement ${isEdit ? 'updated' : 'created'} successfully`);
      controller.closeFn();
      onSubmit(data);
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} requirement`);
    }
  };

  useEffect(() => {
    if (!controller.data) {
      return reset({
        requirement_name: '',
        description: '',
        requirement_type: RequirementTypeEnum.general,
        is_mandatory: false,
        is_active: true,
      });
    }
    reset({
      requirement_name: controller.data.requirement_name,
      description: controller.data.description || '',
      requirement_type: controller.data.requirement_type,
      is_mandatory: controller.data.is_mandatory,
      is_active: controller.data.is_active,
    });
  }, [controller.isOpen, controller.data, reset]);

  return (
    <Modal
      controller={controller}
      title={`${isEdit ? 'Edit' : 'Create'} Requirement`}
      size="md"
      closable
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="requirement_name">Requirement Name</Label>
          <Input
            id="requirement_name"
            placeholder="Enter requirement name"
            {...register('requirement_name')}
          />
          {errors.requirement_name && (
            <p className="text-sm text-destructive">{errors.requirement_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter description (optional)"
            rows={3}
            {...register('description')}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="requirement_type">Requirement Type</Label>
          <Controller
            name="requirement_type"
            control={control}
            render={({ field }) => (
              <Select
                options={Object.entries(RequirementTypeEnum).map(([value, label]) => ({
                  label,
                  value,
                }))}
                placeholder="Select requirement type"
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
          {errors.requirement_type && (
            <p className="text-sm text-destructive">{errors.requirement_type.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Controller
              name="is_mandatory"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="is_mandatory"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="is_mandatory" className="cursor-pointer font-normal">
              Is Mandatory
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <Checkbox id="is_active" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="is_active" className="cursor-pointer font-normal">
              Is Active
            </Label>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update Requirement' : 'Create Requirement'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
