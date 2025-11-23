import { useConfirm } from '@/components/confirm.provider';
import CourseModal from '@/components/courses/course.modal';
import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import TitledPage from '@/components/pages/titled.page';
import { Button } from '@/components/ui/button';
import { encryptIdForUrl } from '@/lib/hash';
import { deleteCourse, useGetCoursePaginated } from '@rest/api';
import type { Course } from '@rest/models/course';
import { DeleteIcon, EditIcon, EllipsisIcon } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

function formatTwoDecimals(value: any): string {
  if (typeof value === 'number') {
    return value.toFixed(2);
  }
  if (!isNaN(Number(value)) && value !== null && value !== undefined && value !== '') {
    return Number(value).toFixed(2);
  }
  return value ?? '';
}

export default function AdminCourses(): React.ReactNode {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rows] = useState(10);

  const {
    data: courses,
    isLoading,
    refetch,
  } = useGetCoursePaginated({
    page,
    rows,
  });

  const controller = useModal<Course>();

  const confirm = useConfirm();

  const handleDelete = async (row: Course) => {
    confirm.confirm(async () => {
      try {
        await deleteCourse(row.id as number);
        toast.success('Course deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete Course');
        // eslint-disable-next-line no-console
        console.error('Delete error:', error);
      }
    });
  };

  const columns = useMemo<TableColumn<Course>[]>(
    () => [
      {
        key: 'course_code',
        title: 'Course Code',
        dataIndex: 'course_code',
      },
      {
        key: 'course_title',
        title: 'Course Title',
        dataIndex: 'course_title',
      },
      {
        key: 'course_description',
        title: 'Description',
        dataIndex: 'course_description',
      },
      {
        key: 'credit_units',
        title: 'Credit Units',
        dataIndex: 'credit_units',
        render: (value) => formatTwoDecimals(value),
      },
      {
        key: 'lecture_units',
        title: 'Lecture Units',
        dataIndex: 'lecture_units',
        render: (value) => formatTwoDecimals(value),
      },
      {
        key: 'laboratory_units',
        title: 'Laboratory Units',
        dataIndex: 'laboratory_units',
        render: (value) => formatTwoDecimals(value),
      },
      {
        key: 'with_laboratory',
        title: 'With Laboratory',
        dataIndex: 'with_laboratory',
        render: (value) => (value ? 'Yes' : 'No'),
      },
      {
        key: 'is_specialize',
        title: 'Specialized',
        dataIndex: 'is_specialize',
        render: (value) => (value ? 'Yes' : 'No'),
      },
      {
        key: 'actions',
        title: 'Actions',
        dataIndex: 'actions',
        render: (_, row) => (
          <Menu
            items={[
              {
                label: 'Edit',
                icon: <EditIcon />,
                variant: 'default',
                onClick: () => {
                  controller.openFn(row);
                },
              },
              {
                label: 'Delete',
                icon: <DeleteIcon />,
                variant: 'destructive',
                onClick: () => {
                  handleDelete(row);
                },
              },
            ]}
            trigger={
              <Button variant="outline" size="icon">
                <EllipsisIcon />
              </Button>
            }
          />
        ),
      },
    ],
    [controller]
  );

  const tableCourses = useMemo(() => courses?.data?.data ?? [], [courses]);
  const paginationMeta = useMemo(() => {
    return courses?.data;
  }, [courses]);

  return (
    <TitledPage title="Courses" description="Manage your courses">
      <Button onClick={() => controller.openFn()}>Add Course</Button>
      <Table
        columns={columns}
        rows={tableCourses}
        itemsPerPage={rows}
        pagination={paginationMeta}
        onPageChange={setPage}
        showPagination={true}
        loading={isLoading}
        onClickRow={(row) => navigate(`/admin/course/${encryptIdForUrl(row?.id as number)}`)}
      />
      <CourseModal
        controller={controller}
        onSubmit={() => {
          refetch();
        }}
      />
    </TitledPage>
  );
}
