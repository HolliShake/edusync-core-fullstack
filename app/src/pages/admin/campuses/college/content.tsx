import AcademicProgramModal from '@/components/campus/academic-program.modal';
import { useConfirm } from '@/components/confirm.provider';
import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollegeContext } from '@/context/college.content';
import { encryptIdForUrl } from '@/lib/hash';
import { useDeleteAcademicProgram, useGetAcademicProgramPaginated } from '@rest/api';
import type { AcademicProgram } from '@rest/models';
import {
  BookOpenIcon,
  BuildingIcon,
  CalendarIcon,
  EditIcon,
  EllipsisIcon,
  GraduationCapIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
} from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import CurriculumSheet, { useCurriculumSheetState } from './curriculum.sheet';

export default function AdminCollegeDetailContent(): React.ReactNode {
  const college = useCollegeContext();
  const [page, setPage] = useState(1);
  const [rows] = useState(10);
  const {
    data: academicPrograms,
    isLoading,
    refetch,
  } = useGetAcademicProgramPaginated(
    {
      page,
      rows,
      ['filter[college_id]']: college?.id,
      ['include']: 'programType',
    },
    {
      query: {
        enabled: !!college?.id,
      },
    }
  );

  const academicProgramItems = useMemo(
    () => academicPrograms?.data?.data ?? [],
    [academicPrograms]
  );

  const controller = useModal<AcademicProgram>();
  const sheet = useCurriculumSheetState();
  const { mutateAsync: deleteAcademicProgram } = useDeleteAcademicProgram();
  const confirm = useConfirm();
  const navigate = useNavigate();

  const handleDelete = async (program: AcademicProgram) => {
    try {
      await deleteAcademicProgram({ id: program.id as number });
      refetch();
      toast.success('Academic program deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete academic program');
    }
  };

  const handleEdit = (program: AcademicProgram) => {
    controller.openFn(program);
  };

  const handleView = (program: AcademicProgram) => {
    navigate(`?curriculum=${encryptIdForUrl(program.id as number)}`);
    sheet.openSheet(program);
  };

  if (!college) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
                <GraduationCapIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {college.college_name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  {college.college_shortname && (
                    <>
                      <Separator orientation="vertical" className="h-4" />
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Code:</span> {college.college_shortname}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800"
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
              Active College
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-primary/5 dark:hover:bg-primary/20"
            >
              <EditIcon className="h-4 w-4 mr-2" />
              Edit College
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-lg transition-all duration-200 dark:from-blue-900 dark:to-blue-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Total Buildings
                </p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-200">-</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Coming soon</p>
              </div>
              <div className="p-3 bg-blue-200/50 rounded-xl dark:bg-blue-900/30">
                <BuildingIcon className="h-8 w-8 text-blue-700 dark:text-blue-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-lg transition-all duration-200 dark:from-purple-900 dark:to-purple-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Total Students
                </p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-200">-</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Coming soon</p>
              </div>
              <div className="p-3 bg-purple-200/50 rounded-xl dark:bg-purple-900/30">
                <UsersIcon className="h-8 w-8 text-purple-700 dark:text-purple-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100/50 hover:shadow-lg transition-all duration-200 dark:from-green-900 dark:to-green-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Active Programs
                </p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-200">
                  {academicProgramItems.length}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {academicProgramItems.length === 1 ? 'program' : 'programs'} available
                </p>
              </div>
              <div className="p-3 bg-green-200/50 rounded-xl dark:bg-green-900/30">
                <BookOpenIcon className="h-8 w-8 text-green-700 dark:text-green-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100/50 hover:shadow-lg transition-all duration-200 dark:from-orange-900 dark:to-orange-800/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Established
                </p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-200">-</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">Coming soon</p>
              </div>
              <div className="p-3 bg-orange-200/50 rounded-xl dark:bg-orange-900/30">
                <CalendarIcon className="h-8 w-8 text-orange-700 dark:text-orange-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Academic Programs Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Academic Programs</h2>
            <p className="text-sm text-muted-foreground">
              Manage and organize academic programs offered by this college
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="whitespace-nowrap px-3 py-1">
              {academicProgramItems.length}{' '}
              {academicProgramItems.length === 1 ? 'program' : 'programs'}
            </Badge>
            <Button
              size="sm"
              onClick={() => controller.openFn()}
              className="bg-primary hover:bg-primary/90 shadow-sm"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Program
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : academicProgramItems.length > 0 ? (
          <Table<AcademicProgram>
            columns={
              [
                {
                  key: 'program_name',
                  title: 'Program Name',
                  className: 'font-medium',
                },
                {
                  key: 'short_name',
                  title: 'Short Name',
                  render: (value) =>
                    value ? (
                      <Badge variant="secondary" className="text-xs px-2 py-0.5">
                        {String(value)}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    ),
                },
                {
                  key: 'program_type.name',
                  title: 'Type',
                },
                {
                  key: 'year_first_implemented',
                  title: 'Established',
                  render: (value) =>
                    value ? (
                      new Date(String(value)).getFullYear()
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    ),
                  align: 'center',
                },
                {
                  key: '__actions__',
                  title: 'Actions',
                  render: (_v, row) => (
                    <Menu
                      items={[
                        {
                          label: 'Edit',
                          icon: <EditIcon className="w-4 h-4" />,
                          variant: 'default',
                          onClick: () => handleEdit(row),
                        },
                        {
                          label: 'Delete',
                          icon: <TrashIcon className="w-4 h-4" />,
                          variant: 'destructive',
                          onClick: () => confirm.confirm(async () => await handleDelete(row)),
                        },
                      ]}
                      trigger={
                        <Button variant="outline" size="icon">
                          <EllipsisIcon className="w-4 h-4" />
                        </Button>
                      }
                    />
                  ),
                  align: 'center',
                },
              ] as Array<TableColumn<AcademicProgram>>
            }
            rows={academicProgramItems}
            onClickRow={(row) => handleView(row)}
            pagination={{
              current_page: academicPrograms?.data?.current_page,
              last_page: academicPrograms?.data?.last_page,
              per_page: academicPrograms?.data?.per_page,
              total: academicPrograms?.data?.total,
              from: academicPrograms?.data?.from ?? 0,
              to: academicPrograms?.data?.to ?? 0,
            }}
            onPageChange={(p) => setPage(p)}
            showPagination
          />
        ) : (
          <Card className="border-2 border-dashed border-gray-200 bg-gray-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200/50 rounded-full mb-6 dark:from-zinc-800 dark:to-zinc-800/50">
                <GraduationCapIcon className="h-12 w-12 text-gray-400 dark:text-zinc-500" />
              </div>
              <CardTitle className="text-xl mb-3 text-gray-700 dark:text-zinc-200">
                No academic programs found
              </CardTitle>
              <CardDescription className="text-center max-w-md mb-8 text-gray-500 leading-relaxed dark:text-zinc-400">
                This college doesn't have any academic programs yet. Create your first program to
                get started with managing academic offerings.
              </CardDescription>
              <Button
                onClick={() => controller.openFn()}
                size="lg"
                className="bg-primary hover:bg-primary/90 shadow-md"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create First Program
              </Button>
            </CardContent>
          </Card>
        )}

        <AcademicProgramModal
          controller={controller}
          collegeId={college.id as number}
          onSubmit={() => {
            refetch();
          }}
        />

        <CurriculumSheet controller={sheet} />
      </div>
    </div>
  );
}
