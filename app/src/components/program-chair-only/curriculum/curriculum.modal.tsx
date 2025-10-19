import Modal, { type ModalState } from '@/components/custom/modal.component';
import Select from '@/components/custom/select.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/auth.context';
import { CurriculumStateEnum } from '@/enums/curriculum-state-enum';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateCurriculum, useGetAcademicTermPaginated, useUpdateCurriculum } from '@rest/api';
import type { AcademicTerm, Curriculum, CurriculumStatus } from '@rest/models';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const curriculumSchema = z.object({
  academic_program_id: z.number().min(1, 'Academic program is required'),
  academic_term_id: z.number().min(1, 'Academic term is required'),
  curriculum_code: z.string().min(1, 'Curriculum code is required'),
  curriculum_name: z.string().min(1, 'Curriculum name is required'),
  description: z.string().nullable(),
  effective_year: z.number().min(1900, 'Valid effective year is required'),
  total_units: z.number().min(0, 'Total units must be non-negative'),
  total_hours: z.number().min(0, 'Total hours must be non-negative'),
  status: z.enum([
    CurriculumStateEnum.ACTIVE,
    CurriculumStateEnum.INACTIVE,
    CurriculumStateEnum.ARCHIVED,
  ]),
  approved_date: z.string().nullable(),
});

type CurriculumFormData = z.infer<typeof curriculumSchema>;

interface CurriculumModalProps {
  controller: ModalState<Curriculum>;
  onSubmit: () => void;
}

export default function CurriculumModal({ controller, onSubmit }: CurriculumModalProps) {
  const { session } = useAuth();
  const { active_academic_program } = session ?? { active_academic_program: 0 };

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CurriculumFormData>({
    resolver: zodResolver(curriculumSchema),
    defaultValues: {
      academic_program_id: active_academic_program ?? 0,
      academic_term_id: 0,
      curriculum_code: '',
      curriculum_name: '',
      description: null,
      effective_year: new Date().getFullYear(),
      total_units: 0,
      total_hours: 0,
      status: 'active',
      approved_date: null,
    },
  });

  const { mutateAsync: createCurriculum, isPending } = useCreateCurriculum();
  const { mutateAsync: updateCurriculum, isPending: isUpdating } = useUpdateCurriculum();

  const { data: listOfAcademicTermsResponse } = useGetAcademicTermPaginated({
    page: 1,
    rows: Number.MAX_SAFE_INTEGER,
  });

  const listOfAcademicTerms = useMemo(
    () =>
      listOfAcademicTermsResponse?.data?.data?.map((academicTerm: AcademicTerm) => ({
        label: academicTerm.name,
        value: String(academicTerm.id),
      })) ?? [],
    [listOfAcademicTermsResponse]
  );

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);

  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);

  const status = watch('status');
  const academicTermId = watch('academic_term_id');

  const statusOptions = [
    { label: 'Active', value: CurriculumStateEnum.ACTIVE },
    { label: 'Inactive', value: CurriculumStateEnum.INACTIVE },
    { label: 'Archived', value: CurriculumStateEnum.ARCHIVED },
  ];

  const onFormSubmit = async (data: CurriculumFormData) => {
    try {
      if (isEdit) {
        await updateCurriculum({
          id: controller.data?.id ?? 0,
          data: data as unknown as Curriculum,
        });
      } else {
        await createCurriculum({
          data: data as unknown as Curriculum,
        });
      }
      toast.success(`Curriculum ${isEdit ? 'updated' : 'created'} successfully`);
      controller.closeFn();
      onSubmit();
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} curriculum`);
    }
  };

  useEffect(() => {
    if (!controller.data) {
      return reset({
        academic_program_id: active_academic_program ?? 0,
        academic_term_id: 0,
        curriculum_code: '',
        curriculum_name: '',
        description: null,
        effective_year: new Date().getFullYear(),
        total_units: 0,
        total_hours: 0,
        status: 'active',
        approved_date: null,
      });
    }
    reset({
      ...controller.data,
      status: controller.data?.status as CurriculumStatus,
    } as CurriculumFormData);
  }, [controller.isOpen, controller.data, reset, active_academic_program]);

  return (
    <Modal
      controller={controller}
      title={`${isEdit ? 'Edit' : 'Create'} Curriculum`}
      size="lg"
      closable
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="curriculum_code">Curriculum Code</Label>
            <Input
              id="curriculum_code"
              placeholder="Enter curriculum code"
              {...register('curriculum_code')}
            />
            {errors.curriculum_code && (
              <p className="text-sm text-destructive">{errors.curriculum_code.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="curriculum_name">Curriculum Name</Label>
            <Input
              id="curriculum_name"
              placeholder="Enter curriculum name"
              {...register('curriculum_name')}
            />
            {errors.curriculum_name && (
              <p className="text-sm text-destructive">{errors.curriculum_name.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter description (optional)"
            {...register('description')}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="academic_term_id">Academic Term</Label>
            <Select
              value={String(academicTermId)}
              onValueChange={(value) => setValue('academic_term_id', Number(value))}
              options={listOfAcademicTerms}
              placeholder="Select academic term"
            />
            {errors.academic_term_id && (
              <p className="text-sm text-destructive">{errors.academic_term_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="effective_year">Effective Year</Label>
            <Input
              id="effective_year"
              type="number"
              placeholder="Enter effective year"
              {...register('effective_year', { valueAsNumber: true })}
            />
            {errors.effective_year && (
              <p className="text-sm text-destructive">{errors.effective_year.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setValue('status', value as any)}
              options={statusOptions}
              placeholder="Select status"
            />
            {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="total_units">Total Units</Label>
            <Input
              id="total_units"
              type="number"
              placeholder="Enter total units"
              {...register('total_units', { valueAsNumber: true })}
            />
            {errors.total_units && (
              <p className="text-sm text-destructive">{errors.total_units.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="total_hours">Total Hours</Label>
          <Input
            id="total_hours"
            type="number"
            placeholder="Enter total hours"
            {...register('total_hours', { valueAsNumber: true })}
          />
          {errors.total_hours && (
            <p className="text-sm text-destructive">{errors.total_hours.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update Curriculum' : 'Create Curriculum'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
