import TitledPage from '@/components/pages/titled.page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import CampusRegistrarUniversityAdmissionDetailCriteriaTab from './criteria.tab';
import CampusRegistrarUniversityAdmissionDetailScheduleTab from './schedule.tab';

export default function CampusRegistrarUniversityAdmissionDetail(): React.ReactNode {
  const tabStorageKey = `${window.location.pathname}_tab`;

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem(tabStorageKey) || 'schedules';
  });

  useEffect(() => {
    localStorage.setItem(tabStorageKey, activeTab);
  }, [activeTab, tabStorageKey]);

  const tabs = useMemo(
    () => [
      {
        label: 'Schedules',
        value: 'schedules',
        component: <CampusRegistrarUniversityAdmissionDetailScheduleTab />,
      },
      {
        label: 'Criteria',
        value: 'criteria',
        component: <CampusRegistrarUniversityAdmissionDetailCriteriaTab />,
      },
    ],
    []
  );

  return (
    <TitledPage
      title="University Admission Details"
      description="View university admission information"
    >
      <Tabs
        defaultValue={activeTab}
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </TitledPage>
  );
}
