import CurriculumDetailModal from '@/components/curriclum-detail/curriculum-detail.modal';
import { useModal } from '@/components/custom/modal.component';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurriculumContext } from '@/context/curriculum.context';
import { useGenerateSections, useGetCurriculumDetailPaginated } from '@rest/api';
import type { Curriculum, GetCurriculumDetailsResponse200 } from '@rest/models';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Hash,
  Plus,
} from 'lucide-react';
import type React from 'react';
import { useMemo } from 'react';
import { toast } from 'sonner';
import CurriculumTable, { type ScheduleGenerationData } from './table';

const STATUS_COLORS = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  inactive: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
} as const;

export default function CurriculumContent(): React.ReactNode {
  const curriculum = useCurriculumContext();
  const isLoading = useMemo(() => !curriculum, [curriculum]);
  const curriculumDetailModal = useModal<Curriculum>();

  const { mutateAsync: generateSection } = useGenerateSections();

  const {
    data: curriculumDetailsResponse,
    isLoading: isCurriculumDetailsLoading,
    refetch,
  } = useGetCurriculumDetailPaginated(
    {
      'filter[curriculum_id]': curriculum?.id,
      paginate: false,
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
    },
    {
      query: {
        enabled: !!curriculum?.id,
      },
    }
  );

  const curriculumDetails = useMemo(
    () => (curriculumDetailsResponse as GetCurriculumDetailsResponse200)?.data ?? [],
    [curriculumDetailsResponse]
  );

  const handleCurriculumDetailSubmit = () => {
    refetch();
  };

  const handleGenerateSchedule = async (data: ScheduleGenerationData) => {
    try {
      await generateSection({
        data: {
          curriculum_id: curriculum?.id,
          year_order: data.year,
          term_order: data.term,
          auto_post: data.autoPost,
          number_of_section: data.numberOfSchedules,
        },
      });
      toast.success('Sections generated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate sections');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header Banner Skeleton */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-full mt-4" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!curriculum) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center space-y-3">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
          <p className="text-lg text-muted-foreground">No curriculum data available</p>
        </div>
      </div>
    );
  }

  const statusColor =
    STATUS_COLORS[curriculum.status?.toLowerCase() as keyof typeof STATUS_COLORS] ||
    STATUS_COLORS.inactive;

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 p-8 border-0 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                  <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                    {curriculum.curriculum_name}
                  </h1>
                  <code className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg mt-2 inline-block font-semibold text-slate-700 dark:text-slate-300">
                    {curriculum.curriculum_code}
                  </code>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                className={`${statusColor} px-4 py-2 text-sm font-semibold hover:${statusColor}`}
              >
                {curriculum.status?.charAt(0).toUpperCase() + curriculum.status?.slice(1)}
              </Badge>
              <Button onClick={() => curriculumDetailModal.openFn(curriculum)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Detail
              </Button>
            </div>
          </div>

          {curriculum.description && (
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {curriculum.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="group border-0 shadow-sm hover:shadow-sm transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Effective Year
            </CardTitle>
            <div className="p-2.5 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl group-hover:scale-110 transition-transform duration-200">
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              {curriculum.effective_year || '—'}
            </div>
            <div className="mt-1 h-1 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
          </CardContent>
        </Card>

        <Card className="group border-0 shadow-sm hover:shadow-sm transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Total Units
            </CardTitle>
            <div className="p-2.5 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl group-hover:scale-110 transition-transform duration-200">
              <Hash className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              {curriculum.total_units || '—'}
            </div>
            <div className="mt-1 h-1 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
          </CardContent>
        </Card>

        <Card className="group border-0 shadow-sm hover:shadow-sm transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Total Hours
            </CardTitle>
            <div className="p-2.5 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl group-hover:scale-110 transition-transform duration-200">
              <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              {curriculum.total_hours || '—'}
            </div>
            <div className="mt-1 h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </CardContent>
        </Card>

        {curriculum.approved_date && (
          <Card className="group border-0 shadow-sm hover:shadow-sm transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Approved Date
              </CardTitle>
              <div className="p-2.5 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                {new Date(curriculum.approved_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
              <div className="mt-1 h-1 w-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Curriculum Details Table */}
      <CurriculumTable
        curriculumDetails={curriculumDetails}
        isLoading={isCurriculumDetailsLoading}
        onGenerateSchedule={handleGenerateSchedule}
      />

      {/* Curriculum Detail Modal */}
      <CurriculumDetailModal
        controller={curriculumDetailModal}
        onSubmit={handleCurriculumDetailSubmit}
      />
    </div>
  );
}
