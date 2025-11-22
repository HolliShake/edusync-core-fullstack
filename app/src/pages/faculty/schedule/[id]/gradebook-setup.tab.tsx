import { Card, CardContent } from '@/components/ui/card';
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
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-9 w-32" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
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

  return <GradeBookView defaultGradebook={gradebook} />;
}
