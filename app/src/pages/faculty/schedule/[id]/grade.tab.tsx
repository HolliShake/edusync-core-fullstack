import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSectionTeacherContext } from '@/context/section-teacher.context';
import SectionGradeView from '@/views/shared/section-grade.view';
import type { Section } from '@rest/models';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react';
import React, { useMemo } from 'react';

export default function FacultyScheduleGradeTab(): React.ReactNode {
  const sectionTeacher = useSectionTeacherContext();

  const gradebook = useMemo(() => sectionTeacher?.section as Section | undefined, [sectionTeacher]);

  const isLoading = !sectionTeacher;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Posted Grades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-400 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending Grades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Missing Grades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Average Grade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>

          <Card className="border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20 dark:border-indigo-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        </div>

        {/* Table Skeleton */}
        <Card className="p-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <div className="overflow-x-auto max-w-full">
                <Table className="min-w-max w-full">
                  <TableHeader>
                    {/* Row 1: Grading Period Headers */}
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead
                        className="sticky left-0 z-20 bg-muted/50 font-semibold text-center text-foreground border-r border-border min-w-[150px]"
                        rowSpan={4}
                      >
                        Student Name
                      </TableHead>
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <TableHead
                          key={idx}
                          className="text-center font-semibold text-foreground bg-primary/10 border-r border-border whitespace-nowrap"
                          colSpan={2}
                        >
                          <Skeleton className="h-4 w-32 mx-auto" />
                        </TableHead>
                      ))}
                      <TableHead
                        className="text-center font-bold text-foreground bg-primary/10 border-r border-border whitespace-nowrap"
                        rowSpan={4}
                      >
                        <Skeleton className="h-4 w-24 mx-auto" />
                      </TableHead>
                    </TableRow>

                    {/* Row 2: Item Headers */}
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <TableHead
                          key={idx}
                          className="text-center font-semibold text-foreground bg-secondary/20 border-r border-border whitespace-nowrap"
                        >
                          <Skeleton className="h-4 w-24 mx-auto" />
                        </TableHead>
                      ))}
                    </TableRow>

                    {/* Row 3: Detail Headers */}
                    <TableRow className="bg-muted/20 hover:bg-muted/20">
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <TableHead
                          key={idx}
                          className="text-center font-semibold text-foreground bg-accent/10 border-r border-border min-w-[120px] whitespace-nowrap"
                        >
                          <Skeleton className="h-4 w-20 mx-auto" />
                        </TableHead>
                      ))}
                    </TableRow>

                    {/* Row 4: Weight and Max Score */}
                    <TableRow className="bg-muted/10 hover:bg-muted/10">
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <TableHead
                          key={idx}
                          className="text-center text-xs font-normal text-muted-foreground border-r border-border whitespace-nowrap"
                        >
                          <Skeleton className="h-3 w-24 mx-auto" />
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {Array.from({ length: 5 }).map((_, rowIdx) => (
                      <TableRow key={rowIdx} className="hover:bg-muted/30">
                        <TableCell className="sticky left-0 z-10 bg-background border-r border-border font-medium">
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        {Array.from({ length: 6 }).map((_, colIdx) => (
                          <TableCell key={colIdx} className="text-center border-r border-border">
                            <Skeleton className="h-8 w-16 mx-auto" />
                          </TableCell>
                        ))}
                        <TableCell className="text-center border-r border-border">
                          <Skeleton className="h-8 w-16 mx-auto" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!gradebook) {
    return (
      <>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <AlertCircle className="h-12 w-12 text-primary/60" />
            </div>
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              No Gradebook Configuration
            </h3>
            <p className="text-muted-foreground max-w-md mb-4">
              A gradebook hasn't been set up for this section yet. You'll need to configure a
              gradebook before you can create grading periods, items, and grade details.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 px-4 py-2 rounded-lg">
              <TrendingUp className="h-4 w-4" />
              <span>Please contact your administrator to initialize the gradebook</span>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return <SectionGradeView section={sectionTeacher?.section!} />;
}
