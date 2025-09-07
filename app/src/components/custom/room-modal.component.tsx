import Modal, { type ModalState } from '@/components/custom/modal.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateRoom, useUpdateRoom } from '@rest/api';
import type { Room } from '@rest/models/room';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const roomSchema = z.object({
  name: z.string().min(1, 'Room name is required'),
  short_name: z.string().min(1, 'Short name is required'),
  room_code: z.string().min(1, 'Room code is required'),
  floor: z.number().min(0, 'Floor must be 0 or greater'),
  room_capacity: z.number().min(1, 'Room capacity must be at least 1'),
  is_lab: z.boolean(),
});

type RoomFormData = z.infer<typeof roomSchema>;

interface RoomModalProps {
  controller: ModalState<Room>;
  buildingId: number;
  onSubmit: (data: RoomFormData) => void;
}

export default function RoomModal({ controller, buildingId, onSubmit }: RoomModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: '',
      short_name: '',
      room_code: '',
      floor: 0,
      room_capacity: 1,
      is_lab: false,
    },
  });

  const { mutateAsync: createRoom, isPending } = useCreateRoom();
  const { mutateAsync: updateRoom, isPending: isUpdating } = useUpdateRoom();

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);
  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);
  const isLab = watch('is_lab');

  const onFormSubmit = async (data: RoomFormData) => {
    try {
      const roomData = {
        ...data,
        building_id: buildingId,
      };

      if (isEdit) {
        await updateRoom({
          id: controller.data!.id!,
          data: roomData,
        });
      } else {
        await createRoom({
          data: roomData,
        });
      }
      toast.success(`Room ${isEdit ? 'updated' : 'created'} successfully`);
      controller.closeFn();
      onSubmit(data);
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} room`);
    }
  };

  useEffect(() => {
    if (!controller.data) {
      return reset({
        name: '',
        short_name: '',
        room_code: '',
        floor: 0,
        room_capacity: 1,
        is_lab: false,
      });
    }
    reset({
      name: controller.data.name || '',
      short_name: controller.data.short_name || '',
      room_code: controller.data.room_code || '',
      floor: controller.data.floor || 0,
      room_capacity: controller.data.room_capacity || 1,
      is_lab: controller.data.is_lab || false,
    });
  }, [controller.isOpen, reset, controller.data]);

  return (
    <Modal controller={controller} title={`${isEdit ? 'Edit' : 'Create'} Room`} size="md" closable>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Room Name</Label>
          <Input id="name" placeholder="Enter room name" {...register('name')} />
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
          <Label htmlFor="room_code">Room Code</Label>
          <Input id="room_code" placeholder="Enter room code" {...register('room_code')} />
          {errors.room_code && (
            <p className="text-sm text-destructive">{errors.room_code.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="floor">Floor</Label>
            <Input
              id="floor"
              type="number"
              min="0"
              placeholder="0"
              {...register('floor', { valueAsNumber: true })}
            />
            {errors.floor && <p className="text-sm text-destructive">{errors.floor.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="room_capacity">Capacity</Label>
            <Input
              id="room_capacity"
              type="number"
              min="1"
              placeholder="1"
              {...register('room_capacity', { valueAsNumber: true })}
            />
            {errors.room_capacity && (
              <p className="text-sm text-destructive">{errors.room_capacity.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_lab"
            checked={isLab}
            onCheckedChange={(checked) => setValue('is_lab', checked)}
          />
          <Label htmlFor="is_lab">Laboratory Room</Label>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update Room' : 'Create Room'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
