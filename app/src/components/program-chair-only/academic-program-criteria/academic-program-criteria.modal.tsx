import Modal, { type ModalState } from '@/components/custom/modal.component';
import Select, { type SelectOption } from '@/components/custom/select.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/auth.context';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateAcademicProgramCriteria,
  useGetSchoolYearPaginated,
  useUpdateAcademicProgramCriteria,
} from '@rest/api';
import type { SchoolYear } from '@rest/models';
import { XCircle } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const academicProgramCriteriaSchema = z
  .object({
    academic_program_id: z.number().min(1, 'Academic program is required'),
    school_year_id: z.number().min(1, 'School year is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().nullable().optional(),
    max_score: z.number().min(0, 'Max score must be at least 0'),
    min_score: z.number().min(0, 'Min score must be at least 0'),
    weight: z.number().min(0, 'Weight must be at least 0').max(100, 'Weight cannot exceed 100'),
    is_active: z.boolean(),
  })
  .refine((data) => data.max_score >= data.min_score, {
    message: 'Max score must be greater than or equal to min score',
    path: ['max_score'],
  });

type AcademicProgramCriteriaFormData = z.infer<typeof academicProgramCriteriaSchema>;

interface AcademicProgramCriteriaModalProps {
  controller: ModalState<any>;
  onSubmit: (data: AcademicProgramCriteriaFormData) => void;
}

export default function AcademicProgramCriteriaModal({
  controller,
  onSubmit,
}: AcademicProgramCriteriaModalProps) {
  const { session } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AcademicProgramCriteriaFormData>({
    resolver: zodResolver(academicProgramCriteriaSchema),
    defaultValues: {
      academic_program_id: 0,
      school_year_id: 0,
      title: '',
      description: '',
      max_score: 100,
      min_score: 0,
      weight: 0,
      is_active: true,
    },
  });

  const { mutateAsync: createCriteria, isPending } = useCreateAcademicProgramCriteria();
  const { mutateAsync: updateCriteria, isPending: isUpdating } = useUpdateAcademicProgramCriteria();

  const { data: schoolYears } = useGetSchoolYearPaginated({
    sort: '-start_date',
    page: 1,
    rows: Number.MAX_SAFE_INTEGER,
  });

  const schoolYearsList = useMemo<SelectOption[]>(
    () =>
      schoolYears?.data?.data?.map((schoolYear: SchoolYear) => ({
        label: schoolYear.name,
        value: String(schoolYear.id),
      })) ?? [],
    [schoolYears]
  );

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);
  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);

  const schoolYearIdValue = watch('school_year_id');
  const isActiveValue = watch('is_active');

  const onFormSubmit = async (data: AcademicProgramCriteriaFormData) => {
    try {
      if (isEdit) {
        await updateCriteria({
          id: controller.data.id,
          data,
        });
      } else {
        await createCriteria({
          data,
        });
      }
      toast.success(`Criteria ${isEdit ? 'updated' : 'created'} successfully`);
      controller.closeFn();
      onSubmit(data);
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} criteria`);
    }
  };

  useEffect(() => {
    if (!controller.data) {
      return reset({
        academic_program_id: session?.active_academic_program ?? 0,
        school_year_id: 0,
        title: '',
        description: '',
        max_score: 100,
        min_score: 0,
        weight: 0,
        is_active: true,
      });
    }
    reset({
      academic_program_id: controller.data.academic_program_id || 0,
      school_year_id: controller.data.school_year_id || 0,
      title: controller.data.title || '',
      description: controller.data.description || '',
      max_score: controller.data.max_score ?? 100,
      min_score: controller.data.min_score ?? 0,
      weight: controller.data.weight ?? 0,
      is_active: controller.data.is_active ?? true,
    });
  }, [controller.isOpen, controller.data, reset, session?.active_academic_program]);

  return (
    <Modal
      controller={controller}
      title={`${isEdit ? 'Edit' : 'Add'} Program Criteria`}
      size="lg"
      closable
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* School Year Selection */}
        <div className="space-y-2">
          <Label htmlFor="school_year_id" className="text-sm font-medium">
            School Year <span className="text-destructive">*</span>
          </Label>
          <Select
            options={schoolYearsList}
            placeholder="Select school year"
            value={schoolYearIdValue?.toString()}
            onValueChange={(value) => setValue('school_year_id', parseInt(value))}
            disabled={isEdit}
          />
          {errors.school_year_id && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              {errors.school_year_id.message}
            </p>
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input id="title" placeholder="Enter criteria title" {...register('title')} />
          {errors.title && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Enter criteria description (optional)"
            rows={3}
            {...register('description')}
          />
          {errors.description && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Score Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min_score" className="text-sm font-medium">
              Min Score <span className="text-destructive">*</span>
            </Label>
            <Input
              id="min_score"
              type="number"
              placeholder="0"
              {...register('min_score', { valueAsNumber: true })}
            />
            {errors.min_score && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                {errors.min_score.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_score" className="text-sm font-medium">
              Max Score <span className="text-destructive">*</span>
            </Label>
            <Input
              id="max_score"
              type="number"
              placeholder="100"
              {...register('max_score', { valueAsNumber: true })}
            />
            {errors.max_score && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                {errors.max_score.message}
              </p>
            )}
          </div>
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <Label htmlFor="weight" className="text-sm font-medium">
            Weight (%) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="weight"
            type="number"
            placeholder="0-100"
            {...register('weight', { valueAsNumber: true })}
          />
          <p className="text-xs text-muted-foreground">
            Weight percentage for this criteria in overall evaluation
          </p>
          {errors.weight && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              {errors.weight.message}
            </p>
          )}
        </div>

        {/* Settings Section */}
        <div className="rounded-lg border bg-muted/50 p-4 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Criteria Settings</h3>

          {/* Is Active Toggle */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1 space-y-1">
              <Label htmlFor="is_active" className="text-sm font-medium">
                Active Status
              </Label>
              <p className="text-xs text-muted-foreground">
                Enable or disable this criteria for evaluation
              </p>
            </div>
            <Switch
              id="is_active"
              checked={isActiveValue}
              onCheckedChange={(checked) => setValue('is_active', checked)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={controller.closeFn} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving} className="min-w-[120px]">
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Saving...</span>
              </div>
            ) : (
              <span>{isEdit ? 'Update' : 'Create'} Criteria</span>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
