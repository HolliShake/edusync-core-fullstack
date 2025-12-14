import Modal, { type ModalState } from '@/components/custom/modal.component';
import Select from '@/components/custom/select.component';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateTestingCenter,
  useGetBuildingPaginated,
  useGetCampusPaginated,
  useGetRoomPaginated,
  useUpdateTestingCenter,
} from '@rest/api';
import type { Building, Campus, Room, TestingCenter } from '@rest/models';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const testingCenterSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  room_id: z.number().min(1, 'Room is required'),
});

type TestingCenterFormData = z.infer<typeof testingCenterSchema>;

interface TestingCenterModalProps {
  controller: ModalState<TestingCenter>;
  onSubmit: () => void;
}

export default function TestingCenterModal({ controller, onSubmit }: TestingCenterModalProps) {
  const [selectedCampusId, setSelectedCampusId] = useState<number>(0);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number>(0);
  const {
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TestingCenterFormData>({
    resolver: zodResolver(testingCenterSchema),
    defaultValues: {
      code: 'DUMMY!',
      room_id: 0,
    },
  });

  const { mutateAsync: createTestingCenter, isPending } = useCreateTestingCenter();
  const { mutateAsync: updateTestingCenter, isPending: isUpdating } = useUpdateTestingCenter();

  const { data: campusesData } = useGetCampusPaginated({
    page: 1,
    rows: 1000,
  });

  const { data: buildingsData } = useGetBuildingPaginated({
    'filter[campus_id]': selectedCampusId,
    page: 1,
    rows: 1000,
  });

  const { data: roomsData } = useGetRoomPaginated({
    'filter[building_id]': selectedBuildingId,
    page: 1,
    rows: 1000,
  });

  const campuses = useMemo(
    () =>
      campusesData?.data?.data?.map((campus: Campus) => ({
        label: campus.name || '',
        value: String(campus.id),
      })) || [],
    [campusesData]
  );

  const buildings = useMemo(
    () =>
      buildingsData?.data?.data?.map((building: Building) => ({
        label: building.name || '',
        value: String(building.id),
      })) || [],
    [buildingsData]
  );

  const rooms = useMemo(
    () =>
      roomsData?.data?.data?.map((room: Room) => ({
        label: `${room.building?.name || ''} - ${room.room_code || ''}${room.is_lab ? ' (Lab)' : ''}`,
        value: String(room.id),
      })) || [],
    [roomsData]
  );

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);

  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);

  const roomId = watch('room_id');

  const onFormSubmit = async (data: TestingCenterFormData) => {
    try {
      if (isEdit) {
        await updateTestingCenter({
          id: controller.data?.id!,
          data,
        });
      } else {
        await createTestingCenter({
          data,
        });
      }
      toast.success(`Testing center ${isEdit ? 'updated' : 'created'} successfully`);
      controller.closeFn();
      onSubmit();
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} testing center`);
    }
  };

  useEffect(() => {
    if (!controller.data) {
      return reset({
        code: 'DUMMY!',
        room_id: 0,
      });
    }
    reset({
      code: controller.data.code || 'DUMMY!',
      room_id: controller.data.room_id || 0,
    });

    // Set the campus and building based on the room
    if (controller.data.room) {
      if (controller.data.room.building_id) {
        setSelectedBuildingId(controller.data.room.building_id);
      }
      if (controller.data.room.building?.campus_id) {
        setSelectedCampusId(controller.data.room.building.campus_id);
      }
    }
  }, [controller.isOpen, controller.data, reset]);

  return (
    <Modal
      controller={controller}
      title={`${isEdit ? 'Edit' : 'Create'} Testing Center`}
      size="md"
      closable
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="campus">Campus</Label>
          <Select
            options={campuses}
            placeholder="Select a campus"
            value={selectedCampusId ? String(selectedCampusId) : ''}
            onValueChange={(value) => {
              setSelectedCampusId(Number(value));
              setSelectedBuildingId(0);
              setValue('room_id', 0);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="building">Building</Label>
          <Select
            options={buildings}
            placeholder="Select a building"
            value={selectedBuildingId ? String(selectedBuildingId) : ''}
            onValueChange={(value) => {
              setSelectedBuildingId(Number(value));
              setValue('room_id', 0);
            }}
            disabled={!selectedCampusId}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="room_id">Room</Label>
          <Select
            options={rooms}
            placeholder="Select a room"
            value={roomId ? String(roomId) : ''}
            onValueChange={(value) => setValue('room_id', Number(value))}
            disabled={!selectedBuildingId}
          />
          {errors.room_id && <p className="text-sm text-destructive">{errors.room_id.message}</p>}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={controller.closeFn}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : isEdit ? 'Update Testing Center' : 'Create Testing Center'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
