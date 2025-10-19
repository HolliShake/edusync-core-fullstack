import TitledPage from '@/components/pages/titled.page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { CampusRegistrarTab } from './campus-registrar.tab';
import { CollegeDeanTab } from './college-dean.tab';
import { UserListTab } from './list.tab';
import { ProgramChairTab } from './program-chair.tab';

export default function AdminUsers(): React.ReactNode {
  const [selectedTab, setSelectedTab] = useState('list');
  const labels = useMemo(
    () => [
      {
        label: 'List',
        value: 'list',
      },
      {
        label: 'Campus Registrar',
        value: 'campus_registrar',
      },
      {
        label: 'College Dean',
        value: 'college_dean',
      },
      {
        label: 'Program Chair',
        value: 'program_chair',
      },
    ],
    []
  );

  const handleTabChange = (value: string): void => {
    localStorage.setItem(window.location.pathname + '_tab', value);
    setSelectedTab(value);
  };

  useEffect(() => {
    const tab = localStorage.getItem(window.location.pathname + '_tab');
    if (labels.some((label) => label.value === tab)) {
      setSelectedTab(tab as string);
    }
  }, [labels]);

  return (
    <TitledPage title="Users" description="Manage system users">
      <Tabs value={selectedTab} onValueChange={handleTabChange}>
        <TabsList className="shadow-sm">
          {labels.map((label) => (
            <TabsTrigger
              key={label.value}
              value={label.value}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              {label.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {/* users list */}
        <TabsContent value="list">
          <UserListTab />
        </TabsContent>
        {/* Campus Registrar */}
        <TabsContent value="campus_registrar">
          <CampusRegistrarTab />
        </TabsContent>
        {/* College Dean */}
        <TabsContent value="college_dean">
          <CollegeDeanTab />
        </TabsContent>
        {/* Program Chair */}
        <TabsContent value="program_chair">
          <ProgramChairTab />
        </TabsContent>
      </Tabs>
    </TitledPage>
  );
}
