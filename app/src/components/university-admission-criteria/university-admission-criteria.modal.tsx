import Modal, { type ModalState } from '@/components/custom/modal.component';
import Select from '@/components/custom/select.component';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateUniversityAdmissionCriteria,
  useGetRequirementPaginated,
  useUpdateUniversityAdmissionCriteria,
} from '@rest/api';
import type { UniversityAdmissionCriteria } from '@rest/models';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const universityAdmissionCriteriaSchema = z
  .object({
    university_admission_id: z.number().min(1, 'University admission is required'),
    requirement_id: z.number().min(1, 'Requirement is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().nullable().optional(),
    max_score: z.number().min(0, 'Max score must be at least 0'),
    min_score: z.number().min(0, 'Min score must be at least 0'),
    weight: z.number().min(0, 'Weight must be at least 0'),
    is_active: z.boolean(),
    file_suffix: z.string().min(1, 'File suffix is required'),
  })
  .refine(
    (data) => {
      return data.max_score >= data.min_score;
    },
    {
      message: 'Max score must be greater than or equal to min score',
      path: ['max_score'],
    }
  );

type UniversityAdmissionCriteriaFormData = z.infer<typeof universityAdmissionCriteriaSchema>;

interface UniversityAdmissionCriteriaModalProps {
  controller: ModalState<UniversityAdmissionCriteria>;
  universityAdmissionId: number;
  onSubmit: () => void;
}

export default function UniversityAdmissionCriteriaModal({
  controller,
  universityAdmissionId,
  onSubmit,
}: UniversityAdmissionCriteriaModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors },
  } = useForm<UniversityAdmissionCriteriaFormData>({
    resolver: zodResolver(universityAdmissionCriteriaSchema),
    defaultValues: {
      university_admission_id: universityAdmissionId,
      requirement_id: 0,
      title: '',
      description: '',
      max_score: 100,
      min_score: 0,
      weight: 0,
      is_active: true,
      file_suffix: '',
    },
  });

  const { data: requirementsData, isLoading: isLoadingRequirements } = useGetRequirementPaginated({
    page: 1,
    rows: Number.MAX_SAFE_INTEGER,
  });

  const { mutateAsync: createCriteria, isPending } = useCreateUniversityAdmissionCriteria();
  const { mutateAsync: updateCriteria, isPending: isUpdating } =
    useUpdateUniversityAdmissionCriteria();

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);

  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);

  const requirementOptions = useMemo(() => {
    return (
      requirementsData?.data?.data
        ?.filter((req) => req.is_active)
        ?.map((requirement) => ({
          label: requirement.requirement_name,
          value: String(requirement.id),
        })) ?? []
    );
  }, [requirementsData]);

  const onFormSubmit = async (data: UniversityAdmissionCriteriaFormData) => {
    try {
      if (isEdit && controller.data?.id) {
        await updateCriteria({
          id: controller.data.id,
          data: {
            ...data,
            university_admission_id: universityAdmissionId,
          },
        });
      } else {
        await createCriteria({
          data: {
            ...data,
            university_admission_id: universityAdmissionId,
          },
        });
      }
      toast.success(`Criteria ${isEdit ? 'updated' : 'created'} successfully`);
      controller.closeFn();
      onSubmit();
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} criteria`);
    }
  };

  useEffect(() => {
    if (!controller.data) {
      return reset({
        university_admission_id: universityAdmissionId,
        requirement_id: 0,
        title: '',
        description: '',
        max_score: 100,
        min_score: 0,
        weight: 0,
        is_active: true,
        file_suffix: '',
      });
    }

    reset({
      university_admission_id: universityAdmissionId,
      requirement_id: controller.data.requirement_id,
      title: controller.data.title,
      description: controller.data.description ?? '',
      max_score: controller.data.max_score,
      min_score: controller.data.min_score,
      weight: controller.data.weight,
      is_active: controller.data.is_active,
      file_suffix: controller.data.file_suffix,
    });
  }, [controller.isOpen, controller.data, reset, universityAdmissionId]);

  return (
    <Modal
      controller={controller}
      title={`${isEdit ? 'Edit' : 'Create'} Admission Criteria`}
      size="lg"
      closable
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="requirement_id">Requirement</Label>
          <Controller
            name="requirement_id"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : ''}
                onValueChange={(value) => field.onChange(Number(value))}
                options={requirementOptions}
                placeholder="Select requirement"
                disabled={isLoadingRequirements}
              />
            )}
          />
          {errors.requirement_id && (
            <p className="text-sm text-destructive">{errors.requirement_id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" type="text" {...register('title')} placeholder="Enter criteria title" />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Enter criteria description (optional)"
            rows={3}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min_score">Min Score</Label>
            <Input
              id="min_score"
              type="number"
              {...register('min_score', { valueAsNumber: true })}
              placeholder="Enter minimum score"
            />
            {errors.min_score && (
              <p className="text-sm text-destructive">{errors.min_score.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_score">Max Score</Label>
            <Input
              id="max_score"
              type="number"
              {...register('max_score', { valueAsNumber: true })}
              placeholder="Enter maximum score"
            />
            {errors.max_score && (
              <p className="text-sm text-destructive">{errors.max_score.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight</Label>
          <Input
            id="weight"
            type="number"
            {...register('weight', { valueAsNumber: true })}
            placeholder="Enter weight"
          />
          {errors.weight && <p className="text-sm text-destructive">{errors.weight.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="file_suffix">File Suffix</Label>
          <Input
            id="file_suffix"
            type="text"
            {...register('file_suffix')}
            placeholder="e.g., .pdf, .docx"
          />
          {errors.file_suffix && (
            <p className="text-sm text-destructive">{errors.file_suffix.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="is_active"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked)}
              />
            )}
          />
          <Label htmlFor="is_active" className="cursor-pointer">
            Active
          </Label>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update Criteria' : 'Create Criteria'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
