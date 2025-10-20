import Menu from '@/components/custom/menu.component';
import { useModal } from '@/components/custom/modal.component';
import Select, { type SelectOption } from '@/components/custom/select.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import TitledPage from '@/components/pages/titled.page';
import AcademicProgramRequirementModal from '@/components/program-chair-only/academic-program-requirement/academic-program-requirement.modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth.context';
import {
  useDeleteAcademicProgramRequirement,
  useGetAcademicProgramRequirementPaginated,
  useGetSchoolYearPaginated,
} from '@rest/api';
import type { AcademicProgramRequirement, SchoolYear } from '@rest/models';
import { DeleteIcon, EditIcon, EllipsisIcon } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function ProgramRequirementPage(): React.ReactNode {
  const { session } = useAuth();
  const [page, setPage] = useState(1);
  const [rows] = useState(10);
  const [schoolYearId, setSchoolYearId] = useState<number>(0);
  const { data: programRequirements, refetch } = useGetAcademicProgramRequirementPaginated(
    {
      'filter[academic_program_id]': session?.active_academic_program ?? 0,
      'filter[school_year_id]': schoolYearId,
      page,
      rows,
    },
    { query: { enabled: !!session?.active_academic_program } }
  );

  const { data: schoolYearResponse } = useGetSchoolYearPaginated({
    sort: '-start_date',
    page: 1,
    rows: Number.MAX_SAFE_INTEGER,
  });

  const schoolYearsList = useMemo<SelectOption[]>(
    () =>
      schoolYearResponse?.data?.data?.map((schoolYear: SchoolYear) => ({
        label: schoolYear.name,
        value: String(schoolYear.id),
      })) ?? [],
    [schoolYearResponse]
  );

  const { mutateAsync: deleteRequirement } = useDeleteAcademicProgramRequirement();

  const controller = useModal<AcademicProgramRequirement>();

  const handleDelete = async (id: number) => {
    try {
      await deleteRequirement({ id });
      toast.success('Program requirement deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete program requirement');
    }
  };

  useEffect(() => {
    if (schoolYearsList.length > 0) setSchoolYearId(parseInt(schoolYearsList[0].value));
  }, [schoolYearsList]);

  const columns = useMemo<TableColumn<AcademicProgramRequirement>[]>(
    () => [
      {
        key: 'academicProgram',
        title: 'Academic Program',
        render: (academicProgram: any) => (
          <div className="flex flex-col gap-1">
            <span className="font-medium">{academicProgram?.program_name}</span>
            {academicProgram?.short_name && (
              <Badge variant="outline" className="text-xs w-fit">
                {academicProgram.short_name}
              </Badge>
            )}
          </div>
        ),
      },
      {
        key: 'requirement',
        title: 'Requirement',
        render: (requirement: any) => (
          <div className="flex flex-col gap-1">
            <span className="font-medium">{requirement?.name}</span>
            {requirement?.description && (
              <span className="text-xs text-muted-foreground">{requirement.description}</span>
            )}
          </div>
        ),
      },
      {
        key: 'schoolYear',
        title: 'School Year',
        render: (schoolYear: any) => (
          <div className="flex items-center gap-2">
            <span>{schoolYear?.name}</span>
            {schoolYear?.is_current && (
              <Badge variant="default" className="text-xs">
                Current
              </Badge>
            )}
          </div>
        ),
      },
      {
        key: 'is_mandatory',
        title: 'Mandatory',
        dataIndex: 'is_mandatory',
        render: (isMandatory) => (
          <Badge variant={isMandatory ? 'default' : 'secondary'}>
            {isMandatory ? 'Yes' : 'No'}
          </Badge>
        ),
      },
      {
        key: 'is_active',
        title: 'Status',
        dataIndex: 'is_active',
        render: (isActive) => (
          <Badge variant={isActive ? 'default' : 'destructive'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        ),
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
                  handleDelete(row.id!);
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

  const tableItems = useMemo(() => programRequirements?.data?.data ?? [], [programRequirements]);
  const paginationMeta = useMemo(() => {
    return programRequirements?.data;
  }, [programRequirements]);

  return (
    <TitledPage
      title="Program Requirements"
      description="Manage admission requirements for academic programs"
    >
      <div className="flex flex-row gap-2">
        <div className="w-fit">
          <Select
            options={schoolYearsList}
            value={schoolYearId?.toString()}
            onValueChange={(value) => setSchoolYearId(parseInt(value))}
            placeholder="Select school year"
          />
        </div>
        <Button onClick={() => controller.openFn()}>Add Program Requirement</Button>
      </div>
      <Table
        columns={columns}
        rows={tableItems}
        itemsPerPage={rows}
        pagination={paginationMeta}
        onPageChange={setPage}
        showPagination={true}
      />
      <AcademicProgramRequirementModal
        controller={controller}
        onSubmit={() => {
          refetch();
        }}
      />
    </TitledPage>
  );
}
