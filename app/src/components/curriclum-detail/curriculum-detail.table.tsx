import { useModal } from '@/components/custom/modal.component';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useUpdateCurriculumDetail } from '@rest/api';
import type { CurriculumDetail } from '@rest/models';
import { BookOpen, Calendar, FlaskConical, GraduationCap } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import CurriculumDetailUpdateModal from './curriculum-detail-update.modal';

interface CurriculumTableProps {
  curriculumDetails: CurriculumDetail[];
  isLoading?: boolean;
  allowEdit?: boolean;
  onGenerateSchedule?: (data: ScheduleGenerationData) => void;
}

interface GroupedCurriculumDetails {
  [year: number]: {
    [term: number]: CurriculumDetail[];
  };
}

export interface ScheduleGenerationData {
  year: number;
  term: number;
  numberOfSchedules: number;
  autoPost: boolean;
}

export default function CurriculumTable({
  curriculumDetails,
  isLoading = false,
  allowEdit = false,
  onGenerateSchedule,
}: CurriculumTableProps): React.ReactNode {
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [numberOfSchedules, setNumberOfSchedules] = useState<{ [key: string]: string }>({});
  const [autoPost, setAutoPost] = useState<{ [key: string]: boolean }>({});

  const { mutateAsync: updateCurriculumDetail } = useUpdateCurriculumDetail();

  const modalController = useModal<CurriculumDetail>();

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

  const handleGenerateSchedule = (year: number, term: number) => {
    const key = `${year}-${term}`;
    const numSchedules = parseInt(numberOfSchedules[key] || '1', 10);

    if (isNaN(numSchedules) || numSchedules < 1) {
      return;
    }

    const data: ScheduleGenerationData = {
      year,
      term,
      numberOfSchedules: numSchedules,
      autoPost: autoPost[key] || false,
    };

    if (onGenerateSchedule) {
      onGenerateSchedule(data);
    }

    setOpenPopover(null);
    setNumberOfSchedules((prev) => ({ ...prev, [key]: '' }));
    setAutoPost((prev) => ({ ...prev, [key]: false }));
  };

  const handleInputChange = (year: number, term: number, value: string) => {
    const key = `${year}-${term}`;
    setNumberOfSchedules((prev) => ({ ...prev, [key]: value }));
  };

  const handleAutoPostChange = (year: number, term: number, checked: boolean) => {
    const key = `${year}-${term}`;
    setAutoPost((prev) => ({ ...prev, [key]: checked }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, yearIndex) => (
          <Card key={yearIndex}>
            <CardHeader className="py-3">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="py-3">
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const handleUpdateCurriculumDetail = async (data: CurriculumDetail) => {
    modalController.openFn(data);
  };

  if (curriculumDetails.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <BookOpen className="h-12 w-12 text-muted-foreground opacity-50 mb-3" />
          <p className="text-sm text-muted-foreground">No curriculum details available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sortedYears.map((year) => {
        const terms = groupedDetails[year];
        const sortedTerms = Object.keys(terms)
          .map(Number)
          .sort((a, b) => a - b);

        return (
          <Card key={year} className="overflow-hidden border shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 text-white py-2.5 px-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <CardTitle className="text-base font-bold">
                  {curriculumDetails.find((d) => d.year_order === year)?.year_label ||
                    `Year ${year}`}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {sortedTerms.map((term, termIndex) => {
                const courses = terms[term];
                const termLabel =
                  courses[0]?.term_label || courses[0]?.term_alias || `Term ${term}`;
                const popoverKey = `${year}-${term}`;

                const totalLectureUnits = courses.reduce(
                  (sum, d) => sum + (d.course?.lecture_units || 0),
                  0
                );
                const totalLabUnits = courses.reduce(
                  (sum, d) => sum + (d.course?.laboratory_units || 0),
                  0
                );
                const totalCreditUnits = courses.reduce(
                  (sum, d) => sum + (d.course?.credit_units || 0),
                  0
                );

                return (
                  <div
                    key={term}
                    className={
                      termIndex > 0 ? 'border-t-2 border-slate-200 dark:border-slate-700' : ''
                    }
                  >
                    <div className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 px-4 py-2 border-b border-slate-300 dark:border-slate-600">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                          {termLabel}
                        </h3>
                        <div className="flex items-center gap-3">
                          <div className="flex gap-3 text-xs font-semibold">
                            <span className="text-slate-600 dark:text-slate-400">
                              Total Units:{' '}
                              <span className="text-blue-600 dark:text-blue-400">
                                {totalCreditUnits}
                              </span>
                            </span>
                          </div>
                          <Popover
                            open={openPopover === popoverKey}
                            onOpenChange={(open) => setOpenPopover(open ? popoverKey : null)}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs gap-1.5 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400"
                              >
                                <Calendar className="h-3 w-3" />
                                Generate Schedule
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium text-sm">Generate Schedules</h4>
                                  <p className="text-xs text-muted-foreground">
                                    Configure schedule generation settings for {termLabel}
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`schedules-${popoverKey}`} className="text-xs">
                                    Number of Schedules
                                  </Label>
                                  <Input
                                    id={`schedules-${popoverKey}`}
                                    type="number"
                                    min="1"
                                    placeholder="Enter number"
                                    value={numberOfSchedules[popoverKey] || ''}
                                    onChange={(e) => handleInputChange(year, term, e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        handleGenerateSchedule(year, term);
                                      }
                                    }}
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`auto-post-${popoverKey}`}
                                    checked={autoPost[popoverKey] || false}
                                    onCheckedChange={(checked) =>
                                      handleAutoPostChange(year, term, checked as boolean)
                                    }
                                  />
                                  <Label
                                    htmlFor={`auto-post-${popoverKey}`}
                                    className="text-xs font-normal cursor-pointer"
                                  >
                                    Auto-post generated schedules
                                  </Label>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setOpenPopover(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleGenerateSchedule(year, term)}
                                  >
                                    Generate
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50 dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900">
                            <TableHead className="w-[120px] font-semibold text-xs text-slate-700 dark:text-slate-300 border-r py-2">
                              Course Code
                            </TableHead>
                            <TableHead className="font-semibold text-xs text-slate-700 dark:text-slate-300 border-r py-2">
                              Course Title
                            </TableHead>
                            <TableHead className="w-[70px] text-center font-semibold text-xs text-slate-700 dark:text-slate-300 border-r py-2">
                              Lec
                            </TableHead>
                            <TableHead className="w-[70px] text-center font-semibold text-xs text-slate-700 dark:text-slate-300 border-r py-2">
                              Lab
                            </TableHead>
                            <TableHead className="w-[70px] text-center font-semibold text-xs text-slate-700 dark:text-slate-300 border-r py-2">
                              Units
                            </TableHead>
                            <TableHead className="w-[100px] text-center font-semibold text-xs text-slate-700 dark:text-slate-300 border-r py-2">
                              Type
                            </TableHead>
                            <TableHead className="w-[70px] text-center font-semibold text-xs text-slate-700 dark:text-slate-300 py-2">
                              GWA
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {courses.map((detail, index) => (
                            <TableRow
                              key={detail.id}
                              className={
                                index % 2 === 0
                                  ? 'bg-white dark:bg-slate-950'
                                  : 'bg-slate-50/50 dark:bg-slate-900/50'
                              }
                              onClick={() => handleUpdateCurriculumDetail(detail)}
                            >
                              <TableCell className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-400 border-r py-2">
                                {detail.course?.course_code}
                              </TableCell>
                              <TableCell className="border-r py-2">
                                <div className="space-y-0.5">
                                  <div className="font-medium text-xs text-slate-900 dark:text-slate-100">
                                    {detail.course?.course_title}
                                  </div>
                                  {detail.course?.course_description && (
                                    <div className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-1">
                                      {detail.course.course_description}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-center text-xs font-medium border-r py-2">
                                {detail.course?.lecture_units || 0}
                              </TableCell>
                              <TableCell className="text-center text-xs font-medium border-r py-2">
                                {detail.course?.laboratory_units || 0}
                              </TableCell>
                              <TableCell className="text-center font-semibold text-sm text-blue-600 dark:text-blue-400 border-r py-2">
                                {detail.course?.credit_units || 0}
                              </TableCell>
                              <TableCell className="text-center border-r py-2">
                                <div className="flex items-center justify-center gap-1 flex-wrap">
                                  {detail.course?.with_laboratory && (
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] px-1.5 py-0 h-5 bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700"
                                    >
                                      <FlaskConical className="h-2.5 w-2.5 mr-0.5" />
                                      Lab
                                    </Badge>
                                  )}
                                  {detail.course?.is_specialize && (
                                    <Badge
                                      variant="secondary"
                                      className="text-[10px] px-1.5 py-0 h-5 bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700"
                                    >
                                      Spec
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-center py-2">
                                {detail.is_include_gwa ? (
                                  <Badge className="text-[10px] px-1.5 py-0 h-5 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">
                                    Yes
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-1.5 py-0 h-5 text-slate-600 dark:text-slate-400"
                                  >
                                    No
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 font-semibold hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/50 dark:hover:to-indigo-950/50 border-t-2 border-blue-300 dark:border-blue-700">
                            <TableCell
                              colSpan={2}
                              className="text-right text-xs text-slate-800 dark:text-slate-200 border-r py-2"
                            >
                              TERM TOTAL:
                            </TableCell>
                            <TableCell className="text-center text-xs text-blue-700 dark:text-blue-400 border-r py-2">
                              {totalLectureUnits}
                            </TableCell>
                            <TableCell className="text-center text-xs text-blue-700 dark:text-blue-400 border-r py-2">
                              {totalLabUnits}
                            </TableCell>
                            <TableCell className="text-center text-sm font-bold text-blue-700 dark:text-blue-400 border-r py-2">
                              {totalCreditUnits}
                            </TableCell>
                            <TableCell colSpan={2} className="py-2" />
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
      <CurriculumDetailUpdateModal controller={modalController} onSubmit={() => {}} />
    </div>
  );
}
