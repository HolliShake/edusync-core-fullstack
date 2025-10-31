import TitledPage from '@/components/pages/titled.page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnrollmentLogAction } from '@rest/models';
import React, { useMemo, useState } from 'react';
import ProgramChairEnrollmentGenericTab from './generic.tab';

export default function ProgramChairEnrollment(): React.ReactNode {
  const [selectedTab, setSelectedTab] = useState<EnrollmentLogAction>(EnrollmentLogAction.enroll);
  const tabs = useMemo(
    () => [
      {
        label: 'Pending Enrollment',
        value: EnrollmentLogAction.enroll,
      },
      {
        label: 'Pending Drop',
        value: EnrollmentLogAction.dropped,
      },
      {
        label: 'Recently Approved',
        value: EnrollmentLogAction.program_chair_approved,
      },
      {
        label: 'Rejected',
        value: EnrollmentLogAction.rejected,
      },
    ],
    []
  );
  return (
    <TitledPage title="Enrollment" description="Manage student enrollments">
      <Tabs
        value={selectedTab}
        onValueChange={(value: string) => setSelectedTab(value as EnrollmentLogAction)}
      >
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {/*  */}
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <ProgramChairEnrollmentGenericTab status={tab.value} />
          </TabsContent>
        ))}
      </Tabs>
    </TitledPage>
  );
}
