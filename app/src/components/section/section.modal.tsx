import Modal, { type ModalState } from '@/components/custom/modal.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateSection } from '@rest/api';
import type { Section } from '@rest/models/section';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const sectionSchema = z
  .object({
    is_posted: z.boolean(),
    min_students: z.number().min(1, 'Minimum students must be at least 1'),
    max_students: z.number().min(1, 'Maximum students must be at least 1'),
  })
  .refine((data) => data.max_students >= data.min_students, {
    message: 'Maximum students must be greater than or equal to minimum students',
    path: ['max_students'],
  });

type SectionFormData = z.infer<typeof sectionSchema>;

interface SectionModalProps {
  controller: ModalState<Section>;
  onSubmit: () => void;
}

export default function SectionModal({ controller, onSubmit }: SectionModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      is_posted: false,
      min_students: 20,
      max_students: 40,
    },
  });

  const { mutateAsync: updateSection, isPending: isUpdating } = useUpdateSection();

  const isPosted = watch('is_posted');

  const onFormSubmit = async (data: SectionFormData) => {
    try {
      if (!controller.data?.id) {
        toast.error('Section ID is missing');
        return;
      }

      await updateSection({
        id: controller.data.id,
        data: {
          ...controller.data,
          is_posted: data.is_posted,
          min_students: data.min_students,
          max_students: data.max_students,
        },
      });

      toast.success('Section updated successfully');
      controller.closeFn();
      onSubmit();
    } catch (error) {
      renderError(error, setError);
      toast.error('Failed to update section');
    }
  };

  useEffect(() => {
    if (!controller.data) {
      return reset({
        is_posted: false,
        min_students: 20,
        max_students: 40,
      });
    }
    reset({
      is_posted: controller.data.is_posted,
      min_students: controller.data.min_students,
      max_students: controller.data.max_students,
    });
  }, [controller.isOpen, controller.data, reset]);

  return (
    <Modal controller={controller} title="Edit Section" size="md" closable>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {/* Read-only fields */}
        <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Section Reference</Label>
            <p className="text-sm font-medium">{controller.data?.section_ref}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Section Name</Label>
            <p className="text-sm font-medium">{controller.data?.section_name}</p>
          </div>

          {controller.data?.curriculum_detail && (
            <div className="space-y-2">
              <Label className="text-muted-foreground">Course</Label>
              <p className="text-sm font-medium">
                {controller.data.curriculum_detail.course?.course_code} -{' '}
                {controller.data.curriculum_detail.course?.course_title}
              </p>
            </div>
          )}

          {controller.data?.school_year && (
            <div className="space-y-2">
              <Label className="text-muted-foreground">School Year</Label>
              <p className="text-sm font-medium">
                {controller.data.school_year.start_date} - {controller.data.school_year.end_date}
              </p>
            </div>
          )}
        </div>

        {/* Editable fields */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="is_posted">Posted Status</Label>
            <Switch
              id="is_posted"
              checked={isPosted}
              onCheckedChange={(checked) => setValue('is_posted', checked)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {isPosted ? 'Section is visible to students' : 'Section is hidden from students'}
          </p>
          {errors.is_posted && (
            <p className="text-sm text-destructive">{errors.is_posted.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="min_students">Minimum Students</Label>
          <Input
            id="min_students"
            type="number"
            placeholder="Enter minimum students"
            {...register('min_students', { valueAsNumber: true })}
          />
          {errors.min_students && (
            <p className="text-sm text-destructive">{errors.min_students.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_students">Maximum Students</Label>
          <Input
            id="max_students"
            type="number"
            placeholder="Enter maximum students"
            {...register('max_students', { valueAsNumber: true })}
          />
          {errors.max_students && (
            <p className="text-sm text-destructive">{errors.max_students.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn}>
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Section'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
