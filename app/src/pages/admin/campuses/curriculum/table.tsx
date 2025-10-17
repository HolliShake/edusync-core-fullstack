import { Badge } from '@/components/ui/badge';
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
import type { CurriculumDetail } from '@rest/models';
import { BookOpen, FlaskConical } from 'lucide-react';
import type React from 'react';
import { useMemo } from 'react';

interface CurriculumTableProps {
  curriculumDetails: CurriculumDetail[];
  isLoading?: boolean;
}

interface GroupedCurriculumDetails {
  [year: number]: {
    [term: number]: CurriculumDetail[];
  };
}

export default function CurriculumTable({
  curriculumDetails,
  isLoading = false,
}: CurriculumTableProps): React.ReactNode {
  const groupedDetails = useMemo(() => {
    const grouped: GroupedCurriculumDetails = {};

    curriculumDetails.forEach((detail) => {
      const year = detail.year_order;
      const term = detail.term_order;

      if (!grouped[year]) {
        grouped[year] = {};
      }

      if (!grouped[year][term]) {
        grouped[year][term] = [];
      }

      grouped[year][term].push(detail);
    });

    return grouped;
  }, [curriculumDetails]);

  const sortedYears = useMemo(
    () =>
      Object.keys(groupedDetails)
        .map(Number)
        .sort((a, b) => a - b),
    [groupedDetails]
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, yearIndex) => (
          <Card key={yearIndex}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (curriculumDetails.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
          <p className="text-lg text-muted-foreground">No curriculum details available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {sortedYears.map((year) => {
        const terms = groupedDetails[year];
        const sortedTerms = Object.keys(terms)
          .map(Number)
          .sort((a, b) => a - b);

        return (
          <Card key={year} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
              <CardTitle className="text-xl font-semibold">
                {curriculumDetails.find((d) => d.year_order === year)?.year_label || `Year ${year}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {sortedTerms.map((term) => {
                const courses = terms[term];
                const termLabel =
                  courses[0]?.term_label || courses[0]?.term_alias || `Term ${term}`;

                return (
                  <div key={term} className="border-b last:border-b-0">
                    <div className="bg-muted/50 px-6 py-3">
                      <h3 className="font-semibold text-base">{termLabel}</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[150px]">Course Code</TableHead>
                            <TableHead>Course Title</TableHead>
                            <TableHead className="w-[120px] text-center">Lecture Units</TableHead>
                            <TableHead className="w-[120px] text-center">Lab Units</TableHead>
                            <TableHead className="w-[120px] text-center">Credit Units</TableHead>
                            <TableHead className="w-[100px] text-center">Type</TableHead>
                            <TableHead className="w-[100px] text-center">GWA</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {courses.map((detail) => (
                            <TableRow key={detail.id}>
                              <TableCell className="font-mono font-medium">
                                {detail.course?.course_code}
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-medium">{detail.course?.course_title}</div>
                                  {detail.course?.course_description && (
                                    <div className="text-sm text-muted-foreground line-clamp-2">
                                      {detail.course.course_description}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                {detail.course?.lecture_units || 0}
                              </TableCell>
                              <TableCell className="text-center">
                                {detail.course?.laboratory_units || 0}
                              </TableCell>
                              <TableCell className="text-center font-semibold">
                                {detail.course?.credit_units || 0}
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-1">
                                  {detail.course?.with_laboratory && (
                                    <Badge variant="outline" className="text-xs">
                                      <FlaskConical className="h-3 w-3 mr-1" />
                                      Lab
                                    </Badge>
                                  )}
                                  {detail.course?.is_specialize && (
                                    <Badge variant="secondary" className="text-xs">
                                      Spec
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                {detail.is_include_gwa ? (
                                  <Badge variant="default" className="text-xs">
                                    Yes
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">
                                    No
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-muted/30 font-semibold hover:bg-muted/30">
                            <TableCell colSpan={2} className="text-right">
                              Total Units:
                            </TableCell>
                            <TableCell className="text-center">
                              {courses.reduce((sum, d) => sum + (d.course?.lecture_units || 0), 0)}
                            </TableCell>
                            <TableCell className="text-center">
                              {courses.reduce(
                                (sum, d) => sum + (d.course?.laboratory_units || 0),
                                0
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {courses.reduce((sum, d) => sum + (d.course?.credit_units || 0), 0)}
                            </TableCell>
                            <TableCell colSpan={2} />
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
