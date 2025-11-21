import TitledPage from '@/components/pages/titled.page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnrollmentGenericTab from '@/views/shared/enrollment-generic.tab';
import { EnrollmentLogActionEnum, UserRoleEnum } from '@rest/models';
import React, { useEffect, useMemo, useState } from 'react';

export default function CampusRegistrarEnrollment(): React.ReactNode {
  const [selectedTab, setSelectedTab] = useState<EnrollmentLogActionEnum>(() => {
    const saved = sessionStorage.getItem(window.location.pathname + '_tab');
    return saved
      ? (saved as EnrollmentLogActionEnum)
      : EnrollmentLogActionEnum.program_chair_approved;
  });

  useEffect(() => {
    sessionStorage.setItem(window.location.pathname + '_tab', selectedTab);
  }, [selectedTab]);

  const tabs = useMemo(
    () => [
      {
        label: 'Pending Enrollment Approval',
        value: EnrollmentLogActionEnum.program_chair_approved,
      },
      {
        label: 'Pending Drop Approval',
        value: EnrollmentLogActionEnum.program_chair_dropped_approved,
      },
      {
        label: 'Recently Approved',
        value: EnrollmentLogActionEnum.registrar_approved,
      },
      {
        label: 'Recently Dropped',
        value: EnrollmentLogActionEnum.registrar_dropped_approved,
      },
      {
        label: 'Rejected',
        value: EnrollmentLogActionEnum.rejected,
      },
    ],
    []
  );
  return (
    <TitledPage title="Enrollment Approval" description="Manage student enrollments">
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
              role={UserRoleEnum.campus_registrar}
              status={tab.value}
              needsAction={
                tab.value === EnrollmentLogActionEnum.program_chair_approved ||
                tab.value === EnrollmentLogActionEnum.program_chair_dropped_approved
              }
            />
          </TabsContent>
        ))}
      </Tabs>
    </TitledPage>
  );
}
