import TitledPage from '@/components/pages/titled.page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import AdmissionOfficerUniversityAdmissionDetailCriteriaTab from './criteria.tab';
import AdmissionOfficerUniversityAdmissionDetailScheduleTab from './schedule.tab';

export default function AdmissionOfficerUniversityAdmissionDetail(): React.ReactNode {
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
        component: <AdmissionOfficerUniversityAdmissionDetailScheduleTab />,
      },
      {
        label: 'Criteria',
        value: 'criteria',
        component: <AdmissionOfficerUniversityAdmissionDetailCriteriaTab />,
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
