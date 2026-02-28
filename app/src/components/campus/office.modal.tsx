import Modal, { type ModalState } from '@/components/custom/modal.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateOffice, useUpdateOffice } from '@rest/api';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const officeSchema = z.object({
  name: z
    .string()
    .min(1, 'Office name is required')
    .max(255, 'Office name must be less than 255 characters'),
  description: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().email('Invalid email address').nullable().optional().or(z.literal('')),
  website: z.string().url('Invalid website URL').nullable().optional().or(z.literal('')),
  campus_id: z.number().min(1, 'Campus ID is required'),
});

type OfficeFormData = z.infer<typeof officeSchema>;

interface OfficeModalProps {
  controller: ModalState<any>;
  onSubmit: (data: OfficeFormData) => void;
  campus_id?: number;
}

export default function OfficeModal({ controller, onSubmit, campus_id }: OfficeModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<OfficeFormData>({
    resolver: zodResolver(officeSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      campus_id: campus_id || 0,
    },
  });

  const { mutateAsync: createOffice, isPending } = useCreateOffice();
  const { mutateAsync: updateOffice, isPending: isUpdating } = useUpdateOffice();

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);

  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);

  const onFormSubmit = async (data: OfficeFormData) => {
    try {
      // Convert empty strings to null for nullable fields
      const formattedData = {
        ...data,
        description: data.description || null,
        address: data.address || null,
        phone: data.phone || null,
        email: data.email || null,
        website: data.website || null,
      };

      if (isEdit) {
        await updateOffice({
          id: controller.data.id,
          data: formattedData,
        });
        toast.success('Office updated successfully');
      } else {
        await createOffice({
          data: formattedData,
        });
        toast.success('Office created successfully');
      }
      controller.closeFn();
      onSubmit(formattedData);
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} office`);
    }
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  useEffect(() => {
    if (!controller.data) {
      return reset({
        name: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        campus_id: campus_id || 0,
      });
    }
    reset({
      ...controller.data,
    });
  }, [controller.isOpen, controller.data, reset, campus_id]);

  return (
    <Modal
      controller={controller}
      title={`${isEdit ? 'Edit' : 'Create'} Office`}
      size="md"
      closable
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Office Name</Label>
          <Input id="name" placeholder="Enter office name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter office description (optional)"
            rows={3}
            {...register('description')}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            placeholder="Enter office address (optional)"
            {...register('address')}
          />
          {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="Enter phone number (optional)" {...register('phone')} />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email (optional)"
              {...register('email')}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            placeholder="Enter website URL (optional)"
            {...register('website')}
          />
          {errors.website && <p className="text-sm text-destructive">{errors.website.message}</p>}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update Office' : 'Create Office'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
