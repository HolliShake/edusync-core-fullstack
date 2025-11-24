import Select from '@/components/custom/select.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import TitledPage from '@/components/pages/titled.page';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth.context';
import { encryptIdForUrl } from '@/lib/hash';
import { useGetSchoolYearPaginated, useGetSectionTeacherPaginated } from '@rest/api';
import type { SchoolYear, SectionTeacher } from '@rest/models';
import { CheckCircle2, CircleX } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

export default function FacultySchedule(): React.ReactNode {
  const { session } = useAuth();
  const [page, setPage] = useState(1);
  const [rows] = useState(10);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<number | undefined>(undefined);

  const navigate = useNavigate();

  const { data: schoolYearResponse } = useGetSchoolYearPaginated(
    {
      sort: '-start_date',
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
    },
    { query: { enabled: !!session?.id } }
  );

  const { data: sectionResponse } = useGetSectionTeacherPaginated(
    {
      'filter[school_year_id]': selectedSchoolYear,
      'filter[user_id]': session?.id,
      page,
      rows,
    },
    { query: { enabled: !!session?.id && !!selectedSchoolYear } }
  );

  const schoolYearOptions = useMemo(() => {
    const schoolYears = schoolYearResponse?.data?.data as SchoolYear[] | undefined;
    return (
      schoolYears?.map((schoolYear) => ({
        label: schoolYear.school_year_code ?? '',
        value: schoolYear.id?.toString() ?? '',
        subtitle: schoolYear.name,
      })) ?? []
    );
  }, [schoolYearResponse]);

  // Set the first school year as default when options are loaded
  useEffect(() => {
    if (schoolYearOptions.length > 0 && !selectedSchoolYear) {
      const firstSchoolYearId = parseInt(schoolYearOptions[0].value);
      setSelectedSchoolYear(firstSchoolYearId);
    }
  }, [schoolYearOptions, selectedSchoolYear]);

  const columns = useMemo<TableColumn<SectionTeacher>[]>(
    () => [
      {
        key: 'user.name',
        title: 'Campus',
        render: (_, row) =>
          row?.section?.curriculum_detail?.curriculum?.academic_program?.college?.campus?.name ||
          'N/A',
      },
      {
        key: 'section.section_name',
        title: 'Section',
        render: (_, row) => {
          return (
            <div className="flex flex-col">
              <span className="font-medium">{row?.section?.section_name || 'N/A'}</span>
              <span className="text-sm text-muted-foreground">
                {row?.section?.section_ref || 'N/A'}
              </span>
            </div>
          );
        },
      },
      {
        key: 'section.curriculum_detail.course.course_title',
        title: 'Course',
        render: (_, row) => {
          const courseTitle = row?.section?.curriculum_detail?.course?.course_title;
          const courseCode = row?.section?.curriculum_detail?.course?.course_code;
          if (!courseTitle && !courseCode) return 'N/A';
          return (
            <div className="flex flex-col">
              <span className="font-medium">{courseTitle || 'N/A'}</span>
              {courseCode && <span className="text-sm text-muted-foreground">{courseCode}</span>}
            </div>
          );
        },
      },
      {
        key: 'section.available_slots',
        title: 'Slots Available',
        align: 'center',
        render: (_, row) =>
          `${row?.section?.available_slots}/${row?.section?.max_students}` || 'N/A',
      },
      {
        key: 'schedule',
        title: 'Schedule & Room',
        render: (_) => {
          return (
            <div className="flex flex-col">
              <span className="font-medium">TBD</span>
            </div>
          );
        },
      },
      {
        key: 'section.has_grade_book',
        title: 'Grade Book',
        align: 'center',
        render: (_, row) =>
          row?.section?.has_grade_book ? (
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Available
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <CircleX className="h-3 w-3" />
              Not Available
            </Badge>
          ),
      },
    ],
    []
  );

  const tableItems = useMemo(() => sectionResponse?.data?.data ?? [], [sectionResponse]);

  const paginationMeta = useMemo(() => {
    return sectionResponse?.data;
  }, [sectionResponse]);

  return (
    <TitledPage title="Schedule" description="View and manage your teaching schedule">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-64">
            <Select
              placeholder="Select School Year"
              options={schoolYearOptions}
              value={selectedSchoolYear?.toString()}
              onValueChange={(value) => {
                setSelectedSchoolYear(parseInt(value));
                setPage(1); // Reset to first page when filter changes
              }}
            />
          </div>
        </div>
        <Table
          columns={columns}
          rows={tableItems}
          itemsPerPage={rows}
          pagination={paginationMeta}
          onPageChange={setPage}
          showPagination={true}
          onClickRow={(row) => {
            navigate(`/faculty/schedule/${encryptIdForUrl(row?.id as number)}`);
          }}
        />
      </div>
    </TitledPage>
  );
}
