import Modal, { type ModalState } from '@/components/custom/modal.component';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  useCreateSectionTeacher,
  useDeleteSectionTeacher,
  useGetSectionTeacherPaginated,
  useGetUserPaginated,
} from '@rest/api';
import type { Section, User } from '@rest/models';
import { ChevronLeft, ChevronRight, Search, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { toast } from 'sonner';

export interface SectionDetailsModalData {
  section: Section;
}

interface SectionDetailsModalProps {
  controller: ModalState<SectionDetailsModalData>;
}

const DRAG_TYPE = 'USER';

interface DraggableUserProps {
  user: User;
  isAssigned: boolean;
}

const DraggableUser = ({ user, isAssigned }: DraggableUserProps) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: DRAG_TYPE,
      item: { user },
      canDrag: !isAssigned,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [user, isAssigned]
  );

  const ref = useRef<HTMLDivElement>(null);
  drag(ref);

  return (
    <div
      ref={ref}
      className={`flex items-start space-x-2 p-2 sm:p-3 rounded-lg border transition-all ${
        isAssigned
          ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800/50'
          : 'cursor-move bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600'
      } ${isDragging ? 'opacity-50 scale-95' : ''} border-slate-200 dark:border-slate-700`}
    >
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <p className="text-xs sm:text-sm font-semibold leading-none break-words whitespace-normal text-slate-900 dark:text-slate-100">
            {user.name}
          </p>
          {user.roles && user.roles.length > 0 && (
            <Badge
              variant="outline"
              className="text-[10px] sm:text-xs border-purple-200 text-purple-600 bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:bg-purple-900/20"
            >
              {user.roles[0]}
            </Badge>
          )}
        </div>
        <p className="text-[11px] sm:text-xs break-words whitespace-normal text-slate-600 dark:text-slate-400">
          {user.email}
        </p>
        {isAssigned && (
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            Already Assigned
          </p>
        )}
      </div>
    </div>
  );
};

interface DropZoneProps {
  onDrop: (user: User) => void;
  children: React.ReactNode;
}

const DropZone = ({ onDrop, children }: DropZoneProps) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: DRAG_TYPE,
      drop: (item: { user: User }) => {
        onDrop(item.user);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [onDrop]
  );

  const ref = useRef<HTMLDivElement>(null);
  drop(ref);

  return (
    <div
      ref={ref}
      className={`h-full min-h-[200px] rounded-lg border-2 border-dashed p-3 sm:p-4 transition-all ${
        isOver
          ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 dark:border-emerald-500 dark:from-emerald-900/20 dark:to-teal-900/20'
          : 'border-slate-300 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/50'
      }`}
    >
      {children}
    </div>
  );
};

function SectionDetailsModalContent({ controller }: SectionDetailsModalProps) {
  const { section } = controller.data || {};

  const [searchInput, setSearchInput] = useState('');
  const [userMeta, setUserMeta] = useState({
    search: '',
    page: 1,
    rows: 10,
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setUserMeta((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch Users
  const { data: usersResponse } = useGetUserPaginated({
    'filter[name]': userMeta.search,
    page: userMeta.page,
    rows: userMeta.rows,
  });

  const users = usersResponse?.data?.data ?? [];
  const totalPages = usersResponse?.data?.last_page ?? 1;

  // Fetch Section Teachers
  const { data: sectionTeachersResponse, refetch: refetchTeachers } = useGetSectionTeacherPaginated(
    {
      'filter[section_id]': Number(section?.id),
      page: 1,
      rows: 100, // Assuming not more than 100 teachers per section
    },
    {
      query: {
        enabled: !!section?.id,
      },
    }
  );

  const sectionTeachers = useMemo(
    () => sectionTeachersResponse?.data?.data ?? [],
    [sectionTeachersResponse]
  );

  const assignedUserIds = useMemo(
    () => new Set(sectionTeachers.map((st) => st.user_id)),
    [sectionTeachers]
  );

  // Mutations
  const { mutateAsync: createSectionTeacher } = useCreateSectionTeacher();
  const { mutateAsync: deleteSectionTeacher } = useDeleteSectionTeacher();

  const handleAddTeacher = useCallback(
    async (user: User) => {
      if (!section?.id || !user.id) return;

      try {
        await createSectionTeacher({
          data: {
            section_id: section.id,
            user_id: user.id,
          },
        });
        toast.success(`${user.name} added to section`);
        refetchTeachers();
      } catch (error) {
        toast.error('Failed to add teacher');
      }
    },
    [section, createSectionTeacher, refetchTeachers]
  );

  const handleRemoveTeacher = useCallback(
    async (sectionTeacherId: number, userName?: string) => {
      try {
        await deleteSectionTeacher({ id: sectionTeacherId });
        toast.success(`${userName || 'Teacher'} removed from section`);
        refetchTeachers();
      } catch (error) {
        toast.error('Failed to remove teacher');
      }
    },
    [deleteSectionTeacher, refetchTeachers]
  );

  const handlePreviousPage = useCallback(() => {
    setUserMeta((prev) => ({ ...prev, page: prev.page - 1 }));
  }, []);

  const handleNextPage = useCallback(() => {
    setUserMeta((prev) => ({ ...prev, page: prev.page + 1 }));
  }, []);

  if (!section) return null;

  return (
    <Modal
      controller={controller}
      title="Section Details & Teachers"
      size="half" // Using large modal
      closable
    >
      <DndProvider backend={HTML5Backend}>
        <div className="space-y-6">
          {/* Section Info Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            <div>
              <Label className="text-xs text-muted-foreground">Section Code</Label>
              <p className="font-medium text-sm">{section.section_code}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Course</Label>
              <p className="font-medium text-sm">
                {section.curriculum_detail?.course?.course_code}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-2">
              <Label className="text-xs text-muted-foreground">Description</Label>
              <p className="font-medium text-sm truncate">
                {section.curriculum_detail?.course?.course_title}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px]">
            {/* Left: User Search */}
            <div className="lg:col-span-5 flex flex-col h-full border rounded-lg p-3 bg-card">
              <div className="space-y-2 mb-3 flex-shrink-0">
                <Label className="text-sm">Available Users</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-8 h-8 text-sm"
                  />
                  {searchInput && (
                    <button
                      onClick={() => setSearchInput('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <ScrollArea className="flex-1 -mx-2 px-2">
                <div className="space-y-2">
                  {users.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No users found
                    </div>
                  ) : (
                    users.map((user) => (
                      <DraggableUser
                        key={user.id}
                        user={user}
                        isAssigned={assignedUserIds.has(user.id!)}
                      />
                    ))
                  )}
                </div>
              </ScrollArea>

              <div className="flex items-center justify-between pt-3 mt-auto border-t">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handlePreviousPage}
                  disabled={userMeta.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground">
                  Page {userMeta.page} of {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleNextPage}
                  disabled={userMeta.page >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right: Assigned Teachers */}
            <div className="lg:col-span-7 flex flex-col h-full">
              <Label className="text-sm mb-2">Assigned Teachers</Label>
              <DropZone onDrop={handleAddTeacher}>
                {sectionTeachers.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                      <Search className="h-8 w-8 opacity-50" />
                    </div>
                    <p className="text-sm font-medium">No teachers assigned</p>
                    <p className="text-xs mt-1">Drag users here to assign them</p>
                  </div>
                ) : (
                  <ScrollArea className="h-full -mr-3 pr-3">
                    <div className="grid grid-cols-1 gap-2">
                      {sectionTeachers.map((st) => (
                        <div
                          key={st.id}
                          className="flex items-center justify-between p-3 rounded-md border bg-card shadow-sm group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                              {st.user?.name?.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium leading-none">{st.user?.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">{st.user?.email}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveTeacher(st.id!, st.user?.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </DropZone>
            </div>
          </div>
        </div>
      </DndProvider>
    </Modal>
  );
}

export default function SectionDetailsModal(props: SectionDetailsModalProps) {
  return <SectionDetailsModalContent {...props} />;
}
