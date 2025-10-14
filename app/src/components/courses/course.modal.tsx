import Modal, { type ModalState } from '@/components/custom/modal.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateCourse, useUpdateCourse } from '@rest/api';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const courseSchema = z.object({
  course_code: z.string().min(1, 'Course code is required'),
  course_title: z.string().min(1, 'Course title is required'),
  course_description: z.string().min(1, 'Course description is required'),
  with_laboratory: z.boolean(),
  is_specialize: z.boolean(),
  lecture_units: z
    .number({ error: 'Lecture units must be a number' })
    .min(0, 'Lecture units must be zero or more'),
  laboratory_units: z
    .number({ error: 'Laboratory units must be a number' })
    .min(0, 'Laboratory units must be zero or more'),
  credit_units: z
    .number({ error: 'Credit units must be a number' })
    .min(0, 'Credit units must be zero or more'),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseModalProps {
  controller: ModalState<any>;
  onSubmit: () => void;
}

export default function CourseModal({ controller, onSubmit }: CourseModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      course_code: '',
      course_title: '',
      course_description: '',
      with_laboratory: false,
      is_specialize: false,
      lecture_units: 0,
      laboratory_units: 0,
      credit_units: 0,
    },
  });

  const { mutateAsync: createCourse, isPending } = useCreateCourse();
  const { mutateAsync: updateCourse, isPending: isUpdating } = useUpdateCourse();

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);
  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);

  useEffect(() => {
    if (!controller.data) {
      reset({
        course_code: '',
        course_title: '',
        course_description: '',
        with_laboratory: false,
        is_specialize: false,
        lecture_units: 0,
        laboratory_units: 0,
        credit_units: 0,
      });
    } else {
      reset({
        ...controller.data,
        lecture_units: Number(controller.data.lecture_units ?? 0),
        laboratory_units: Number(controller.data.laboratory_units ?? 0),
        credit_units: Number(controller.data.credit_units ?? 0),
        with_laboratory:
          typeof controller.data.with_laboratory === 'boolean'
            ? controller.data.with_laboratory
            : controller.data.with_laboratory === '1' || controller.data.with_laboratory === 'true',
        is_specialize:
          typeof controller.data.is_specialize === 'boolean'
            ? controller.data.is_specialize
            : controller.data.is_specialize === '1' || controller.data.is_specialize === 'true',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controller.isOpen, reset]);

  const onFormSubmit = async (data: CourseFormData) => {
    try {
      const submitData = {
        ...data,
        with_laboratory: !!data.with_laboratory,
        is_specialize: !!data.is_specialize,
      };
      if (isEdit) {
        await updateCourse({
          id: controller.data.id,
          data: submitData,
        });
      } else {
        await createCourse({
          data: submitData,
        });
      }
      toast.success(`Course ${isEdit ? 'updated' : 'created'} successfully`);
      controller.closeFn();
      onSubmit();
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} Course`);
    }
  };

  return (
    <Modal
      controller={controller}
      title={`${isEdit ? 'Edit' : 'Create'} Course`}
      size="md"
      closable
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="course_code">Course Code</Label>
          <Input
            id="course_code"
            placeholder="e.g., CS101"
            maxLength={32}
            autoComplete="off"
            {...register('course_code')}
            disabled={isEdit}
          />
          {errors.course_code && (
            <p className="text-sm text-destructive">{errors.course_code.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="course_title">Course Title</Label>
          <Input
            id="course_title"
            placeholder="e.g., Introduction to Computer Science"
            maxLength={128}
            autoComplete="off"
            {...register('course_title')}
          />
          {errors.course_title && (
            <p className="text-sm text-destructive">{errors.course_title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="course_description">Course Description</Label>
          <Input
            id="course_description"
            placeholder="Brief description"
            maxLength={255}
            autoComplete="off"
            {...register('course_description')}
          />
          {errors.course_description && (
            <p className="text-sm text-destructive">{errors.course_description.message}</p>
          )}
        </div>

        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="lecture_units">Lecture Units</Label>
            <Input
              id="lecture_units"
              type="number"
              min={0}
              step={1}
              {...register('lecture_units', { valueAsNumber: true })}
            />
            {errors.lecture_units && (
              <p className="text-sm text-destructive">{errors.lecture_units.message}</p>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="laboratory_units">Laboratory Units</Label>
            <Input
              id="laboratory_units"
              type="number"
              min={0}
              step={1}
              {...register('laboratory_units', { valueAsNumber: true })}
            />
            {errors.laboratory_units && (
              <p className="text-sm text-destructive">{errors.laboratory_units.message}</p>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="credit_units">Credit Units</Label>
            <Input
              id="credit_units"
              type="number"
              min={0}
              step={1}
              {...register('credit_units', { valueAsNumber: true })}
            />
            {errors.credit_units && (
              <p className="text-sm text-destructive">{errors.credit_units.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="with_laboratory"
              checked={!!(watch && watch('with_laboratory'))}
              {...register('with_laboratory')}
              onCheckedChange={(value: boolean) => setValue('with_laboratory', value)}
            />
            <Label htmlFor="with_laboratory">With Laboratory</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="is_specialize"
              checked={!!(watch && watch('is_specialize'))}
              {...register('is_specialize')}
              onCheckedChange={(value: boolean) => setValue('is_specialize', value)}
            />
            <Label htmlFor="is_specialize">Is Specialize</Label>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update Course' : 'Create Course'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
