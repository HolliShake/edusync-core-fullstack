import Table from '@/components/custom/table.component';
import TitledPage from '@/components/pages/titled.page';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { decryptIdFromUrl } from '@/lib/hash';
import { useEnrollUser, useGetAdmissionApplicationById, useGetSectionPaginated } from '@rest/api';
import type { Enrollment, Section } from '@rest/models';
import { AlertCircle, BookOpen, Calendar, CheckCircle2, Trash, Users } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function GuestEnrollment(): React.ReactNode {
  //   const { session } = useAuth();
  //   const navigate = useNavigate();

  const { mutateAsync: enrollUser, isPending: isEnrollingUser } = useEnrollUser();

  const [alert, setAlert] = useState<string | undefined>(undefined);

  const { applicationId } = useParams<{ applicationId: string }>();

  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const { data: applicationResponse, isLoading: isLoadingApplication } =
    useGetAdmissionApplicationById(Number(decryptIdFromUrl(applicationId as string)), {
      query: { enabled: !!applicationId },
    });

  const application = useMemo(() => applicationResponse?.data, [applicationResponse]);

  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);

  const { data: availableSectionsResponse, isLoading: isLoadingAvailableSections } =
    useGetSectionPaginated(
      {
        'filter[school_year_id]': application?.school_year_id,
        'filter[for_freshmen]': true,
        page: 1,
        rows: Number.MAX_SAFE_INTEGER,
      },
      {
        query: {
          enabled: !!application?.school_year_id,
          refetchInterval: 5000, // 5 seconds
        },
      }
    );

  const availableSectionsGroupBySectionCode = useMemo(() => {
    const sections = availableSectionsResponse?.data?.data ?? [];
    return sections.reduce<Record<string, Section[]>>((acc, section) => {
      if (!acc[section.section_code]) {
        acc[section.section_code] = [];
      }
      acc[section.section_code].push(section);
      return acc;
    }, {});
  }, [availableSectionsResponse]);

  const yearLevel = useMemo(() => {
    const sections = availableSectionsResponse?.data?.data ?? [];
    return sections.map((s) => s.curriculum_detail?.year_label).find((t) => t !== undefined);
  }, [availableSectionsResponse]);

  const termLevel = useMemo(() => {
    const sections = availableSectionsResponse?.data?.data ?? [];
    return sections.map((s) => s.curriculum_detail?.term_label).find((t) => t !== undefined);
  }, [availableSectionsResponse]);

  const isLoadingAll = useMemo(() => {
    return isLoadingApplication || isLoadingAvailableSections;
  }, [isLoadingApplication, isLoadingAvailableSections]);

  useEffect(() => {
    const sectionCodes = Object.keys(availableSectionsGroupBySectionCode);
    if (sectionCodes.length > 0 && !selectedSection) {
      setSelectedSection(sectionCodes[0]);
    }
  }, [availableSectionsGroupBySectionCode, selectedSection]);

  const courses = useMemo<Section[]>(() => {
    return availableSectionsGroupBySectionCode[selectedSection!] ?? [];
  }, [selectedSection, availableSectionsGroupBySectionCode]);

  const selectedSectionCourses = useMemo<Section[]>(() => {
    const sections = availableSectionsResponse?.data?.data ?? [];
    return sections.filter((section) => selectedCourses.includes(section.id!));
  }, [selectedCourses, availableSectionsResponse]);

  const totalUnitsRequired = useMemo(() => {
    return (availableSectionsGroupBySectionCode[selectedSection!] ?? []).reduce(
      (acc, sectionCourse) => acc + (sectionCourse.curriculum_detail?.course?.credit_units ?? 0),
      0
    );
  }, [availableSectionsGroupBySectionCode, selectedSection]);

  const totalUnitsSelected = useMemo(() => {
    return selectedSectionCourses.reduce(
      (acc, sectionCourse) => acc + (sectionCourse.curriculum_detail?.course?.credit_units ?? 0),
      0
    );
  }, [selectedSectionCourses]);

  const isValidSelection = (selected: number[]): boolean => {
    const sections = availableSectionsResponse?.data?.data ?? [];
    const selectedSections = sections.filter((section) => selected.includes(section.id!));

    const courseIds = selectedSections.map((section) => section.curriculum_detail?.course_id);
    const duplicateCourses = courseIds.filter(
      (courseId, index, self) => courseId !== undefined && self.indexOf(courseId) !== index
    );

    if (duplicateCourses.length > 0) {
      const duplicateCourseTitle = selectedSections.find(
        (section) => section.curriculum_detail?.course_id === duplicateCourses[0]
      )?.curriculum_detail?.course?.course_title;
      setAlert(`You cannot select the same course twice: ${duplicateCourseTitle}`);
      toast.error('Ooops, something went wrong!');
      return false;
    }
    setAlert(undefined);
    return true;
  };

  const handleSubmit = async () => {
    try {
      const payload = selectedSectionCourses.map((sectionCourse) => ({
        user_id: application?.user_id,
        section_id: sectionCourse.id,
      }));
      await enrollUser({
        data: payload as Enrollment[],
      });
      toast.success('Enrollment submitted successfully');
      // reset
      setSelectedCourses([]);
      setSelectedSection(null);
      setAlert(undefined);
    } catch (error) {
      console.error(error);
      toast.error('Failed to enroll user');
    }
  };

  return (
    <TitledPage
      title="Enrollment Application"
      description="Complete your enrollment process"
      breadcrumb={[
        { label: 'Enrollment', href: '/guest/enrollment' },
        { label: 'Application', href: '#' },
      ]}
    >
      {alert && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Selection Error</AlertTitle>
          <AlertDescription>{alert}</AlertDescription>
        </Alert>
      )}
      {isLoadingAll ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted mt-2" />
            </CardHeader>
          </Card>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-20 animate-pulse rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Card */}
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">{application?.school_year?.name}</CardTitle>
                  <CardDescription className="text-base">
                    {yearLevel} • {termLevel}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="h-fit px-4 py-2 text-sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Active Enrollment
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Section Selection */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Available Sections
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose your preferred section for this term
              </p>
            </div>

            {Object.keys(availableSectionsGroupBySectionCode).length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <Users className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    No sections available at this time
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please check back later or contact the registrar
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 lg:grid-cols-12">
                {/* Section List - Compact Version */}
                <div className="lg:col-span-3">
                  <div className="sticky top-4 max-h-[calc(100vh-8rem)] overflow-y-auto space-y-2 pr-2">
                    {Object.keys(availableSectionsGroupBySectionCode).map((sectionCode) => {
                      const sections = availableSectionsGroupBySectionCode[sectionCode];
                      const firstSection = sections[0];
                      const isSelected = selectedSection === sectionCode;
                      return (
                        <button
                          key={firstSection.id}
                          className={`group relative w-full rounded-lg border p-3 text-left transition-all duration-200 outline-none ${
                            isSelected
                              ? 'border-primary bg-primary/5 shadow-md'
                              : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
                          }`}
                          onClick={() => setSelectedSection(sectionCode)}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4
                                className={`text-sm font-semibold truncate ${
                                  isSelected
                                    ? 'text-primary'
                                    : 'text-foreground group-hover:text-primary'
                                }`}
                              >
                                {firstSection.section_name}
                              </h4>
                              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                                {firstSection.section_code}
                              </p>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section Details */}
                <div className="lg:col-span-9 space-y-2">
                  <Table
                    columns={[
                      {
                        key: 'curriculum_detail.course.course_code',
                        title: 'Course Code',
                        className: 'font-mono font-medium',
                      },
                      {
                        key: 'curriculum_detail.course.course_title',
                        title: 'Course Title',
                      },
                      {
                        key: 'curriculum_detail.course.lecture_units',
                        title: 'Lecture Units',
                        align: 'center',
                      },
                      {
                        key: 'curriculum_detail.course.laboratory_units',
                        title: 'Lab Units',
                        align: 'center',
                      },
                      {
                        key: 'curriculum_detail.course.credit_units',
                        title: 'Credit Units',
                        align: 'center',
                      },
                      {
                        key: 'curriculum_detail.course.with_laboratory',
                        title: 'Laboratory',
                        align: 'center',
                        render: (value) =>
                          value ? (
                            <Badge variant="secondary" className="text-xs">
                              Yes
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              No
                            </Badge>
                          ),
                      },
                      {
                        key: 'available_slots',
                        title: 'Available Slots',
                        align: 'center',
                        render: (_, row) => (
                          <Badge variant="secondary" className="text-xs">
                            {row.max_students - row.available_slots!} / {row.max_students}
                          </Badge>
                        ),
                      },
                    ]}
                    rows={courses}
                    emptyState={
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-muted p-3 mb-4">
                          <BookOpen className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                          No courses available for this section
                        </p>
                      </div>
                    }
                    loading={false}
                    rowKey={(row: Section) => row.id}
                    selectable={true}
                    selectedRows={selectedCourses}
                    onSelectionChange={(selectedRows) => {
                      const items = selectedRows.map((row) => Number(row));
                      if (!isValidSelection(items)) return;
                      setSelectedCourses(items);
                    }}
                  />
                  {/*  */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Selected Courses</CardTitle>
                      <CardDescription>Review your selected courses for enrollment</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table
                        className="border"
                        columns={[
                          {
                            key: 'section_name',
                            title: 'Section',
                          },
                          {
                            key: 'curriculum_detail.course.course_code',
                            title: 'Course Code',
                          },
                          {
                            key: 'curriculum_detail.course.course_title',
                            title: 'Course Title',
                          },
                          {
                            key: 'curriculum_detail.course.lecture_units',
                            title: 'Lecture Units',
                            align: 'center',
                          },
                          {
                            key: 'curriculum_detail.course.laboratory_units',
                            title: 'Lab Units',
                            align: 'center',
                          },
                          {
                            key: 'curriculum_detail.course.credit_units',
                            title: 'Credit Units',
                            align: 'center',
                          },
                          {
                            key: 'id',
                            title: 'Action',
                            align: 'center',
                            render: (value) => (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedCourses(
                                    selectedCourses.filter((section) => section != value)
                                  );
                                }}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            ),
                          },
                        ]}
                        rows={selectedSectionCourses}
                        emptyState={
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="rounded-full bg-muted p-3 mb-4">
                              <BookOpen className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">
                              No courses selected
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Select courses from the table above to add them here
                            </p>
                          </div>
                        }
                        loading={false}
                        rowKey={(row: Section) => row.id}
                      />
                    </CardContent>
                  </Card>
                  {/*  */}
                  <div className="flex flex-row justify-between items-center">
                    <span className="block">
                      {totalUnitsSelected}/{totalUnitsRequired}
                    </span>
                    <Button
                      disabled={totalUnitsSelected != totalUnitsRequired || isEnrollingUser}
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </TitledPage>
  );
}
