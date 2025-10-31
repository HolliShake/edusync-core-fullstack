import TitledPage from '@/components/pages/titled.page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AdmissionApplicationLogTypeEnum,
  type AdmissionApplicationLogType,
} from '@/enums/admission-application-log-type-enum';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import ProgramChairAdmissionApplicationGenericTab from './generic.tab';

export default function ProgramChairAdmissionApplication(): React.ReactNode {
  const [selectedTab, setSelectedTab] = useState<AdmissionApplicationLogType>(() => {
    const saved = localStorage.getItem(window.location.pathname + '_tab');
    return saved
      ? (saved as AdmissionApplicationLogType)
      : AdmissionApplicationLogTypeEnum.SUBMITTED;
  });

  const tabs = useMemo(
    () => [
      {
        label: 'Pending', // Show as "Pending", if already submitted by applicant
        value: AdmissionApplicationLogTypeEnum.SUBMITTED,
      },
      {
        label: 'Approved',
        value: AdmissionApplicationLogTypeEnum.APPROVED,
      },
      {
        label: 'Rejected',
        value: AdmissionApplicationLogTypeEnum.REJECTED,
      },
      {
        label: 'Accepted',
        value: AdmissionApplicationLogTypeEnum.ACCEPTED,
      },
    ],
    []
  );

  const handleTabChange = (value: string): void => {
    localStorage.setItem(window.location.pathname + '_tab', value);
    setSelectedTab(value as AdmissionApplicationLogType);
  };

  useEffect(() => {
    const tab = localStorage.getItem(window.location.pathname + '_tab');
    if (tabs.some((t) => t.value === tab)) {
      setSelectedTab(tab as AdmissionApplicationLogType);
    }
  }, [tabs]);

  return (
    <TitledPage
      title="Admission Applications"
      description="Manage and review admission applications"
    >
      <Tabs value={selectedTab} onValueChange={handleTabChange}>
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
            <ProgramChairAdmissionApplicationGenericTab status={tab.value} />
          </TabsContent>
        ))}
      </Tabs>
    </TitledPage>
  );
}
