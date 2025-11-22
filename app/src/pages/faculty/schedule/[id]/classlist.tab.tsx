import type { TableColumn } from '@/components/custom/table.component';
import Table from '@/components/custom/table.component';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSectionTeacherContext } from '@/context/section-teacher.context';
import { useGetEnrollmentPaginated } from '@rest/api';
import type { Enrollment } from '@rest/models/enrollment';
import { Sparkles, Users, UserX } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

export default function FacultyScheduleClasslistTab(): React.ReactNode {
  const sectionTeacher = useSectionTeacherContext();
  const [page, setPage] = useState(1);
  const [rows, _] = useState(10);

  const { data: enrollmentResponse, isLoading } = useGetEnrollmentPaginated(
    {
      'filter[officially_enrolled]': true,
      'filter[section_id]': sectionTeacher?.section?.id ?? 0,
      page,
      rows,
    },
    { query: { enabled: !!sectionTeacher?.section?.id } }
  );

  const enrollments = enrollmentResponse?.data?.data as Enrollment[] | undefined;
  const paginationMeta = enrollmentResponse?.data
    ? {
        current_page: enrollmentResponse.data.current_page,
        last_page: enrollmentResponse.data.last_page,
        per_page: enrollmentResponse.data.per_page,
        total: enrollmentResponse.data.total,
        from: enrollmentResponse.data.from,
        to: enrollmentResponse.data.to,
      }
    : undefined;

  const columns: TableColumn<Enrollment>[] = [
    {
      key: 'user.id',
      title: 'Student ID',
      className: 'font-medium',
    },
    {
      key: 'user.name',
      title: 'Name',
    },
    {
      key: 'user.email',
      title: 'Email',
    },
    {
      key: 'latest_status_label',
      title: 'Status',
      render: (value: any) => (
        <span className="text-sm text-muted-foreground">{value || 'N/A'}</span>
      ),
    },
  ];

  if (isLoading && !enrollments) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border bg-card">
          <div className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-4 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
          <div className="divide-y">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t px-6 py-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!enrollments || enrollments.length === 0) {
    return (
      <>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <UserX className="h-12 w-12 text-primary/60" />
            </div>
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Your Classroom Awaits!
            </h3>
            <p className="text-muted-foreground max-w-md mb-4">
              No students have officially enrolled in this section yet. Once students register and
              their enrollment is validated, they'll appear here.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 px-4 py-2 rounded-lg">
              <Users className="h-4 w-4" />
              <span>Check back soon as enrollment opens!</span>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <Table
        columns={columns}
        rows={enrollments}
        rowKey={(enrollment) => enrollment.id!}
        loading={isLoading}
        striped
        hoverable
        pagination={paginationMeta}
        showPagination={true}
        onPageChange={setPage}
        emptyState={
          <div className="flex flex-col items-center gap-2">
            <UserX className="h-8 w-8 text-muted-foreground" />
            <span>No students enrolled</span>
          </div>
        }
      />
    </>
  );
}
