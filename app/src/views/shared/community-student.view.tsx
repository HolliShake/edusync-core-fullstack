import Select from '@/components/custom/select.component';
import type { TableColumn } from '@/components/custom/table.component';
import Table from '@/components/custom/table.component';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth.context';
import { UserRoleEnum } from '@/enums/role-enum';
import { useGetCurriculumTaggingPaginated } from '@rest/api';
import { UserRole, type CurriculumTagging } from '@rest/models';
import { Building2, GraduationCap, Mail, Search, User, Users } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';

export default function CommunityStudentView({ role }: { role: UserRole }): React.ReactNode {
  const { session } = useAuth();
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const { data: students, isLoading } = useGetCurriculumTaggingPaginated(
    {
      ...(role === UserRoleEnum.PROGRAM_CHAIR
        ? { 'filter[academic_program_id]': session?.active_academic_program ?? 0 }
        : role === UserRoleEnum.COLLEGE_DEAN
          ? { 'filter[college_id]': session?.active_college ?? 0 }
          : role === UserRoleEnum.CAMPUS_REGISTRAR
            ? { 'filter[campus_id]': session?.active_campus ?? 0 }
            : {}),
      ...(debouncedSearchTerm ? { 'filter[search]': debouncedSearchTerm } : {}),
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

  const columns = useMemo<TableColumn<CurriculumTagging>[]>(
    () => [
      {
        key: 'user.name',
        title: 'Student',
        render: (_, row) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
              <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm text-foreground">{row.user?.name || 'N/A'}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" />
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
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span className="font-medium text-sm text-foreground">
                  {program?.college?.college_name || 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2 pl-5">
                <GraduationCap className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                <span className="text-xs text-muted-foreground">
                  {program?.short_name || 'N/A'}
                </span>
              </div>
              <span className="text-xs text-muted-foreground pl-5">
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
            <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20 text-xs font-medium">
              Active
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="bg-slate-500/10 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400 border-slate-500/20 text-xs font-medium"
            >
              Inactive
            </Badge>
          ),
      },
    ],
    []
  );

  const tableItems = useMemo(() => students?.data?.data ?? [], [students]);
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
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-border/50">
              <CardHeader className="pb-2 pt-4 px-4">
                <Skeleton className="h-3 w-20 mb-1" />
                <Skeleton className="h-7 w-12" />
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="border-border/50">
          <CardHeader className="pb-3 pt-4 px-4">
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-3 w-48" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-56" />
                <Skeleton className="h-9 w-28" />
              </div>
              <div className="space-y-2">
                {[...Array(itemsPerPage)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 border rounded-lg border-border/50"
                  >
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-32 ml-auto" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-3 w-28" />
                <div className="flex gap-1">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Card className="border-border/50 hover:border-border transition-colors">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardDescription className="text-xs text-muted-foreground font-medium">
              Total Students
            </CardDescription>
            <CardTitle className="text-2xl font-bold bg-gradient-to-br from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              {totalStudents}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-border/50 hover:border-emerald-500/30 transition-colors">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardDescription className="text-xs text-muted-foreground font-medium">
              Active Students
            </CardDescription>
            <CardTitle className="text-2xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              {activeStudents}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-border/50 hover:border-slate-500/30 transition-colors">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardDescription className="text-xs text-muted-foreground font-medium">
              Inactive Students
            </CardDescription>
            <CardTitle className="text-2xl font-bold bg-gradient-to-br from-slate-600 to-slate-500 dark:from-slate-400 dark:to-slate-500 bg-clip-text text-transparent">
              {totalStudents - activeStudents}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3 pt-4 px-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base font-semibold text-foreground">
                  Student Directory
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                View and manage students in your program
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">Show:</span>
              <Select
                options={itemsPerPageOptions}
                value={String(itemsPerPage)}
                onValueChange={handleItemsPerPageChange}
                className="w-[140px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by student name, email, program, or college..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-9"
              />
            </div>
          </div>
          <Table
            columns={columns}
            rows={tableItems}
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
