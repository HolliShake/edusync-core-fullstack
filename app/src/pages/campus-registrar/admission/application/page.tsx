import TitledPage from '@/components/pages/titled.page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdmissionApplicationLogTypeEnum } from '@rest/models';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import CampusRegistrarAdmissionApplicationGenericTab from './generic.tab';

export default function CampusRegistrarAdmissionApplication(): React.ReactNode {
  const [selectedTab, setSelectedTab] = useState<AdmissionApplicationLogTypeEnum>(() => {
    const saved = localStorage.getItem(window.location.pathname + '_tab');
    return saved
      ? (saved as AdmissionApplicationLogTypeEnum)
      : AdmissionApplicationLogTypeEnum.submitted;
  });

  const tabs = useMemo(
    () => [
      {
        label: 'Pending', // Show as "Pending", if already submitted by applicant
        value: AdmissionApplicationLogTypeEnum.submitted,
      },
      {
        label: 'Approved',
        value: AdmissionApplicationLogTypeEnum.approved,
      },
      {
        label: 'Rejected',
        value: AdmissionApplicationLogTypeEnum.rejected,
      },
      {
        label: 'Accepted',
        value: AdmissionApplicationLogTypeEnum.accepted,
      },
    ],
    []
  );

  const handleTabChange = (value: string): void => {
    localStorage.setItem(window.location.pathname + '_tab', value);
    setSelectedTab(value as AdmissionApplicationLogTypeEnum);
  };

  useEffect(() => {
    const tab = localStorage.getItem(window.location.pathname + '_tab');
    if (tabs.some((t) => t.value === tab)) {
      setSelectedTab(tab as AdmissionApplicationLogTypeEnum);
    }
  }, [tabs]);

  return (
    <TitledPage
      title="Admission Applications for University Admission"
      description="Manage and review admission applications for the selected university admission"
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
            <CampusRegistrarAdmissionApplicationGenericTab status={tab.value} />
          </TabsContent>
        ))}
      </Tabs>
    </TitledPage>
  );
}
