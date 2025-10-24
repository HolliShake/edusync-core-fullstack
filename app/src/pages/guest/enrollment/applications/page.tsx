import TitledPage from '@/components/pages/titled.page';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth.context';
import { useGetEnrollmentPaginated } from '@rest/api';
import type { Enrollment } from '@rest/models';
import { BookOpen } from 'lucide-react';
import type React from 'react';
import { useMemo } from 'react';

export default function GuestEnrollmentApplication(): React.ReactNode {
  const { session } = useAuth();
  const { data: enrollmentResponse, isLoading } = useGetEnrollmentPaginated(
    {
      'filter[user_id]': session?.id ?? (0 || 0),
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
    },
    {
      query: {
        enabled: !!session?.id,
      },
    }
  );

  const allEnrollments = useMemo(() => enrollmentResponse?.data?.data ?? [], [enrollmentResponse]);

  const groupedEnrollments = useMemo(() => {
    const sorted = [...allEnrollments].sort((a, b) => {
      const aYearOrder = a.section?.curriculum_detail?.year_order ?? 0;
      const bYearOrder = b.section?.curriculum_detail?.year_order ?? 0;
      const aTermOrder = a.section?.curriculum_detail?.term_order ?? 0;
      const bTermOrder = b.section?.curriculum_detail?.term_order ?? 0;

      // Sort by year_order descending
      if (bYearOrder !== aYearOrder) {
        return bYearOrder - aYearOrder;
      }
      // Then by term_order descending
      return bTermOrder - aTermOrder;
    });

    // Group by year_order and term_order
    const grouped = sorted.reduce<
      Record<string, { yearOrder: number; termOrder: number; enrollments: Enrollment[] }>
    >((acc, enrollment) => {
      const yearOrder = enrollment.section?.curriculum_detail?.year_order ?? 0;
      const termOrder = enrollment.section?.curriculum_detail?.term_order ?? 0;
      const key = `${yearOrder}-${termOrder}`;

      if (!acc[key]) {
        acc[key] = { yearOrder, termOrder, enrollments: [] };
      }
      acc[key].enrollments.push(enrollment);
      return acc;
    }, {});

    return grouped;
  }, [allEnrollments]);

  if (isLoading) {
    return (
      <TitledPage
        title="Enrollment Applications"
        description="View and manage your enrollment applications"
      >
        <div className="flex items-center justify-center py-8">
          <div className="text-center space-y-2">
            <div className="inline-flex h-8 w-8 animate-spin items-center justify-center rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading your registration...</p>
          </div>
        </div>
      </TitledPage>
    );
  }

  if (Object.keys(groupedEnrollments).length === 0) {
    return (
      <TitledPage
        title="Certificate of Registration"
        description="View your official certificate of registration"
      >
        <Alert className="border-dashed">
          <BookOpen className="h-4 w-4" />
          <AlertDescription>
            No registration found. Please complete your enrollment to generate your Certificate of
            Registration.
          </AlertDescription>
        </Alert>
      </TitledPage>
    );
  }

  return (
    <TitledPage
      title="Enrollment Applications"
      description="View and manage your enrollment applications"
    >
      <div className="space-y-6">
        {/* Course Schedule per Term */}
        <div className="space-y-4">
          {Object.entries(groupedEnrollments)
            .sort(([keyA], [keyB]) => {
              const [yearA, termA] = keyA.split('-').map(Number);
              const [yearB, termB] = keyB.split('-').map(Number);
              if (yearB !== yearA) return yearB - yearA;
              return termB - termA;
            })
            .map(([key, { enrollments }]) => {
              const yearLabel =
                enrollments[0]?.section?.curriculum_detail?.year_label || 'Unknown Year';
              const termLabel =
                enrollments[0]?.section?.curriculum_detail?.term_label || 'Unknown Term';
              const totalUnits = enrollments.reduce(
                (sum, e) => sum + (e.section?.curriculum_detail?.course?.credit_units || 0),
                0
              );

              return (
                <Card key={key} className="border-2">
                  <CardHeader className="bg-muted/30 border-b pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold">
                        {yearLabel} - {termLabel}
                      </CardTitle>
                      <Badge variant="outline" className="font-normal">
                        Total Units: {totalUnits}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/50 border-b">
                            <th className="p-3 text-left text-xs font-semibold">Course Code</th>
                            <th className="p-3 text-left text-xs font-semibold">Course Title</th>
                            <th className="p-3 text-left text-xs font-semibold">Section</th>
                            <th className="p-3 text-center text-xs font-semibold">Units</th>
                            <th className="p-3 text-left text-xs font-semibold">Schedule</th>
                            <th className="p-3 text-center text-xs font-semibold">Room</th>
                            <th className="p-3 text-center text-xs font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {enrollments.map((enrollment) => (
                            <tr key={enrollment.id} className="hover:bg-muted/20 transition-colors">
                              <td className="p-3 text-sm font-medium">
                                {enrollment.section?.curriculum_detail?.course?.course_code ||
                                  'N/A'}
                              </td>
                              <td className="p-3 text-sm">
                                {enrollment.section?.curriculum_detail?.course?.course_title ||
                                  'No title'}
                              </td>
                              <td className="p-3 text-sm">
                                {enrollment.section?.section_name || 'N/A'}
                              </td>
                              <td className="p-3 text-sm text-center">
                                {enrollment.section?.curriculum_detail?.course?.credit_units || 0}
                              </td>
                              <td className="p-3 text-xs">TBA</td>
                              <td className="p-3 text-xs text-center">TBA</td>
                              <td className="p-3 text-center">
                                <Badge variant="outline" className="text-xs py-0">
                                  {enrollment.latest_status || 'N/A'}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-muted/30 border-t-2">
                            <td colSpan={3} className="p-3 text-sm font-semibold text-right">
                              TOTAL UNITS:
                            </td>
                            <td className="p-3 text-sm font-semibold text-center">{totalUnits}</td>
                            <td colSpan={3}></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
    </TitledPage>
  );
}
