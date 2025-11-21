import Table, { type TableColumn } from '@/components/custom/table.component';
import TitledPage from '@/components/pages/titled.page';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth.context';
import { encryptIdForUrl } from '@/lib/hash';
import { useGetSectionTeacherPaginated } from '@rest/api';
import type { SectionTeacher } from '@rest/models';
import { CheckCircle2, CircleX } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

export default function FacultySchedule(): React.ReactNode {
  const { session } = useAuth();
  const [page, setPage] = useState(1);
  const [rows] = useState(10);

  const navigate = useNavigate();

  const { data: sectionResponse } = useGetSectionTeacherPaginated(
    {
      'filter[user_id]': session?.id,
      page,
      rows,
    },
    { query: { enabled: !!session?.id } }
  );

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
        render: (_, row) => row?.section?.section_name || 'N/A',
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
        render: (_, row) => {
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
    </TitledPage>
  );
}
