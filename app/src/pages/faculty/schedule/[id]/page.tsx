import Select from '@/components/custom/select.component';
import TitledPage from '@/components/pages/titled.page';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth.context';
import { decryptIdFromUrl } from '@/lib/hash';
import { useGetGradeBookById, useGetGradeBookPaginated, useGetSectionTeacherById } from '@rest/api';
import { AlertCircle, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function FacultyScheduleDetail(): React.ReactNode {
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();
  const [page, setPage] = useState(1);
  const [rows] = useState(10);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const parsedSectionTeacherId = useMemo(() => {
    return decryptIdFromUrl(id!);
  }, [id]);

  const { data: sectionTeacherResponse, isLoading: isSectionLoading } = useGetSectionTeacherById(
    parsedSectionTeacherId,
    {
      query: { enabled: !!parsedSectionTeacherId },
    }
  );

  const hasGradeBook = useMemo(() => {
    return sectionTeacherResponse?.data?.section?.has_grade_book ?? false;
  }, [sectionTeacherResponse]);

  const { data: gradeBookResponse, isLoading: isGradeBookLoading } = useGetGradeBookPaginated(
    {
      'filter[academic_program_id]':
        sectionTeacherResponse?.data?.section?.curriculum_detail?.curriculum?.academic_program_id ??
        0,
      'filter[is_template]': true,
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
    },
    {
      query: {
        enabled:
          !hasGradeBook &&
          !!sectionTeacherResponse?.data?.section?.curriculum_detail?.curriculum
            ?.academic_program_id,
      },
    }
  );

  const { data: selectedTemplateResponse, isLoading: isTemplateDetailLoading } =
    useGetGradeBookById(Number(selectedTemplate), {
      query: { enabled: !!selectedTemplate },
    });

  console.log(
    gradeBookResponse,
    hasGradeBook,
    sectionTeacherResponse?.data?.section?.curriculum_detail?.curriculum?.academic_program_id ?? 0
  );

  const gradeBookTemplateOptions = useMemo(() => {
    return (
      gradeBookResponse?.data?.data?.map((gradeBook) => ({
        label: gradeBook.title,
        value: `${gradeBook.id}`,
        subtitle: gradeBook.academic_program?.college?.campus?.name,
      })) ?? []
    );
  }, [gradeBookResponse]);

  const handleSetupGradeBook = () => {
    if (!selectedTemplate) return;
    // TODO: Implement grade book setup logic
    console.log('Setting up grade book with template:', selectedTemplate);
  };

  return (
    <TitledPage
      title="Schedule Details"
      description="View detailed information about this schedule"
    >
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
            <AlertTitle className="text-accent-foreground font-semibold">
              Grade Book Ready!
            </AlertTitle>
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
                  disabled={!selectedTemplate || isGradeBookLoading}
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
      </div>
    </TitledPage>
  );
}
