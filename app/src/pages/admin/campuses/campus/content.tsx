import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCampusContext } from '@/context/campus.context';
import { Building2, Hash, MapPin, School } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import AdminBuildingTab from './building.tab';
import AdminCollegeTab from './college.tab';

export default function AdminCampusDetailContent(): React.ReactNode {
  const campus = useCampusContext();
  const isLoading = useMemo(() => !campus, [campus]);
  const [activeTab, setActiveTab] = useState('colleges');
  const navigate = useNavigate();

  const tabs = useMemo(
    () => [
      {
        label: 'Colleges',
        value: 'colleges',
        icon: <School className="h-4 w-4" />,
      },
      {
        label: 'Buildings',
        value: 'building',
        icon: <Building2 className="h-4 w-4" />,
      },
    ],
    []
  );

  const handleTabChange = (value: string): void => {
    localStorage.setItem(window.location.href + '_campus_tab', value);
    navigate(`?campus_tab=${value}`);
    setActiveTab(value);
  };

  useEffect(() => {
    const tab = localStorage.getItem(window.location.href + '_campus_tab');
    if (tabs.some((t) => t.value === tab)) {
      setActiveTab(tab as string);
    }
  }, [tabs]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header Section Skeleton */}
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Skeleton className="h-6 w-6" />
              </div>
              <div>
                <Skeleton className="h-10 w-64 mb-2" />
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <Skeleton className="h-4 w-24" />
              <div className="p-2.5 bg-blue-100/50 dark:bg-blue-800/50 rounded-xl">
                <Skeleton className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-1 w-12" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-emerald-900/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <Skeleton className="h-4 w-20" />
              <div className="p-2.5 bg-emerald-100/50 dark:bg-emerald-800/50 rounded-xl">
                <Skeleton className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-1 w-12" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <Skeleton className="h-4 w-16" />
              <div className="p-2.5 bg-red-100/50 dark:bg-red-800/50 rounded-xl">
                <Skeleton className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-1 w-16" />
            </CardContent>
          </Card>
        </div>

        {/* Tabs Skeleton */}
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                {campus?.name}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {campus?.short_name}
                </Badge>
                <span className="text-sm text-muted-foreground">Campus Management</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="group border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              Campus Name
            </CardTitle>
            <div className="p-2.5 bg-blue-100/50 dark:bg-blue-800/50 rounded-xl group-hover:scale-110 transition-transform duration-200">
              <School className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {campus?.name}
            </div>
            <div className="mt-1 h-1 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
          </CardContent>
        </Card>

        <Card className="group border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-emerald-900/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Short Name
            </CardTitle>
            <div className="p-2.5 bg-emerald-100/50 dark:bg-emerald-800/50 rounded-xl group-hover:scale-110 transition-transform duration-200">
              <Hash className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              {campus?.short_name}
            </div>
            <div className="mt-1 h-1 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
          </CardContent>
        </Card>

        <Card className="group border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-red-700 dark:text-red-300">
              Location
            </CardTitle>
            <div className="p-2.5 bg-red-100/50 dark:bg-red-800/50 rounded-xl group-hover:scale-110 transition-transform duration-200">
              <MapPin className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold leading-relaxed text-red-900 dark:text-red-100">
              {campus?.address}
            </div>
            <div className="mt-2 h-1 w-16 bg-gradient-to-r from-red-500 to-rose-500 rounded-full"></div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="shadow-sm">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              {tab.icon}
              <span className="ms-2">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="colleges">
          <AdminCollegeTab />
        </TabsContent>
        {/* Building */}
        <TabsContent value="building">
          <AdminBuildingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
