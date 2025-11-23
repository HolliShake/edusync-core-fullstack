import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, FileText, TrendingUp } from 'lucide-react';
import type React from 'react';
import { useMemo } from 'react';

import { useSectionTeacherContext } from '@/context/section-teacher.context';
import GradeBookView from '@/views/shared/gradebook.view';
import type { GradeBook } from '@rest/models/gradeBook';

export default function FacultyScheduleGradebookSetupTab(): React.ReactNode {
  const sectionTeacher = useSectionTeacherContext();

  const gradebook = useMemo(
    () => sectionTeacher?.section?.grade_book as GradeBook | undefined,
    [sectionTeacher]
  );

  const isLoading = !sectionTeacher;

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Enhanced Summary Card Skeleton */}
        <Card className="border-2 shadow-xl overflow-hidden">
          <CardHeader className="bg-muted/50 pb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-7 w-32 ml-auto rounded-full" />
            </div>
            <Skeleton className="h-5 w-96 mt-2" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="relative overflow-hidden">
                  <div className="relative space-y-2 p-6 rounded-2xl border-2 bg-background shadow-lg">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-5 w-5 rounded" />
                    </div>
                    <Skeleton className="h-10 w-16" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Grading Periods Section Skeleton */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-48 rounded-lg" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card
                key={i}
                className="rounded-2xl shadow-lg border-2 bg-background overflow-hidden"
              >
                <div className="px-6 py-5 bg-muted/80 min-h-[72px]">
                  <div className="flex flex-1 items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-xl" />
                      <div className="flex flex-col gap-2 items-start">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-5 w-40" />
                          <Skeleton className="h-5 w-16 rounded-full" />
                          <Skeleton className="h-5 w-24 rounded-full" />
                        </div>
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-9 w-24 rounded-xl" />
                      <Skeleton className="h-9 w-9 rounded-xl" />
                    </div>
                  </div>
                </div>
                <CardContent className="pb-8 pt-6 px-6">
                  <div className="w-full flex-wrap overflow-x-auto h-auto gap-2 flex bg-muted/80 rounded-xl p-2 shadow-inner mb-6">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <Skeleton key={j} className="h-10 w-32 rounded-lg" />
                    ))}
                  </div>
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl border-2 bg-muted/20 shadow-md">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded-lg" />
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-5 w-16 rounded-full" />
                          <Skeleton className="h-5 w-24 rounded-full" />
                        </div>
                        <Skeleton className="h-9 w-9 rounded-xl" />
                      </div>
                      <div className="space-y-3">
                        <div className="p-5 rounded-xl bg-muted/80 border-2">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <Skeleton className="h-5 w-48 mb-2" />
                              <Skeleton className="h-3 w-40" />
                            </div>
                            <Skeleton className="h-12 w-24 rounded-xl" />
                          </div>
                          <Skeleton className="h-2.5 w-full rounded-full" />
                        </div>
                        {Array.from({ length: 2 }).map((_, k) => (
                          <div
                            key={k}
                            className="flex items-center justify-between p-4 rounded-xl bg-background border-2 shadow-md"
                          >
                            <div className="flex-1">
                              <Skeleton className="h-4 w-40 mb-2" />
                              <div className="flex gap-3">
                                <Skeleton className="h-6 w-24 rounded-lg" />
                                <Skeleton className="h-6 w-20 rounded-lg" />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Skeleton className="h-9 w-9 rounded-xl" />
                              <Skeleton className="h-9 w-9 rounded-xl" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
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

  return <GradeBookView defaultGradebook={gradebook} />;
}
