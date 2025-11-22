import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSectionTeacherContext } from '@/context/section-teacher.context';
import { useGetEnrollmentPaginated } from '@rest/api';
import type { Enrollment } from '@rest/models/enrollment';
import { Sparkles, Users, UserX } from 'lucide-react';
import type React from 'react';

export default function FacultyScheduleClasslistTab(): React.ReactNode {
  const sectionTeacher = useSectionTeacherContext();
  const { data: enrollmentResponse, isLoading } = useGetEnrollmentPaginated(
    {
      'filter[officially_enrolled]': true,
      'filter[section_id]': sectionTeacher?.section?.id ?? 0,
    },
    { query: { enabled: !!sectionTeacher?.section?.id } }
  );

  const enrollments = enrollmentResponse?.data?.data as Enrollment[] | undefined;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading class list...</p>
      </div>
    );
  }

  if (!enrollments || enrollments.length === 0) {
    return (
      <div className="p-4">
        <Card className="border-dashed border-2">
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
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Student ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Validated</TableHead>
              <TableHead className="text-center">Dropped</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollments.map((enrollment) => (
              <TableRow key={enrollment.id}>
                <TableCell className="font-medium">{enrollment.user?.id}</TableCell>
                <TableCell>{enrollment.user?.name}</TableCell>
                <TableCell>{enrollment.user?.email}</TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {enrollment.latest_status_label || 'N/A'}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {enrollment.validated ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {enrollment.is_dropped ? (
                    <span className="text-red-600">✓</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 text-sm text-muted-foreground">Total students: {enrollments.length}</div>
    </div>
  );
}
