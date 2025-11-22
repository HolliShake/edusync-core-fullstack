import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import {
  useGetEnrollmentPaginated,
  useGetSyncGradeBookScore,
  useSyncScoreForSection,
} from '@rest/api';
import type { GradeBookScore } from '@rest/models';
import type { Enrollment } from '@rest/models/enrollment';
import type { GradeBook } from '@rest/models/gradeBook';
import type { GradeBookGradingPeriod } from '@rest/models/gradeBookGradingPeriod';
import type { GradeBookItem } from '@rest/models/gradeBookItem';
import type { GradeBookItemDetail } from '@rest/models/gradeBookItemDetail';
import type { SyncGradeBookScore } from '@rest/models/syncGradeBookScore';
import React, { Fragment, useMemo, useState } from 'react';
import { toast } from 'sonner';

// Helper function to get score for a specific enrollment and detail
const getScoreForEnrollmentAndDetail = (
  gradeBookScores: GradeBookScore[],
  enrollmentId: number,
  detailId: number
): number | undefined => {
  const score = gradeBookScores.find(
    (score) => score.enrollment_id === enrollmentId && score.gradebook_item_detail_id === detailId
  );
  return score?.score !== undefined ? Number(score.score) : undefined;
};

// Helper function to create a score payload for syncing
const createScorePayload = (
  enrollmentId: number,
  detailId: number,
  score: number,
  existingScores: GradeBookScore[]
): SyncGradeBookScore => {
  const existingScore = existingScores.find(
    (s) => s.enrollment_id === enrollmentId && s.gradebook_item_detail_id === detailId
  );

  return {
    id: existingScore?.id ?? null,
    gradebook_item_detail_id: detailId,
    enrollment_id: enrollmentId,
    score: score,
  };
};

export default function FacultyScheduleGradeTab(): React.ReactNode {
  const sectionTeacher = useSectionTeacherContext();
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [scoreChanges, setScoreChanges] = useState<Map<string, number>>(new Map());

  const hasGradeBook = useMemo(() => !!sectionTeacher?.section?.grade_book, [sectionTeacher]);

  const { mutateAsync: syncScoreForSection, isPending: isSyncingScore } = useSyncScoreForSection();

  // fetch grade book data
  const gradeBook = useMemo(
    () => sectionTeacher?.section?.grade_book as GradeBook | undefined,
    [sectionTeacher]
  );

  const { data: enrollmentResponse, isLoading } = useGetEnrollmentPaginated(
    {
      'filter[officially_enrolled]': true,
      'filter[section_id]': sectionTeacher?.section?.id ?? 0,
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
    },
    { query: { enabled: !!sectionTeacher?.section?.id } }
  );

  const { data: gradeBookScoreResponse, refetch: refetchGradeBookScore } = useGetSyncGradeBookScore(
    sectionTeacher?.section?.id ?? 0,
    {
      query: { enabled: !!sectionTeacher?.section?.id },
    }
  );

  const enrollments: Enrollment[] = useMemo(
    () => (enrollmentResponse?.data?.data as Enrollment[] | undefined) || [],
    [enrollmentResponse]
  );

  const gradeBookScores: GradeBookScore[] = useMemo(
    () => (gradeBookScoreResponse?.data as GradeBookScore[] | undefined) || [],
    [gradeBookScoreResponse]
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
      isPeriodGrade?: boolean;
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

        // Add Period Grade Column even if no items
        cols.push({
          periodTitle: period.title ?? '',
          periodWeight: Number(period.weight) || 0,
          itemTitle: 'Grade',
          itemWeight: 0,
          detailTitle: 'Grade',
          detailWeight: 0,
          detailMaxScore: 0,
          detailMinScore: 0,
          periodId: period.id ?? 0,
          itemId: 0,
          detailId: 0,
          isPlaceholder: false,
          isPeriodGrade: true,
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

      // Add Period Grade Column
      cols.push({
        periodTitle: period.title ?? '',
        periodWeight: Number(period.weight) || 0,
        itemTitle: 'Grade',
        itemWeight: 0,
        detailTitle: 'Grade',
        detailWeight: 0,
        detailMaxScore: 0,
        detailMinScore: 0,
        periodId: period.id ?? 0,
        itemId: 0,
        detailId: 0,
        isPlaceholder: false,
        isPeriodGrade: true,
      });
    });

    return cols;
  }, [gradingPeriods]);

  const hasColumns = columns.length > 0;

  // Handler for score input changes
  const handleScoreChange = (enrollmentId: number, detailId: number, value: string) => {
    const key = `${enrollmentId}-${detailId}`;

    if (value === '') {
      setScoreChanges((prev) => {
        const updated = new Map(prev);
        updated.delete(key);
        return updated;
      });
      return;
    }

    const numericValue = Number(value);

    setScoreChanges((prev) => {
      const updated = new Map(prev);
      updated.set(key, numericValue);
      return updated;
    });
  };

  // Handler for save button click
  const handleSaveScores = async () => {
    const validationErrors: string[] = [];
    const payloads: SyncGradeBookScore[] = [];

    // Validate all score changes
    scoreChanges.forEach((score, key) => {
      const [enrollmentIdStr, detailIdStr] = key.split('-');
      const enrollmentId = Number(enrollmentIdStr);
      const detailId = Number(detailIdStr);

      // Find the column to get min/max scores
      const column = columns.find((col) => col.detailId === detailId);

      if (column && !column.isPlaceholder) {
        if (score < column.detailMinScore || score > column.detailMaxScore) {
          const enrollment = enrollments.find((e) => e.id === enrollmentId);
          validationErrors.push(
            `${enrollment?.user?.name || 'Student'} - ${column.detailTitle}: Score must be between ${column.detailMinScore} and ${column.detailMaxScore}`
          );
        } else {
          // Create payload for valid scores
          const payload = createScorePayload(enrollmentId, detailId, score, gradeBookScores);
          payloads.push(payload);
        }
      }
    });

    // Show validation errors if any
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => toast.error(error));
      return;
    }

    // If no changes to save
    if (payloads.length === 0) {
      toast.info('No changes to save');
      return;
    }

    try {
      await syncScoreForSection({
        sectionId: sectionTeacher?.section?.id ?? 0,
        data: payloads.map((payload) => ({
          id: payload.id ?? undefined,
          gradebook_item_detail_id: payload.gradebook_item_detail_id!,
          enrollment_id: payload.enrollment_id!,
          score: payload.score!,
        })),
      });
      toast.success(`${payloads.length} score(s) saved successfully`);
      refetchGradeBookScore();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save scores');
    }

    // Clear the changes after successful save
    setScoreChanges(new Map());
  };

  // Helper to get the current value for an input (either from local state or from API)
  const getCurrentScore = (enrollmentId: number, detailId: number): number | string => {
    const key = `${enrollmentId}-${detailId}`;

    // Check if there's a local change first
    if (scoreChanges.has(key)) {
      return scoreChanges.get(key)!;
    }

    // Otherwise, get from API data
    const score = getScoreForEnrollmentAndDetail(gradeBookScores, enrollmentId, detailId);
    return score !== undefined ? score : '';
  };

  // Helper to calculate period grade
  const getPeriodGrade = (enrollmentId: number, periodId: number): string => {
    const periodColumns = columns.filter(
      (col) =>
        col.periodId === periodId &&
        !col.isPlaceholder &&
        !col.isPeriodGrade &&
        col.detailMaxScore > 0
    );

    if (periodColumns.length === 0) return '0.00';

    let totalPeriodGrade = 0;

    periodColumns.forEach((col) => {
      const scoreVal = getCurrentScore(enrollmentId, col.detailId);
      const score = typeof scoreVal === 'number' ? scoreVal : Number(scoreVal) || 0;

      const normalizedScore = score / col.detailMaxScore;
      // Contribution = (Score / Max) * DetailWeight% * (ItemWeight% / 100)
      const term = normalizedScore * col.detailWeight * (col.itemWeight / 100);
      totalPeriodGrade += term;
    });

    return totalPeriodGrade.toFixed(2);
  };

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

  if (isLoading && enrollments.length === 0) {
    return (
      <Card className="p-0 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <div className="overflow-x-auto max-w-full">
              <Table className="min-w-max w-full">
                <TableHeader>
                  {/* Row 1: Grading Period Headers */}
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead
                      className="sticky left-0 z-20 bg-muted/50 font-semibold text-foreground border-r border-border min-w-[150px]"
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
                      <TableCell className="font-medium sticky left-0 z-10 border-r border-border bg-card">
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      {Array.from({ length: 6 }).map((_, colIdx) => (
                        <TableCell key={colIdx} className="text-center p-2 border-r border-border">
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleSaveScores} disabled={scoreChanges.size === 0 || isSyncingScore}>
          {isSyncingScore
            ? 'Saving...'
            : `Save Changes${scoreChanges.size > 0 ? ` (${scoreChanges.size})` : ''}`}
        </Button>
      </div>
      <Card className="p-0 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-hidden">
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
                            (item.gradebook_item_details as GradeBookItemDetail[] | undefined) ||
                            [];
                          return sum + (details.length || 1);
                        }, 0);

                        return (
                          <TableHead
                            key={periodIdx}
                            className="text-center font-semibold text-foreground bg-primary/10 border-r border-border whitespace-nowrap"
                            colSpan={(totalDetailCount || 1) + 1}
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
                          const items =
                            (period.gradebook_items as GradeBookItem[] | undefined) || [];

                          return (
                            <Fragment key={periodIdx}>
                              {items.length === 0 ? (
                                <TableHead
                                  key={`${periodIdx}-empty`}
                                  className="text-center font-semibold text-foreground bg-secondary/20 border-r border-border whitespace-nowrap"
                                >
                                  No items
                                </TableHead>
                              ) : (
                                items.map((item, itemIdx) => {
                                  const details =
                                    (item.gradebook_item_details as
                                      | GradeBookItemDetail[]
                                      | undefined) || [];

                                  return (
                                    <TableHead
                                      key={`${periodIdx}-${itemIdx}`}
                                      className="text-center font-semibold text-foreground bg-secondary/20 border-r border-border whitespace-nowrap"
                                      colSpan={details.length || 1}
                                    >
                                      {item.title}{' '}
                                      <span className="text-muted-foreground">
                                        ({item.weight}%)
                                      </span>
                                    </TableHead>
                                  );
                                })
                              )}
                              <TableHead
                                key={`${periodIdx}-grade`}
                                className="text-center font-bold text-foreground bg-secondary/20 border-r border-border whitespace-nowrap align-middle"
                                rowSpan={3}
                              >
                                Grade
                              </TableHead>
                            </Fragment>
                          );
                        })}
                      </TableRow>

                      {/* Row 3: Detail Headers */}
                      <TableRow className="bg-muted/20 hover:bg-muted/20">
                        {gradingPeriods.map((period) => {
                          const items =
                            (period.gradebook_items as GradeBookItem[] | undefined) || [];

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
                              (item.gradebook_item_details as GradeBookItemDetail[] | undefined) ||
                              [];

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
                          const items =
                            (period.gradebook_items as GradeBookItem[] | undefined) || [];

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
                              (item.gradebook_item_details as GradeBookItemDetail[] | undefined) ||
                              [];

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
                                {detail.weight}% | Min: {detail.min_score} | Max: {detail.max_score}
                              </TableHead>
                            ));
                          });
                        })}
                      </TableRow>
                    </>
                  )}
                </TableHeader>

                <TableBody>
                  {enrollments.map((enrollment) => (
                    <TableRow
                      key={enrollment.id}
                      className={`transition-colors ${
                        hoveredRow === enrollment.id ? 'bg-primary/10' : 'hover:bg-muted/30'
                      }`}
                      onMouseEnter={() => setHoveredRow(enrollment.id!)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <TableCell
                        className={`font-medium sticky left-0 z-10 border-r border-border transition-colors ${
                          hoveredRow === enrollment.id ? 'bg-primary/10' : 'bg-card'
                        }`}
                      >
                        {enrollment.user?.name}
                      </TableCell>
                      {hasColumns ? (
                        columns.map((col, idx) => {
                          if (col.isPeriodGrade) {
                            return (
                              <TableCell
                                key={idx}
                                className="text-center p-2 border-r border-border font-bold bg-muted/10"
                              >
                                {getPeriodGrade(enrollment.id!, col.periodId)}%
                              </TableCell>
                            );
                          }

                          const currentValue = !col.isPlaceholder
                            ? getCurrentScore(enrollment.id!, col.detailId)
                            : '';

                          return (
                            <TableCell key={idx} className="text-center p-2 border-r border-border">
                              {!col.isPlaceholder ? (
                                <Input
                                  type="number"
                                  className="w-full text-center h-8 border-none bg-transparent focus-visible:bg-accent/10 focus-visible:ring-1 focus-visible:ring-ring shadow-none"
                                  placeholder="0"
                                  min={col.detailMinScore}
                                  max={col.detailMaxScore}
                                  value={currentValue}
                                  onChange={(e) => {
                                    handleScoreChange(enrollment.id!, col.detailId, e.target.value);
                                  }}
                                />
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          );
                        })
                      ) : (
                        <TableCell className="text-center p-4 text-muted-foreground">
                          No grade items to display
                        </TableCell>
                      )}
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
