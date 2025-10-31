import Modal, { type ModalState } from '@/components/custom/modal.component';
import Select from '@/components/custom/select.component';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetCoursePaginated, useGetCurriculumById, useUpdateCurriculumDetail } from '@rest/api';
import type { CurriculumDetail } from '@rest/models';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const curriculumDetailUpdateSchema = z.object({
  curriculum_id: z.number().min(1, 'Curriculum ID is required'),
  course_id: z.number().min(1, 'Course ID is required'),
  year_order: z.number().min(1, 'Year order must be at least 1'),
  term_order: z.number().min(1, 'Term order must be at least 1'),
  term_alias: z.string().min(1, 'Term alias is required'),
  is_include_gwa: z.boolean(),
});

type CurriculumDetailUpdateFormData = z.infer<typeof curriculumDetailUpdateSchema>;

interface CurriculumDetailUpdateModalProps {
  controller: ModalState<CurriculumDetail>;
  onSubmit: (data: CurriculumDetailUpdateFormData) => void;
}

export default function CurriculumDetailUpdateModal({
  controller,
  onSubmit,
}: CurriculumDetailUpdateModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors },
  } = useForm<CurriculumDetailUpdateFormData>({
    resolver: zodResolver(curriculumDetailUpdateSchema),
    defaultValues: {
      curriculum_id: 0,
      course_id: 0,
      year_order: 1,
      term_order: 1,
      term_alias: '',
      is_include_gwa: true,
    },
  });

  const [courseMeta] = useState({
    page: 1,
    rows: Number.MAX_SAFE_INTEGER,
    search: '',
  });

  const { data: curriculum } = useGetCurriculumById(controller.data?.curriculum_id!, {
    query: { enabled: !!controller.data?.curriculum_id },
  });

  const { data: coursesData } = useGetCoursePaginated({
    page: courseMeta.page,
    rows: courseMeta.rows,
    search: courseMeta.search,
  });

  const { mutateAsync: updateCurriculumDetail, isPending } = useUpdateCurriculumDetail();

  const onFormSubmit = async (data: CurriculumDetailUpdateFormData) => {
    try {
      await updateCurriculumDetail({
        id: controller.data?.id!,
        data,
      });
      toast.success('Curriculum detail updated successfully');
      controller.closeFn();
      onSubmit(data);
    } catch (error) {
      renderError(error, setError);
      toast.error('Failed to update curriculum detail');
    }
  };

  useEffect(() => {
    if (!controller.data) {
      return reset({
        curriculum_id: 0,
        course_id: 0,
        year_order: 1,
        term_order: 1,
        term_alias: '',
        is_include_gwa: true,
      });
    }
    reset({
      curriculum_id: controller.data.curriculum_id,
      course_id: controller.data.course_id,
      year_order: controller.data.year_order,
      term_order: controller.data.term_order,
      term_alias: controller.data.term_alias,
      is_include_gwa: controller.data.is_include_gwa,
    });
  }, [controller.isOpen, controller.data, reset]);

  const yearOptions = useMemo(
    () => [
      { value: '1', label: 'First Year' },
      { value: '2', label: 'Second Year' },
      { value: '3', label: 'Third Year' },
      { value: '4', label: 'Fourth Year' },
      { value: '5', label: 'Fifth Year' },
    ],
    []
  );

  const termOrderOptions = useMemo(() => {
    if (!controller.data) return [];
    const term = curriculum?.data?.academic_term!;
    return Array.from({ length: term.number_of_terms }, (_, i) => ({
      label: `${term.suffix} ${i + 1}`,
      value: String(i + 1),
    }));
  }, [curriculum]);

  const courseOptions = useMemo(() => {
    if (!coursesData?.data) return [];
    return (
      coursesData.data?.data?.map((course) => ({
        value: String(course.id),
        label: `${course.course_code} - ${course.course_title}`,
      })) ?? []
    );
  }, [coursesData]);

  return (
    <Modal controller={controller} title="Edit Curriculum Detail" size="md" closable>
      <div className="p-4 sm:p-6">
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="course_id"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Course
            </Label>
            <Controller
              name="course_id"
              control={control}
              render={({ field }) => (
                <Select
                  options={courseOptions}
                  value={String(field.value)}
                  onValueChange={(value) => field.onChange(Number(value))}
                  placeholder="Select course"
                />
              )}
            />
            {errors.course_id && (
              <p className="text-xs sm:text-sm text-destructive mt-1.5">
                {errors.course_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="year_order"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Year Level
            </Label>
            <Controller
              name="year_order"
              control={control}
              render={({ field }) => (
                <Select
                  options={yearOptions}
                  value={String(field.value)}
                  onValueChange={(value) => field.onChange(Number(value))}
                  placeholder="Select year level"
                />
              )}
            />
            {errors.year_order && (
              <p className="text-xs sm:text-sm text-destructive mt-1.5">
                {errors.year_order.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="term_order"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Term
            </Label>
            <Controller
              name="term_order"
              control={control}
              render={({ field }) => (
                <Select
                  options={termOrderOptions}
                  value={String(field.value)}
                  onValueChange={(value) => field.onChange(Number(value))}
                  placeholder="Select term"
                />
              )}
            />
            {errors.term_order && (
              <p className="text-xs sm:text-sm text-destructive mt-1.5">
                {errors.term_order.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="term_alias"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Term Alias
            </Label>
            <Input
              id="term_alias"
              placeholder="e.g., 1st Semester, Summer"
              {...register('term_alias')}
              className="text-sm"
            />
            {errors.term_alias && (
              <p className="text-xs sm:text-sm text-destructive mt-1.5">
                {errors.term_alias.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Controller
              name="is_include_gwa"
              control={control}
              render={({ field }) => (
                <div className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/80 transition-colors">
                  <Checkbox
                    id="is_include_gwa"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5"
                  />
                  <div className="flex-1 space-y-1">
                    <Label
                      htmlFor="is_include_gwa"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer leading-none"
                    >
                      Include in GWA Calculation
                    </Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Check this if the course should be included in the General Weighted Average
                      calculation
                    </p>
                  </div>
                </div>
              )}
            />
            {errors.is_include_gwa && (
              <p className="text-xs sm:text-sm text-destructive mt-1.5">
                {errors.is_include_gwa.message}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={controller.closeFn}
              className="w-full sm:w-auto text-sm"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isPending ? 'Updating...' : 'Update Detail'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
