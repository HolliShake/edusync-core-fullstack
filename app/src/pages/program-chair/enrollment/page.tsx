import TitledPage from '@/components/pages/titled.page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnrollmentGenericTab from '@/views/shared/enrollment-generic.tab';
import { EnrollmentLogActionEnum, UserRoleEnum } from '@rest/models';
import React, { useEffect, useMemo, useState } from 'react';

export default function ProgramChairEnrollment(): React.ReactNode {
  const [selectedTab, setSelectedTab] = useState<EnrollmentLogActionEnum>(() => {
    const saved = sessionStorage.getItem(window.location.pathname + '_tab');
    return saved ? (saved as EnrollmentLogActionEnum) : EnrollmentLogActionEnum.enroll;
  });

  useEffect(() => {
    sessionStorage.setItem(window.location.pathname + '_tab', selectedTab);
  }, [selectedTab]);

  const tabs = useMemo(
    () => [
      {
        label: 'Pending Enrollment',
        value: EnrollmentLogActionEnum.enroll,
      },
      {
        label: 'Pending Drop',
        value: EnrollmentLogActionEnum.dropped,
      },
      {
        label: 'Recently Approved',
        value: EnrollmentLogActionEnum.program_chair_approved,
      },
      {
        label: 'Recently Dropped',
        value: EnrollmentLogActionEnum.program_chair_dropped_approved,
      },
      {
        label: 'Rejected',
        value: EnrollmentLogActionEnum.rejected,
      },
    ],
    []
  );
  return (
    <TitledPage title="Enrollment" description="Manage student enrollments">
      <Tabs
        value={selectedTab}
        onValueChange={(value: string) => setSelectedTab(value as EnrollmentLogActionEnum)}
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
              role={UserRoleEnum.program_chair}
              status={tab.value}
              needsAction={
                tab.value === EnrollmentLogActionEnum.enroll ||
                tab.value === EnrollmentLogActionEnum.dropped
              }
            />
          </TabsContent>
        ))}
      </Tabs>
    </TitledPage>
  );
}
