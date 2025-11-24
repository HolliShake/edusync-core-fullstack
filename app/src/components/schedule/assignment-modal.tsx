import Modal, { type ModalState } from '@/components/custom/modal.component';
import SearchableSelect from '@/components/custom/searchable-select.component';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/auth.context';
import { useCreateScheduleAssignment, useGetRoomPaginated } from '@rest/api';
import { UserRoleEnum, type Room } from '@rest/models';
import { format } from 'date-fns';
import { CalendarIcon, ClockIcon, DoorOpenIcon, MapPinIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export type AssignmentModalData = {
  sectionId: number;
  sectionCode: string;
  start: Date;
  end: Date;
  daySchedule: string;
};

type AssignmentModalProps = {
  controller: ModalState<AssignmentModalData>;
  role: UserRoleEnum;
  refetchAssignments: () => void;
  onAssignmentSuccess: (sectionCode: string) => void;
};

export default function AssignmentModal({
  controller,
  role,
  refetchAssignments,
  onAssignmentSuccess,
}: AssignmentModalProps) {
  const { session } = useAuth();
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const { mutateAsync: createAssignment, isPending: isCreatingAssignment } =
    useCreateScheduleAssignment();

  const { data: roomReponse } = useGetRoomPaginated(
    {
      ...(role === UserRoleEnum.program_chair
        ? { 'filter[academic_program_id]': Number(session?.active_academic_program) }
        : role === UserRoleEnum.college_dean
          ? { 'filter[college_id]': Number(session?.active_college) }
          : role === UserRoleEnum.campus_registrar
            ? { 'filter[campus_id]': Number(session?.active_campus) }
            : {}),
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
    },
    {
      query: {
        enabled:
          !!session?.active_academic_program ||
          !!session?.active_college ||
          (!!session?.active_campus && !!controller.data),
      },
    }
  );

  const roomOptions = useMemo(() => {
    const rooms =
      roomReponse?.data?.data?.map((room: Room) => ({
        label: `${room.name} - ${room.short_name}`,
        subtitle: room.building?.name || room.building?.short_name,
        value: room.id?.toString() ?? '',
        buildingName: room.building?.name || room.building?.short_name || '',
      })) ?? [];

    return rooms.sort((a, b) => a.buildingName.localeCompare(b.buildingName));
  }, [roomReponse]);

  const selectedRoom = useMemo(() => {
    return roomReponse?.data?.data?.find((room: Room) => room.id?.toString() === selectedRoomId);
  }, [roomReponse, selectedRoomId]);

  const handleAssignSubmit = async () => {
    if (!controller.data || !selectedRoomId) {
      toast.error('Please select a room');
      return;
    }

    try {
      await createAssignment({
        data: {
          section_id: controller.data.sectionId,
          room_id: Number(selectedRoomId),
          day_schedule: controller.data.daySchedule,
          start_time: format(controller.data.start, 'HH:mm'),
          end_time: format(controller.data.end, 'HH:mm'),
        },
      });
      toast.success('Schedule assigned successfully');
      refetchAssignments();
      controller.closeFn();
      onAssignmentSuccess(controller.data.sectionCode);
      setSelectedRoomId(''); // Reset room selection
    } catch (error) {
      toast.error('Failed to create assignment');
      console.error(error);
    }
  };

  return (
    <Modal controller={controller} title="Assign Room to Schedule" size="md">
      <div className="space-y-6">
        {/* Schedule Information Card */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Schedule Details
            </h4>
            <Badge variant="outline" className="font-mono">
              {controller.data?.sectionCode}
            </Badge>
          </div>

          <Separator />

          <div className="space-y-2.5">
            <div className="flex items-start gap-3">
              <CalendarIcon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Date & Day</p>
                <p className="text-sm font-medium">
                  {controller.data && format(controller.data.start, 'EEEE, MMMM do, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ClockIcon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Time Slot</p>
                <p className="text-sm font-medium">
                  {controller.data && format(controller.data.start, 'h:mm a')} -{' '}
                  {controller.data && format(controller.data.end, 'h:mm a')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Room Selection */}
        <div className="space-y-2">
          <Label htmlFor="room" className="text-base font-semibold">
            Select Room
          </Label>
          <SearchableSelect
            placeholder="Choose a room..."
            options={roomOptions}
            value={selectedRoomId}
            onValueChange={(value) => setSelectedRoomId(value)}
            className="w-full"
          />
        </div>

        {/* Selected Room Preview */}
        {selectedRoom && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <DoorOpenIcon className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-sm">Selected Room</h4>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">{selectedRoom.name}</p>
                {selectedRoom.building?.name && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPinIcon className="h-3.5 w-3.5" />
                    <span>{selectedRoom.building.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={controller.closeFn}>
            Cancel
          </Button>
          <Button onClick={handleAssignSubmit} disabled={!selectedRoomId}>
            <DoorOpenIcon className="h-4 w-4 mr-2" />
            {isCreatingAssignment ? 'Assigning...' : 'Assign Room'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
