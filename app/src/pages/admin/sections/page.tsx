import { useConfirm } from '@/components/confirm.provider';
import { useModal } from '@/components/custom/modal.component';
import CustomSelect from '@/components/custom/select.component';
import TitledPage from '@/components/pages/titled.page';
import SectionModal from '@/components/section/section.modal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useDeleteSection,
  useDeleteSectionBySectionCode,
  useGenerateSections,
  useGetAcademicProgramPaginated,
  useGetCampusPaginated,
  useGetCollegePaginated,
  useGetCurriculumPaginated,
  useGetSectionPaginated,
} from '@rest/api';
import type { Section } from '@rest/models/section';
import {
  BookOpenIcon,
  EditIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  UsersIcon,
  XIcon,
} from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const STORAGE_KEY = 'admin-sections-filters';

interface StoredFilters {
  selectedCampus: number;
  selectedCollege: number;
  selectedProgram: number;
  selectedCurriculum: number;
  selectedYear: number;
  selectedTerm: number;
  query: string;
  sort: 'name-asc' | 'name-desc' | 'ref-asc' | 'ref-desc';
}

export default function AdminSections(): React.ReactNode {
  const controller = useModal<Section>();

  // Load initial state from localStorage
  const [filters, setFilters] = useState<Omit<StoredFilters, 'query' | 'sort'>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredFilters;
        return {
          selectedCampus: parsed.selectedCampus ?? 0,
          selectedCollege: parsed.selectedCollege ?? 0,
          selectedProgram: parsed.selectedProgram ?? 0,
          selectedCurriculum: parsed.selectedCurriculum ?? 0,
          selectedYear: parsed.selectedYear ?? 0,
          selectedTerm: parsed.selectedTerm ?? 0,
        };
      }
    } catch (error) {
      console.error('Failed to load filters from localStorage:', error);
    }
    return {
      selectedCampus: 0,
      selectedCollege: 0,
      selectedProgram: 0,
      selectedCurriculum: 0,
      selectedYear: 0,
      selectedTerm: 0,
    };
  });

  const [query, setQuery] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredFilters;
        return parsed.query ?? '';
      }
    } catch (error) {
      console.error('Failed to load query from localStorage:', error);
    }
    return '';
  });

  const [sort, setSort] = useState<'name-asc' | 'name-desc' | 'ref-asc' | 'ref-desc'>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredFilters;
        return parsed.sort ?? 'name-asc';
      }
    } catch (error) {
      console.error('Failed to load sort from localStorage:', error);
    }
    return 'name-asc';
  });

  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [numberOfSchedules, setNumberOfSchedules] = useState<{ [key: string]: string }>({});
  const [autoPost, setAutoPost] = useState<{ [key: string]: boolean }>({});

  const { mutateAsync: generateScection, isPending: isGeneratingSections } = useGenerateSections();

  const { mutateAsync: deleteSectionBySectionCode } = useDeleteSectionBySectionCode();

  // Persist filters to localStorage whenever they change
  useEffect(() => {
    try {
      const toStore: StoredFilters = {
        ...filters,
        query,
        sort,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (error) {
      console.error('Failed to save filters to localStorage:', error);
    }
  }, [filters, query, sort]);

  const { data: campusesResponse } = useGetCampusPaginated({
    page: 1,
    rows: Number.MAX_SAFE_INTEGER,
  });

  const { data: collegesResponse } = useGetCollegePaginated(
    {
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
      'filter[campus_id]': filters.selectedCampus,
    },
    { query: { enabled: !!filters.selectedCampus } }
  );

  const { data: programsResponse } = useGetAcademicProgramPaginated(
    {
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
      'filter[college_id]': filters.selectedCollege,
    },
    { query: { enabled: !!filters.selectedCollege } }
  );

  const { data: curriculumsResponse } = useGetCurriculumPaginated(
    {
      paginate: true,
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
      'filter[academic_program_id]': filters.selectedProgram,
    },
    { query: { enabled: !!filters.selectedProgram } }
  );

  const {
    data: sectionsResponse,
    isLoading,
    refetch,
  } = useGetSectionPaginated(
    {
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
      'filter[curriculum_id]': filters.selectedCurriculum,
    },
    { query: { enabled: !!filters.selectedCurriculum } }
  );

  const campuses = useMemo(() => campusesResponse?.data?.data ?? [], [campusesResponse]);

  const colleges = useMemo(() => collegesResponse?.data?.data ?? [], [collegesResponse]);

  const programs = useMemo(() => programsResponse?.data?.data ?? [], [programsResponse]);

  const curriculums = useMemo(() => curriculumsResponse?.data?.data ?? [], [curriculumsResponse]);

  const sectionItems = useMemo(() => sectionsResponse?.data?.data ?? [], [sectionsResponse]);

  // Extract unique years and terms from sections
  const availableYears = useMemo(() => {
    const yearsMap = new Map<number, string>();
    sectionItems.forEach((section) => {
      const yearOrder = section.curriculum_detail?.year_order;
      const yearLabel = section.curriculum_detail?.year_label;
      if (yearOrder !== undefined && yearLabel) {
        yearsMap.set(yearOrder, yearLabel);
      }
    });
    return Array.from(yearsMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([order, label]) => ({ order, label }));
  }, [sectionItems]);

  const availableTerms = useMemo(() => {
    const termsMap = new Map<number, string>();
    sectionItems.forEach((section) => {
      const termOrder = section.curriculum_detail?.term_order;
      const termLabel = section.curriculum_detail?.term_label;
      if (termOrder !== undefined && termLabel) {
        termsMap.set(termOrder, termLabel);
      }
    });
    return Array.from(termsMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([order, label]) => ({ order, label }));
  }, [sectionItems]);

  // Auto-select first campus when campuses are loaded and no campus is selected
  useEffect(() => {
    if (campuses.length > 0 && filters.selectedCampus === 0) {
      const firstCampusId = campuses[0]?.id;
      if (firstCampusId) {
        setFilters((prev) => ({ ...prev, selectedCampus: firstCampusId }));
      }
    }
  }, [campuses, filters.selectedCampus]);

  // Auto-select first college when colleges are loaded and no college is selected
  useEffect(() => {
    if (colleges.length > 0 && filters.selectedCollege === 0 && filters.selectedCampus !== 0) {
      const firstCollegeId = colleges[0]?.id;
      if (firstCollegeId) {
        setFilters((prev) => ({ ...prev, selectedCollege: firstCollegeId }));
      }
    }
  }, [colleges, filters.selectedCollege, filters.selectedCampus]);

  // Auto-select first program when programs are loaded and no program is selected
  useEffect(() => {
    if (programs.length > 0 && filters.selectedProgram === 0 && filters.selectedCollege !== 0) {
      const firstProgramId = programs[0]?.id;
      if (firstProgramId) {
        setFilters((prev) => ({ ...prev, selectedProgram: firstProgramId }));
      }
    }
  }, [programs, filters.selectedProgram, filters.selectedCollege]);

  // Auto-select first curriculum when curriculums are loaded and no curriculum is selected
  useEffect(() => {
    if (
      curriculums.length > 0 &&
      filters.selectedCurriculum === 0 &&
      filters.selectedProgram !== 0
    ) {
      const firstCurriculumId = curriculums[0]?.id;
      if (firstCurriculumId) {
        setFilters((prev) => ({ ...prev, selectedCurriculum: firstCurriculumId }));
      }
    }
  }, [curriculums, filters.selectedCurriculum, filters.selectedProgram]);

  // Auto-select first year when years are loaded and no year is selected
  useEffect(() => {
    if (availableYears.length > 0 && filters.selectedYear === 0) {
      const firstYearOrder = availableYears[0]?.order;
      if (firstYearOrder !== undefined) {
        setFilters((prev) => ({ ...prev, selectedYear: firstYearOrder }));
      }
    }
  }, [availableYears, filters.selectedYear]);

  // Auto-select first term when terms are loaded and no term is selected
  useEffect(() => {
    if (availableTerms.length > 0 && filters.selectedTerm === 0) {
      const firstTermOrder = availableTerms[0]?.order;
      if (firstTermOrder !== undefined) {
        setFilters((prev) => ({ ...prev, selectedTerm: firstTermOrder }));
      }
    }
  }, [availableTerms, filters.selectedTerm]);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let filtered = sectionItems;

    // Filter by search query
    if (normalizedQuery) {
      filtered = filtered.filter(
        (item: Section) =>
          (item.section_name ?? '').toLowerCase().includes(normalizedQuery) ||
          (item.section_ref ?? '').toLowerCase().includes(normalizedQuery)
      );
    }

    // Filter by year
    if (filters.selectedYear !== 0) {
      filtered = filtered.filter(
        (item: Section) => item.curriculum_detail?.year_order === filters.selectedYear
      );
    }

    // Filter by term
    if (filters.selectedTerm !== 0) {
      filtered = filtered.filter(
        (item: Section) => item.curriculum_detail?.term_order === filters.selectedTerm
      );
    }

    const collator = new Intl.Collator(undefined, { sensitivity: 'base' });
    const sorted = [...filtered].sort((a: Section, b: Section) => {
      switch (sort) {
        case 'name-desc':
          return collator.compare(b.section_name ?? '', a.section_name ?? '');
        case 'ref-asc':
          return collator.compare(a.section_ref ?? '', b.section_ref ?? '');
        case 'ref-desc':
          return collator.compare(b.section_ref ?? '', a.section_ref ?? '');
        case 'name-asc':
        default:
          return collator.compare(a.section_name ?? '', b.section_name ?? '');
      }
    });

    return sorted;
  }, [sectionItems, query, sort, filters.selectedYear, filters.selectedTerm]);

  const groupedSections = useMemo(() => {
    const groups = new Map<string, Section[]>();

    visibleItems.forEach((section) => {
      const sectionName = section.section_name ?? 'Unnamed Section';
      if (!groups.has(sectionName)) {
        groups.set(sectionName, []);
      }
      groups.get(sectionName)?.push(section);
    });

    return Array.from(groups.entries()).map(([name, items]) => ({
      name,
      items,
    }));
  }, [visibleItems]);

  const { mutateAsync: deleteSection } = useDeleteSection();

  const confirm = useConfirm();

  const getSectionCode = useCallback(
    (section_name: string) => {
      return (
        sectionsResponse?.data?.data?.find(
          (section: Section) => section.section_name === section_name
        )?.section_code ?? ''
      );
    },
    [sectionItems]
  );

  const handleDelete = useCallback(
    async (section: Section) => {
      confirm.confirm(async () => {
        try {
          await deleteSection({ id: section.id as number });
          toast.success('Section deleted');
          refetch();
        } catch (error) {
          console.error(error);
          toast.error('Failed to delete section');
        }
      });
    },
    [confirm, deleteSection, refetch]
  );

  const handleDeleteBySectionCode = useCallback(
    async (sectionCode: string, event: React.MouseEvent) => {
      event.stopPropagation();
      confirm.confirm(async () => {
        try {
          await deleteSectionBySectionCode({ sectionCode });
          toast.success('All sections with this code deleted');
          refetch();
        } catch (error) {
          console.error(error);
          toast.error('Failed to delete sections');
        }
      });
    },
    [confirm, deleteSectionBySectionCode, refetch]
  );

  const handleFilterChange = useCallback((key: keyof typeof filters, value: number) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };

      // Reset dependent filters
      if (key == 'selectedCampus') {
        newFilters.selectedCollege = 0;
        newFilters.selectedProgram = 0;
        newFilters.selectedCurriculum = 0;
      } else if (key == 'selectedCollege') {
        newFilters.selectedProgram = 0;
        newFilters.selectedCurriculum = 0;
      } else if (key == 'selectedProgram') {
        newFilters.selectedCurriculum = 0;
      }

      return newFilters;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      selectedCampus: 0,
      selectedCollege: 0,
      selectedProgram: 0,
      selectedCurriculum: 0,
      selectedYear: 0,
      selectedTerm: 0,
    });
    setQuery('');
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some((value) => value !== 0) || query.trim() !== '';
  }, [filters, query]);

  const sortOptions = [
    { label: 'Name (A–Z)', value: 'name-asc' },
    { label: 'Name (Z–A)', value: 'name-desc' },
    { label: 'Ref (A–Z)', value: 'ref-asc' },
    { label: 'Ref (Z–A)', value: 'ref-desc' },
  ];

  const handleEditSection = useCallback(
    (section: Section) => {
      controller.openFn(section);
    },
    [controller]
  );

  const handleAddSection = useCallback(() => {
    const popoverKey = `${filters.selectedYear}-${filters.selectedTerm}`;
    setOpenPopover(popoverKey);
  }, [filters.selectedYear, filters.selectedTerm]);

  const handleGenerateSchedule = useCallback(
    async (year: number, term: number) => {
      const key = `${year}-${term}`;
      const numSchedules = parseInt(numberOfSchedules[key] || '1', 10);

      if (isNaN(numSchedules) || numSchedules < 1) {
        toast.error('Please enter a valid number of schedules');
        return;
      }

      // TODO: Implement schedule generation logic
      try {
        await generateScection({
          data: {
            year_order: year,
            term_order: year,
            number_of_section: numSchedules,
            auto_post: autoPost[key] || false,
            curriculum_id: filters.selectedCurriculum,
          },
        });
        refetch();
        toast.success('Sections generated successfully');
      } catch (err) {
        console.error(err);
        toast.error('Failed to generate sections');
      }

      setOpenPopover(null);
      setNumberOfSchedules((prev) => ({ ...prev, [key]: '' }));
      setAutoPost((prev) => ({ ...prev, [key]: false }));
    },
    [numberOfSchedules, autoPost, filters.selectedCurriculum, generateScection, refetch]
  );

  const handleInputChange = useCallback((year: number, term: number, value: string) => {
    const key = `${year}-${term}`;
    setNumberOfSchedules((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleAutoPostChange = useCallback((year: number, term: number, checked: boolean) => {
    const key = `${year}-${term}`;
    setAutoPost((prev) => ({ ...prev, [key]: checked }));
  }, []);

  const handleSubmitSection = useCallback(async () => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <TitledPage title="Sections" description="Manage your sections">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-6 w-48 mb-3" />
              <Card className="p-3 shadow-sm">
                <Skeleton className="h-16 w-full" />
              </Card>
            </div>
          ))}
        </div>
      </TitledPage>
    );
  }

  const popoverKey = `${filters.selectedYear}-${filters.selectedTerm}`;

  return (
    <TitledPage title="Sections" description="Manage your sections">
      <div className="flex flex-col gap-4 mb-6">
        {/* Filters */}
        <Card className="p-4 shadow-sm">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Filters</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
                  <XIcon className="h-3 w-3 mr-1" />
                  Clear all
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="campus-select" className="text-xs font-medium">
                  Campus
                </Label>
                <CustomSelect
                  options={campuses.map((campus) => ({
                    label: campus.name ?? 'Unknown',
                    value: campus.id?.toString() ?? '',
                  }))}
                  value={`${filters.selectedCampus}`}
                  onValueChange={(value) => handleFilterChange('selectedCampus', Number(value))}
                  placeholder="Select Campus"
                  className="w-full"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="college-select" className="text-xs font-medium">
                  College
                </Label>
                <CustomSelect
                  options={colleges.map((college) => ({
                    label: college.college_name ?? 'Unknown',
                    value: college.id?.toString() ?? '',
                  }))}
                  value={`${filters.selectedCollege}`}
                  onValueChange={(value) => handleFilterChange('selectedCollege', Number(value))}
                  placeholder="Select College"
                  className="w-full"
                  disabled={!filters.selectedCampus}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="program-select" className="text-xs font-medium">
                  Program
                </Label>
                <CustomSelect
                  options={programs.map((program) => ({
                    label: program.program_name ?? 'Unknown',
                    value: program.id?.toString() ?? '',
                  }))}
                  value={`${filters.selectedProgram}`}
                  onValueChange={(value) => handleFilterChange('selectedProgram', Number(value))}
                  placeholder="Select Program"
                  className="w-full"
                  disabled={!filters.selectedCollege}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="curriculum-select" className="text-xs font-medium">
                  Curriculum
                </Label>
                <CustomSelect
                  options={curriculums.map((curriculum) => ({
                    label: curriculum.curriculum_name ?? 'Unknown',
                    value: curriculum.id?.toString() ?? '',
                  }))}
                  value={`${filters.selectedCurriculum}`}
                  onValueChange={(value) => handleFilterChange('selectedCurriculum', Number(value))}
                  placeholder="Select Curriculum"
                  className="w-full"
                  disabled={!filters.selectedProgram}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="year-select" className="text-xs font-medium">
                  Year
                </Label>
                <CustomSelect
                  options={availableYears.map((year) => ({
                    label: year.label,
                    value: year.order.toString(),
                  }))}
                  value={`${filters.selectedYear}`}
                  onValueChange={(value) => handleFilterChange('selectedYear', Number(value))}
                  placeholder="Select Year"
                  className="w-full"
                  disabled={!filters.selectedCurriculum}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="term-select" className="text-xs font-medium">
                  Term
                </Label>
                <CustomSelect
                  options={availableTerms.map((term) => ({
                    label: term.label,
                    value: term.order.toString(),
                  }))}
                  value={`${filters.selectedTerm}`}
                  onValueChange={(value) => handleFilterChange('selectedTerm', Number(value))}
                  placeholder="Select Term"
                  className="w-full"
                  disabled={!filters.selectedCurriculum}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Badge
              variant="secondary"
              className="whitespace-nowrap px-3 py-1.5 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-800"
            >
              <span className="text-blue-700 dark:text-blue-300 font-semibold">
                {visibleItems.length} {visibleItems.length == 1 ? 'section' : 'sections'}
              </span>
            </Badge>
            <span className="text-sm text-muted-foreground">of {sectionItems.length} total</span>
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sections..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 w-full shadow-sm"
              />
            </div>
            <CustomSelect
              options={sortOptions}
              value={sort}
              onValueChange={(value) => setSort(value as typeof sort)}
              placeholder="Sort by"
              className="w-[180px] shadow-sm"
            />
            <Popover
              open={openPopover === popoverKey}
              onOpenChange={(open) => setOpenPopover(open ? popoverKey : null)}
            >
              <PopoverTrigger asChild>
                <Button
                  onClick={handleAddSection}
                  className="whitespace-nowrap shadow-sm"
                  disabled={!filters.selectedCurriculum}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Generate Sections</h4>
                    <p className="text-xs text-muted-foreground">
                      Configure section generation settings
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`schedules-${popoverKey}`} className="text-xs">
                      Number of Sections
                    </Label>
                    <Input
                      id={`schedules-${popoverKey}`}
                      type="number"
                      min="1"
                      placeholder="Enter number"
                      value={numberOfSchedules[popoverKey] || ''}
                      onChange={(e) =>
                        handleInputChange(
                          filters.selectedYear,
                          filters.selectedTerm,
                          e.target.value
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleGenerateSchedule(filters.selectedYear, filters.selectedTerm);
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`auto-post-${popoverKey}`}
                      checked={autoPost[popoverKey] || false}
                      onCheckedChange={(checked) =>
                        handleAutoPostChange(
                          filters.selectedYear,
                          filters.selectedTerm,
                          checked as boolean
                        )
                      }
                    />
                    <Label
                      htmlFor={`auto-post-${popoverKey}`}
                      className="text-xs font-normal cursor-pointer"
                    >
                      Auto-post generated sections
                    </Label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => setOpenPopover(null)}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        handleGenerateSchedule(filters.selectedYear, filters.selectedTerm)
                      }
                      disabled={isGeneratingSections}
                    >
                      {isGeneratingSections ? 'Generating...' : 'Generate'}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {!filters.selectedCurriculum ? (
          <Card className="p-12 text-center shadow-sm bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700">
            <div className="flex flex-col items-center gap-3">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                <SearchIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-muted-foreground text-lg">Select a curriculum to view sections</p>
              <p className="text-sm text-muted-foreground">
                Use the filters above to narrow down your search
              </p>
            </div>
          </Card>
        ) : groupedSections.length == 0 ? (
          <Card className="p-12 text-center shadow-sm bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700">
            <div className="flex flex-col items-center gap-3">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                <SearchIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-muted-foreground text-lg">No sections found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          </Card>
        ) : (
          <Accordion type="multiple" className="w-full space-y-3">
            {groupedSections.map((group) => (
              <AccordionItem
                key={group.name}
                value={group.name}
                className="border rounded-lg bg-card shadow-sm overflow-hidden"
              >
                <AccordionTrigger className="px-5 py-3 hover:no-underline hover:bg-accent/50 transition-colors [&[data-state=open]]:bg-gradient-to-br [&[data-state=open]]:from-blue-50 [&[data-state=open]]:to-indigo-100 dark:[&[data-state=open]]:from-blue-900/20 dark:[&[data-state=open]]:to-indigo-900/20">
                  <div className="flex items-center justify-between w-full pr-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                        {group.name}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="font-medium bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-200 dark:border-purple-800"
                      >
                        <span className="text-purple-700 dark:text-purple-300">
                          {group.items.length}
                        </span>
                      </Badge>
                    </div>
                    <div
                      onClick={(e) => handleDeleteBySectionCode(getSectionCode(group.name), e)}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive rounded-md flex items-center justify-center cursor-pointer"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-3 bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-800/50">
                  <ul className="space-y-2 pt-2">
                    {group.items.map((section) => (
                      <li
                        key={section.id}
                        className="flex items-start gap-3 p-3 rounded-lg border bg-background hover:bg-accent/30 transition-all shadow-sm hover:shadow-md"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h4 className="font-semibold text-sm">{section.section_ref}</h4>
                            {section.is_posted && (
                              <Badge
                                variant="default"
                                className="text-xs px-1.5 py-0 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-emerald-900/30 border-emerald-200 dark:border-emerald-800"
                              >
                                <span className="text-emerald-700 dark:text-emerald-300">
                                  Posted
                                </span>
                              </Badge>
                            )}
                          </div>
                          {section.curriculum_detail?.course && (
                            <div className="flex items-start gap-2 mb-2">
                              <BookOpenIcon className="h-3.5 w-3.5 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground leading-tight">
                                  {section.curriculum_detail.course.course_code} -{' '}
                                  {section.curriculum_detail.course.course_title}
                                </p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                  <span>{section.curriculum_detail.year_label}</span>
                                  <span>•</span>
                                  <span>{section.curriculum_detail.term_label}</span>
                                  <span>•</span>
                                  <span>{section.curriculum_detail.course.credit_units} units</span>
                                  {section.curriculum_detail.course.with_laboratory && (
                                    <>
                                      <span>•</span>
                                      <span className="text-blue-600 dark:text-blue-400">
                                        with lab
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <UsersIcon className="h-3 w-3" />
                              {section.min_students ?? 'N/A'} - {section.max_students ?? 'N/A'}{' '}
                              students
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditSection(section)}
                            className="h-8 w-8 p-0 hover:bg-primary/10"
                          >
                            <EditIcon className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(section)}
                            className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive"
                          >
                            <TrashIcon className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      <SectionModal controller={controller} onSubmit={handleSubmitSection} />
    </TitledPage>
  );
}
