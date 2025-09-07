import { useConfirm } from '@/components/confirm.provider';
import { useModal } from '@/components/custom/modal.component';
import TitledPage from '@/components/pages/titled.page';
import ProgramTypeModal from '@/components/program-types/program-type.modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

  if (isLoading) {
    return (
      <TitledPage title="Program Types" description="Manage your program types">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-6 w-32" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Skeleton className="h-4 w-24" />
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardFooter>
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
              <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A–Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z–A)</SelectItem>
                  <SelectItem value="id-asc">ID (Low → High)</SelectItem>
                  <SelectItem value="id-desc">ID (High → Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => controller.openFn()} className="whitespace-nowrap">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Program Type
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.01] border-l-4 border-l-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <GraduationCapIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold group-hover:text-primary">
                      {programType.name}
                    </CardTitle>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <Badge variant="outline">ID: {programType.id}</Badge>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="ml-auto flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    controller.openFn(programType);
                  }}
                  aria-label="Edit program type"
                >
                  <EditIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirm.confirm(async () => await handleDelete(programType));
                  }}
                  aria-label="Delete program type"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
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
