import Modal, { type ModalState } from '@/components/custom/modal.component';
import Select, { type SelectOption } from '@/components/custom/select.component';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateCourseRequisite,
  useGetCoursePaginated,
  useUpdateCourseRequisite,
} from '@rest/api';
import { type CourseRequisite, CourseRequisiteRequisiteType } from '@rest/models';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const courseRequisiteSchema = z.object({
  course_id: z.number().min(1, 'Course is required'),
  requisite_course_id: z.number().min(1, 'Requisite course is required'),
  requisite_type: z.enum(Object.values(CourseRequisiteRequisiteType), {
    message: 'Requisite type is required',
  }),
});

type CourseRequisiteFormData = z.infer<typeof courseRequisiteSchema>;

interface CourseRequisiteModalProps {
  controller: ModalState<CourseRequisite>;
  onSubmit: () => void;
  courseId?: number;
}

const requisiteTypeOptions: SelectOption[] = [
  { label: 'Pre-requisite', value: 'pre' },
  { label: 'Co-requisite', value: 'co' },
  { label: 'Equivalent', value: 'equivalent' },
];

export default function CourseRequisiteModal({
  controller,
  onSubmit,
  courseId,
}: CourseRequisiteModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CourseRequisiteFormData>({
    resolver: zodResolver(courseRequisiteSchema),
    defaultValues: {
      course_id: courseId || 0,
      requisite_course_id: 0,
      requisite_type: 'pre',
    },
  });

  const { mutateAsync: createCourseRequisite, isPending } = useCreateCourseRequisite();
  const { mutateAsync: updateCourseRequisite, isPending: isUpdating } = useUpdateCourseRequisite();

  const { data: coursesResponse } = useGetCoursePaginated({
    page: 1,
    rows: Number.MAX_SAFE_INTEGER,
  });

  const courseOptions = useMemo<SelectOption[]>(
    () =>
      coursesResponse?.data?.data?.map((course) => ({
        label: course.course_title || '',
        value: String(course.id),
        subtitle: course.course_code,
      })) ?? [],
    [coursesResponse]
  );

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);

  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);

  const onFormSubmit = async (data: CourseRequisiteFormData) => {
    try {
      if (isEdit) {
        await updateCourseRequisite({
          id: controller.data?.id as number,
          data,
        });
      } else {
        await createCourseRequisite({
          data,
        });
      }
      toast.success(`Course requisite ${isEdit ? 'updated' : 'created'} successfully`);
      controller.closeFn();
      onSubmit();
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} course requisite`);
    }
  };

  useEffect(() => {
    if (!controller.data) {
      return reset({
        course_id: courseId || 0,
        requisite_course_id: 0,
        requisite_type: 'pre',
      });
    }
    reset({
      course_id: controller.data.course_id,
      requisite_course_id: controller.data.requisite_course_id,
      requisite_type: controller.data.requisite_type,
    });
  }, [controller.isOpen, controller.data, courseId, reset]);

  return (
    <Modal
      controller={controller}
      title={`${isEdit ? 'Edit' : 'Add'} Course Requisite`}
      size="md"
      closable
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="course_id">Course</Label>
          <Controller
            name="course_id"
            control={control}
            render={({ field }) => (
              <Select
                options={courseOptions}
                placeholder="Select course"
                value={String(field.value)}
                onValueChange={(value) => field.onChange(parseInt(value))}
                disabled={!!courseId}
              />
            )}
          />
          {errors.course_id && (
            <p className="text-sm text-destructive">{errors.course_id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="requisite_course_id">Requisite Course</Label>
          <Controller
            name="requisite_course_id"
            control={control}
            render={({ field }) => (
              <Select
                options={courseOptions}
                placeholder="Select requisite course"
                value={String(field.value)}
                onValueChange={(value) => field.onChange(parseInt(value))}
              />
            )}
          />
          {errors.requisite_course_id && (
            <p className="text-sm text-destructive">{errors.requisite_course_id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="requisite_type">Requisite Type</Label>
          <Controller
            name="requisite_type"
            control={control}
            render={({ field }) => (
              <Select
                options={requisiteTypeOptions}
                placeholder="Select requisite type"
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
          {errors.requisite_type && (
            <p className="text-sm text-destructive">{errors.requisite_type.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update Requisite' : 'Add Requisite'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
