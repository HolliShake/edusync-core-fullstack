import TitledPage from '@/components/pages/titled.page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRoleEnum } from '@/enums/role-enum';
import EnrollmentGenericTab from '@/views/shared/enrollment-generic.tab';
import { EnrollmentLogAction } from '@rest/models';
import React, { useEffect, useMemo, useState } from 'react';

export default function ProgramChairEnrollment(): React.ReactNode {
  const [selectedTab, setSelectedTab] = useState<EnrollmentLogAction>(() => {
    const saved = sessionStorage.getItem(window.location.pathname + '_tab');
    return saved ? (saved as EnrollmentLogAction) : EnrollmentLogAction.enroll;
  });

  useEffect(() => {
    sessionStorage.setItem(window.location.pathname + '_tab', selectedTab);
  }, [selectedTab]);

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
        label: 'Recently Dropped',
        value: EnrollmentLogAction.program_chair_dropped_approved,
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
            <EnrollmentGenericTab
              role={UserRoleEnum.PROGRAM_CHAIR}
              status={tab.value}
              needsAction={
                tab.value === EnrollmentLogAction.enroll ||
                tab.value === EnrollmentLogAction.dropped
              }
            />
          </TabsContent>
        ))}
      </Tabs>
    </TitledPage>
  );
}
