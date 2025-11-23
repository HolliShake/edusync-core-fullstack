/**
 * GradeBookView Component
 *
 * A comprehensive gradebook management interface that allows instructors to:
 * - View and manage grading periods
 * - Create and organize grade book items (assignments, exams, etc.)
 * - Define item details with weights and maximum scores
 * - Track completion status and statistics
 *
 * The component uses an accordion-based layout to organize grading periods,
 * with nested items and their details. It provides modals for creating/editing
 * grading periods, items, and item details.
 *
 * @component
 * @example
 * ```tsx
 * <GradeBookView
 *   defaultGradebook={gradebook}
 *   isLoading={false}
 * />
 * ```
 */

import { useConfirm } from '@/components/confirm.provider';
import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import GradebookGradingPeriodModal from '@/components/gradebook/gradebook-grading-period.modal';
import GradebookItemDetailModal from '@/components/gradebook/gradebook-item-detail.modal';
import GradebookItemModal from '@/components/gradebook/gradebook-item.modal';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useDeleteGradeBookItem,
  useDeleteGradeBookItemDetail,
  useGetGradeBookById,
} from '@rest/api';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  DeleteIcon,
  EditIcon,
  EllipsisIcon,
  FileText,
  PlusIcon,
  TrendingUp,
} from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import type { GradeBook } from '@rest/models/gradeBook';
import type { GradeBookGradingPeriod } from '@rest/models/gradeBookGradingPeriod';
import type { GradeBookItem } from '@rest/models/gradeBookItem';
import type { GradeBookItemDetail } from '@rest/models/gradeBookItemDetail';

export interface GradeBookViewProps {
  defaultGradebook: GradeBook;
  isLoading?: boolean;
}

export default function GradeBookView({
  defaultGradebook,
  isLoading,
}: GradeBookViewProps): React.ReactNode {
  const { data: gradebookData, refetch } = useGetGradeBookById(defaultGradebook.id!, {
    query: {
      enabled: false,
    },
  });

  const gradebook = useMemo(
    () => (gradebookData?.data as GradeBook) ?? defaultGradebook,
    [gradebookData, defaultGradebook]
  );

  const defaultGradingPeriod: GradeBookGradingPeriod = useMemo(
    () => ({
      gradebook_id: gradebook?.id ?? 0,
      title: '',
      weight: 0,
    }),
    [gradebook]
  );

  const gradingPeriodController = useModal<GradeBookGradingPeriod>();
  const itemController = useModal<GradeBookItem & { gradebook_grading_period_id?: number }>();
  const itemDetailController = useModal<GradeBookItemDetail & { gradebook_item_id?: number }>();
  const confirm = useConfirm();

  const { mutateAsync: deleteGradeBookItem } = useDeleteGradeBookItem();
  const { mutateAsync: deleteGradeBookItemDetail } = useDeleteGradeBookItemDetail();

  // Get all grading periods in this gradebook
  const gradingPeriods = useMemo(
    () => (gradebook?.gradebook_grading_periods as GradeBookGradingPeriod[] | undefined) || [],
    [gradebook]
  );

  // Functions for weight computations:
  const getGradingPeriodTotalWeight = (gradingPeriod: GradeBookGradingPeriod) => {
    const weight =
      (gradingPeriod.gradebook_items as GradeBookItem[] | undefined)?.reduce(
        (sum, item) => sum + (Number(item.weight) || 0),
        0
      ) || 0;
    return Number(weight);
  };

  const getItemDetailsTotalWeight = (item: GradeBookItem) => {
    const weight =
      (item.gradebook_item_details as GradeBookItemDetail[] | undefined)?.reduce(
        (sum, detail) => sum + (Number(detail.weight) || 0),
        0
      ) || 0;
    return Number(weight);
  };

  // Gradebook-level: sum over all periods' weights (not item weights)
  const totalWeight = useMemo(() => {
    return gradingPeriods.reduce((sum, gp) => sum + (Number(gp.weight) || 0), 0);
  }, [gradingPeriods]);

  const handleDeleteItem = async (item: GradeBookItem) => {
    confirm.confirm(async () => {
      try {
        await deleteGradeBookItem({ id: item.id as number });
        toast.success('Gradebook item deleted successfully');
        refetch?.();
      } catch (error) {
        toast.error('Failed to delete gradebook item');
        console.error('Delete error:', error);
      }
    });
  };

  const handleDeleteItemDetail = async (detail: GradeBookItemDetail) => {
    confirm.confirm(async () => {
      try {
        await deleteGradeBookItemDetail({ id: detail.id as number });
        toast.success('Item detail deleted successfully');
        refetch?.();
      } catch (error) {
        toast.error('Failed to delete item detail');
        console.error('Delete error:', error);
      }
    });
  };

  // Use Accordion (shadcn UI) instead of manual panel logic
  const [accordionValue, setAccordionValue] = useState<string[]>([]);
  // Store active item tab for each grading period
  const [activeTabPerGradingPeriod, setActiveTabPerGradingPeriod] = useState<
    Record<number, string>
  >({});

  function handleOpenGradingPeriodModal(preset?: any) {
    gradingPeriodController.openFn(preset);
  }

  function handleOpenItemModal(gradingPeriod: GradeBookGradingPeriod, preset?: any) {
    itemController.openFn({ gradebook_grading_period_id: gradingPeriod.id, ...preset });
    setAccordionValue([gradingPeriod.id?.toString() || ''] as string[]); // expand this accordion item
  }

  function handleTabChange(periodId: number, itemId: string) {
    setActiveTabPerGradingPeriod((tabs) => ({
      ...tabs,
      [periodId]: itemId,
    }));
  }

  const handleGradingPeriodSubmit = () => {
    refetch?.();
  };

  const handleItemSubmit = () => {
    refetch?.();
  };

  const handleItemDetailSubmit = () => {
    refetch?.();
  };

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
                          <Skeleton className="h-5 w-32 rounded-full" />
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
                  <div className="space-y-6">
                    {/* Tabs skeleton */}
                    <div className="w-full flex gap-2 bg-muted/80 rounded-xl p-2 shadow-inner">
                      {Array.from({ length: 2 }).map((_, j) => (
                        <Skeleton key={j} className="h-10 w-32 rounded-lg" />
                      ))}
                    </div>

                    {/* Tab content skeleton */}
                    <Card className="!shadow-none !border-2 p-0 bg-muted/20 rounded-xl">
                      <CardHeader className="flex flex-row items-start justify-between pb-4 px-6 pt-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                          </div>
                          <Skeleton className="h-4 w-32 mt-2 ml-11" />
                        </div>
                        <Skeleton className="h-9 w-9 rounded-xl" />
                      </CardHeader>
                      <CardContent className="px-6 pb-6">
                        {/* Weight summary skeleton */}
                        <div className="mb-6 rounded-xl bg-muted/80 p-5 shadow-md border-2 border-muted">
                          <div className="flex items-center justify-between gap-4 mb-3">
                            <div>
                              <Skeleton className="h-5 w-48 mb-2" />
                              <Skeleton className="h-3 w-40" />
                            </div>
                            <div className="text-right">
                              <Skeleton className="h-12 w-32 rounded-xl mb-2" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                          <Skeleton className="h-2.5 w-full rounded-full" />
                        </div>

                        {/* Item details skeleton */}
                        <div className="space-y-3">
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
                      </CardContent>
                    </Card>
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
    return null;
  }

  return (
    <>
      <div className="space-y-8">
        {/* Enhanced Summary Card */}
        <Card className="border-2 shadow-xl overflow-hidden">
          <CardHeader className="bg-muted/50 pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span>Gradebook Overview</span>
              {totalWeight === 100 ? (
                <span className="text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 ml-auto px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  Complete
                </span>
              ) : (
                <span className="text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 ml-auto px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm">
                  <AlertCircle className="h-4 w-4" />
                  Needs Adjustment
                </span>
              )}
            </CardTitle>
            <CardDescription className="mt-2 text-base">
              Track your grading structure and ensure proper weight distribution
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/10 rounded-2xl" />
                <div className="relative space-y-2 p-6 rounded-2xl border-2 border-blue-200/50 dark:border-blue-800/50 bg-background shadow-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Grading Periods
                    </p>
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-4xl font-black text-blue-600 dark:text-blue-400">
                    {gradingPeriods.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Active periods</p>
                </div>
              </div>

              <div className="relative overflow-hidden">
                <div
                  className={`absolute inset-0 rounded-2xl ${totalWeight === 100 ? 'bg-green-500/10' : 'bg-amber-500/10'}`}
                />
                <div
                  className="relative space-y-2 p-6 rounded-2xl border-2 bg-background shadow-lg"
                  style={{
                    borderColor:
                      totalWeight === 100 ? 'rgb(134 239 172 / 0.5)' : 'rgb(252 211 77 / 0.5)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Total Weight
                    </p>
                    <TrendingUp
                      className={`h-5 w-5 ${totalWeight === 100 ? 'text-green-500' : 'text-amber-500'}`}
                    />
                  </div>
                  <p
                    className={`text-4xl font-black ${totalWeight === 100 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}
                  >
                    {totalWeight.toFixed(1)}%
                  </p>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${totalWeight === 100 ? 'bg-green-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(totalWeight, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden">
                <div
                  className={`absolute inset-0 rounded-2xl ${totalWeight === 100 ? 'bg-green-500/10' : 'bg-amber-500/10'}`}
                />
                <div
                  className="relative space-y-2 p-6 rounded-2xl border-2 bg-background shadow-lg"
                  style={{
                    borderColor:
                      totalWeight === 100 ? 'rgb(134 239 172 / 0.5)' : 'rgb(252 211 77 / 0.5)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Status
                    </p>
                    {totalWeight === 100 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    )}
                  </div>
                  <p
                    className={`text-3xl font-black ${totalWeight === 100 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}
                  >
                    {totalWeight === 100 ? 'Complete' : 'Incomplete'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {totalWeight === 100
                      ? 'All weights balanced'
                      : `${(100 - totalWeight).toFixed(1)}% remaining`}
                  </p>
                </div>
              </div>
            </div>

            {totalWeight !== 100 && (
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border-2 border-amber-200 dark:border-amber-800 flex items-start gap-3 shadow-sm">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-amber-900 dark:text-amber-300 mb-1">
                    Weight Adjustment Needed
                  </p>
                  <p className="text-sm text-amber-800 dark:text-amber-400">
                    Total weight should equal 100%. Current total:{' '}
                    <span className="font-bold">{totalWeight.toFixed(2)}%</span>
                    {totalWeight < 100 && (
                      <span className="ml-1">({(100 - totalWeight).toFixed(2)}% remaining)</span>
                    )}
                    {totalWeight > 100 && (
                      <span className="ml-1">({(totalWeight - 100).toFixed(2)}% over limit)</span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Grading Periods Section */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Grading Periods</h2>
            {gradingPeriods.length > 0 && (
              <Button
                onClick={() => handleOpenGradingPeriodModal(defaultGradingPeriod)}
                disabled={totalWeight >= 100}
                className="font-semibold gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <PlusIcon className="w-5 h-5" />
                Add Grading Period
              </Button>
            )}
          </div>

          {gradingPeriods.length === 0 ? (
            <Card className="border-2 border-dashed border-muted-foreground/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                  <Calendar className="h-10 w-10 text-primary" />
                </div>
                <p className="text-muted-foreground mb-2 text-xl font-semibold">
                  No grading periods yet
                </p>
                <p className="text-sm text-muted-foreground mb-6 max-w-md text-center">
                  Get started by creating your first grading period to organize your gradebook
                </p>
                <Button
                  size="lg"
                  onClick={() => handleOpenGradingPeriodModal(defaultGradingPeriod)}
                  className="font-semibold gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <PlusIcon className="w-5 h-5" />
                  Create First Grading Period
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Accordion
              type="single"
              collapsible
              value={accordionValue[0] || ''}
              onValueChange={(val) => setAccordionValue(typeof val === 'string' ? [val] : [])}
              className="space-y-4"
            >
              {gradingPeriods.map((gradingPeriod) => {
                const gpItems = (gradingPeriod.gradebook_items || []) as GradeBookItem[];
                const periodTotalWeight = getGradingPeriodTotalWeight(gradingPeriod);
                const periodActiveTab =
                  activeTabPerGradingPeriod[gradingPeriod.id as number] ||
                  gpItems[0]?.id?.toString() ||
                  '';

                return (
                  <AccordionItem
                    value={gradingPeriod.id?.toString() || ''}
                    key={gradingPeriod.id}
                    className="rounded-2xl shadow-lg border-2 bg-background overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative group bg-muted/80 hover:bg-muted rounded-t-2xl transition-all duration-200">
                      <AccordionTrigger className="!no-underline px-6 py-5 bg-transparent hover:bg-transparent w-full">
                        <div className="flex flex-1 items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-md">
                              <Calendar className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <div className="flex flex-col gap-1 items-start">
                              <div className="flex items-center gap-3">
                                <span className="truncate max-w-xs md:max-w-lg font-bold text-lg">
                                  {gradingPeriod.title}
                                </span>
                                <span
                                  title={`Period Weight: ${Number(gradingPeriod.weight || 0).toFixed(2)}%`}
                                  className="text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1 shadow-sm bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                >
                                  {Number(gradingPeriod.weight || 0).toFixed(1)}%
                                </span>
                                <span
                                  title={`Total Item Weight: ${periodTotalWeight.toFixed(2)}%`}
                                  className={`text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1 shadow-sm
                                  ${
                                    periodTotalWeight === 100
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                  }`}
                                >
                                  {periodTotalWeight === 100 ? (
                                    <CheckCircle2 className="h-3 w-3" />
                                  ) : (
                                    <AlertCircle className="h-3 w-3" />
                                  )}
                                  Items: {periodTotalWeight.toFixed(1)}%
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                                <FileText className="h-3 w-3" />
                                {gpItems?.length || 0} item{gpItems?.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <div className="absolute right-14 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Add Item"
                          className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                          disabled={periodTotalWeight >= 100}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenItemModal(gradingPeriod);
                          }}
                        >
                          <PlusIcon className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Add Item</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Edit Grading Period"
                          className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            gradingPeriodController.openFn(gradingPeriod);
                          }}
                        >
                          <EditIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <AccordionContent>
                      <Card className="!shadow-none !border-0 rounded-t-none bg-transparent">
                        <CardContent className="pb-8 pt-6 px-6">
                          {gpItems.length === 0 ? (
                            <div className="flex flex-col items-center py-12 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/20">
                              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                                <FileText className="h-8 w-8 text-primary" />
                              </div>
                              <p className="mb-1 text-lg font-semibold">No items added yet</p>
                              <p className="text-sm text-muted-foreground mb-4">
                                Start by adding your first gradebook item
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="font-semibold shadow-sm hover:shadow-md transition-all"
                                onClick={() => handleOpenItemModal(gradingPeriod)}
                              >
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Add First Item
                              </Button>
                            </div>
                          ) : (
                            <Tabs
                              defaultValue={periodActiveTab}
                              value={periodActiveTab}
                              className="w-full"
                              onValueChange={(val) =>
                                handleTabChange(gradingPeriod.id as number, val)
                              }
                            >
                              <TabsList className="w-full flex-wrap overflow-x-auto h-auto gap-2 flex bg-muted/80 rounded-xl p-2 shadow-inner">
                                {gpItems.map((item) => (
                                  <TabsTrigger
                                    key={item.id}
                                    value={item.id?.toString() || ''}
                                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg text-sm px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 hover:bg-muted"
                                  >
                                    <span className="truncate">{item.title}</span>
                                    <span className="ml-2 text-xs opacity-80 font-bold">
                                      {item.weight}%
                                    </span>
                                  </TabsTrigger>
                                ))}
                              </TabsList>
                              {gpItems.map((item) => {
                                const itemDetails = (item.gradebook_item_details ||
                                  []) as GradeBookItemDetail[];
                                const itemDetailsTotalWeight = getItemDetailsTotalWeight(item);
                                const isItemDetailsWeightComplete = itemDetailsTotalWeight === 100;

                                return (
                                  <TabsContent
                                    key={item.id}
                                    value={item.id?.toString() || ''}
                                    className="mt-6"
                                  >
                                    <Card className="!shadow-none !border-2 p-0 bg-muted/20 rounded-xl">
                                      <CardHeader className="flex flex-row items-start justify-between pb-4 px-6 pt-6">
                                        <div className="flex-1">
                                          <CardTitle className="flex items-center gap-3 text-lg font-bold">
                                            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                              <FileText className="h-4 w-4 text-primary" />
                                            </div>
                                            <span>{item.title}</span>
                                            <span className="text-sm font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                                              {item.weight}%
                                            </span>
                                          </CardTitle>
                                          <CardDescription className="text-sm mt-2 ml-11 flex items-center gap-1.5">
                                            <FileText className="h-3.5 w-3.5" />
                                            {itemDetails?.length || 0} detail
                                            {itemDetails?.length !== 1 ? 's' : ''}
                                          </CardDescription>
                                        </div>
                                        <Menu
                                          items={[
                                            {
                                              label: 'Add Detail',
                                              icon: <PlusIcon />,
                                              variant: 'default',
                                              onClick: () => {
                                                itemDetailController.openFn({
                                                  gradebook_item_id: item.id,
                                                } as any);
                                              },
                                              disabled: itemDetailsTotalWeight >= 100,
                                            },
                                            {
                                              label: 'Edit Item',
                                              icon: <EditIcon />,
                                              variant: 'default',
                                              onClick: () => itemController.openFn(item),
                                            },
                                            {
                                              label: 'Delete Item',
                                              icon: <DeleteIcon />,
                                              variant: 'destructive',
                                              onClick: () => handleDeleteItem(item),
                                            },
                                          ]}
                                          trigger={
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="rounded-xl hover:bg-primary/10 transition-colors"
                                            >
                                              <EllipsisIcon />
                                            </Button>
                                          }
                                        />
                                      </CardHeader>

                                      {itemDetails.length > 0 ? (
                                        <CardContent className="px-6 pb-6">
                                          <div className="mb-6 rounded-xl bg-muted/80 p-5 shadow-md border-2 border-muted">
                                            <div className="flex items-center justify-between gap-4 mb-3">
                                              <div>
                                                <p className="text-base font-bold flex items-center gap-2">
                                                  <TrendingUp className="h-4 w-4 text-primary" />
                                                  Details Weight Summary
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                  Combined weight of all details
                                                </p>
                                              </div>
                                              <div className="text-right">
                                                <span
                                                  className={`text-2xl font-black px-3 py-1.5 rounded-xl inline-flex items-center gap-2 shadow-sm
                                                  ${
                                                    isItemDetailsWeightComplete
                                                      ? 'text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
                                                      : 'text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400'
                                                  }`}
                                                >
                                                  {isItemDetailsWeightComplete ? (
                                                    <CheckCircle2 className="h-5 w-5" />
                                                  ) : (
                                                    <AlertCircle className="h-5 w-5" />
                                                  )}
                                                  {itemDetailsTotalWeight.toFixed(1)}%
                                                </span>
                                                <div className="text-xs mt-2 font-semibold">
                                                  {isItemDetailsWeightComplete ? (
                                                    <span className="text-green-700 dark:text-green-400">
                                                      ✓ Complete
                                                    </span>
                                                  ) : (
                                                    <span className="text-amber-700 dark:text-amber-400">
                                                      {(100 - itemDetailsTotalWeight).toFixed(1)}%
                                                      remaining
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="w-full bg-background/50 rounded-full h-2.5 overflow-hidden shadow-inner">
                                              <div
                                                className={`h-full rounded-full transition-all duration-500 ${isItemDetailsWeightComplete ? 'bg-green-500' : 'bg-amber-500'}`}
                                                style={{
                                                  width: `${Math.min(itemDetailsTotalWeight, 100)}%`,
                                                }}
                                              />
                                            </div>
                                            {!isItemDetailsWeightComplete && (
                                              <div className="mt-3 flex items-center gap-2 p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg text-amber-800 dark:text-amber-300 text-xs border border-amber-200 dark:border-amber-800">
                                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                                <span className="font-medium">
                                                  Details weight should equal 100%
                                                </span>
                                              </div>
                                            )}
                                          </div>

                                          <div className="space-y-3">
                                            {itemDetails.map((detail) => (
                                              <div
                                                key={detail.id}
                                                className="flex items-center justify-between p-4 rounded-xl bg-background border-2 shadow-md hover:shadow-lg transition-all duration-200 hover:border-primary/30"
                                              >
                                                <div className="flex-1">
                                                  <p className="font-bold truncate max-w-xs text-base mb-1.5">
                                                    {detail.title}
                                                  </p>
                                                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-lg">
                                                      <span className="text-xs font-medium">
                                                        Range:
                                                      </span>
                                                      <span className="font-bold text-foreground">
                                                        {detail.min_score} - {detail.max_score}
                                                      </span>
                                                    </span>
                                                    <span className="flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded-lg">
                                                      <span className="text-xs font-medium">
                                                        Weight:
                                                      </span>
                                                      <span className="font-bold text-primary">
                                                        {detail.weight}%
                                                      </span>
                                                    </span>
                                                  </div>
                                                </div>
                                                <div className="flex gap-2 ml-3">
                                                  <Button
                                                    variant="outline"
                                                    size="icon"
                                                    title="Edit Detail"
                                                    className="rounded-xl hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors"
                                                    onClick={() =>
                                                      itemDetailController.openFn(detail)
                                                    }
                                                  >
                                                    <EditIcon className="w-4 h-4" />
                                                  </Button>
                                                  <Button
                                                    variant="outline"
                                                    size="icon"
                                                    title="Delete Detail"
                                                    className="rounded-xl hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors"
                                                    onClick={() => handleDeleteItemDetail(detail)}
                                                  >
                                                    <DeleteIcon className="w-4 h-4" />
                                                  </Button>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </CardContent>
                                      ) : (
                                        <CardContent className="px-6 pb-6">
                                          <div className="flex flex-col items-center py-12 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/20">
                                            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                                              <FileText className="h-8 w-8 text-primary" />
                                            </div>
                                            <p className="mb-1 text-lg font-semibold">
                                              No details added yet
                                            </p>
                                            <p className="text-sm text-muted-foreground mb-4">
                                              Add details to break down this item
                                            </p>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="font-semibold shadow-sm hover:shadow-md transition-all"
                                              onClick={() =>
                                                itemDetailController.openFn({
                                                  gradebook_item_id: item.id,
                                                } as any)
                                              }
                                            >
                                              <PlusIcon className="w-4 h-4 mr-2" />
                                              Add First Detail
                                            </Button>
                                          </div>
                                        </CardContent>
                                      )}
                                    </Card>
                                  </TabsContent>
                                );
                              })}
                            </Tabs>
                          )}
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
      </div>

      <GradebookGradingPeriodModal
        controller={gradingPeriodController}
        onSubmit={handleGradingPeriodSubmit}
      />

      <GradebookItemModal controller={itemController} onSubmit={handleItemSubmit} />

      <GradebookItemDetailModal
        controller={itemDetailController}
        onSubmit={handleItemDetailSubmit}
      />
    </>
  );
}
