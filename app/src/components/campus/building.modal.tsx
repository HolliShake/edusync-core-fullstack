import Modal, { type ModalState } from '@/components/custom/modal.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateBuilding, useUpdateBuilding } from '@rest/api';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const buildingSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  short_name: z
    .string()
    .min(1, 'Short name is required')
    .max(25, 'Short name must be less than 25 characters'),
  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
  campus_id: z.number().min(1, 'Campus ID is required'),
});

type BuildingFormData = z.infer<typeof buildingSchema>;

interface BuildingModalProps {
  controller: ModalState<any>;
  onSubmit: (data: BuildingFormData) => void;
  campusId?: number;
}

export default function BuildingModal({ controller, onSubmit, campusId }: BuildingModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<BuildingFormData>({
    resolver: zodResolver(buildingSchema),
    defaultValues: {
      name: '',
      short_name: '',
      latitude: 0,
      longitude: 0,
      campus_id: campusId || 0,
    },
  });

  const { mutateAsync: createBuilding, isPending } = useCreateBuilding();
  const { mutateAsync: updateBuilding, isPending: isUpdating } = useUpdateBuilding();

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);

  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);

  const onFormSubmit = async (data: BuildingFormData) => {
    try {
      if (isEdit) {
        await updateBuilding({
          id: controller.data.id,
          data,
        });
        toast.success('Building updated successfully');
      } else {
        await createBuilding({
          data,
        });
        toast.success('Building created successfully');
      }
      controller.closeFn();
      onSubmit(data);
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} building`);
    }
  };

  useEffect(() => {
    if (!controller.data) {
      return reset({
        name: '',
        short_name: '',
        latitude: 0,
        longitude: 0,
        campus_id: campusId || 0,
      });
    }
    reset({
      ...controller.data,
    });
  }, [controller.isOpen, reset, campusId]);

  return (
    <Modal controller={controller} title="Building Details" size="md" closable>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter building name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="short_name">Short Name</Label>
          <Input id="short_name" placeholder="Enter short name" {...register('short_name')} />
          {errors.short_name && (
            <p className="text-sm text-destructive">{errors.short_name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              placeholder="Enter latitude"
              {...register('latitude', { valueAsNumber: true })}
            />
            {errors.latitude && (
              <p className="text-sm text-destructive">{errors.latitude.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              placeholder="Enter longitude"
              {...register('longitude', { valueAsNumber: true })}
            />
            {errors.longitude && (
              <p className="text-sm text-destructive">{errors.longitude.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update Building' : 'Create Building'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
