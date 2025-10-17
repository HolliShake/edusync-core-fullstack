import { useConfirm } from '@/components/confirm.provider';
import { useModal } from '@/components/custom/modal.component';
import CustomSelect from '@/components/custom/select.component';
import TitledPage from '@/components/pages/titled.page';
import ProgramTypeModal from '@/components/program-types/program-type.modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeleteProgramType, useGetProgramTypePaginated } from '@rest/api';
import type { ProgramType } from '@rest/models';
import { EditIcon, GraduationCapIcon, PlusIcon, TrashIcon } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function AdminProgramTypes(): React.ReactNode {
  const [page] = useState(1);
  const [rows] = useState(10);
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

  if (isLoading) {
    return (
      <TitledPage title="Program Types" description="Manage your program types">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Skeleton className="h-9 w-9 rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Skeleton className="h-7 w-7 rounded" />
                  <Skeleton className="h-7 w-7 rounded" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </TitledPage>
    );
  }

  return (
    <TitledPage title="Program Types" description="Manage your program types">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Badge variant="secondary" className="whitespace-nowrap">
              {visibleItems.length} {visibleItems.length === 1 ? 'type' : 'types'}
            </Badge>
            <span className="text-xs text-muted-foreground">
              of {programTypeItems.length} total
            </span>
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search by name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="min-w-[180px]">
              <CustomSelect
                options={sortOptions}
                value={sort}
                onChange={(v) => setSort(v as typeof sort)}
                placeholder="Sort"
              />
            </div>
            <Button onClick={() => controller.openFn()} className="whitespace-nowrap">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Program Type
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleItems.map((programType: ProgramType) => (
          <Card
            key={programType.id}
            role="button"
            tabIndex={0}
            onClick={() => controller.openFn(programType)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                controller.openFn(programType);
              }
            }}
            className="group cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] border-l-4 border-l-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/30 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                  <GraduationCapIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                    {programType.name}
                  </h3>
                  <Badge variant="outline" className="text-xs mt-1">
                    ID: {programType.id}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-blue-50 hover:text-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    controller.openFn(programType);
                  }}
                  aria-label="Edit program type"
                >
                  <EditIcon className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-red-50 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirm.confirm(async () => await handleDelete(programType));
                  }}
                  aria-label="Delete program type"
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {visibleItems.length === 0 && !isLoading && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-muted/50 rounded-full mb-4">
              <GraduationCapIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-xl mb-2">No program types found</CardTitle>
            <CardDescription className="text-center max-w-md mb-6">
              {programTypeItems.length === 0
                ? 'Create your first program type to get started with organizing your academic programs.'
                : 'Try adjusting your search or sort to find what you are looking for.'}
            </CardDescription>
            <Button onClick={() => controller.openFn()}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Program Type
            </Button>
          </CardContent>
        </Card>
      )}

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
