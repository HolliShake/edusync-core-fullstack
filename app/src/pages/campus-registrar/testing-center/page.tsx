import { useConfirm } from '@/components/confirm.provider';
import { useModal } from '@/components/custom/modal.component';
import TitledPage from '@/components/pages/titled.page';
import TestingCenterModal from '@/components/testing-center/testing-center.modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeleteTestingCenter, useGetTestingCenterPaginated } from '@rest/api';
import type { TestingCenter } from '@rest/models';
import { Building2, Edit, FlaskConical, MapPin, Plus, Trash2, Users } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function CampusRegistrarTestingCenter(): React.ReactNode {
  const [page] = useState(1);
  const [rows] = useState(1000);

  const { mutateAsync: deleteTestingCenter } = useDeleteTestingCenter();
  const confirm = useConfirm();
  const testingCenterModal = useModal<TestingCenter>();

  const {
    data: testingCenters,
    refetch: refetchTestingCenters,
    isLoading,
  } = useGetTestingCenterPaginated({
    page,
    rows,
  });

  // Group testing centers by building
  const groupedTestingCenters = useMemo(() => {
    if (!testingCenters?.data?.data) return {};

    const grouped = testingCenters.data.data.reduce(
      (acc, testingCenter) => {
        const buildingName = testingCenter.room?.building?.name || 'Unknown Building';
        if (!acc[buildingName]) {
          acc[buildingName] = [];
        }
        acc[buildingName].push(testingCenter);
        return acc;
      },
      {} as Record<string, TestingCenter[]>
    );

    // Sort testing centers within each building by code
    Object.keys(grouped).forEach((building) => {
      grouped[building].sort((a, b) => {
        const codeA = a.code || '';
        const codeB = b.code || '';
        return codeA.localeCompare(codeB);
      });
    });

    return grouped;
  }, [testingCenters?.data?.data]);

  const totalTestingCenters = useMemo(() => {
    return Object.values(groupedTestingCenters).reduce(
      (total, centers) => total + centers.length,
      0
    );
  }, [groupedTestingCenters]);

  const totalCapacity = useMemo(() => {
    return Object.values(groupedTestingCenters)
      .flat()
      .reduce((total, center) => total + (center.room?.room_capacity || 0), 0);
  }, [groupedTestingCenters]);

  const labCount = useMemo(() => {
    return Object.values(groupedTestingCenters)
      .flat()
      .filter((center) => center.room?.is_lab).length;
  }, [groupedTestingCenters]);

  const handleDeleteTestingCenter = async (testingCenter: TestingCenter) => {
    confirm.confirm(async () => {
      if (!testingCenter.id) return;

      try {
        await deleteTestingCenter({ id: testingCenter.id });
        toast.success('Testing center deleted successfully');
        refetchTestingCenters();
      } catch (error) {
        toast.error('Failed to delete testing center');
        // eslint-disable-next-line no-console
        console.error('Delete error:', error);
      }
    });
  };

  if (isLoading) {
    return (
      <TitledPage title="Testing Center" description="Manage testing centers across campus">
        <div className="space-y-6 sm:space-y-8">
          {/* Stats Cards Skeleton */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card
                key={i}
                className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-10 rounded-lg" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-9 w-20 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Testing Centers Section Skeleton */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-full sm:w-40" />
            </div>

            {/* Building Cards Skeleton */}
            <div className="space-y-6">
              {[...Array(2)].map((_, buildingIndex) => (
                <Card
                  key={buildingIndex}
                  className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <CardHeader className="border-b bg-muted/30 px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                      <div className="min-w-0 flex-1 space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {[...Array(4)].map((_, centerIndex) => (
                        <div
                          key={centerIndex}
                          className="relative p-4 sm:p-5 border rounded-xl bg-card"
                        >
                          <div className="flex items-start justify-between mb-3 gap-2">
                            <div className="flex-1 min-w-0 space-y-2">
                              <Skeleton className="h-5 w-24" />
                              <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-5 w-12 rounded-full shrink-0" />
                          </div>

                          <div className="space-y-2">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between py-1.5 px-2 bg-muted/40 rounded-md"
                              >
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-12" />
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-16" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </TitledPage>
    );
  }

  return (
    <TitledPage title="Testing Center" description="Manage testing centers across campus">
      <div className="space-y-6 sm:space-y-8">
        {/* Enhanced Stats Cards with better responsive design */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="group border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Testing Centers
              </CardTitle>
              <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg group-hover:scale-105 transition-transform duration-200">
                <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                {totalTestingCenters}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Active locations</p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Total Capacity
              </CardTitle>
              <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg group-hover:scale-105 transition-transform duration-200">
                <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                {totalCapacity}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Available seats</p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-purple-50/50 to-violet-50/30 dark:from-purple-950/20 dark:to-violet-950/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Laboratory Centers
              </CardTitle>
              <div className="p-2.5 bg-purple-100 dark:bg-purple-900/40 rounded-lg group-hover:scale-105 transition-transform duration-200">
                <FlaskConical className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                {labCount}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Lab facilities</p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-rose-50/50 to-pink-50/30 dark:from-rose-950/20 dark:to-pink-950/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Buildings
              </CardTitle>
              <div className="p-2.5 bg-rose-100 dark:bg-rose-900/40 rounded-lg group-hover:scale-105 transition-transform duration-200">
                <MapPin className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-rose-700 dark:text-rose-300">
                {Object.keys(groupedTestingCenters).length}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Campus locations</p>
            </CardContent>
          </Card>
        </div>

        {/* Testing Centers Section with improved header */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Testing Centers
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                {totalTestingCenters > 0 ? (
                  <>
                    Viewing {totalTestingCenters} center{totalTestingCenters !== 1 ? 's' : ''}{' '}
                    across {Object.keys(groupedTestingCenters).length} building
                    {Object.keys(groupedTestingCenters).length !== 1 ? 's' : ''}
                  </>
                ) : (
                  'No testing centers configured'
                )}
              </p>
            </div>
            <Button
              onClick={() => testingCenterModal.openFn()}
              className="gap-2 shadow-sm hover:shadow-md transition-shadow w-full sm:w-auto"
              size="default"
            >
              <Plus className="h-4 w-4" />
              Add Testing Center
            </Button>
          </div>

          {Object.keys(groupedTestingCenters).length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
                <div className="p-4 bg-muted/50 rounded-full mb-4">
                  <Building2 className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/60" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                  No testing centers found
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-md px-4">
                  Get started by adding your first testing center to manage exam locations.
                </p>
                <Button
                  onClick={() => testingCenterModal.openFn()}
                  className="mt-6 gap-2"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                  Add Your First Center
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedTestingCenters)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([buildingName, centers]) => (
                  <Card
                    key={buildingName}
                    className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <CardHeader className="border-b bg-muted/30 px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-base sm:text-lg font-semibold truncate">
                            {buildingName}
                          </CardTitle>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                            {centers.length} center{centers.length !== 1 ? 's' : ''} •{' '}
                            {centers.reduce(
                              (sum, center) => sum + (center.room?.room_capacity || 0),
                              0
                            )}{' '}
                            seats
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {centers.map((center) => (
                          <div
                            key={center.id}
                            className="group relative p-4 sm:p-5 border rounded-xl bg-card hover:bg-accent/5 hover:border-accent hover:shadow-sm transition-all duration-200"
                          >
                            <div className="flex items-start justify-between mb-3 gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm sm:text-base truncate">
                                  {center.code}
                                </h4>
                                <p className="text-xs sm:text-sm text-muted-foreground truncate mt-0.5">
                                  {center.room?.name || 'Unknown Room'}
                                </p>
                              </div>
                              {center.room?.is_lab && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs shrink-0 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-0"
                                >
                                  <FlaskConical className="h-3 w-3 mr-1" />
                                  Lab
                                </Badge>
                              )}
                            </div>

                            <div className="space-y-2 text-xs sm:text-sm">
                              <div className="flex items-center justify-between py-1.5 px-2 bg-muted/40 rounded-md">
                                <span className="text-muted-foreground">Room Code</span>
                                <span className="font-medium">{center.room?.room_code || '—'}</span>
                              </div>
                              <div className="flex items-center justify-between py-1.5 px-2 bg-muted/40 rounded-md">
                                <span className="text-muted-foreground">Capacity</span>
                                <span className="font-medium">
                                  {center.room?.room_capacity || '—'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between py-1.5 px-2 bg-muted/40 rounded-md">
                                <span className="text-muted-foreground">Floor</span>
                                <span className="font-medium">{center.room?.floor ?? '—'}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => testingCenterModal.openFn(center)}
                                className="h-8 px-3 hover:bg-primary/10 hover:text-primary"
                              >
                                <Edit className="h-3.5 w-3.5 mr-1.5" />
                                <span className="text-xs">Edit</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteTestingCenter(center)}
                                className="h-8 px-3 hover:bg-destructive/10 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                <span className="text-xs">Delete</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </div>

      <TestingCenterModal controller={testingCenterModal} onSubmit={refetchTestingCenters} />
    </TitledPage>
  );
}
