/**
 * SectionGradeView Component
 *
 * A comprehensive gradebook interface for managing student grades within a section.
 * This component provides functionality for:
 * - Viewing and editing individual assignment scores
 * - Calculating and managing grading period grades
 * - Computing and posting final grades
 * - Tracking grade statistics and completion rates
 * - Handling grade overrides and posting status
 *
 * The component uses a complex column structure to display:
 * - Student information
 * - Individual assignment scores grouped by grading items
 * - Period grades (calculated or overridden)
 * - Final grades (calculated or overridden)
 *
 * Grade calculations follow a weighted system where:
 * - Individual scores contribute to period grades based on item and detail weights
 * - Period grades contribute to final grades based on period weights
 * - Grades can be overridden manually and posted when finalized
 *
 * @param {SectionGradeViewProps} props - Component props
 * @param {Section} props.section - The section object containing gradebook configuration
 */

import { useConfirm } from '@/components/confirm.provider';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useGetEnrollmentPaginated,
  useGetSyncFinalGrade,
  useGetSyncGradeBookScore,
  useGetSyncGradingPeriodGrade,
  useSyncFinalGradeForSection,
  useSyncGradingPeriodGradeForSection,
  useSyncScoreForSection,
} from '@rest/api';
import type { GradeBookScore, Section, SyncFinalGrade, SyncGradingPeriodGrade } from '@rest/models';
import type { Enrollment } from '@rest/models/enrollment';
import type { GradeBook } from '@rest/models/gradeBook';
import type { GradeBookGradingPeriod } from '@rest/models/gradeBookGradingPeriod';
import type { GradeBookItem } from '@rest/models/gradeBookItem';
import type { GradeBookItemDetail } from '@rest/models/gradeBookItemDetail';
import type { SyncGradeBookScore } from '@rest/models/syncGradeBookScore';
import { CheckCircle2, Clock, FileText, TrendingUp, Users, XCircle } from 'lucide-react';
import React, { Fragment, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface SectionGradeViewProps {
  section: Section;
}

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

// Helper function to get period grade from API
const getPeriodGradeFromAPI = (
  gradingPeriodGrades: SyncGradingPeriodGrade[],
  enrollmentId: number,
  periodId: number
): SyncGradingPeriodGrade | undefined => {
  return gradingPeriodGrades.find(
    (grade) =>
      grade.enrollment_id === enrollmentId && grade.gradebook_grading_period_id === periodId
  );
};

// Helper function to get final grade from API
const getFinalGradeFromAPI = (
  finalGrades: SyncFinalGrade[],
  enrollmentId: number
): SyncFinalGrade | undefined => {
  return finalGrades.find((grade) => grade.enrollment_id === enrollmentId);
};

export default function SectionGradeView({ section }: SectionGradeViewProps): React.ReactNode {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [scoreChanges, setScoreChanges] = useState<Map<string, number>>(new Map());
  const [periodGradeChanges, setPeriodGradeChanges] = useState<Map<string, number>>(new Map());
  const [finalGradeChanges, setFinalGradeChanges] = useState<Map<number, number>>(new Map());

  const hasGradeBook = useMemo(() => !!section?.grade_book, [section]);

  const { mutateAsync: syncScoreForSection, isPending: isSyncingScore } = useSyncScoreForSection();
  const { mutateAsync: syncGradingPeriodGradeForSection, isPending: isSyncingGradingPeriodGrade } =
    useSyncGradingPeriodGradeForSection();
  const { mutateAsync: syncFinalGradeForSection, isPending: isSyncingFinalGrade } =
    useSyncFinalGradeForSection();

  const confirm = useConfirm();

  // fetch grade book data
  const gradeBook = useMemo(() => section?.grade_book as GradeBook | undefined, [section]);

  const { data: enrollmentResponse, isLoading } = useGetEnrollmentPaginated(
    {
      'filter[officially_enrolled]': true,
      'filter[section_id]': section?.id ?? 0,
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
    },
    { query: { enabled: !!section?.id } }
  );

  const { data: gradeBookScoreResponse, refetch: refetchGradeBookScore } = useGetSyncGradeBookScore(
    section?.id ?? 0,
    {
      query: { enabled: !!section?.id },
    }
  );

  const { data: gradingPeriodGradeResponse, refetch: refetchGradingPeriodGrade } =
    useGetSyncGradingPeriodGrade(section?.id ?? 0, {
      query: { enabled: !!section?.id },
    });

  const { data: finalGradeResponse, refetch: refetchFinalGrade } = useGetSyncFinalGrade(
    section?.id ?? 0,
    {
      query: { enabled: !!section?.id },
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

  const gradingPeriodGrades: SyncGradingPeriodGrade[] = useMemo(
    () => (gradingPeriodGradeResponse?.data as SyncGradingPeriodGrade[] | undefined) || [],
    [gradingPeriodGradeResponse]
  );

  const finalGrades: SyncFinalGrade[] = useMemo(
    () => (finalGradeResponse?.data as SyncFinalGrade[] | undefined) || [],
    [finalGradeResponse]
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

  // Handler for period grade input changes
  const handlePeriodGradeChange = (enrollmentId: number, periodId: number, value: string) => {
    const key = `${enrollmentId}-${periodId}`;

    if (value === '') {
      setPeriodGradeChanges((prev) => {
        const updated = new Map(prev);
        updated.delete(key);
        return updated;
      });
      return;
    }

    const numericValue = Number(value);

    setPeriodGradeChanges((prev) => {
      const updated = new Map(prev);
      updated.set(key, numericValue);
      return updated;
    });
  };

  // Handler for final grade input changes
  const handleFinalGradeChange = (enrollmentId: number, value: string) => {
    if (value === '') {
      setFinalGradeChanges((prev) => {
        const updated = new Map(prev);
        updated.delete(enrollmentId);
        return updated;
      });
      return;
    }

    const numericValue = Number(value);

    setFinalGradeChanges((prev) => {
      const updated = new Map(prev);
      updated.set(enrollmentId, numericValue);
      return updated;
    });
  };

  // Helper to count changes for a specific period
  const getChangesCountForPeriod = (periodId: number) => {
    let count = 0;
    scoreChanges.forEach((_, key) => {
      const [, detailIdStr] = key.split('-');
      const detailId = Number(detailIdStr);
      const column = columns.find((col) => col.detailId === detailId);
      if (column?.periodId === periodId) {
        count++;
      }
    });
    return count;
  };

  // Handler for save button click
  const handleSaveScores = async (periodId?: number) => {
    const validationErrors: string[] = [];
    const payloads: SyncGradeBookScore[] = [];
    const keysToClear: string[] = [];

    // Validate all score changes
    scoreChanges.forEach((score, key) => {
      const [enrollmentIdStr, detailIdStr] = key.split('-');
      const enrollmentId = Number(enrollmentIdStr);
      const detailId = Number(detailIdStr);

      // Find the column to get min/max scores
      const column = columns.find((col) => col.detailId === detailId);

      // If a specific period is requested, skip if not matching
      if (typeof periodId === 'number' && column?.periodId !== periodId) {
        return;
      }

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
          keysToClear.push(key);
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
        sectionId: section?.id ?? 0,
        data: payloads.map((payload) => ({
          id: payload.id ?? undefined,
          gradebook_item_detail_id: payload.gradebook_item_detail_id!,
          enrollment_id: payload.enrollment_id!,
          score: payload.score!,
        })),
      });
      toast.success(`${payloads.length} score(s) saved successfully`);
      refetchGradeBookScore();
      refetchGradingPeriodGrade();
      refetchFinalGrade();

      // Clear the changes after successful save
      setScoreChanges((prev) => {
        const updated = new Map(prev);
        keysToClear.forEach((key) => updated.delete(key));
        return updated;
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to save scores');
    }
  };

  // Handler for posting period grade
  const handleSyncGradingPeriodGrade = async (
    enrollmentId: number,
    periodId: number,
    isPosted: boolean
  ) => {
    const key = `${enrollmentId}-${periodId}`;
    let grade = periodGradeChanges.get(key);

    const existingGrade = getPeriodGradeFromAPI(gradingPeriodGrades, enrollmentId, periodId);

    if (existingGrade && existingGrade?.is_posted) {
      toast.error('Grade already posted');
      return;
    }

    // If no local change, try to use existing API grade
    if (grade === undefined && existingGrade?.grade !== undefined) {
      grade = Number(existingGrade.grade);
    }

    // If still undefined, try calculated grade
    if (grade === undefined) {
      const calculated = getPeriodGrade(enrollmentId, periodId);
      grade = Number(calculated);
    }

    if (grade === undefined) {
      toast.error('Please enter a grade before saving or posting');
      return;
    }

    // Validate grade is between 0 and 100
    if (grade < 0 || grade > 100) {
      toast.error('Grade must be between 0 and 100');
      return;
    }

    try {
      await syncGradingPeriodGradeForSection({
        sectionId: section?.id ?? 0,
        data: [
          {
            id: existingGrade?.id ?? undefined,
            gradebook_grading_period_id: periodId,
            enrollment_id: enrollmentId,
            grade: grade,
            is_posted: isPosted,
          },
        ],
      });

      toast.success(isPosted ? 'Grade posted successfully' : 'Grade saved successfully');
      refetchGradingPeriodGrade();
      refetchFinalGrade();

      // Clear the local change after successful post
      setPeriodGradeChanges((prev) => {
        const updated = new Map(prev);
        updated.delete(key);
        return updated;
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to save/post grade');
    }
  };

  // Handler for syncing final grade
  const handleSyncFinalGrade = async (enrollmentId: number, isPosted: boolean) => {
    let grade = finalGradeChanges.get(enrollmentId);

    const existingGrade = getFinalGradeFromAPI(finalGrades, enrollmentId);

    if (existingGrade && existingGrade?.is_posted) {
      toast.error('Final grade already posted');
      return;
    }

    // If no local change, try to use existing API grade
    if (grade === undefined && existingGrade?.grade !== undefined) {
      grade = Number(existingGrade.grade);
    }

    // If still undefined, try calculated grade
    if (grade === undefined) {
      const calculated = getFinalGrade(enrollmentId);
      grade = Number(calculated);
    }

    if (grade === undefined) {
      toast.error('Please enter a final grade before saving or posting');
      return;
    }

    // Validate grade is between 0 and 100
    if (grade < 0 || grade > 100) {
      toast.error('Final grade must be between 0 and 100');
      return;
    }

    try {
      await syncFinalGradeForSection({
        sectionId: section?.id ?? 0,
        data: [
          {
            id: existingGrade?.id ?? undefined,
            enrollment_id: enrollmentId,
            grade: grade,
            credited_units: existingGrade?.credited_units ?? undefined,
            is_posted: isPosted,
          },
        ],
      });

      toast.success(
        isPosted ? 'Final grade posted successfully' : 'Final grade saved successfully'
      );
      refetchFinalGrade();

      // Clear the local change after successful post
      setFinalGradeChanges((prev) => {
        const updated = new Map(prev);
        updated.delete(enrollmentId);
        return updated;
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to save/post final grade');
    }
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

  // Helper to get current period grade value
  const getCurrentPeriodGrade = (enrollmentId: number, periodId: number): number | string => {
    const key = `${enrollmentId}-${periodId}`;

    // Check if there's a local change first
    if (periodGradeChanges.has(key)) {
      return periodGradeChanges.get(key)!;
    }

    // Otherwise, get from calculated/API data
    return getPeriodGrade(enrollmentId, periodId);
  };

  // Helper to get current final grade value
  const getCurrentFinalGrade = (enrollmentId: number): number | string => {
    // Check if there's a local change first
    if (finalGradeChanges.has(enrollmentId)) {
      return finalGradeChanges.get(enrollmentId)!;
    }

    // Otherwise, get from calculated/API data
    return getFinalGrade(enrollmentId);
  };

  // Helper to calculate period grade
  const getPeriodGrade = (enrollmentId: number, periodId: number): string => {
    // First, check if we have a grade from the API
    const apiGrade = getPeriodGradeFromAPI(gradingPeriodGrades, enrollmentId, periodId);
    if (apiGrade?.grade !== undefined) {
      return Number(apiGrade.grade).toFixed(2);
    }

    // Fallback to calculation if no API grade exists
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

  // Helper to calculate final grade
  const getFinalGrade = (enrollmentId: number): string => {
    // First, check if we have a grade from the API
    const apiGrade = getFinalGradeFromAPI(finalGrades, enrollmentId);
    if (apiGrade?.grade !== undefined) {
      return Number(apiGrade.grade).toFixed(2);
    }

    // Fallback to calculation if no API grade exists
    let totalFinalGrade = 0;

    gradingPeriods.forEach((period) => {
      const periodGradeValue = getPeriodGrade(enrollmentId, period.id!);
      const periodGrade = Number(periodGradeValue) || 0;
      const periodWeight = Number(period.weight) || 0;

      totalFinalGrade += periodGrade * (periodWeight / 100);
    });

    return totalFinalGrade.toFixed(2);
  };

  // Helper to check if a period is posted for a specific enrollment
  const isPeriodPosted = (enrollmentId: number, periodId: number): boolean => {
    const periodGrade = getPeriodGradeFromAPI(gradingPeriodGrades, enrollmentId, periodId);
    return periodGrade?.is_posted ?? true;
  };

  // Helper to check if a period grade is overridden
  const isPeriodGradeOverridden = (enrollmentId: number, periodId: number): boolean => {
    const periodGrade = getPeriodGradeFromAPI(gradingPeriodGrades, enrollmentId, periodId);
    return periodGrade?.is_overridden ?? false;
  };

  // Helper to check if final grade is posted
  const isFinalGradePosted = (enrollmentId: number): boolean => {
    const finalGrade = getFinalGradeFromAPI(finalGrades, enrollmentId);
    return finalGrade?.is_posted ?? true;
  };

  // Helper to check if final grade is overridden
  const isFinalGradeOverridden = (enrollmentId: number): boolean => {
    const finalGrade = getFinalGradeFromAPI(finalGrades, enrollmentId);
    return finalGrade?.is_overridden ?? false;
  };

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalStudents = enrollments.length;
    const totalPeriods = gradingPeriods.length;
    const totalGradeSlots = totalStudents * totalPeriods;

    let postedCount = 0;
    let unpostedCount = 0;
    let missingGradesCount = 0;
    let overriddenCount = 0;
    let totalGradeSum = 0;
    let gradesWithValueCount = 0;

    enrollments.forEach((enrollment) => {
      gradingPeriods.forEach((period) => {
        const periodGrade = getPeriodGradeFromAPI(gradingPeriodGrades, enrollment.id!, period.id!);

        if (periodGrade) {
          if (periodGrade.is_posted) {
            postedCount++;
          } else {
            unpostedCount++;
          }

          if (periodGrade.is_overridden) {
            overriddenCount++;
          }

          if (periodGrade.grade !== undefined && periodGrade.grade !== null) {
            totalGradeSum += Number(periodGrade.grade);
            gradesWithValueCount++;
          } else {
            missingGradesCount++;
          }
        } else {
          missingGradesCount++;
          unpostedCount++;
        }
      });
    });

    const averageGrade = gradesWithValueCount > 0 ? totalGradeSum / gradesWithValueCount : 0;
    const completionRate =
      totalGradeSlots > 0 ? ((totalGradeSlots - missingGradesCount) / totalGradeSlots) * 100 : 0;

    return {
      totalStudents,
      totalPeriods,
      totalGradeSlots,
      postedCount,
      unpostedCount,
      missingGradesCount,
      overriddenCount,
      averageGrade,
      completionRate,
    };
  }, [enrollments, gradingPeriods, gradingPeriodGrades]);

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
      <div className="space-y-4">
        {/* Statistics Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
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
                        className="sticky left-0 z-20 bg-muted/50 font-semibold text-center text-foreground border-r border-border min-w-[150px]"
                        rowSpan={4}
                      >
                        Student Name
                      </TableHead>
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <TableHead
                          key={idx}
                          className="text-center font-semibold text-foreground bg-primary/10 border-r border-border whitespace-nowrap"
                          colSpan={3}
                        >
                          <Skeleton className="h-4 w-32 mx-auto" />
                        </TableHead>
                      ))}
                      <TableHead
                        className="text-center font-bold text-foreground bg-primary/10 border-r border-border whitespace-nowrap"
                        rowSpan={4}
                      >
                        Final Grade
                      </TableHead>
                    </TableRow>

                    {/* Row 2: Item Headers */}
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      {Array.from({ length: 3 }).map((_, periodIdx) => (
                        <Fragment key={periodIdx}>
                          {Array.from({ length: 2 }).map((_, itemIdx) => (
                            <TableHead
                              key={`${periodIdx}-${itemIdx}`}
                              className="text-center font-semibold text-foreground bg-secondary/20 border-r border-border whitespace-nowrap"
                            >
                              <Skeleton className="h-4 w-24 mx-auto" />
                            </TableHead>
                          ))}
                          <TableHead
                            className="text-center font-bold text-foreground bg-secondary/20 border-r border-border whitespace-nowrap align-middle"
                            rowSpan={3}
                          >
                            Grade
                          </TableHead>
                        </Fragment>
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
                          <Skeleton className="h-3 w-32 mx-auto" />
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
                          <TableCell
                            key={colIdx}
                            className="text-center p-2 border-r border-border"
                          >
                            <Skeleton className="h-8 w-full" />
                          </TableCell>
                        ))}
                        {Array.from({ length: 3 }).map((_, gradeIdx) => (
                          <TableCell
                            key={`grade-${gradeIdx}`}
                            className="text-center p-2 border-r border-border font-bold bg-muted/10"
                          >
                            <div className="flex items-center gap-2 justify-center">
                              <Skeleton className="h-9 w-24" />
                              <Skeleton className="h-9 w-16" />
                              <Skeleton className="h-9 w-16" />
                            </div>
                          </TableCell>
                        ))}
                        <TableCell className="text-center p-2 border-r border-border font-bold bg-muted/10">
                          <div className="flex items-center gap-2 justify-center">
                            <Skeleton className="h-9 w-24" />
                            <Skeleton className="h-9 w-16" />
                            <Skeleton className="h-9 w-16" />
                          </div>
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
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {statistics.totalStudents}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Enrolled in section</p>
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
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {statistics.postedCount}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              Out of {statistics.totalGradeSlots} total
            </p>
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
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {statistics.unpostedCount}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Not yet posted</p>
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
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">
              {statistics.missingGradesCount}
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">Need attention</p>
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
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {statistics.averageGrade.toFixed(2)}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Across all periods</p>
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
            <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
              {statistics.completionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
              {statistics.overriddenCount} overridden
            </p>
          </CardContent>
        </Card>
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
                      className="sticky left-0 z-20 bg-muted/50 font-semibold text-center text-foreground border-r border-border min-w-[150px]"
                      rowSpan={hasColumns ? 4 : 1}
                    >
                      Student Name
                    </TableHead>
                    {hasColumns ? (
                      <>
                        {gradingPeriods.map((period, periodIdx) => {
                          const items =
                            (period.gradebook_items as GradeBookItem[] | undefined) || [];
                          const totalDetailCount = items.reduce((sum, item) => {
                            const details =
                              (item.gradebook_item_details as GradeBookItemDetail[] | undefined) ||
                              [];
                            return sum + (details.length || 1);
                          }, 0);

                          const changesCount = getChangesCountForPeriod(period.id ?? 0);

                          return (
                            <TableHead
                              key={periodIdx}
                              className="text-center font-semibold text-foreground bg-primary/10 border-r border-border whitespace-nowrap"
                              colSpan={(totalDetailCount || 1) + 1}
                            >
                              <div className="w-full relative flex items-center justify-center gap-2">
                                <span>
                                  {period.title}{' '}
                                  <span className="text-muted-foreground">({period.weight}%)</span>
                                </span>
                                {changesCount > 0 && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleSaveScores(period.id ?? 0)}
                                    disabled={isSyncingScore}
                                    className="h-7 text-xs absolute right-0"
                                  >
                                    Save Changes ({changesCount})
                                  </Button>
                                )}
                              </div>
                            </TableHead>
                          );
                        })}
                        <TableHead
                          className="text-center font-bold text-foreground bg-primary/10 border-r border-border whitespace-nowrap"
                          rowSpan={4}
                        >
                          Final Grade
                        </TableHead>
                      </>
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
                        <>
                          {columns.map((col, idx) => {
                            if (col.isPeriodGrade) {
                              const periodGrade = getPeriodGradeFromAPI(
                                gradingPeriodGrades,
                                enrollment.id!,
                                col.periodId
                              );
                              const isPosted = periodGrade?.is_posted ?? true;
                              const isOverridden = isPeriodGradeOverridden(
                                enrollment.id!,
                                col.periodId
                              );
                              const currentValue = getCurrentPeriodGrade(
                                enrollment.id!,
                                col.periodId
                              );

                              return (
                                <TableCell
                                  key={idx}
                                  className="text-center p-2 border-r border-border font-bold bg-muted/10"
                                >
                                  <div className="flex items-center gap-2 justify-center">
                                    <div className="relative">
                                      <Input
                                        type="number"
                                        className={`w-24 text-center h-9 border border-input bg-background focus-visible:bg-accent/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring transition-all`}
                                        placeholder="0.00"
                                        min={0}
                                        max={100}
                                        step="0.01"
                                        value={currentValue}
                                        onChange={(e) => {
                                          handlePeriodGradeChange(
                                            enrollment.id!,
                                            col.periodId,
                                            e.target.value
                                          );
                                        }}
                                        disabled={isPosted}
                                      />
                                      {isOverridden && (
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <span className="absolute -top-1 -right-1 text-orange-500 text-xs font-bold cursor-help">
                                              ⚠
                                            </span>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-80">
                                            <div className="space-y-2">
                                              <p className="text-sm font-medium">Grade Override</p>
                                              <p className="text-sm text-muted-foreground">
                                                Grade has been manually overridden from{' '}
                                                <span className="font-semibold">
                                                  {periodGrade?.recommended_grade?.toFixed(2)}
                                                </span>{' '}
                                                to{' '}
                                                <span className="font-semibold">
                                                  {currentValue}
                                                </span>
                                              </p>
                                            </div>
                                          </PopoverContent>
                                        </Popover>
                                      )}
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-9 px-4 font-medium hover:bg-blue-600 hover:text-white border-blue-500 text-blue-600 transition-all shadow-sm hover:shadow-md"
                                      onClick={() =>
                                        handleSyncGradingPeriodGrade(
                                          enrollment.id!,
                                          col.periodId,
                                          false
                                        )
                                      }
                                      disabled={isPosted || isSyncingGradingPeriodGrade}
                                    >
                                      {isSyncingGradingPeriodGrade ? 'Saving...' : 'Save'}
                                    </Button>

                                    <Button
                                      size="sm"
                                      variant={isPosted ? 'secondary' : 'default'}
                                      className={`h-9 px-4 font-medium transition-all shadow-sm hover:shadow-md ${
                                        isPosted
                                          ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                                          : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                      }`}
                                      onClick={() => {
                                        confirm.confirm(async () => {
                                          await handleSyncGradingPeriodGrade(
                                            enrollment.id!,
                                            col.periodId,
                                            true
                                          );
                                        });
                                      }}
                                      disabled={isPosted || isSyncingGradingPeriodGrade}
                                    >
                                      {isPosted ? '✓ Posted' : 'Post'}
                                    </Button>
                                  </div>
                                </TableCell>
                              );
                            }

                            const currentValue = !col.isPlaceholder
                              ? getCurrentScore(enrollment.id!, col.detailId)
                              : '';
                            const isPosted = isPeriodPosted(enrollment.id!, col.periodId);

                            return (
                              <TableCell
                                key={idx}
                                className="text-center p-2 border-r border-border"
                              >
                                {!col.isPlaceholder ? (
                                  <Input
                                    type="number"
                                    className="w-full text-center h-8 border-none bg-transparent focus-visible:bg-accent/10 focus-visible:ring-1 focus-visible:ring-ring shadow-none"
                                    placeholder="0"
                                    min={col.detailMinScore}
                                    max={col.detailMaxScore}
                                    value={currentValue}
                                    onChange={(e) => {
                                      handleScoreChange(
                                        enrollment.id!,
                                        col.detailId,
                                        e.target.value
                                      );
                                    }}
                                    disabled={isPosted}
                                  />
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                            );
                          })}
                          {/* Final Grade Column */}
                          <TableCell className="text-center p-2 border-r border-border font-bold bg-muted/10">
                            <div className="flex items-center gap-2 justify-center">
                              <div className="relative">
                                <Input
                                  type="number"
                                  className={`w-24 text-center h-9 border border-input bg-background focus-visible:bg-accent/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring transition-all`}
                                  placeholder="0.00"
                                  min={0}
                                  max={100}
                                  step="0.01"
                                  value={getCurrentFinalGrade(enrollment.id!)}
                                  onChange={(e) => {
                                    handleFinalGradeChange(enrollment.id!, e.target.value);
                                  }}
                                  disabled={isFinalGradePosted(enrollment.id!)}
                                />
                                {isFinalGradeOverridden(enrollment.id!) && (
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <span className="absolute -top-1 -right-1 text-orange-500 text-xs font-bold cursor-help">
                                        ⚠
                                      </span>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                      <div className="space-y-2">
                                        <p className="text-sm font-medium">Final Grade Override</p>
                                        <p className="text-sm text-muted-foreground">
                                          Final grade has been manually overridden from{' '}
                                          <span className="font-semibold">
                                            {getFinalGradeFromAPI(
                                              finalGrades,
                                              enrollment.id!
                                            )?.recommended_grade?.toFixed(2)}
                                          </span>{' '}
                                          to{' '}
                                          <span className="font-semibold">
                                            {getCurrentFinalGrade(enrollment.id!)}
                                          </span>
                                        </p>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9 px-4 font-medium hover:bg-blue-600 hover:text-white border-blue-500 text-blue-600 transition-all shadow-sm hover:shadow-md"
                                onClick={() => handleSyncFinalGrade(enrollment.id!, false)}
                                disabled={isFinalGradePosted(enrollment.id!) || isSyncingFinalGrade}
                              >
                                {isSyncingFinalGrade ? 'Saving...' : 'Save'}
                              </Button>

                              <Button
                                size="sm"
                                variant={
                                  isFinalGradePosted(enrollment.id!) ? 'secondary' : 'default'
                                }
                                className={`h-9 px-4 font-medium transition-all shadow-sm hover:shadow-md ${
                                  isFinalGradePosted(enrollment.id!)
                                    ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                                    : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                }`}
                                onClick={() => {
                                  confirm.confirm(async () => {
                                    await handleSyncFinalGrade(enrollment.id!, true);
                                  });
                                }}
                                disabled={isFinalGradePosted(enrollment.id!) || isSyncingFinalGrade}
                              >
                                {isFinalGradePosted(enrollment.id!) ? '✓ Posted' : 'Post'}
                              </Button>
                            </div>
                          </TableCell>
                        </>
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
