import Modal, { type ModalState } from '@/components/custom/modal.component';
import Select from '@/components/custom/select.component';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { renderError } from '@/lib/error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateMultipleCurriculumDetail, useGetCoursePaginated } from '@rest/api';
import type { Course, Curriculum } from '@rest/models';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const curriculumDetailSchema = z.object({
  curriculum_id: z.number().min(1, 'Curriculum ID is required'),
  year_order: z.number().min(1, 'Year order must be at least 1'),
  term_order: z.number().min(1, 'Term order must be at least 1'),
  term_alias: z.string().min(1, 'Term alias is required'),
  is_include_gwa: z.boolean(),
  courses: z.array(z.number()).min(1, 'At least one course is required'),
});

type CurriculumDetailFormData = z.infer<typeof curriculumDetailSchema>;

interface CurriculumDetailModalProps {
  controller: ModalState<Curriculum>;
  onSubmit: (data: CurriculumDetailFormData) => void;
}

const DRAG_TYPE = 'COURSE';

interface DraggableCourseProps {
  course: Course;
  isSelected: boolean;
}

const DraggableCourse = ({ course, isSelected }: DraggableCourseProps) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: DRAG_TYPE,
      item: { course },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [course]
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
            className={`text-xs sm:text-sm font-semibold leading-none ${
              isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {course.course_code}
          </p>
          {course.with_laboratory && (
            <Badge
              variant="outline"
              className={`text-[10px] sm:text-xs ${
                isSelected
                  ? 'border-purple-300 text-purple-700 bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:bg-purple-900/30'
                  : 'border-purple-200 text-purple-600 bg-purple-50 dark:border-purple-700 dark:text-purple-400 dark:bg-purple-900/20'
              }`}
            >
              Lab
            </Badge>
          )}
          {course.is_specialize && (
            <Badge
              variant="outline"
              className={`text-[10px] sm:text-xs ${
                isSelected
                  ? 'border-amber-300 text-amber-700 bg-amber-50 dark:border-amber-600 dark:text-amber-300 dark:bg-amber-900/30'
                  : 'border-amber-200 text-amber-600 bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:bg-amber-900/20'
              }`}
            >
              Specialized
            </Badge>
          )}
        </div>
        <p
          className={`text-[11px] sm:text-xs line-clamp-2 ${
            isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {course.course_title}
        </p>
        <div
          className={`flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs flex-wrap ${
            isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-500'
          }`}
        >
          <span>Lec: {course.lecture_units}u</span>
          {course.with_laboratory && <span>Lab: {course.laboratory_units}u</span>}
          <span className="font-medium">Total: {course.credit_units}u</span>
        </div>
      </div>
    </div>
  );
};

interface DropZoneProps {
  onDrop: (course: Course) => void;
  children: React.ReactNode;
}

const DropZone = ({ onDrop, children }: DropZoneProps) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: DRAG_TYPE,
      drop: (item: { course: Course }) => {
        onDrop(item.course);
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

function CurriculumDetailModalContent({ controller, onSubmit }: CurriculumDetailModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CurriculumDetailFormData>({
    resolver: zodResolver(curriculumDetailSchema),
    defaultValues: {
      curriculum_id: 0,
      year_order: 1,
      term_order: 1,
      term_alias: '',
      is_include_gwa: true,
      courses: [],
    },
  });

  const [searchInput, setSearchInput] = useState('');
  const [courseMeta, setCourseMeta] = useState({
    search: '',
    page: 1,
    rows: 10,
  });
  const [allCourses, setAllCourses] = useState<Course[]>([]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setCourseMeta((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: coursesResponse } = useGetCoursePaginated({
    'filter[course_code]': courseMeta.search,
    page: courseMeta.page,
    rows: courseMeta.rows,
  });

  const courses = coursesResponse?.data?.data ?? [];
  const totalPages = coursesResponse?.data?.last_page ?? 1;
  const selectedCourses = watch('courses');
  const yearOrder = watch('year_order');
  const termOrder = watch('term_order');

  const { mutateAsync: createMultipleCurriculumDetail, isPending } =
    useCreateMultipleCurriculumDetail();

  useEffect(() => {
    if (courses.length > 0) {
      setAllCourses((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const newCourses = courses.filter((c) => !existingIds.has(c.id));
        return [...prev, ...newCourses];
      });
    }
  }, [courses]);

  const handleCourseDrop = useCallback(
    (course: Course) => {
      const current = getValues('courses') || [];
      if (!current.includes(course.id!)) {
        setValue('courses', [...current, course.id!]);
      }
    },
    [getValues, setValue]
  );

  const removeCourse = useCallback(
    (courseId: number) => {
      const current = getValues('courses') || [];
      setValue(
        'courses',
        current.filter((id) => id !== courseId)
      );
    },
    [getValues, setValue]
  );

  const selectedCourseDetails = useMemo(() => {
    return allCourses.filter((course) => selectedCourses?.includes(course.id!));
  }, [allCourses, selectedCourses]);

  const onFormSubmit = useCallback(
    async (data: CurriculumDetailFormData) => {
      try {
        await createMultipleCurriculumDetail({
          data,
        });
        toast.success('Curriculum detail created successfully');
        controller.closeFn();
        onSubmit(data);
      } catch (error) {
        renderError(error, setError);
        toast.error('Failed to create curriculum detail');
      }
    },
    [createMultipleCurriculumDetail, controller, onSubmit, setError]
  );

  useEffect(() => {
    if (!controller.data) {
      return reset({
        curriculum_id: 0,
        year_order: 1,
        term_order: 1,
        term_alias: '',
        is_include_gwa: true,
        courses: [],
      });
    }
    reset({
      curriculum_id: controller.data.id || 0,
      year_order: 1,
      term_order: 1,
      term_alias: '',
      is_include_gwa: true,
      courses: [],
    });
  }, [controller.isOpen, controller.data, reset]);

  const yearOrderOptions = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        label: `Year ${i + 1}`,
        value: String(i + 1),
      })),
    []
  );

  const termOrderOptions = useMemo(() => {
    if (!controller.data) return [];
    const term = controller?.data.academic_term!;
    return Array.from({ length: term.number_of_terms }, (_, i) => ({
      label: `${term.suffix} ${i + 1}`,
      value: String(i + 1),
    }));
  }, [controller]);

  const handlePreviousPage = useCallback(() => {
    setCourseMeta((prev) => ({ ...prev, page: prev.page - 1 }));
  }, []);

  const handleNextPage = useCallback(() => {
    setCourseMeta((prev) => ({ ...prev, page: prev.page + 1 }));
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
  }, []);

  return (
    <Modal controller={controller} title="Create Curriculum Detail" size="half" closable>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 lg:border-r lg:pr-4">
          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-300 text-sm sm:text-base">
              Available Courses
            </Label>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Drag courses to add them
            </p>
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by code..."
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
              <div className="space-y-2">
                {courses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[200px] sm:h-[300px] lg:h-[350px] text-center px-4">
                    <Search className="h-10 w-10 sm:h-12 sm:w-12 text-slate-300 dark:text-slate-600 mb-2 sm:mb-3" />
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      No courses found
                    </p>
                    <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Try adjusting your search
                    </p>
                  </div>
                ) : (
                  courses.map((course: Course) => (
                    <DraggableCourse
                      key={course.id}
                      course={course}
                      isSelected={selectedCourses?.includes(course.id!)}
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
                disabled={courseMeta.page === 1}
                className="h-8 px-2 sm:px-3"
              >
                <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
              <span className="text-xs sm:text-sm text-muted-foreground">
                Page {courseMeta.page} of {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={courseMeta.page >= totalPages}
                className="h-8 px-2 sm:px-3"
              >
                <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-8">
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="year_order" className="text-sm">
                  Year Order
                </Label>
                <Select
                  options={yearOrderOptions}
                  placeholder="Select year order"
                  value={String(yearOrder)}
                  onValueChange={(value) => setValue('year_order', Number(value))}
                />
                {errors.year_order && (
                  <p className="text-xs sm:text-sm text-destructive">{errors.year_order.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="term_order" className="text-sm">
                  Term Order
                </Label>
                <Select
                  options={termOrderOptions}
                  placeholder="Select term order"
                  value={String(termOrder)}
                  onValueChange={(value) => setValue('term_order', Number(value))}
                />
                {errors.term_order && (
                  <p className="text-xs sm:text-sm text-destructive">{errors.term_order.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="term_alias" className="text-sm">
                Term Alias
              </Label>
              <Input
                id="term_alias"
                placeholder="Enter term alias"
                {...register('term_alias')}
                className="text-sm"
              />
              {errors.term_alias && (
                <p className="text-xs sm:text-sm text-destructive">{errors.term_alias.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="is_include_gwa"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id="is_include_gwa"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4"
                  />
                )}
              />
              <Label htmlFor="is_include_gwa" className="cursor-pointer text-sm">
                Include in GWA calculation
              </Label>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-300 text-sm">Selected Courses</Label>
              <DropZone onDrop={handleCourseDrop}>
                {selectedCourses?.length === 0 ? (
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center py-6 sm:py-8">
                    Drop courses here to add them
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {selectedCourseDetails.map((course) => (
                      <Badge
                        key={course.id}
                        className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-sm text-xs"
                      >
                        <span className="font-medium">{course.course_code}</span>
                        <button
                          type="button"
                          onClick={() => removeCourse(course.id!)}
                          className="ml-0.5 sm:ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </DropZone>
              <div className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                {selectedCourses?.length || 0} course(s) selected
              </div>
              {errors.courses && (
                <p className="text-xs sm:text-sm text-destructive">{errors.courses.message}</p>
              )}
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
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto text-sm">
                {isPending ? 'Saving...' : 'Create Detail'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}

export default function CurriculumDetailModal(props: CurriculumDetailModalProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <CurriculumDetailModalContent {...props} />
    </DndProvider>
  );
}
