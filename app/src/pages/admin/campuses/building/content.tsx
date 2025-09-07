import RoomModal from '@/components/campus/room-modal.component';
import { useModal } from '@/components/custom/modal.component';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useBuildingContext } from '@/context/building.context';
import { useDeleteRoom, useGetRoomPaginated } from '@rest/api';
import type { Room } from '@rest/models/room';
import { Building2, Edit, FlaskConical, Hash, MapPin, Plus, Trash2, Users } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function AdminBuildingDetailContent(): React.ReactNode {
  const building = useBuildingContext();
  const isLoading = useMemo(() => !building, [building]);

  const [page] = useState(1);
  const [rows] = useState(1000);

  const roomModal = useModal<Room>();
  const { mutateAsync: deleteRoom } = useDeleteRoom();

  const { data: rooms, refetch: refetchRooms } = useGetRoomPaginated(
    {
      page,
      rows,
      ['filter[building_id]']: building?.id,
    },
    {
      query: {
        enabled: !!building?.id,
      },
    }
  );

  // Group rooms by floor and sort by room code
  const groupedRooms = useMemo(() => {
    if (!rooms?.data?.data) return {};

    const grouped = rooms.data.data.reduce(
      (acc, room) => {
        const floor = room.floor ?? 0;
        if (!acc[floor]) {
          acc[floor] = [];
        }
        acc[floor].push(room);
        return acc;
      },
      {} as Record<number, Room[]>
    );

    // Sort rooms within each floor by room_code
    Object.keys(grouped).forEach((floor) => {
      grouped[Number(floor)].sort((a, b) => {
        const codeA = a.room_code || '';
        const codeB = b.room_code || '';
        return codeA.localeCompare(codeB);
      });
    });

    return grouped;
  }, [rooms?.data?.data]);

  const totalRooms = useMemo(() => {
    return Object.values(groupedRooms).reduce((total, floorRooms) => total + floorRooms.length, 0);
  }, [groupedRooms]);

  const totalCapacity = useMemo(() => {
    return Object.values(groupedRooms)
      .flat()
      .reduce((total, room) => total + (room.room_capacity || 0), 0);
  }, [groupedRooms]);

  const labCount = useMemo(() => {
    return Object.values(groupedRooms)
      .flat()
      .filter((room) => room.is_lab).length;
  }, [groupedRooms]);

  const handleRoomSubmit = () => {
    refetchRooms();
  };

  const handleDeleteRoom = async (room: Room) => {
    if (!room.id) return;

    try {
      await deleteRoom({ id: room.id });
      toast.success('Room deleted successfully');
      refetchRooms();
    } catch (error) {
      toast.error('Failed to delete room');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header Section Skeleton */}
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Skeleton className="h-6 w-6" />
              </div>
              <div>
                <Skeleton className="h-10 w-64 mb-2" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <Skeleton className="h-4 w-24" />
              <div className="p-2.5 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                <Skeleton className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-1 w-12" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <Skeleton className="h-4 w-20" />
              <div className="p-2.5 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl">
                <Skeleton className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-1 w-12" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <Skeleton className="h-4 w-16" />
              <div className="p-2.5 bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 rounded-xl">
                <Skeleton className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-1 w-16" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text">
                {building?.name}
              </h1>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="text-xs font-medium px-2.5 py-1">
                  {building?.short_name}
                </Badge>
                <span className="text-sm text-muted-foreground">Building Management</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Total Rooms
            </CardTitle>
            <div className="p-2.5 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl group-hover:scale-110 transition-transform duration-200">
              <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {totalRooms}
            </div>
            <div className="mt-2 h-1 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
          </CardContent>
        </Card>

        <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Total Capacity
            </CardTitle>
            <div className="p-2.5 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl group-hover:scale-110 transition-transform duration-200">
              <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              {totalCapacity}
            </div>
            <div className="mt-2 h-1 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
          </CardContent>
        </Card>

        <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Laboratory Rooms
            </CardTitle>
            <div className="p-2.5 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 rounded-xl group-hover:scale-110 transition-transform duration-200">
              <FlaskConical className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent">
              {labCount}
            </div>
            <div className="mt-2 h-1 w-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"></div>
          </CardContent>
        </Card>

        <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Location
            </CardTitle>
            <div className="p-2.5 bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 rounded-xl group-hover:scale-110 transition-transform duration-200">
              <MapPin className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-semibold leading-relaxed bg-gradient-to-r from-rose-600 to-pink-600 dark:from-rose-400 dark:to-pink-400 bg-clip-text text-transparent">
              {building?.latitude != null && building?.longitude != null
                ? `${Number(building.latitude).toFixed(4)}, ${Number(building.longitude).toFixed(4)}`
                : 'Not specified'}
            </div>
            <div className="mt-2 h-1 w-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"></div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Rooms Section with Accordion */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text">
              Rooms Management
            </h2>
            <p className="text-muted-foreground mt-2">
              Organize and manage rooms across {Object.keys(groupedRooms).length} floor
              {Object.keys(groupedRooms).length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            onClick={() => roomModal.openFn()}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Room
          </Button>
        </div>

        {Object.keys(groupedRooms).length === 0 ? (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-full mb-6">
                <Building2 className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-muted-foreground mb-3">No rooms found</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                This building doesn't have any rooms yet. Start by adding your first room to
                organize the space effectively.
              </p>
              <Button
                onClick={() => roomModal.openFn()}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground"
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Room
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
            <CardContent className="p-6">
              <Accordion type="multiple" className="w-full space-y-4">
                {Object.entries(groupedRooms)
                  .sort(([a], [b]) => Number(b) - Number(a)) // Sort floors in descending order
                  .map(([floor, floorRooms]) => (
                    <AccordionItem
                      key={floor}
                      value={`floor-${floor}`}
                      className="border border-border/50 rounded-lg bg-background/30 hover:bg-background/50 transition-colors duration-200"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex items-center justify-between w-full mr-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                              <Hash className="h-5 w-5 text-primary" />
                            </div>
                            <div className="text-left">
                              <h3 className="text-lg font-semibold">Floor {floor}</h3>
                              <p className="text-sm text-muted-foreground">
                                {floorRooms.length} room{floorRooms.length !== 1 ? 's' : ''} •
                                {floorRooms.reduce(
                                  (sum, room) => sum + (room.room_capacity || 0),
                                  0
                                )}{' '}
                                total capacity
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="font-medium">
                              {floorRooms.length}
                            </Badge>
                            {floorRooms.some((room) => room.is_lab) && (
                              <Badge
                                variant="outline"
                                className="text-purple-600 border-purple-200"
                              >
                                <FlaskConical className="h-3 w-3 mr-1" />
                                Lab
                              </Badge>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-2">
                          {floorRooms.map((room) => (
                            <div
                              key={room.id}
                              className="group relative p-5 border border-border/40 rounded-xl bg-gradient-to-br from-background to-background/50 hover:from-background hover:to-background/80 hover:border-border hover:shadow-md transition-all duration-300"
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-base truncate text-foreground">
                                    {room.name}
                                  </h4>
                                  <p className="text-sm text-muted-foreground truncate mt-1">
                                    Code: {room.room_code}
                                  </p>
                                </div>
                                {room.is_lab && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs ml-2 text-purple-600 border-purple-200 bg-purple-50 dark:bg-purple-900/20"
                                  >
                                    <FlaskConical className="h-3 w-3 mr-1" />
                                    Lab
                                  </Badge>
                                )}
                              </div>

                              <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                                  <span className="text-muted-foreground flex items-center">
                                    <Users className="h-3 w-3 mr-1" />
                                    Capacity:
                                  </span>
                                  <span className="font-semibold text-foreground">
                                    {room.room_capacity || '—'}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                                  <span className="text-muted-foreground flex items-center">
                                    <Hash className="h-3 w-3 mr-1" />
                                    Short Name:
                                  </span>
                                  <span className="font-semibold text-foreground">
                                    {room.short_name || '—'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-end space-x-2 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => roomModal.openFn(room)}
                                  className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteRoom(room)}
                                  className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors duration-200"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Room Modal */}
      <RoomModal
        controller={roomModal}
        buildingId={building?.id || 0}
        onSubmit={handleRoomSubmit}
      />
    </div>
  );
}
