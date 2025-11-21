import { useConfirm } from '@/components/confirm.provider';
import CustomSelect, { type SelectOption } from '@/components/custom/select.component';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { renderError } from '@/lib/error';
import { encryptIdForUrl } from '@/lib/hash';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateCurriculum,
  useDeleteCurriculum,
  useGetAcademicTermPaginated,
  useGetCurriculumPaginated,
  useGetSchoolYearPaginated,
  useUpdateCurriculum,
} from '@rest/api';
import {
  CurriculumStateEnum,
  type AcademicProgram,
  type Curriculum,
  type GetCurriculumsResponse200,
} from '@rest/models';
import { Calendar, Clock, Eye, FileText, GraduationCap, Hash, PlusCircle } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

interface CurriculumSheetState {
  openSheet: (data?: AcademicProgram | null) => void;
  closeSheet: () => void;
  isOpen: boolean;
  data: AcademicProgram | null;
}

interface CurriculumSheetProps {
  controller: CurriculumSheetState;
}

const curriculumSchema = z.object({
  curriculum_code: z.string().min(1, 'Curriculum code is required'),
  curriculum_name: z.string().min(1, 'Curriculum name is required'),
  description: z.string().optional(),
  effective_year: z.number().min(1900, 'Enter a valid year'),
  total_units: z.number().min(0, 'Total units required'),
  total_hours: z.number().min(0, 'Total hours required'),
  status: z.enum([
    CurriculumStateEnum.active,
    CurriculumStateEnum.inactive,
    CurriculumStateEnum.archived,
  ]),
  approved_date: z.string().optional(),
  academic_program_id: z.number().min(1, 'Academic program required'),
  academic_term_id: z.number().min(1, 'Academic term required'),
  school_year_id: z.number().min(1, 'School year required'),
});

type CurriculumFormData = z.infer<typeof curriculumSchema>;

const STATUS_OPTIONS: SelectOption[] = [
  { label: 'Active', value: CurriculumStateEnum.active },
  { label: 'Inactive', value: CurriculumStateEnum.inactive },
  { label: 'Archived', value: CurriculumStateEnum.archived },
];

const STATUS_BADGE_CLASSES = {
  [CurriculumStateEnum.active]:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  [CurriculumStateEnum.archived]:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  [CurriculumStateEnum.inactive]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
} as const;

const getDefaultValues = (academicProgramId?: number): CurriculumFormData => ({
  curriculum_code: '',
  curriculum_name: '',
  description: '',
  effective_year: new Date().getFullYear(),
  total_units: 0,
  total_hours: 0,
  status: CurriculumStateEnum.active,
  approved_date: new Date().toISOString(),
  academic_program_id: academicProgramId ?? 0,
  academic_term_id: 0,
  school_year_id: 0,
});

export const useCurriculumSheetState = (): CurriculumSheetState => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<AcademicProgram | null>(null);

  const openSheet = useCallback((academicProgram?: AcademicProgram | null) => {
    setData(academicProgram ?? null);
    setIsOpen(true);
  }, []);

  const closeSheet = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  return useMemo(
    () => ({
      openSheet,
      closeSheet,
      isOpen,
      data,
    }),
    [openSheet, closeSheet, isOpen, data]
  );
};

const getStatusBadge = (status: string): string => {
  return (
    STATUS_BADGE_CLASSES[status as keyof typeof STATUS_BADGE_CLASSES] ||
    STATUS_BADGE_CLASSES[CurriculumStateEnum.inactive]
  );
};

const CurriculumCard = React.memo(
  ({
    curriculum,
    onClick,
    onView,
  }: {
    curriculum: Curriculum;
    onClick: (curr: Curriculum) => void;
    onView: (curr: Curriculum) => void;
  }) => (
    <Card className="hover:border-primary hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onClick(curriculum)}>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <code className="text-xs font-mono bg-muted px-2 py-1 rounded font-semibold">
                  {curriculum.curriculum_code}
                </code>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusBadge(curriculum.status)}`}
                >
                  {curriculum.status.charAt(0).toUpperCase() + curriculum.status.slice(1)}
                </span>
              </div>
              <h4 className="font-semibold text-sm truncate" title={curriculum.curriculum_name}>
                {curriculum.curriculum_name}
              </h4>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onView(curriculum);
              }}
              className="h-8 px-3"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>

          {curriculum.description && (
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p
                className="text-xs text-muted-foreground line-clamp-2"
                title={curriculum.description}
              >
                {curriculum.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Year</span>
                <span className="text-xs font-medium">{curriculum.effective_year || '—'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="h-3.5 w-3.5 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Units</span>
                <span className="text-xs font-medium">{curriculum.total_units || '—'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Hours</span>
                <span className="text-xs font-medium">{curriculum.total_hours || '—'}</span>
              </div>
            </div>
            {curriculum.school_year && (
              <div className="flex items-center gap-2">
                <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">School Year</span>
                  <span className="text-xs font-medium">{curriculum.school_year.name}</span>
                </div>
              </div>
            )}
          </div>

          {curriculum.approved_date && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Approved</span>
                <span className="text-xs font-medium">
                  {new Date(curriculum.approved_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          {(curriculum.created_at || curriculum.updated_at) && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t">
              {curriculum.created_at && (
                <span>Created: {new Date(curriculum.created_at).toLocaleDateString()}</span>
              )}
              {curriculum.updated_at && (
                <span>Updated: {new Date(curriculum.updated_at).toLocaleDateString()}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
);

CurriculumCard.displayName = 'CurriculumCard';

export default function CurriculumSheet({ controller }: CurriculumSheetProps) {
  const { isOpen, closeSheet, data: academicProgram } = controller;
  const [showForm, setShowForm] = useState(false);
  const [editingCurriculum, setEditingCurriculum] = useState<Curriculum | null>(null);
  const confirm = useConfirm();
  const navigate = useNavigate();
  const { campusId, collegeId } = useParams();

  const { data: listOfCurriculumsResponse, refetch } = useGetCurriculumPaginated(
    {
      'filter[academic_program_id]': academicProgram?.id,
      paginate: false,
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
    },
    {
      query: {
        enabled: isOpen && !!academicProgram?.id,
      },
    }
  );

  const listOfCurriculums = useMemo(
    () => (listOfCurriculumsResponse as GetCurriculumsResponse200)?.data ?? [],
    [listOfCurriculumsResponse]
  );

  const isEdit = useMemo(() => !!editingCurriculum?.id, [editingCurriculum?.id]);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CurriculumFormData>({
    resolver: zodResolver(curriculumSchema),
    defaultValues: getDefaultValues(),
  });

  const resetAll = useCallback(() => {
    setEditingCurriculum(null);
    reset(getDefaultValues(academicProgram?.id));
  }, [reset, academicProgram?.id]);

  useEffect(() => {
    if (!isOpen) {
      resetAll();
      setShowForm(false);
    }
  }, [isOpen, resetAll]);

  const { data: listOfAcademicTermsResponse } = useGetAcademicTermPaginated({
    page: 1,
    rows: Number.MAX_SAFE_INTEGER,
  });

  const { data: listOfSchoolYearsResponse } = useGetSchoolYearPaginated({
    sort: '-start_date',
    page: 1,
    rows: Number.MAX_SAFE_INTEGER,
  });

  const { mutateAsync: createCurriculum, isPending: creating } = useCreateCurriculum();
  const { mutateAsync: updateCurriculum, isPending: updating } = useUpdateCurriculum();
  const { mutateAsync: deleteCurriculum, isPending: deleting } = useDeleteCurriculum();

  const listOfAcademicTerms = useMemo<SelectOption[]>(
    () =>
      listOfAcademicTermsResponse?.data?.data?.map<SelectOption>((data) => ({
        label: data.name,
        value: data.id?.toString() ?? '',
      })) ?? [],
    [listOfAcademicTermsResponse]
  );

  const listOfSchoolYears = useMemo<SelectOption[]>(
    () =>
      listOfSchoolYearsResponse?.data?.data?.map<SelectOption>((data) => ({
        label: data.name,
        value: data.id?.toString() ?? '',
      })) ?? [],
    [listOfSchoolYearsResponse]
  );

  const isSaving = useMemo(() => creating || updating, [creating, updating]);

  const onFormSubmit = useCallback(
    async (formData: CurriculumFormData) => {
      try {
        if (isEdit && editingCurriculum?.id) {
          await updateCurriculum({
            id: editingCurriculum.id,
            data: formData as unknown as Curriculum,
          });
          toast.success('Curriculum updated successfully');
        } else {
          await createCurriculum({
            data: formData as unknown as Curriculum,
          });
          toast.success('Curriculum created successfully');
        }
        await refetch();
        setShowForm(false);
        resetAll();
      } catch (error) {
        renderError(error, setError);
        toast.error(`Failed to ${isEdit ? 'update' : 'create'} curriculum`);
      }
    },
    [isEdit, editingCurriculum?.id, updateCurriculum, createCurriculum, refetch, setError, resetAll]
  );

  const handleDelete = useCallback(async () => {
    if (!editingCurriculum?.id) return;

    confirm.confirm(async () => {
      try {
        await deleteCurriculum({ id: editingCurriculum.id as number });
        toast.success('Curriculum deleted successfully');
        await refetch();
        setShowForm(false);
        resetAll();
      } catch (error) {
        toast.error('Failed to delete curriculum');
      }
    });
  }, [editingCurriculum?.id, confirm, deleteCurriculum, refetch, resetAll]);

  const handleCurriculumClick = useCallback(
    (curr: Curriculum) => {
      setEditingCurriculum(curr);
      reset(curr as unknown as CurriculumFormData);
      setShowForm(true);
    },
    [reset]
  );

  const handleViewCurriculum = useCallback(
    (curr: Curriculum) => {
      navigate(
        `/admin/campuses/${campusId}/colleges/${collegeId}/programs/${encryptIdForUrl(academicProgram?.id as number)}/curriculum/${encryptIdForUrl(curr.id as number)}`
      );
    },
    [navigate, campusId, collegeId, academicProgram?.id]
  );

  const handleCreateNew = useCallback(() => {
    const defaultData = getDefaultValues(academicProgram?.id);
    setEditingCurriculum(defaultData as unknown as Curriculum);
    reset(defaultData);
    setShowForm(true);
  }, [academicProgram?.id, reset]);

  const sheetTitle = useMemo(
    () => (showForm ? (isEdit ? 'Edit Curriculum' : 'Create Curriculum') : 'Curriculum Manager'),
    [showForm, isEdit]
  );

  const sheetSubtitle = useMemo(
    () => editingCurriculum?.curriculum_name || academicProgram?.program_name,
    [editingCurriculum?.curriculum_name, academicProgram?.program_name]
  );

  const currentStatus = watch('status');
  const currentAcademicTermId = watch('academic_term_id');
  const currentSchoolYearId = watch('school_year_id');

  if (!isOpen) return null;

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent className="focus:outline-none overflow-y-auto sm:max-w-2xl">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-lg">{sheetTitle}</SheetTitle>
          {sheetSubtitle && <p className="text-sm text-muted-foreground">{sheetSubtitle}</p>}
        </SheetHeader>

        {!showForm ? (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Existing Curriculums</h3>
              <Button type="button" size="sm" onClick={handleCreateNew} className="h-8">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New
              </Button>
            </div>
            <div className="space-y-3 max-h-[calc(100vh-240px)] overflow-y-auto overflow-x-visible pr-2 pb-2">
              {listOfCurriculums && listOfCurriculums.length > 0 ? (
                listOfCurriculums.map((curr: Curriculum) => (
                  <CurriculumCard
                    key={curr.id}
                    curriculum={curr}
                    onClick={handleCurriculumClick}
                    onView={handleViewCurriculum}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-sm text-muted-foreground">No curriculums found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        ) : (
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="curriculum_code" className="text-sm font-medium">
                Curriculum Code
              </Label>
              <Input
                id="curriculum_code"
                placeholder="Enter curriculum code"
                {...register('curriculum_code')}
                autoFocus
                className="h-9"
              />
              {errors.curriculum_code && (
                <p className="text-xs text-destructive">{errors.curriculum_code.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="curriculum_name" className="text-sm font-medium">
                Curriculum Name
              </Label>
              <Input
                id="curriculum_name"
                placeholder="Enter curriculum name"
                {...register('curriculum_name')}
                className="h-9"
              />
              {errors.curriculum_name && (
                <p className="text-xs text-destructive">{errors.curriculum_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the curriculum"
                {...register('description')}
                rows={3}
                className="resize-none"
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="effective_year" className="text-sm font-medium">
                  Effective Year
                </Label>
                <Input
                  id="effective_year"
                  type="number"
                  {...register('effective_year', { valueAsNumber: true })}
                  className="h-9"
                />
                {errors.effective_year && (
                  <p className="text-xs text-destructive">{errors.effective_year.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <CustomSelect
                  options={STATUS_OPTIONS}
                  value={currentStatus}
                  onValueChange={(val) =>
                    setValue(
                      'status',
                      val as
                        | typeof CurriculumStateEnum.active
                        | typeof CurriculumStateEnum.inactive
                        | typeof CurriculumStateEnum.archived
                    )
                  }
                  placeholder="Select status"
                  disabled={isSaving}
                />
                {errors.status && (
                  <p className="text-xs text-destructive">{errors.status.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total_units" className="text-sm font-medium">
                  Total Units
                </Label>
                <Input
                  id="total_units"
                  type="number"
                  {...register('total_units', { valueAsNumber: true })}
                  min={0}
                  className="h-9"
                />
                {errors.total_units && (
                  <p className="text-xs text-destructive">{errors.total_units.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_hours" className="text-sm font-medium">
                  Total Hours
                </Label>
                <Input
                  id="total_hours"
                  type="number"
                  {...register('total_hours', { valueAsNumber: true })}
                  min={0}
                  className="h-9"
                />
                {errors.total_hours && (
                  <p className="text-xs text-destructive">{errors.total_hours.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="academic_term_id" className="text-sm font-medium">
                Academic Term
              </Label>
              <CustomSelect
                options={listOfAcademicTerms}
                value={
                  currentAcademicTermId && currentAcademicTermId > 0
                    ? `${currentAcademicTermId}`
                    : ''
                }
                onValueChange={(val) => setValue('academic_term_id', val ? Number(val) : 0)}
                placeholder="Select academic term"
                disabled={isSaving}
              />
              {errors.academic_term_id && (
                <p className="text-xs text-destructive">{errors.academic_term_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="school_year_id" className="text-sm font-medium">
                School Year
              </Label>
              <CustomSelect
                options={listOfSchoolYears}
                value={
                  currentSchoolYearId && currentSchoolYearId > 0 ? `${currentSchoolYearId}` : ''
                }
                onValueChange={(val) => setValue('school_year_id', val ? Number(val) : 0)}
                placeholder="Select school year"
                disabled={isSaving}
              />
              {errors.school_year_id && (
                <p className="text-xs text-destructive">{errors.school_year_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="approved_date" className="text-sm font-medium">
                Approved Date
              </Label>
              <Input
                id="approved_date"
                type="date"
                {...register('approved_date')}
                className="h-9"
              />
              {errors.approved_date && (
                <p className="text-xs text-destructive">{errors.approved_date.message}</p>
              )}
            </div>

            <input type="hidden" {...register('academic_program_id', { valueAsNumber: true })} />
            {errors.academic_program_id && (
              <p className="text-xs text-destructive">{errors.academic_program_id.message}</p>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t">
              {isEdit && (
                <Button
                  type="button"
                  variant="destructive"
                  className="mr-auto"
                  onClick={handleDelete}
                  disabled={deleting || isSaving}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                disabled={isSaving}
              >
                Back
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : isEdit ? 'Update Curriculum' : 'Create Curriculum'}
              </Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
