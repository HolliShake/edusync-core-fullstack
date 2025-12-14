import Modal, { type ModalState } from '@/components/custom/modal.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@radix-ui/react-switch';
import { useCreateCampus, useUpdateCampus } from '@rest/api';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const campusSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  short_name: z.string().min(1, 'Short name is required'),
  address: z.string().min(1, 'Address is required'),
  main_campus: z.boolean(),
});

type CampusFormData = z.infer<typeof campusSchema>;

interface CampusModalProps {
  controller: ModalState<any>;
  onSubmit: (data: CampusFormData) => void;
}

export default function CampusModal({ controller, onSubmit }: CampusModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CampusFormData>({
    resolver: zodResolver(campusSchema),
    defaultValues: {
      name: '',
      short_name: '',
      address: '',
      main_campus: false,
    },
  });

  const { mutateAsync: createCampus, isPending } = useCreateCampus();
  const { mutateAsync: updateCampus, isPending: isUpdating } = useUpdateCampus();

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);

  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);

  const onFormSubmit = async (data: CampusFormData) => {
    try {
      if (isEdit) {
        await updateCampus({
          id: controller.data.id,
          data,
        });
        toast.success('Campus updated successfully');
      } else {
        await createCampus({
          data,
        });
        toast.success('Campus created successfully');
      }
      controller.closeFn();
      onSubmit(data);
    } catch (error) {
      renderError(error, setError);
      toast.error('Failed to create campus');
    }
  };

  useEffect(() => {
    if (!controller.data) {
      return reset({
        name: '',
        short_name: '',
        address: '',
        main_campus: false,
      });
    }
    reset({
      ...controller.data,
    });
  }, [controller.isOpen, reset]);

  return (
    <Modal controller={controller} title="Campus Details" size="md" closable>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter campus name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="short_name">Short Name</Label>
          <Input id="short_name" placeholder="Enter short name" {...register('short_name')} />
          {errors.short_name && (
            <p className="text-sm text-destructive">{errors.short_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea id="address" placeholder="Enter campus address" {...register('address')} />
          {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="main_campus">Main Campus</Label>
          <Switch id="main_campus" {...register('main_campus')} />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update Campus' : 'Create Campus'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
