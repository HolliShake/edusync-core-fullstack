import { useConfirm } from '@/components/confirm.provider';
import CourseRequisiteModal from '@/components/courses/course-requisite.modal';
import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import TitledPage from '@/components/pages/titled.page';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { decryptIdFromUrl } from '@/lib/hash';
import { useDeleteCourseRequisite, useGetCourseRequisitePaginated } from '@rest/api';
import { CourseRequisiteTypeEnum, type CourseRequisite } from '@rest/models';
import { DeleteIcon, EditIcon, EllipsisIcon } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';

export default function AdminCourseRequisites(): React.ReactNode {
  const { courseId } = useParams();
  const [page, setPage] = useState(1);
  const [rows] = useState(10);

  const decryptedCourseId = useMemo(
    () => (courseId ? Number(decryptIdFromUrl(courseId)) : undefined),
    [courseId]
  );

  const {
    data: courseRequisites,
    refetch,
    isLoading,
  } = useGetCourseRequisitePaginated(
    {
      'filter[course_id]': decryptedCourseId as number,
      page,
      rows,
    },
    { query: { enabled: !!decryptedCourseId } }
  );

  const { mutateAsync: deleteCourseRequisite } = useDeleteCourseRequisite();

  const controller = useModal<CourseRequisite>();
  const confirm = useConfirm();

  const handleDelete = async (data: CourseRequisite) => {
    try {
      await deleteCourseRequisite({ id: data.id as number });
      toast.success('Course requisite deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete course requisite');
    }
  };

  const columns = useMemo<TableColumn<CourseRequisite>[]>(
    () => [
      {
        key: 'requisite_course',
        title: 'Requisite Course',
        render: (requisiteCourse: any) => (
          <div className="flex flex-col gap-1">
            <span className="font-medium">{requisiteCourse?.course_title}</span>
            {requisiteCourse?.course_code && (
              <Badge variant="outline" className="text-xs w-fit">
                {requisiteCourse.course_code}
              </Badge>
            )}
          </div>
        ),
      },
      {
        key: 'requisite_type',
        title: 'Requisite Type',
        render: (requisiteType: any) => {
          const typeLabels: Record<string, string> = {
            pre: 'Pre-requisite',
            co: 'Co-requisite',
            equivalent: 'Equivalent',
          };
          return <Badge variant="secondary">{typeLabels[requisiteType] || requisiteType}</Badge>;
        },
      },
      {
        key: 'actions',
        title: 'Actions',
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
                  confirm.confirm(async () => await handleDelete(row));
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
    [controller, confirm]
  );

  const tableItems = useMemo(() => courseRequisites?.data?.data ?? [], [courseRequisites]);
  const paginationMeta = useMemo(() => {
    return courseRequisites?.data;
  }, [courseRequisites]);

  return (
    <TitledPage
      title="Course Requisites"
      description="Manage course prerequisites and corequisites"
    >
      <Button
        onClick={() =>
          controller.openFn({
            course_id: decryptedCourseId as number,
            requisite_course_id: 0,
            requisite_type: CourseRequisiteTypeEnum.co,
          })
        }
      >
        Add Course Requisite
      </Button>
      <Table
        columns={columns}
        rows={tableItems}
        itemsPerPage={rows}
        pagination={paginationMeta}
        onPageChange={setPage}
        showPagination={true}
        loading={isLoading}
      />
      <CourseRequisiteModal
        controller={controller}
        onSubmit={refetch}
        courseId={decryptedCourseId}
      />
    </TitledPage>
  );
}
