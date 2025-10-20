import Modal, { type ModalState } from '@/components/custom/modal.component';
import Select, { type SelectOption } from '@/components/custom/select.component';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/auth.context';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateAcademicProgramRequirement,
  useGetRequirementPaginated,
  useGetSchoolYearPaginated,
  useUpdateAcademicProgramRequirement,
} from '@rest/api';
import type { Requirement, SchoolYear } from '@rest/models';
import { XCircle } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const academicProgramRequirementSchema = z.object({
  academic_program_id: z.number().min(1, 'Academic program is required'),
  requirement_id: z.number().min(1, 'Requirement is required'),
  school_year_id: z.number().min(1, 'School year is required'),
  is_mandatory: z.boolean(),
  is_active: z.boolean(),
});

type AcademicProgramRequirementFormData = z.infer<typeof academicProgramRequirementSchema>;

interface AcademicProgramRequirementModalProps {
  controller: ModalState<any>;
  onSubmit: (data: AcademicProgramRequirementFormData) => void;
}

export default function AcademicProgramRequirementModal({
  controller,
  onSubmit,
}: AcademicProgramRequirementModalProps) {
  const { session } = useAuth();
  const {
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AcademicProgramRequirementFormData>({
    resolver: zodResolver(academicProgramRequirementSchema),
    defaultValues: {
      academic_program_id: 0,
      requirement_id: 0,
      school_year_id: 0,
      is_mandatory: true,
      is_active: true,
    },
  });

  const { mutateAsync: createRequirement, isPending } = useCreateAcademicProgramRequirement();
  const { mutateAsync: updateRequirement, isPending: isUpdating } =
    useUpdateAcademicProgramRequirement();

  const { data: requirements } = useGetRequirementPaginated({
    page: 1,
    rows: Number.MAX_SAFE_INTEGER,
  });

  const { data: schoolYears } = useGetSchoolYearPaginated({
    sort: '-start_date',
    page: 1,
    rows: Number.MAX_SAFE_INTEGER,
  });

  const requirementsList = useMemo<SelectOption[]>(
    () =>
      requirements?.data?.data?.map((requirement: Requirement) => ({
        label: requirement.requirement_name,
        value: String(requirement.id),
      })) ?? [],
    [requirements]
  );

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

  const requirementIdValue = watch('requirement_id');
  const schoolYearIdValue = watch('school_year_id');
  const isMandatoryValue = watch('is_mandatory');
  const isActiveValue = watch('is_active');

  const onFormSubmit = async (data: AcademicProgramRequirementFormData) => {
    try {
      if (isEdit) {
        await updateRequirement({
          id: controller.data.id,
          data,
        });
      } else {
        await createRequirement({
          data,
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
        academic_program_id: session?.active_academic_program ?? 0,
        requirement_id: 0,
        school_year_id: 0,
        is_mandatory: true,
        is_active: true,
      });
    }
    reset({
      academic_program_id: controller.data.academic_program_id || 0,
      requirement_id: controller.data.requirement_id || 0,
      school_year_id: controller.data.school_year_id || 0,
      is_mandatory: controller.data.is_mandatory ?? true,
      is_active: controller.data.is_active ?? true,
    });
  }, [controller.isOpen, controller.data, reset, session?.active_academic_program]);

  return (
    <Modal
      controller={controller}
      title={`${isEdit ? 'Edit' : 'Add'} Program Requirement`}
      size="lg"
      closable
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Requirement Selection */}
        <div className="space-y-2">
          <Label htmlFor="requirement_id" className="text-sm font-medium">
            Requirement <span className="text-destructive">*</span>
          </Label>
          <Select
            options={requirementsList}
            placeholder="Select requirement"
            value={requirementIdValue?.toString()}
            onValueChange={(value) => setValue('requirement_id', parseInt(value))}
            disabled={isEdit}
          />
          {errors.requirement_id && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              {errors.requirement_id.message}
            </p>
          )}
        </div>

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

        {/* Settings Section */}
        <div className="rounded-lg border bg-muted/50 p-4 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Requirement Settings</h3>

          {/* Is Mandatory Toggle */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1 space-y-1">
              <Label htmlFor="is_mandatory" className="text-sm font-medium">
                Mandatory Requirement
              </Label>
              <p className="text-xs text-muted-foreground">
                Students must fulfill this requirement to be admitted
              </p>
            </div>
            <Switch
              id="is_mandatory"
              checked={isMandatoryValue}
              onCheckedChange={(checked) => setValue('is_mandatory', checked)}
            />
          </div>

          {/* Is Active Toggle */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1 space-y-1">
              <Label htmlFor="is_active" className="text-sm font-medium">
                Active Status
              </Label>
              <p className="text-xs text-muted-foreground">
                Enable or disable this requirement for the program
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
              <span>{isEdit ? 'Update' : 'Create'} Requirement</span>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
