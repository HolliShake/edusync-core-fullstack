import Modal, { type ModalState } from '@/components/custom/modal.component';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDeleteScheduleAssignment } from '@rest/api';
import { Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

export type ViewEventModalData = {
  id: string;
  courseTitle: string;
  courseCode: string;
  sectionCode: string;
  sectionName: string;
  buildingName: string;
  roomName: string;
  time: string;
  day: string;
};

type ViewEventModalProps = {
  controller: ModalState<ViewEventModalData>;
  refetchAssignments: () => void;
};

export default function ViewEventModal({ controller, refetchAssignments }: ViewEventModalProps) {
  const { mutateAsync: deleteAssignment } = useDeleteScheduleAssignment();

  const handleDelete = async () => {
    if (!controller.data) return;
    try {
      await deleteAssignment({ id: Number(controller.data.id) });
      toast.success('Assignment removed');
      refetchAssignments();
      controller.closeFn();
    } catch (error) {
      toast.error('Failed to remove assignment');
    }
  };

  return (
    <Modal controller={controller} title="Class Schedule Details" size="md">
      <div className="space-y-6">
        {controller.data && (
          <div className="space-y-4">
            <div className="border-b pb-3">
              <h3 className="font-bold text-lg leading-tight">{controller.data.courseTitle}</h3>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <Badge variant="secondary" className="font-mono">
                  {controller.data.courseCode}
                </Badge>
                <span>•</span>
                <span className="font-medium">{controller.data.sectionCode}</span>
              </div>
            </div>

            <div className="grid gap-3 text-sm">
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">Section Name:</span>
                <span className="font-medium">{controller.data.sectionName}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">Location:</span>
                <div>
                  <div className="font-medium">{controller.data.buildingName}</div>
                  <div className="text-muted-foreground">{controller.data.roomName}</div>
                </div>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="font-medium text-muted-foreground">Schedule:</span>
                <div className="flex flex-col">
                  <span className="font-medium">{controller.data.day}</span>
                  <span className="text-muted-foreground">{controller.data.time}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
            <Trash2Icon className="h-4 w-4" />
            Remove Schedule
          </Button>
          <Button variant="outline" onClick={controller.closeFn}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
