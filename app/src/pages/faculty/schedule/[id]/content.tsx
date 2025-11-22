import Select from '@/components/custom/select.component';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSectionTeacherContext } from '@/context/section-teacher.context';
import {
  useGenerateGradeBookFromTemplate,
  useGetGradeBookById,
  useGetGradeBookPaginated,
} from '@rest/api';
import { AlertCircle, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import FacultyScheduleClasslistTab from './classlist.tab';
import FacultyScheduleGradeTab from './grade.tab';

export default function FacultyScheduleDetailContent(): React.ReactNode {
  const sectionTeacher = useSectionTeacherContext();
  const storageKey = `faculty-schedule-tab-${window.location.pathname}`;

  const [selectedTab, setSelectedTab] = useState<string>(() => {
    const savedTab = localStorage.getItem(storageKey);
    return savedTab || 'grade';
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const section = useMemo(() => sectionTeacher?.section, [sectionTeacher]);

  const isSectionLoading = useMemo(() => !section, [section]);

  const { mutateAsync: generateGradeBook, isPending: isGeneratingGradeBook } =
    useGenerateGradeBookFromTemplate();

  const hasGradeBook = useMemo(() => {
    return section?.has_grade_book ?? false;
  }, [section]);

  const {
    data: gradeBookResponse,
    isLoading: isGradeBookLoading,
    refetch: refetchGradeBook,
  } = useGetGradeBookPaginated(
    {
      'filter[academic_program_id]':
        section?.curriculum_detail?.curriculum?.academic_program_id ?? 0,
      'filter[is_template]': true,
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
    },
    {
      query: {
        enabled: !hasGradeBook && !!section?.curriculum_detail?.curriculum?.academic_program_id,
      },
    }
  );

  const { data: selectedTemplateResponse, isLoading: isTemplateDetailLoading } =
    useGetGradeBookById(Number(selectedTemplate), {
      query: { enabled: !!selectedTemplate },
    });

  const gradeBookTemplateOptions = useMemo(() => {
    return (
      gradeBookResponse?.data?.data?.map((gradeBook) => ({
        label: gradeBook.title,
        value: `${gradeBook.id}`,
        subtitle: gradeBook.academic_program?.college?.campus?.name,
      })) ?? []
    );
  }, [gradeBookResponse]);

  const handleSetupGradeBook = async () => {
    if (!selectedTemplate) return;
    try {
      await generateGradeBook({
        isTemplateGradeBookId: Number(selectedTemplate),
        sectionId: section?.id ?? 0,
      });
      toast.success('Grade book generated successfully');
      refetchGradeBook();
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate grade book');
    }
  };

  const tabs = useMemo(() => {
    return [
      {
        label: 'Grade',
        value: 'grade',
        component: <FacultyScheduleGradeTab />,
      },
      {
        label: 'Class List',
        value: 'class-list',
        component: <FacultyScheduleClasslistTab />,
      },
      {
        label: 'Grade Book Setup',
        value: 'grade-book-setup',
        component: undefined,
      },
    ];
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, selectedTab);
  }, [selectedTab, storageKey]);

  return (
    <div className="space-y-6">
      {isSectionLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      ) : hasGradeBook ? (
        <Alert className="border-accent/30 bg-accent/10">
          <CheckCircle2 className="h-5 w-5 text-accent-foreground" />
          <AlertTitle className="font-semibold">Grade Book Ready!</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Your grade book is all set up and ready to use. You can start recording student grades
            and track their progress.
          </AlertDescription>
        </Alert>
      ) : (
        <Card className="border-primary/20 bg-gradient-to-br from-card to-secondary/10">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <AlertCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Grade Book Setup Required
                </CardTitle>
                <CardDescription className="mt-2">
                  Let's get your grade book ready! Choose a template that matches your teaching
                  style and grading criteria. This will help you track student performance
                  efficiently.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="template-select"
                className="text-base font-semibold text-card-foreground flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4 text-primary" />
                Select a Grade Book Template
              </Label>
              <p className="text-sm text-muted-foreground">
                Choose from pre-configured templates designed for your academic program. Each
                template includes standard grading components and can be customized later.
              </p>
              {isGradeBookLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={selectedTemplate}
                  onValueChange={setSelectedTemplate}
                  options={gradeBookTemplateOptions}
                  placeholder="Choose a template to get started..."
                  className="bg-background border-input focus:ring-ring"
                  disabled={!gradeBookTemplateOptions.length}
                />
              )}
            </div>

            {selectedTemplate && (
              <div className="space-y-4">
                {isTemplateDetailLoading ? (
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-64 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-32 w-full" />
                    </CardContent>
                  </Card>
                ) : selectedTemplateResponse?.data ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Template Preview</CardTitle>
                      <CardDescription>
                        {selectedTemplateResponse.data.academic_program?.program_name} -{' '}
                        {selectedTemplateResponse.data.academic_program?.college?.campus?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedTemplateResponse.data.gradebook_grading_periods?.map((period) => (
                        <div key={period.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-base">{period.title}</h4>
                            <span className="text-sm text-muted-foreground">
                              Weight: {period.weight}%
                            </span>
                          </div>
                          {period.gradebook_items && period.gradebook_items.length > 0 ? (
                            <div className="space-y-2 pl-4">
                              {period.gradebook_items.map((item) => (
                                <div
                                  key={item.id}
                                  className="border-l-2 border-muted pl-3 space-y-2"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium text-sm">{item.title}</span>
                                    <span className="text-xs text-muted-foreground">
                                      Weight: {item.weight}%
                                    </span>
                                  </div>
                                  {item.gradebook_item_details &&
                                  item.gradebook_item_details.length > 0 ? (
                                    <div className="space-y-1 pl-4">
                                      {item.gradebook_item_details.map((detail) => (
                                        <div
                                          key={detail.id}
                                          className="flex items-center justify-between text-xs"
                                        >
                                          <span className="text-muted-foreground">
                                            {detail.title}
                                          </span>
                                          <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground">
                                              {detail.min_score}-{detail.max_score}
                                            </span>
                                            <span className="text-muted-foreground">
                                              ({detail.weight}%)
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-xs text-muted-foreground pl-4">
                                      No item details
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground pl-4">
                              No items configured
                            </p>
                          )}
                        </div>
                      ))}
                      {(!selectedTemplateResponse.data.gradebook_grading_periods ||
                        selectedTemplateResponse.data.gradebook_grading_periods.length === 0) && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No grading periods configured
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ) : null}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={handleSetupGradeBook}
                disabled={!selectedTemplate || isGradeBookLoading || isGeneratingGradeBook}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Setup Grade Book
              </Button>
              <p className="text-xs text-muted-foreground">
                You can customize the template after setup
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional content can go here */}
      {hasGradeBook && (
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {/* Tabs content */}
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
