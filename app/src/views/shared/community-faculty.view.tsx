import Select from '@/components/custom/select.component';
import type { TableColumn } from '@/components/custom/table.component';
import Table from '@/components/custom/table.component';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth.context';
import { UserRoleEnum } from '@/enums/role-enum';
import {
  useGetSchoolYearPaginated,
  useGetSectionTeachersByProgramIdGroupedByTeacherName,
} from '@rest/api';
import { UserRole, type SectionTeacher } from '@rest/models';
import { Building2, GraduationCap, Mail, Search, User, Users } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';

export default function CommunityFacultyView({ role }: { role: UserRole }): React.ReactNode {
  const { session } = useAuth();
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [_, setDebouncedSearchTerm] = useState('');
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const { data: schoolYears } = useGetSchoolYearPaginated(
    {
      sort: '-start_date',
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
    },
    { query: { enabled: !!session?.active_academic_program || !!session?.active_campus } }
  );

  const schoolYearOptions = useMemo(() => {
    return [
      ...(schoolYears?.data?.data?.map((schoolYear) => ({
        label: schoolYear.school_year_code ?? '',
        value: schoolYear.id?.toString() ?? '',
      })) ?? []),
    ];
  }, [schoolYears]);

  // Set default school year to the first item when data is loaded
  useEffect(() => {
    if (schoolYears?.data?.data && schoolYears.data.data.length > 0 && !selectedSchoolYear) {
      const firstSchoolYear = schoolYears.data.data[0];
      if (firstSchoolYear.id) {
        setSelectedSchoolYear(firstSchoolYear.id.toString());
      }
    }
  }, [schoolYears, selectedSchoolYear]);

  const statusOptions = useMemo(
    () => [
      { label: 'All Status', value: 'all' },
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
    []
  );

  const { data: programChairFacultyResponse, isLoading: isLoadingProgramChairFaculty } =
    useGetSectionTeachersByProgramIdGroupedByTeacherName(
      Number(session?.active_academic_program),
      {
        page,
        rows: itemsPerPage,
        'filter[school_year_id]': Number(selectedSchoolYear),
      },
      {
        query: {
          enabled:
            role === UserRoleEnum.PROGRAM_CHAIR &&
            !!selectedSchoolYear &&
            !!session?.active_academic_program,
        },
      }
    );

  const { data: campusRegistrarFacultyResponse, isLoading: isLoadingCampusRegistrarFaculty } =
    useGetSectionTeachersByProgramIdGroupedByTeacherName(
      Number(session?.active_academic_program),
      {
        page,
        rows: itemsPerPage,
        'filter[school_year_id]': Number(selectedSchoolYear),
      },
      {
        query: {
          enabled:
            role === UserRoleEnum.CAMPUS_REGISTRAR &&
            !!selectedSchoolYear &&
            !!session?.active_academic_program,
        },
      }
    );

  const facultyResponse = useMemo(() => {
    if (role === UserRoleEnum.PROGRAM_CHAIR) return programChairFacultyResponse;
    if (role === UserRoleEnum.CAMPUS_REGISTRAR) return campusRegistrarFacultyResponse;
    return undefined;
  }, [role, programChairFacultyResponse, campusRegistrarFacultyResponse]);

  const isLoading = useMemo(() => {
    if (role === UserRoleEnum.PROGRAM_CHAIR) return isLoadingProgramChairFaculty;
    if (role === UserRoleEnum.CAMPUS_REGISTRAR) return isLoadingCampusRegistrarFaculty;
    return false;
  }, [role, isLoadingProgramChairFaculty, isLoadingCampusRegistrarFaculty]);

  const itemsPerPageOptions = useMemo(
    () => [
      { label: '10 per page', value: '10' },
      { label: '20 per page', value: '20' },
      { label: '30 per page', value: '30' },
      { label: '50 per page', value: '50' },
    ],
    []
  );

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setPage(1); // Reset to first page when changing items per page
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleSchoolYearChange = (value: string) => {
    setSelectedSchoolYear(value);
    setPage(1); // Reset to first page when filtering
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1); // Reset to first page when filtering
  };

  const columns = useMemo<TableColumn<SectionTeacher>[]>(
    () => [
      {
        key: 'user.name',
        title: 'Faculty',
        render: (_, row) => (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
              <User className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-xs text-foreground">{row.user?.name || 'N/A'}</span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Mail className="h-2.5 w-2.5" />
                {row.user?.email || 'N/A'}
              </span>
            </div>
          </div>
        ),
      },
      {
        key: 'section.academic_program',
        title: 'College & Program',
        render: (_, row) => {
          const program = row.section?.curriculum_detail?.curriculum?.academic_program;
          return (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                <span className="font-medium text-xs text-foreground">
                  {program?.college?.college_name || 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 pl-4">
                <GraduationCap className="h-2.5 w-2.5 text-blue-600 dark:text-blue-400" />
                <span className="text-[10px] text-muted-foreground">
                  {program?.short_name || 'N/A'}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground pl-4">
                {program?.program_name || 'N/A'}
              </span>
            </div>
          );
        },
      },
      {
        key: 'sections',
        title: 'Sections',
        render: (_, row) => {
          // Get all sections for this faculty member from the grouped data
          const groupedData = facultyResponse?.data?.data;
          const facultyName = row.user?.name;
          const sections =
            facultyName && groupedData?.[facultyName]
              ? groupedData[facultyName]
                  .map((st) => ({
                    sectionName: st.section?.section_name,
                    courseTitle: st.section?.curriculum_detail?.course?.course_title,
                  }))
                  .filter((s) => s.sectionName || s.courseTitle)
              : [];

          // Group courses by section name
          const groupedSections = sections.reduce(
            (acc, section) => {
              const sectionName = section.sectionName || 'Unknown Section';
              if (!acc[sectionName]) {
                acc[sectionName] = [];
              }
              if (section.courseTitle) {
                acc[sectionName].push(section.courseTitle);
              }
              return acc;
            },
            {} as Record<string, string[]>
          );

          return (
            <div className="flex flex-col gap-2">
              {Object.keys(groupedSections).length > 0 ? (
                Object.entries(groupedSections).map(([sectionName, courses], index) => (
                  <div key={index} className="flex flex-col gap-1">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200/50 dark:border-indigo-800/50">
                      <div className="h-1 w-1 rounded-full bg-indigo-500" />
                      <span className="text-[10px] font-medium text-indigo-700 dark:text-indigo-300">
                        {sectionName}
                      </span>
                    </div>
                    {courses.length > 0 && (
                      <div className="flex flex-col gap-0.5 pl-4">
                        {courses.map((course, courseIndex) => (
                          <div key={courseIndex} className="flex items-center gap-1">
                            <span className="text-[10px] text-muted-foreground">-</span>
                            <span className="text-[10px] text-muted-foreground">{course}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-[10px] text-muted-foreground italic">
                  No sections assigned
                </span>
              )}
            </div>
          );
        },
      },
    ],
    [facultyResponse]
  );

  // Transform the grouped data structure into a flat array for the table
  const tableItems = useMemo(() => {
    const groupedData = facultyResponse?.data?.data;
    if (!groupedData || typeof groupedData !== 'object') return [];

    // Flatten the grouped structure: { "Teacher Name": [SectionTeacher[]] } -> SectionTeacher[]
    const flattenedItems: SectionTeacher[] = [];
    Object.values(groupedData).forEach((teacherSections) => {
      if (Array.isArray(teacherSections)) {
        // For each teacher, we'll just take the first section to represent them in the table
        // since we're showing faculty members, not individual section assignments
        if (teacherSections.length > 0) {
          flattenedItems.push(teacherSections[0]);
        }
      }
    });

    // Apply status filter on client side
    if (statusFilter === 'active') {
      return flattenedItems;
    }
    return flattenedItems;
  }, [facultyResponse, statusFilter]);

  const paginationMeta = useMemo(() => {
    return facultyResponse?.data;
  }, [facultyResponse]);

  const totalFaculties = useMemo(() => {
    // Count unique faculty members from the grouped data
    const groupedData = facultyResponse?.data?.data;
    if (!groupedData || typeof groupedData !== 'object') return 0;
    return Object.keys(groupedData).length;
  }, [facultyResponse]);

  const isInitialLoading = isLoading && !facultyResponse;

  if (isInitialLoading) {
    return (
      <div className="space-y-3">
        <div className="grid gap-2 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-border/50">
              <CardHeader className="pb-1.5 pt-2.5 px-3">
                <Skeleton className="h-2.5 w-16 mb-0.5" />
                <Skeleton className="h-6 w-10" />
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="border-border/50">
          <CardHeader className="pb-2 pt-2.5 px-3">
            <Skeleton className="h-4 w-28 mb-0.5" />
            <Skeleton className="h-2.5 w-40" />
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 w-24" />
              </div>
              <div className="space-y-1.5">
                {[...Array(itemsPerPage)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 border rounded-lg border-border/50"
                  >
                    <Skeleton className="h-7 w-7 rounded-full" />
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3.5 w-28 ml-auto" />
                    <Skeleton className="h-4 w-12 rounded-full" />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-1">
                <Skeleton className="h-2.5 w-24" />
                <div className="flex gap-1">
                  <Skeleton className="h-7 w-7" />
                  <Skeleton className="h-7 w-7" />
                  <Skeleton className="h-7 w-7" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2 md:grid-cols-3">
        <Card className="border-border/50 hover:border-border transition-colors">
          <CardHeader className="pb-1.5 pt-2.5 px-3">
            <CardDescription className="text-[10px] text-muted-foreground font-medium">
              Total Faculties
            </CardDescription>
            <CardTitle className="text-xl font-bold bg-gradient-to-br from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              {totalFaculties}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-border/50 hover:border-emerald-500/30 transition-colors">
          <CardHeader className="pb-1.5 pt-2.5 px-3">
            <CardDescription className="text-[10px] text-muted-foreground font-medium">
              Active Faculties
            </CardDescription>
            <CardTitle className="text-xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              {totalFaculties}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-border/50 hover:border-slate-500/30 transition-colors">
          <CardHeader className="pb-1.5 pt-2.5 px-3">
            <CardDescription className="text-[10px] text-muted-foreground font-medium">
              Inactive Faculties
            </CardDescription>
            <CardTitle className="text-xl font-bold bg-gradient-to-br from-slate-600 to-slate-500 dark:from-slate-400 dark:to-slate-500 bg-clip-text text-transparent">
              0
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-2 pt-2.5 px-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold text-foreground">
                  Faculty Directory
                </CardTitle>
              </div>
              <CardDescription className="text-[10px] text-muted-foreground mt-0.5">
                View and manage faculties in your program
              </CardDescription>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground font-medium">Show:</span>
              <Select
                options={itemsPerPageOptions}
                value={String(itemsPerPage)}
                onValueChange={handleItemsPerPageChange}
                className="w-[120px] h-8 text-xs"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="mb-3 space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by faculty name, email, program, or college..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-8 h-8 text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select
                options={schoolYearOptions}
                value={selectedSchoolYear}
                onValueChange={handleSchoolYearChange}
                className="flex-1 h-8 text-xs"
                placeholder="Filter by School Year"
              />
              <Select
                options={statusOptions}
                value={statusFilter}
                onValueChange={handleStatusFilterChange}
                className="flex-1 h-8 text-xs"
                placeholder="Filter by Status"
              />
            </div>
          </div>
          <Table
            columns={columns}
            rows={tableItems as SectionTeacher[]}
            itemsPerPage={itemsPerPage}
            pagination={paginationMeta}
            showPagination={true}
            onPageChange={setPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
