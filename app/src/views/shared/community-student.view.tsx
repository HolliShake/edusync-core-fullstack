/**
 * CommunityStudentView Component
 *
 * A comprehensive student directory interface for viewing and managing students within a program or campus.
 * This component provides functionality for:
 * - Viewing student information including personal details, program, and enrollment status
 * - Filtering students by school year and enrollment status
 * - Searching students by name, email, program, or college
 * - Paginating through student records
 * - Displaying student statistics and enrollment information
 *
 * The component supports different user roles:
 * - Program Chair: Views students within their specific academic program
 * - Campus Registrar: Views students across the entire campus
 *
 * Student information displayed includes:
 * - Student name and email
 * - Academic program and college
 * - Year level and enrollment status
 * - School year information
 *
 * @param {Object} props - Component props
 * @param {UserRoleEnum} props.role - The user role determining the scope of student data (program or campus level)
 */

import Select from '@/components/custom/select.component';
import type { TableColumn } from '@/components/custom/table.component';
import Table from '@/components/custom/table.component';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth.context';
import { useGetCurriculumTaggingPaginated, useGetSchoolYearPaginated } from '@rest/api';
import { UserRoleEnum, type CurriculumTagging } from '@rest/models';
import { Building2, GraduationCap, Mail, Search, User, Users } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';

export default function CommunityStudentView({ role }: { role: UserRoleEnum }): React.ReactNode {
  const { session } = useAuth();
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
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
      page,
      rows: Number.MAX_SAFE_INTEGER,
    },
    { query: { enabled: !!session?.active_academic_program } }
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

  const { data: students, isLoading } = useGetCurriculumTaggingPaginated(
    {
      ...(role === UserRoleEnum.program_chair
        ? { 'filter[academic_program_id]': session?.active_academic_program ?? 0 }
        : role === UserRoleEnum.college_dean
          ? { 'filter[college_id]': session?.active_college ?? 0 }
          : role === UserRoleEnum.campus_registrar
            ? { 'filter[campus_id]': session?.active_campus ?? 0 }
            : {}),
      ...(debouncedSearchTerm ? { 'filter[search]': debouncedSearchTerm } : {}),
      ...(selectedSchoolYear ? { 'filter[school_year_id]': selectedSchoolYear } : {}),
      page,
      rows: itemsPerPage,
    },
    { query: { enabled: !!role && !!session?.active_academic_program } }
  );

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

  const columns = useMemo<TableColumn<CurriculumTagging>[]>(
    () => [
      {
        key: 'user.name',
        title: 'Student',
        render: (_, row) => (
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
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
        key: 'curriculum.academic_program',
        title: 'College & Program',
        render: (_, row) => {
          const program = row.curriculum?.academic_program;
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
        key: 'is_active',
        title: 'Status',
        render: (_, row) =>
          row.is_active ? (
            <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-medium px-1.5 py-0">
              Active
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="bg-slate-500/10 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400 border-slate-500/20 text-[10px] font-medium px-1.5 py-0"
            >
              Inactive
            </Badge>
          ),
      },
    ],
    []
  );

  const tableItems = useMemo(() => {
    const items = students?.data?.data ?? [];

    // Apply status filter on client side
    if (statusFilter === 'active') {
      return items.filter((student) => student.is_active);
    }
    if (statusFilter === 'inactive') {
      return items.filter((student) => !student.is_active);
    }

    return items;
  }, [students, statusFilter]);

  const paginationMeta = useMemo(() => {
    return students?.data;
  }, [students]);

  const totalStudents = useMemo(() => paginationMeta?.total ?? 0, [paginationMeta]);
  const activeStudents = useMemo(
    () => tableItems.filter((student) => student.is_active).length,
    [tableItems]
  );

  const isInitialLoading = isLoading && !students;

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
              Total Students
            </CardDescription>
            <CardTitle className="text-xl font-bold bg-gradient-to-br from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              {totalStudents}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-border/50 hover:border-emerald-500/30 transition-colors">
          <CardHeader className="pb-1.5 pt-2.5 px-3">
            <CardDescription className="text-[10px] text-muted-foreground font-medium">
              Active Students
            </CardDescription>
            <CardTitle className="text-xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              {activeStudents}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-border/50 hover:border-slate-500/30 transition-colors">
          <CardHeader className="pb-1.5 pt-2.5 px-3">
            <CardDescription className="text-[10px] text-muted-foreground font-medium">
              Inactive Students
            </CardDescription>
            <CardTitle className="text-xl font-bold bg-gradient-to-br from-slate-600 to-slate-500 dark:from-slate-400 dark:to-slate-500 bg-clip-text text-transparent">
              {totalStudents - activeStudents}
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
                  Student Directory
                </CardTitle>
              </div>
              <CardDescription className="text-[10px] text-muted-foreground mt-0.5">
                View and manage students in your program
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
                placeholder="Search by student name, email, program, or college..."
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
        </CardContent>
      </Card>

      <Table
        columns={columns}
        rows={tableItems}
        itemsPerPage={itemsPerPage}
        pagination={paginationMeta}
        showPagination={true}
        onPageChange={setPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
}
