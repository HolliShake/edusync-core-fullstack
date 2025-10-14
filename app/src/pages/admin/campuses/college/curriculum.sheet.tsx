import { useConfirm } from '@/components/confirm.provider';
import CustomSelect from '@/components/custom/select.component';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateCurriculum,
  useDeleteCurriculum,
  useGetCurriculumPaginated,
  useUpdateCurriculum,
} from '@rest/api';
import type { AcademicProgram, Curriculum, GetCurriculumsResponse200 } from '@rest/models';
import { Calendar, Clock, FileText, Hash, PlusCircle } from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
  status: z.enum(['active', 'inactive', 'archived']),
  approved_date: z.string().optional(),
  academic_program_id: z.number().min(1, 'Academic program required'),
});

type CurriculumFormData = z.infer<typeof curriculumSchema>;

export const useCurriculumSheetState = (): CurriculumSheetState => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [data, setData] = React.useState<AcademicProgram | null>(null);

  const openSheet = (academicProgram?: AcademicProgram | null) => {
    setData(academicProgram ?? null);
    setIsOpen(true);
  };

  const closeSheet = () => {
    setIsOpen(false);
    setData(null);
  };

  return {
    openSheet,
    closeSheet,
    get isOpen() {
      return isOpen;
    },
    get data() {
      return data;
    },
  };
};

export default function CurriculumSheet({ controller }: CurriculumSheetProps) {
  const { isOpen, closeSheet, data: academicProgram } = controller;
  const [showForm, setShowForm] = React.useState(false);
  const [editingCurriculum, setEditingCurriculum] = React.useState<Curriculum | null>(null);
  const confirm = useConfirm();

  const { data: listOfCurriculumsResponse, refetch } = useGetCurriculumPaginated(
    {
      'filter[academic_program_id]': academicProgram?.id,
    },
    {
      query: {
        enabled: isOpen && !!academicProgram?.id,
      },
    }
  );

  const listOfCurriculums = (listOfCurriculumsResponse as GetCurriculumsResponse200)?.data ?? [];

  // "isEdit" now depends on editingCurriculum state
  const isEdit = !!editingCurriculum?.id;

  // Default values based on editingCurriculum or academicProgram
  const getDefaultValues = (): CurriculumFormData => ({
    curriculum_code: editingCurriculum?.curriculum_code || '',
    curriculum_name: editingCurriculum?.curriculum_name || '',
    description: editingCurriculum?.description || '',
    effective_year: editingCurriculum?.effective_year || new Date().getFullYear(),
    total_units: editingCurriculum?.total_units ?? 0,
    total_hours: editingCurriculum?.total_hours ?? 0,
    status: (editingCurriculum?.status as 'active' | 'inactive' | 'archived') || 'active',
    approved_date: editingCurriculum?.approved_date || '',
    academic_program_id: editingCurriculum?.academic_program_id ?? academicProgram?.id ?? 0,
  });

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

  useEffect(() => {
    // Reset form and editing state when sheet opens/closes
    if (!isOpen) {
      setEditingCurriculum(null);
      setShowForm(false);
    }
  }, [isOpen]);

  useEffect(() => {
    // Reset form when editingCurriculum changes
    reset(getDefaultValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingCurriculum, academicProgram]);

  const { mutateAsync: createCurriculum, isPending: creating } = useCreateCurriculum();
  const { mutateAsync: updateCurriculum, isPending: updating } = useUpdateCurriculum();
  const { mutateAsync: deleteCurriculum, isPending: deleting } = useDeleteCurriculum();

  const isSaving = creating || updating;

  const onFormSubmit = async (formData: CurriculumFormData) => {
    try {
      if (isEdit && editingCurriculum?.id) {
        await updateCurriculum({
          id: editingCurriculum.id,
          data: formData as unknown as Curriculum,
        });
        toast.success('Curriculum updated successfully');
      } else {
        await createCurriculum({
          data: {
            ...formData,
          } as unknown as Curriculum,
        });
        toast.success('Curriculum created successfully');
      }
      refetch();
      setShowForm(false);
      setEditingCurriculum(null);
    } catch (error) {
      renderError(error, setError);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} curriculum`);
    }
  };

  const handleDelete = async () => {
    if (!editingCurriculum?.id) return;

    confirm.confirm(async () => {
      try {
        await deleteCurriculum({ id: editingCurriculum.id as number });
        toast.success('Curriculum deleted successfully');
        refetch();
        setShowForm(false);
        setEditingCurriculum(null);
      } catch (error) {
        toast.error('Failed to delete curriculum');
      }
    });
  };

  const handleCurriculumClick = (curr: Curriculum) => {
    // Set editing curriculum and show form
    setEditingCurriculum(curr);
    setShowForm(true);
  };

  const handleCreateNew = () => {
    setEditingCurriculum(null);
    setShowForm(true);
  };

  // If not open, do not render
  if (!isOpen) return null;

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Archived', value: 'archived' },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      archived: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      inactive: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent className="focus:outline-none overflow-y-auto sm:max-w-2xl">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-lg">
            {showForm ? (isEdit ? 'Edit Curriculum' : 'Create Curriculum') : 'Curriculum Manager'}
          </SheetTitle>
          {(editingCurriculum?.curriculum_name || academicProgram?.program_name) && (
            <p className="text-sm text-muted-foreground">
              {editingCurriculum?.curriculum_name || academicProgram?.program_name}
            </p>
          )}
        </SheetHeader>

        {!showForm ? (
          <>
            {/* Curriculum List Section */}
            <section className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm">Existing Curriculums</h3>
                <Button type="button" size="sm" onClick={handleCreateNew} className="h-8">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New
                </Button>
              </div>
              <div className="space-y-3 max-h-[calc(100vh-240px)] overflow-y-auto pr-2">
                {listOfCurriculums && listOfCurriculums.length > 0 ? (
                  listOfCurriculums.map((curr: Curriculum) => (
                    <Card
                      key={curr.id}
                      className="cursor-pointer hover:border-primary hover:shadow-md transition-all duration-200"
                      onClick={() => handleCurriculumClick(curr)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Header Row */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <code className="text-xs font-mono bg-muted px-2 py-1 rounded font-semibold">
                                  {curr.curriculum_code}
                                </code>
                                <span
                                  className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusBadge(curr.status)}`}
                                >
                                  {curr.status.charAt(0).toUpperCase() + curr.status.slice(1)}
                                </span>
                              </div>
                              <h4
                                className="font-semibold text-sm truncate"
                                title={curr.curriculum_name}
                              >
                                {curr.curriculum_name}
                              </h4>
                            </div>
                          </div>

                          {/* Description */}
                          {curr.description && (
                            <div className="flex items-start gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <p
                                className="text-xs text-muted-foreground line-clamp-2"
                                title={curr.description}
                              >
                                {curr.description}
                              </p>
                            </div>
                          )}

                          {/* Metadata Grid */}
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                              <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">Year</span>
                                <span className="text-xs font-medium">
                                  {curr.effective_year || '—'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                              <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">Units</span>
                                <span className="text-xs font-medium">
                                  {curr.total_units || '—'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                              <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground">Hours</span>
                                <span className="text-xs font-medium">
                                  {curr.total_hours || '—'}
                                </span>
                              </div>
                            </div>
                            {curr.approved_date && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                <div className="flex flex-col">
                                  <span className="text-xs text-muted-foreground">Approved</span>
                                  <span className="text-xs font-medium">
                                    {new Date(curr.approved_date).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Footer metadata */}
                          {(curr.created_at || curr.updated_at) && (
                            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t">
                              {curr.created_at && (
                                <span>
                                  Created: {new Date(curr.created_at).toLocaleDateString()}
                                </span>
                              )}
                              {curr.updated_at && (
                                <span>
                                  Updated: {new Date(curr.updated_at).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
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
          </>
        ) : (
          <>
            {/* Form Section */}
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
                    options={statusOptions}
                    value={watch('status')}
                    onChange={(val) =>
                      setValue('status', val as 'active' | 'inactive' | 'archived')
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

              {/* Hidden Academic Program ID input for safety */}
              <input
                type="hidden"
                value={getDefaultValues().academic_program_id}
                {...register('academic_program_id', { valueAsNumber: true })}
              />
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
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
