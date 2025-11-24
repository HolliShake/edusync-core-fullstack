import { useConfirm } from '@/components/confirm.provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useCreateEnrollment,
  useCreateSectionTeacher,
  useDeleteEnrollment,
  useDeleteSectionTeacher,
  useGetEnrollmentPaginated,
  useGetSectionTeacherPaginated,
  useGetUserPaginated,
} from '@rest/api';
import type { Enrollment, Section, User } from '@rest/models';
import { ChevronLeft, ChevronRight, Search, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { toast } from 'sonner';

interface ScheduleInfoViewProps {
  section: Section | undefined;
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
      className={`flex items-start space-x-3 p-3 rounded-lg border transition-all ${
        isAssigned
          ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800/30'
          : 'cursor-move bg-white dark:bg-slate-800 hover:border-blue-400 hover:shadow-sm dark:hover:border-blue-500'
      } ${isDragging ? 'opacity-50 scale-95' : ''} border-slate-200 dark:border-slate-700`}
    >
      <div className="flex-1 space-y-1.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold leading-none break-words whitespace-normal text-slate-900 dark:text-slate-100">
            {user.name}
          </p>
          {user.roles && user.roles.length > 0 && (
            <Badge
              variant="outline"
              className="text-xs border-purple-200 text-purple-700 bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:bg-purple-900/30"
            >
              {user.roles[0]}
            </Badge>
          )}
        </div>
        <p className="text-xs break-words whitespace-normal text-slate-600 dark:text-slate-400">
          {user.email}
        </p>
        {isAssigned && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
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
      className={`min-h-[200px] rounded-lg border-2 border-dashed p-4 transition-all ${
        isOver
          ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 dark:border-emerald-500 dark:from-emerald-900/20 dark:to-teal-900/20 shadow-inner'
          : 'border-slate-300 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/50'
      }`}
    >
      {children}
    </div>
  );
};

export default function ScheduleInfoView({ section }: ScheduleInfoViewProps) {
  const [searchInput, setSearchInput] = useState('');
  const [userMeta, setUserMeta] = useState({
    search: '',
    page: 1,
    rows: 10,
  });

  const [teacherMeta, setTeacherMeta] = useState({
    search: '',
    page: 1,
    rows: 10,
  });

  const [studentMeta, setStudentMeta] = useState({
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
      page: teacherMeta.page,
      rows: teacherMeta.rows,
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

  const teacherTotalPages = sectionTeachersResponse?.data?.last_page ?? 1;

  const assignedTeacherIds = useMemo(
    () => new Set(sectionTeachers.map((st) => st.user_id)),
    [sectionTeachers]
  );

  // Fetch Enrollments
  const { data: enrollmentsResponse, refetch: refetchEnrollments } = useGetEnrollmentPaginated(
    {
      'filter[section_id]': Number(section?.id),
      page: studentMeta.page,
      rows: studentMeta.rows,
    },
    {
      query: {
        enabled: !!section?.id,
      },
    }
  );

  const enrollments = useMemo(() => enrollmentsResponse?.data?.data ?? [], [enrollmentsResponse]);

  const studentTotalPages = enrollmentsResponse?.data?.last_page ?? 1;

  const assignedStudentIds = useMemo(
    () => new Set(enrollments.map((e) => e.user_id)),
    [enrollments]
  );

  const confirm = useConfirm();

  // Mutations
  const { mutateAsync: createSectionTeacher } = useCreateSectionTeacher();
  const { mutateAsync: deleteSectionTeacher } = useDeleteSectionTeacher();
  const { mutateAsync: createEnrollment } = useCreateEnrollment();
  const { mutateAsync: deleteEnrollment } = useDeleteEnrollment();

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
        toast.success(`${user.name} added as teacher`);
        refetchTeachers();
      } catch (error) {
        toast.error('Failed to add teacher');
      }
    },
    [section, createSectionTeacher, refetchTeachers]
  );

  const handleRemoveTeacher = useCallback(
    async (sectionTeacherId: number, userName?: string) => {
      confirm.confirm(async () => {
        try {
          await deleteSectionTeacher({ id: sectionTeacherId });
          toast.success(`${userName || 'Teacher'} removed from section`);
          refetchTeachers();
        } catch (error) {
          toast.error('Failed to remove teacher');
        }
      });
    },
    [confirm, deleteSectionTeacher, refetchTeachers]
  );

  const handleAddStudent = useCallback(
    async (user: User) => {
      if (!section?.id || !user.id) return;

      try {
        await createEnrollment({
          data: {
            section_id: section.id,
            user_id: user.id,
          },
        });

        toast.success(`${user.name} enrolled as student`);
        refetchEnrollments();
      } catch (error) {
        toast.error('Failed to enroll student');
      }
    },
    [section, createEnrollment, refetchEnrollments]
  );

  const handleRemoveStudent = useCallback(
    async (enrollment: Enrollment) => {
      // Removal functionality removed - enrollment logs are no longer created
      confirm.confirm(async () => {
        try {
          await deleteEnrollment({ id: enrollment.id! });
          toast.success('Student removed from section');
          refetchEnrollments();
        } catch (error) {
          toast.error('Failed to remove student');
        }
      });
    },
    [confirm, deleteEnrollment, refetchEnrollments]
  );

  const handlePreviousPage = useCallback(() => {
    setUserMeta((prev) => ({ ...prev, page: prev.page - 1 }));
  }, []);

  const handleNextPage = useCallback(() => {
    setUserMeta((prev) => ({ ...prev, page: prev.page + 1 }));
  }, []);

  const handleTeacherPreviousPage = useCallback(() => {
    setTeacherMeta((prev) => ({ ...prev, page: prev.page - 1 }));
  }, []);

  const handleTeacherNextPage = useCallback(() => {
    setTeacherMeta((prev) => ({ ...prev, page: prev.page + 1 }));
  }, []);

  const handleTeacherRowsChange = useCallback((value: string) => {
    setTeacherMeta((prev) => ({ ...prev, rows: Number(value), page: 1 }));
  }, []);

  const handleStudentPreviousPage = useCallback(() => {
    setStudentMeta((prev) => ({ ...prev, page: prev.page - 1 }));
  }, []);

  const handleStudentNextPage = useCallback(() => {
    setStudentMeta((prev) => ({ ...prev, page: prev.page + 1 }));
  }, []);

  const handleStudentRowsChange = useCallback((value: string) => {
    setStudentMeta((prev) => ({ ...prev, rows: Number(value), page: 1 }));
  }, []);

  if (!section) {
    return (
      <div className="space-y-6">
        {/* Section Info Header Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <Skeleton className="h-3 w-20 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div>
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="col-span-2 sm:col-span-2">
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: User Search Skeleton */}
          <div className="lg:col-span-5 flex flex-col border rounded-xl p-4 bg-card shadow-sm">
            <div className="space-y-3 mb-4 flex-shrink-0">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            <div className="flex-1 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 mt-auto border-t">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
          </div>

          {/* Right: Assigned Teachers Skeleton */}
          <div className="lg:col-span-7 flex flex-col">
            <Skeleton className="h-4 w-36 mb-3" />
            <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-4">
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                    <Skeleton className="h-9 w-9 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Section Info Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <Label className="text-xs text-muted-foreground font-medium">Section Code</Label>
            <p className="font-semibold text-sm mt-1 text-slate-900 dark:text-slate-100">
              {section.section_code}
            </p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground font-medium">Course</Label>
            <p className="font-semibold text-sm mt-1 text-slate-900 dark:text-slate-100">
              {section.curriculum_detail?.course?.course_code}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-2">
            <Label className="text-xs text-muted-foreground font-medium">Description</Label>
            <p className="font-semibold text-sm mt-1 truncate text-slate-900 dark:text-slate-100">
              {section.curriculum_detail?.course?.course_title}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: User Search */}
          <div className="lg:col-span-5 flex flex-col border rounded-xl p-4 bg-card shadow-sm">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 pr-9"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <ScrollArea className="flex-1 -mx-2 px-2 max-h-[500px]">
              <div className="space-y-2">
                {users.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    <div className="inline-flex p-3 rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                      <Search className="h-6 w-6 opacity-50" />
                    </div>
                    <p className="font-medium">No users found</p>
                    <p className="text-xs mt-1">Try adjusting your search</p>
                  </div>
                ) : (
                  users.map((user) => (
                    <DraggableUser
                      key={user.id}
                      user={user}
                      isAssigned={
                        assignedTeacherIds.has(user.id!) || assignedStudentIds.has(user.id!)
                      }
                    />
                  ))
                )}
              </div>
            </ScrollArea>

            <div className="flex items-center justify-between pt-4 mt-auto border-t">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg"
                onClick={handlePreviousPage}
                disabled={userMeta.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground font-medium">
                Page {userMeta.page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg"
                onClick={handleNextPage}
                disabled={userMeta.page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right: Assigned Teachers and Students */}
          <div className="lg:col-span-7 flex flex-col">
            <Tabs defaultValue="teachers" className="flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mb-3 h-11">
                <TabsTrigger
                  value="teachers"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                >
                  Teachers
                </TabsTrigger>
                <TabsTrigger
                  value="students"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                >
                  Students
                </TabsTrigger>
              </TabsList>

              <TabsContent value="teachers" className="flex-1 mt-0 flex flex-col">
                <DropZone onDrop={handleAddTeacher}>
                  {sectionTeachers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-muted-foreground py-12">
                      <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                        <Search className="h-8 w-8 opacity-50" />
                      </div>
                      <p className="text-sm font-semibold">No teachers assigned</p>
                      <p className="text-xs mt-1.5">Drag users here to assign them as teachers</p>
                    </div>
                  ) : (
                    <ScrollArea className="max-h-[400px] pr-4">
                      <div className="grid grid-cols-1 gap-3 p-3">
                        {sectionTeachers.map((st) => (
                          <div
                            key={st.id}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                {st.user?.name?.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-semibold leading-none text-slate-900 dark:text-slate-100">
                                  {st.user?.name}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1.5">
                                  {st.user?.email}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
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

                <div className="flex items-center justify-between pt-4 mt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground whitespace-nowrap">
                      Rows per page:
                    </Label>
                    <Select
                      value={String(teacherMeta.rows)}
                      onValueChange={handleTeacherRowsChange}
                    >
                      <SelectTrigger className="h-9 w-[70px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-lg"
                      onClick={handleTeacherPreviousPage}
                      disabled={teacherMeta.page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground font-medium">
                      Page {teacherMeta.page} of {teacherTotalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-lg"
                      onClick={handleTeacherNextPage}
                      disabled={teacherMeta.page >= teacherTotalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="students" className="flex-1 mt-0 flex flex-col">
                <DropZone onDrop={handleAddStudent}>
                  {enrollments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-muted-foreground py-12">
                      <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                        <Search className="h-8 w-8 opacity-50" />
                      </div>
                      <p className="text-sm font-semibold">No students enrolled</p>
                      <p className="text-xs mt-1.5">Drag users here to enroll them as students</p>
                    </div>
                  ) : (
                    <ScrollArea className="max-h-[400px] -mr-3 pr-3">
                      <div className="grid grid-cols-1 gap-3 p-3">
                        {enrollments.map((enrollment) => (
                          <div
                            key={enrollment.id}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                                {enrollment.user?.name?.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold leading-none text-slate-900 dark:text-slate-100">
                                    {enrollment.user?.name}
                                  </p>
                                  {enrollment.latest_status_label && (
                                    <Badge variant="outline" className="text-xs">
                                      {enrollment.latest_status_label}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1.5">
                                  {enrollment.user?.email}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveStudent(enrollment)}
                              disabled={enrollment.is_dropped}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </DropZone>

                <div className="flex items-center justify-between pt-4 mt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground whitespace-nowrap">
                      Rows per page:
                    </Label>
                    <Select
                      value={String(studentMeta.rows)}
                      onValueChange={handleStudentRowsChange}
                    >
                      <SelectTrigger className="h-9 w-[70px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-lg"
                      onClick={handleStudentPreviousPage}
                      disabled={studentMeta.page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground font-medium">
                      Page {studentMeta.page} of {studentTotalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-lg"
                      onClick={handleStudentNextPage}
                      disabled={studentMeta.page >= studentTotalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
