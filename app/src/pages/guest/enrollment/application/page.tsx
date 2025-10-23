import Table from '@/components/custom/table.component';
import TitledPage from '@/components/pages/titled.page';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth.context';
import { decryptIdFromUrl } from '@/lib/hash';
import { useGetAdmissionApplicationById, useGetSectionPaginated } from '@rest/api';
import type { Section } from '@rest/models';
import { BookOpen, Calendar, CheckCircle2, Users } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function GuestEnrollmentApplication(): React.ReactNode {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { applicationId } = useParams<{ applicationId: string }>();

  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const { data: applicationResponse, isLoading: isLoadingApplication } =
    useGetAdmissionApplicationById(Number(decryptIdFromUrl(applicationId as string)), {
      query: { enabled: !!applicationId },
    });

  const application = useMemo(() => applicationResponse?.data, [applicationResponse]);

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

  return (
    <TitledPage
      title="Enrollment Application"
      description="Complete your enrollment process"
      breadcrumb={[
        { label: 'Enrollment', href: '/guest/enrollment' },
        { label: 'Application', href: '#' },
      ]}
    >
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
                  <CardTitle className="text-2xl">{application?.schoolYear?.name}</CardTitle>
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
                <div className="lg:col-span-9">
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
                    ]}
                    rows={courses}
                    rowKey={(row) => row.id}
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
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </TitledPage>
  );
}
