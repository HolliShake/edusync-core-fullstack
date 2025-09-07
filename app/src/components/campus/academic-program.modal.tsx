import Modal, { type ModalState } from '@/components/custom/modal.component';
import CustomSelect from '@/components/custom/select.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateAcademicProgram,
  useGetProgramTypePaginated,
  useUpdateAcademicProgram,
} from '@rest/api';
import type { AcademicProgram, ProgramType } from '@rest/models';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const academicProgramSchema = z.object({
  program_name: z.string().min(1, 'Program name is required'),
  short_name: z.string().min(1, 'Short name is required'),
  year_first_implemented: z
    .string()
    .min(1, 'Year first implemented is required')
    .refine((dateStr) => {
      const date = new Date(dateStr);
      return !isNaN(date.getTime());
    }, 'The year first implemented field must be a valid date.'),
  program_type_id: z.number({ error: 'Program type is required' }).int(),
});

type AcademicProgramFormData = z.infer<typeof academicProgramSchema>;

interface AcademicProgramModalProps {
  controller: ModalState<any>;
  collegeId: number;
  onSubmit: (data: AcademicProgram) => void;
}

export default function AcademicProgramModal({
  controller,
  collegeId,
  onSubmit,
}: AcademicProgramModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AcademicProgramFormData>({
    resolver: zodResolver(academicProgramSchema),
    defaultValues: {
      program_name: '',
      short_name: '',
      year_first_implemented: '',
      program_type_id: 0,
    },
  });

  const { data: programTypesRes, isLoading: isLoadingTypes } = useGetProgramTypePaginated({
    page: 1,
    rows: 1000,
    paginate: false,
  });
  const programTypes = useMemo<ProgramType[]>(
    () => (programTypesRes?.data as ProgramType[]) ?? [],
    [programTypesRes]
  );

  const { mutateAsync: createAcademicProgram, isPending } = useCreateAcademicProgram();
  const { mutateAsync: updateAcademicProgram, isPending: isUpdating } = useUpdateAcademicProgram();

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);

  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);

  const programTypeId = watch('program_type_id');

  const onFormSubmit = async (data: AcademicProgramFormData) => {
    try {
      if (isEdit) {
        await updateAcademicProgram({
          id: controller.data?.id,
          data: {
            program_name: data.program_name,
            short_name: data.short_name,
            year_first_implemented: data.year_first_implemented,
            program_type_id: data.program_type_id,
            college_id: collegeId,
          },
        });
        toast.success('Academic program updated successfully');
      } else {
        await createAcademicProgram({
          data: {
            program_name: data.program_name,
            short_name: data.short_name,
            year_first_implemented: data.year_first_implemented,
            program_type_id: data.program_type_id,
            college_id: collegeId,
          },
        });
        toast.success('Academic program created successfully');
      }
      controller.closeFn();
      onSubmit({ ...data, college_id: collegeId } as AcademicProgram);
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} academic program`);
    }
  };

  useEffect(() => {
    if (!controller.data) {
      return reset({
        program_name: '',
        short_name: '',
        year_first_implemented: '',
        program_type_id: 0,
      });
    }
    reset({
      program_name: controller.data.program_name || '',
      short_name: controller.data.short_name || '',
      year_first_implemented: controller.data.year_first_implemented || '',
      program_type_id: controller.data.program_type_id || 0,
    });
  }, [controller.isOpen, controller.data, reset]);

  return (
    <Modal
      controller={controller}
      title={`${isEdit ? 'Edit' : 'Create'} Academic Program`}
      size="lg"
      closable
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="program_name">Program Name</Label>
            <Input
              id="program_name"
              placeholder="e.g. Bachelor of Science in IT"
              {...register('program_name')}
            />
            {errors.program_name && (
              <p className="text-sm text-destructive">{errors.program_name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="short_name">Short Name</Label>
            <Input id="short_name" placeholder="e.g. BSIT" {...register('short_name')} />
            {errors.short_name && (
              <p className="text-sm text-destructive">{errors.short_name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="year_first_implemented">Year First Implemented</Label>
            <Input
              id="year_first_implemented"
              type="date"
              {...register('year_first_implemented')}
            />
            {errors.year_first_implemented && (
              <p className="text-sm text-destructive">{errors.year_first_implemented.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="program_type_id">Program Type</Label>
            <CustomSelect
              options={programTypes.map((pt) => ({
                label: pt.name,
                value: String(pt.id),
              }))}
              value={programTypeId ? String(programTypeId) : undefined}
              onChange={(v) => setValue('program_type_id', Number(v))}
              placeholder={isLoadingTypes ? 'Loading...' : 'Select a program type'}
              disabled={isLoadingTypes}
            />
            {errors.program_type_id && (
              <p className="text-sm text-destructive">{errors.program_type_id.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update Program' : 'Create Program'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
