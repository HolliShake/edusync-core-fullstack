import Modal, { type ModalState } from '@/components/custom/modal.component';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AdmissionApplicationLog } from '@rest/models';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const admissionApplicationLogSchema = z.object({
  admission_application_id: z.number(),
  user_id: z.number(),
  type: z.string().min(1, 'Type is required'),
  note: z.string().nullable().optional(),
});

type AdmissionApplicationLogFormData = z.infer<typeof admissionApplicationLogSchema>;

interface AdmissionApplicationLogModalProps {
  controller: ModalState<AdmissionApplicationLog>;
  onSubmit: (data: AdmissionApplicationLogFormData) => void;
}

export default function AdmissionApplicationLogModal({
  controller,
  onSubmit,
}: AdmissionApplicationLogModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdmissionApplicationLogFormData>({
    resolver: zodResolver(admissionApplicationLogSchema),
    defaultValues: {
      admission_application_id: 0,
      user_id: 0,
      type: '',
      note: null,
    },
  });

  const onFormSubmit = async (data: AdmissionApplicationLogFormData) => {
    onSubmit(data);
    controller.closeFn();
  };

  useEffect(() => {
    if (!controller.data) {
      return reset({
        admission_application_id: 0,
        user_id: 0,
        type: '',
        note: null,
      });
    }
    reset({
      admission_application_id: controller.data.admission_application_id,
      user_id: controller.data.user_id,
      type: controller.data.type,
      note: controller.data.note ?? null,
    });
  }, [controller.isOpen, controller.data, reset]);

  return (
    <Modal controller={controller} title={`Application Log Detail`} size="md" closable>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="note">Note</Label>
          <Textarea
            id="note"
            placeholder="Enter additional notes (optional)"
            rows={4}
            {...register('note')}
          />
          {errors.note && <p className="text-sm text-destructive">{errors.note.message}</p>}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Modal>
  );
}
