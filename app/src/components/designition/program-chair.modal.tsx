import Modal, { type ModalState } from '@/components/custom/modal.component';
import Select from '@/components/custom/select.component';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateProgramChair,
  useGetAcademicProgramPaginated,
  useGetCampusPaginated,
  useGetCollegePaginated,
  useGetUserPaginated,
  useUpdateDesignition,
} from '@rest/api';
import type { Designition, User } from '@rest/models';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const programChairSchema = z.object({
  user_id: z.number().min(1, 'User is required'),
  designitionable_id: z.number().min(1, 'Program is required'),
  is_active: z.boolean(),
});

type ProgramChairFormData = z.infer<typeof programChairSchema>;

interface ProgramChairModalProps {
  controller: ModalState<Designition>;
  onSubmit: (data: ProgramChairFormData) => void;
}

const DRAG_TYPE = 'USER';

interface DraggableUserProps {
  user: User;
  isSelected: boolean;
}

const DraggableUser = ({ user, isSelected }: DraggableUserProps) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: DRAG_TYPE,
      item: { user },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [user]
  );

  const ref = useRef<HTMLDivElement>(null);
  drag(ref);

  return (
    <div
      ref={ref}
      className={`flex items-start space-x-2 p-2 sm:p-3 rounded-lg border transition-all cursor-move ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${
        isSelected
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-700'
          : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:hover:border-blue-600'
      }`}
    >
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <p
            className={`text-xs sm:text-sm font-semibold leading-none break-words whitespace-normal ${
              isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {user.name}
          </p>
          {user.roles && user.roles.length > 0 && (
            <Badge
              variant="outline"
              className={`text-[10px] sm:text-xs ${
                isSelected
                  ? 'border-purple-300 text-purple-700 bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:bg-purple-900/30'
                  : 'border-purple-200 text-purple-600 bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:bg-purple-900/20'
              }`}
            >
              {user.roles[0]}
            </Badge>
          )}
        </div>
        <p
          className={`text-[11px] sm:text-xs break-words whitespace-normal ${
            isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {user.email}
        </p>
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
      className={`min-h-[80px] sm:min-h-[100px] rounded-lg border-2 border-dashed p-3 sm:p-4 transition-all ${
        isOver
          ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 dark:border-emerald-500 dark:from-emerald-900/20 dark:to-teal-900/20'
          : 'border-slate-300 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/50'
      }`}
    >
      {children}
    </div>
  );
};

function ProgramChairModalContent({ controller, onSubmit }: ProgramChairModalProps) {
  const {
    handleSubmit,
    reset,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProgramChairFormData>({
    resolver: zodResolver(programChairSchema),
    defaultValues: {
      user_id: 0,
      designitionable_id: 0,
      is_active: true,
    },
  });

  const [searchInput, setSearchInput] = useState('');
  const [userMeta, setUserMeta] = useState({
    search: '',
    page: 1,
    rows: 10,
  });

  const [filters, setFilters] = useState({
    campus_id: 0,
    college_id: 0,
  });

  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setUserMeta((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: usersResponse } = useGetUserPaginated({
    'filter[name]': userMeta.search,
    page: userMeta.page,
    rows: userMeta.rows,
  });

  const { data: campusesResponse } = useGetCampusPaginated({
    page: 1,
    rows: Number.MAX_SAFE_INTEGER,
  });

  const { data: collegesResponse } = useGetCollegePaginated(
    {
      'filter[campus_id]': filters?.campus_id ?? 0,
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
    },
    { query: { enabled: !!filters?.campus_id } }
  );

  const { data: programsResponse } = useGetAcademicProgramPaginated(
    {
      'filter[college_id]': filters?.college_id ?? 0,
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
    },
    { query: { enabled: !!filters?.college_id } }
  );

  const users = usersResponse?.data?.data ?? [];
  const totalPages = usersResponse?.data?.last_page ?? 1;
  const campuses = campusesResponse?.data?.data ?? [];
  const colleges = collegesResponse?.data?.data ?? [];
  const programs = programsResponse?.data?.data ?? [];
  const selectedUserId = watch('user_id');
  const isActive = watch('is_active');

  const { mutateAsync: createProgramChair, isPending } = useCreateProgramChair();
  const { mutateAsync: updateDesignition, isPending: isUpdating } = useUpdateDesignition();

  const isSaving = useMemo(() => isPending || isUpdating, [isPending, isUpdating]);

  const isEdit = useMemo(() => !!controller.data?.id, [controller.data]);

  // Set default campus on load
  useEffect(() => {
    if (campuses.length > 0 && filters.campus_id === 0) {
      setFilters((prev) => ({ ...prev, campus_id: campuses[0].id ?? 0 }));
    }
  }, [campuses, filters.campus_id]);

  // Set default college on load
  useEffect(() => {
    if (colleges.length > 0 && filters.college_id === 0) {
      setFilters((prev) => ({ ...prev, college_id: colleges[0].id ?? 0 }));
    }
  }, [colleges, filters.college_id]);

  // Set default program on load
  useEffect(() => {
    if (programs.length > 0 && watch('designitionable_id') === 0 && !isEdit) {
      setValue('designitionable_id', programs[0].id ?? 0);
    }
  }, [programs, setValue, watch, isEdit]);

  useEffect(() => {
    if (users.length > 0) {
      setAllUsers((prev) => {
        const existingIds = new Set(prev.map((u) => u.id));
        const newUsers = users.filter((u) => !existingIds.has(u.id));
        return [...prev, ...newUsers];
      });
    }
  }, [users]);

  const handleUserDrop = useCallback(
    (user: User) => {
      setValue('user_id', user.id!);
    },
    [setValue]
  );

  const removeUser = useCallback(() => {
    setValue('user_id', 0);
  }, [setValue]);

  const selectedUserDetail = useMemo(() => {
    return allUsers.find((user) => user.id === selectedUserId);
  }, [allUsers, selectedUserId]);

  const campusOptions = useMemo(
    () =>
      campuses.map((campus) => ({
        label: campus.name ?? '',
        value: String(campus.id ?? ''),
      })),
    [campuses]
  );

  const collegeOptions = useMemo(
    () =>
      colleges.map((college) => ({
        label: college.college_name ?? '',
        value: String(college.id ?? ''),
      })),
    [colleges]
  );

  const programOptions = useMemo(
    () =>
      programs.map((program) => ({
        label: program.program_name ?? '',
        value: String(program.id ?? ''),
      })),
    [programs]
  );

  const onFormSubmit = useCallback(
    async (data: ProgramChairFormData) => {
      try {
        if (isEdit) {
          await updateDesignition({
            id: controller.data?.id ?? 0,
            data: {
              ...data,
              designitionable_type: controller?.data?.designitionable_type,
            } as Designition,
          });
        } else {
          await createProgramChair({
            data: {
              ...data,
              designitionable_type: controller?.data?.designitionable_type,
            } as Designition,
          });
        }
        toast.success(`Program Chair ${isEdit ? 'updated' : 'created'} successfully`);
        controller.closeFn();
        onSubmit(data);
      } catch (error) {
        renderError(error, setError);
        toast.error(`Failed to ${isEdit ? 'update' : 'create'} Program Chair`);
      }
    },
    [createProgramChair, updateDesignition, controller, onSubmit, setError, isEdit]
  );

  useEffect(() => {
    if (!controller.data) {
      return reset({
        user_id: 0,
        designitionable_id: 0,
        is_active: true,
      });
    }
    reset({
      user_id: controller.data.user_id || 0,
      designitionable_id: controller.data.designitionable_id || 0,
      is_active: controller.data.is_active ?? true,
    });
  }, [controller.isOpen, controller.data, reset]);

  const handlePreviousPage = useCallback(() => {
    setUserMeta((prev) => ({ ...prev, page: prev.page - 1 }));
  }, []);

  const handleNextPage = useCallback(() => {
    setUserMeta((prev) => ({ ...prev, page: prev.page + 1 }));
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
  }, []);

  const handleCampusChange = useCallback(
    (value: string) => {
      setFilters((prev) => ({ ...prev, campus_id: Number(value), college_id: 0 }));
      setValue('designitionable_id', 0);
    },
    [setValue]
  );

  const handleCollegeChange = useCallback(
    (value: string) => {
      setFilters((prev) => ({ ...prev, college_id: Number(value) }));
      setValue('designitionable_id', 0);
    },
    [setValue]
  );

  const handleProgramChange = useCallback(
    (value: string) => {
      setValue('designitionable_id', Number(value));
    },
    [setValue]
  );

  const handleIsActiveChange = useCallback(
    (checked: boolean) => {
      setValue('is_active', checked);
    },
    [setValue]
  );

  return (
    <Modal
      controller={controller}
      title={`${isEdit ? 'Edit' : 'Add'} Program Chair`}
      size="half"
      closable
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 lg:border-r lg:pr-4">
          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-300 text-sm sm:text-base">
              Available Users
            </Label>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Drag user to select
            </p>
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-8 sm:pl-9 pr-8 sm:pr-9 text-sm"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              )}
            </div>
            <ScrollArea className="h-[250px] sm:h-[350px] lg:h-[400px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 p-2 sm:p-3">
              <div className="space-y-2 pr-3">
                {users.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[200px] sm:h-[300px] lg:h-[350px] text-center px-4">
                    <Search className="h-10 w-10 sm:h-12 sm:w-12 text-slate-300 dark:text-slate-600 mb-2 sm:mb-3" />
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 break-words">
                      No users found
                    </p>
                    <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-1 break-words">
                      Try adjusting your search
                    </p>
                  </div>
                ) : (
                  users.map((user: User) => (
                    <DraggableUser
                      key={user.id}
                      user={user}
                      isSelected={selectedUserId === user.id!}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={userMeta.page === 1}
                className="h-8 px-2 sm:px-3"
              >
                <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
              <span className="text-xs sm:text-sm text-muted-foreground">
                Page {userMeta.page} of {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={userMeta.page >= totalPages}
                className="h-8 px-2 sm:px-3"
              >
                <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-300 text-sm">Selected User</Label>
              <DropZone onDrop={handleUserDrop}>
                {!selectedUserId || selectedUserId === 0 ? (
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center py-6 sm:py-8">
                    Drop user here to select
                  </p>
                ) : (
                  selectedUserDetail && (
                    <div className="flex items-center justify-between">
                      <Badge className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-sm text-xs">
                        <span className="font-medium break-words whitespace-normal">
                          {selectedUserDetail.name}
                        </span>
                        <button
                          type="button"
                          onClick={removeUser}
                          className="ml-0.5 sm:ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors flex-shrink-0"
                        >
                          <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        </button>
                      </Badge>
                    </div>
                  )
                )}
              </DropZone>
              {errors.user_id && (
                <p className="text-xs sm:text-sm text-destructive">{errors.user_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="campus_id" className="text-sm">
                Campus
              </Label>
              <Select
                options={campusOptions}
                value={String(filters.campus_id)}
                onValueChange={handleCampusChange}
                placeholder="Select campus"
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="college_id" className="text-sm">
                College
              </Label>
              <Select
                options={collegeOptions}
                value={String(filters.college_id)}
                onValueChange={handleCollegeChange}
                placeholder="Select college"
                className="text-sm"
                disabled={!filters.campus_id}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="designitionable_id" className="text-sm">
                Program
              </Label>
              <Select
                options={programOptions}
                value={String(watch('designitionable_id'))}
                onValueChange={handleProgramChange}
                placeholder="Select program"
                className="text-sm"
                disabled={!filters.college_id}
              />
              {errors.designitionable_id && (
                <p className="text-xs sm:text-sm text-destructive">
                  {errors.designitionable_id.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="is_active" checked={isActive} onCheckedChange={handleIsActiveChange} />
              <Label htmlFor="is_active" className="cursor-pointer text-sm">
                Active
              </Label>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={controller.closeFn}
                className="w-full sm:w-auto text-sm"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="w-full sm:w-auto text-sm">
                {isSaving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}

export default function ProgramChairModal(props: ProgramChairModalProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <ProgramChairModalContent {...props} />
    </DndProvider>
  );
}
