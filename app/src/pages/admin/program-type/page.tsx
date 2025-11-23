import { useConfirm } from '@/components/confirm.provider';
import { useModal } from '@/components/custom/modal.component';
import CustomSelect from '@/components/custom/select.component';
import Table, { type TableColumn } from '@/components/custom/table.component';
import TitledPage from '@/components/pages/titled.page';
import ProgramTypeModal from '@/components/program-types/program-type.modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDeleteProgramType, useGetProgramTypePaginated } from '@rest/api';
import type { ProgramType } from '@rest/models';
import { EditIcon, PlusIcon, SearchIcon, TrashIcon } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function AdminProgramTypes(): React.ReactNode {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'name-asc' | 'name-desc' | 'id-asc' | 'id-desc'>('name-asc');

  const {
    data: programTypes,
    isLoading,
    refetch,
  } = useGetProgramTypePaginated({
    page,
    rows,
  });

  const controller = useModal<ProgramType>();

  const programTypeItems = useMemo(() => programTypes?.data?.data ?? [], [programTypes]);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = normalizedQuery
      ? programTypeItems.filter((item: ProgramType) =>
          (item.name ?? '').toLowerCase().includes(normalizedQuery)
        )
      : programTypeItems;

    const collator = new Intl.Collator(undefined, { sensitivity: 'base' });
    const sorted = [...filtered].sort((a: ProgramType, b: ProgramType) => {
      switch (sort) {
        case 'name-desc':
          return collator.compare(b.name ?? '', a.name ?? '');
        case 'id-asc':
          return (a.id ?? 0) - (b.id ?? 0);
        case 'id-desc':
          return (b.id ?? 0) - (a.id ?? 0);
        case 'name-asc':
        default:
          return collator.compare(a.name ?? '', b.name ?? '');
      }
    });

    return sorted;
  }, [programTypeItems, query, sort]);

  const { mutateAsync: deleteProgramType } = useDeleteProgramType();
  const confirm = useConfirm();

  const handleDelete = async (programType: ProgramType) => {
    try {
      await deleteProgramType({ id: programType.id as number });
      toast.success('Program type deleted');
      refetch();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete program type');
    }
  };

  const sortOptions = [
    { label: 'Name (A–Z)', value: 'name-asc' },
    { label: 'Name (Z–A)', value: 'name-desc' },
    { label: 'ID (Low → High)', value: 'id-asc' },
    { label: 'ID (High → Low)', value: 'id-desc' },
  ];

  const columns: TableColumn<ProgramType>[] = [
    {
      key: 'id',
      title: 'ID',
      width: '80px',
    },
    {
      key: 'name',
      title: 'Name',
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'right',
      width: '100px',
      render: (_, row) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={(e) => {
              e.stopPropagation();
              controller.openFn(row);
            }}
          >
            <EditIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              confirm.confirm(async () => await handleDelete(row));
            }}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <TitledPage title="Program Types" description="Manage your program types">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex w-full sm:w-auto gap-2">
            <div className="relative w-full sm:w-64">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="min-w-[180px]">
              <CustomSelect
                options={sortOptions}
                value={sort}
                onValueChange={(v: string) => setSort(v as typeof sort)}
                placeholder="Sort"
              />
            </div>
          </div>
          <Button onClick={() => controller.openFn()} className="whitespace-nowrap shadow-sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Program Type
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        rows={visibleItems}
        loading={isLoading}
        pagination={programTypes?.data}
        onPageChange={setPage}
        itemsPerPage={rows}
        onItemsPerPageChange={setRows}
        emptyState={
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 bg-muted rounded-full mb-3">
              <SearchIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No program types found</h3>
            <p className="text-sm text-muted-foreground max-w-xs mt-1">
              {programTypeItems.length === 0
                ? 'Get started by creating a new program type.'
                : 'Try adjusting your search query or filters.'}
            </p>
            {programTypeItems.length === 0 && (
              <Button onClick={() => controller.openFn()} variant="outline" className="mt-4">
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Program Type
              </Button>
            )}
          </div>
        }
      />

      <ProgramTypeModal
        controller={controller}
        onSubmit={(data: ProgramType) => {
          console.log(data);
          toast.success('Program type saved');
          refetch();
        }}
      />
    </TitledPage>
  );
}
