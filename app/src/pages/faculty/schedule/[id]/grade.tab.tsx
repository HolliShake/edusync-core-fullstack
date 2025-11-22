import { Alert, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSectionTeacherContext } from '@/context/section-teacher.context';
import type { Enrollment } from '@rest/models/enrollment';
import type { GradeBook } from '@rest/models/gradeBook';
import type { GradeBookGradingPeriod } from '@rest/models/gradeBookGradingPeriod';
import type { GradeBookItem } from '@rest/models/gradeBookItem';
import type { GradeBookItemDetail } from '@rest/models/gradeBookItemDetail';
import type React from 'react';
import { useMemo, useState } from 'react';

export default function FacultyScheduleGradeTab(): React.ReactNode {
  const sectionTeacher = useSectionTeacherContext();
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const hasGradeBook = useMemo(() => !!sectionTeacher?.section?.grade_book, [sectionTeacher]);

  // fetch grade book data
  const gradeBook = useMemo(
    () => sectionTeacher?.section?.grade_book as GradeBook | undefined,
    [sectionTeacher]
  );

  // Dummy student data
  const dummyEnrollment: Enrollment = useMemo(
    () => ({
      id: 1,
      user_id: 1,
      section_id: sectionTeacher?.section?.id ?? 0,
      validated: true,
      is_dropped: false,
      user: {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '',
      },
    }),
    [sectionTeacher]
  );

  const gradingPeriods = useMemo(() => {
    return (gradeBook?.gradebook_grading_periods as GradeBookGradingPeriod[] | undefined) || [];
  }, [gradeBook]);

  // Flatten the structure to get all item details with their hierarchy
  const columns = useMemo(() => {
    const cols: Array<{
      periodTitle: string;
      periodWeight: number;
      itemTitle: string;
      itemWeight: number;
      detailTitle: string;
      detailWeight: number;
      detailMaxScore: number;
      detailMinScore: number;
      periodId: number;
      itemId: number;
      detailId: number;
      isPlaceholder?: boolean;
    }> = [];

    gradingPeriods.forEach((period) => {
      const items = (period.gradebook_items as GradeBookItem[] | undefined) || [];

      if (items.length === 0) {
        cols.push({
          periodTitle: period.title ?? '',
          periodWeight: Number(period.weight) || 0,
          itemTitle: '',
          itemWeight: 0,
          detailTitle: '',
          detailWeight: 0,
          detailMaxScore: 0,
          detailMinScore: 0,
          periodId: period.id ?? 0,
          itemId: 0,
          detailId: 0,
          isPlaceholder: true,
        });
        return;
      }

      items.forEach((item) => {
        const details = (item.gradebook_item_details as GradeBookItemDetail[] | undefined) || [];

        if (details.length === 0) {
          cols.push({
            periodTitle: period.title ?? '',
            periodWeight: Number(period.weight) || 0,
            itemTitle: item.title ?? '',
            itemWeight: Number(item.weight) || 0,
            detailTitle: '',
            detailWeight: 0,
            detailMaxScore: 0,
            detailMinScore: 0,
            periodId: period.id ?? 0,
            itemId: item.id ?? 0,
            detailId: 0,
            isPlaceholder: true,
          });
          return;
        }

        details.forEach((detail) => {
          cols.push({
            periodTitle: period.title ?? '',
            periodWeight: Number(period.weight) || 0,
            itemTitle: item.title ?? '',
            itemWeight: Number(item.weight) || 0,
            detailTitle: detail.title ?? '',
            detailWeight: Number(detail.weight) || 0,
            detailMaxScore: Number(detail.max_score) || 0,
            detailMinScore: Number(detail.min_score) || 0,
            periodId: period.id ?? 0,
            itemId: item.id ?? 0,
            detailId: detail.id ?? 0,
            isPlaceholder: false,
          });
        });
      });
    });

    return cols;
  }, [gradingPeriods]);

  const hasColumns = columns.length > 0;

  if (!hasGradeBook) {
    return (
      <Alert className="border-accent/30 bg-accent/10">
        <AlertTitle className="text-accent-foreground font-semibold">
          No grade book found
        </AlertTitle>
      </Alert>
    );
  }

  if (gradingPeriods.length === 0) {
    return (
      <Alert className="border-accent/30 bg-accent/10">
        <AlertTitle className="text-accent-foreground font-semibold">
          No grading periods configured
        </AlertTitle>
      </Alert>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <Table className="min-w-max w-full">
            <TableHeader>
              {/* Row 1: Grading Period Headers */}
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead
                  className="sticky left-0 z-20 bg-muted/50 font-semibold text-foreground border-r border-border min-w-[150px]"
                  rowSpan={hasColumns ? 4 : 1}
                >
                  Student Name
                </TableHead>
                {hasColumns ? (
                  gradingPeriods.map((period, periodIdx) => {
                    const items = (period.gradebook_items as GradeBookItem[] | undefined) || [];
                    const totalDetailCount = items.reduce((sum, item) => {
                      const details =
                        (item.gradebook_item_details as GradeBookItemDetail[] | undefined) || [];
                      return sum + (details.length || 1);
                    }, 0);

                    return (
                      <TableHead
                        key={periodIdx}
                        className="text-center font-semibold text-foreground bg-primary/10 border-r border-border whitespace-nowrap"
                        colSpan={totalDetailCount || 1}
                      >
                        {period.title}{' '}
                        <span className="text-muted-foreground">({period.weight}%)</span>
                      </TableHead>
                    );
                  })
                ) : (
                  <TableHead className="text-center font-semibold text-foreground bg-primary/10 border-r border-border whitespace-nowrap">
                    No grade items configured
                  </TableHead>
                )}
              </TableRow>

              {hasColumns && (
                <>
                  {/* Row 2: Item Headers */}
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    {gradingPeriods.map((period, periodIdx) => {
                      const items = (period.gradebook_items as GradeBookItem[] | undefined) || [];

                      if (items.length === 0) {
                        return (
                          <TableHead
                            key={`${periodIdx}-empty`}
                            className="text-center font-semibold text-foreground bg-secondary/20 border-r border-border whitespace-nowrap"
                          >
                            No items
                          </TableHead>
                        );
                      }

                      return items.map((item, itemIdx) => {
                        const details =
                          (item.gradebook_item_details as GradeBookItemDetail[] | undefined) || [];

                        return (
                          <TableHead
                            key={`${periodIdx}-${itemIdx}`}
                            className="text-center font-semibold text-foreground bg-secondary/20 border-r border-border whitespace-nowrap"
                            colSpan={details.length || 1}
                          >
                            {item.title}{' '}
                            <span className="text-muted-foreground">({item.weight}%)</span>
                          </TableHead>
                        );
                      });
                    })}
                  </TableRow>

                  {/* Row 3: Detail Headers */}
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    {gradingPeriods.map((period) => {
                      const items = (period.gradebook_items as GradeBookItem[] | undefined) || [];

                      if (items.length === 0) {
                        return (
                          <TableHead
                            key={`${period.id}-empty-detail`}
                            className="text-center font-semibold text-foreground bg-accent/10 border-r border-border min-w-[120px] whitespace-nowrap"
                          >
                            -
                          </TableHead>
                        );
                      }

                      return items.map((item) => {
                        const details =
                          (item.gradebook_item_details as GradeBookItemDetail[] | undefined) || [];

                        if (details.length === 0) {
                          return (
                            <TableHead
                              key={`${item.id}-empty-detail`}
                              className="text-center font-semibold text-foreground bg-accent/10 border-r border-border min-w-[120px] whitespace-nowrap"
                            >
                              -
                            </TableHead>
                          );
                        }

                        return details.map((detail) => (
                          <TableHead
                            key={detail.id}
                            className="text-center font-semibold text-foreground bg-accent/10 border-r border-border min-w-[120px] whitespace-nowrap"
                          >
                            {detail.title}
                          </TableHead>
                        ));
                      });
                    })}
                  </TableRow>

                  {/* Row 4: Weight and Max Score */}
                  <TableRow className="bg-muted/10 hover:bg-muted/10">
                    {gradingPeriods.map((period) => {
                      const items = (period.gradebook_items as GradeBookItem[] | undefined) || [];

                      if (items.length === 0) {
                        return (
                          <TableHead
                            key={`${period.id}-empty-weight`}
                            className="text-center text-xs font-normal text-muted-foreground border-r border-border whitespace-nowrap"
                          >
                            -
                          </TableHead>
                        );
                      }

                      return items.map((item) => {
                        const details =
                          (item.gradebook_item_details as GradeBookItemDetail[] | undefined) || [];

                        if (details.length === 0) {
                          return (
                            <TableHead
                              key={`${item.id}-empty-weight`}
                              className="text-center text-xs font-normal text-muted-foreground border-r border-border whitespace-nowrap"
                            >
                              -
                            </TableHead>
                          );
                        }

                        return details.map((detail) => (
                          <TableHead
                            key={`${detail.id}-weight`}
                            className="text-center text-xs font-normal text-muted-foreground border-r border-border whitespace-nowrap"
                          >
                            {detail.weight}% | Max: {detail.max_score}
                          </TableHead>
                        ));
                      });
                    })}
                  </TableRow>
                </>
              )}
            </TableHeader>

            <TableBody>
              {/* Dummy student row */}
              <TableRow
                className={`transition-colors ${
                  hoveredRow === dummyEnrollment.id ? 'bg-primary/10' : 'hover:bg-muted/30'
                }`}
                onMouseEnter={() => setHoveredRow(dummyEnrollment.id!)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <TableCell
                  className={`font-medium sticky left-0 z-10 border-r border-border transition-colors ${
                    hoveredRow === dummyEnrollment.id ? 'bg-primary/10' : 'bg-card'
                  }`}
                >
                  {dummyEnrollment.user?.name}
                </TableCell>
                {hasColumns ? (
                  columns.map((col, idx) => (
                    <TableCell key={idx} className="text-center p-2 border-r border-border">
                      {!col.isPlaceholder ? (
                        <Input
                          type="number"
                          className="w-full text-center h-8 border-none bg-transparent focus-visible:bg-accent/10 focus-visible:ring-1 focus-visible:ring-ring"
                          placeholder="0"
                          min={col.detailMinScore}
                          max={col.detailMaxScore}
                        />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  ))
                ) : (
                  <TableCell className="text-center p-4 text-muted-foreground">
                    No grade items to display
                  </TableCell>
                )}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
