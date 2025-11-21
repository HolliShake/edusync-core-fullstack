import TitledPage from '@/components/pages/titled.page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentRequestLogActionEnum } from '@rest/models';
import { useEffect, useMemo, useState } from 'react';
import RequestGenericTab from './request-generic-tab';

export default function CampusRegistrarRequest(): React.ReactNode {
  const [selectedTab, setSelectedTab] = useState<DocumentRequestLogActionEnum>(() => {
    const saved = sessionStorage.getItem(window.location.pathname + '_tab');
    return saved ? (saved as DocumentRequestLogActionEnum) : DocumentRequestLogActionEnum.paid;
  });

  useEffect(() => {
    sessionStorage.setItem(window.location.pathname + '_tab', selectedTab);
  }, [selectedTab]);

  const tabs = useMemo(
    () => [
      {
        label: 'Pending Approval',
        value: DocumentRequestLogActionEnum.paid,
      },
      {
        label: 'Processing',
        value: DocumentRequestLogActionEnum.processing,
      },
      {
        label: 'Pending Pickup',
        value: DocumentRequestLogActionEnum.pickup,
      },
      {
        label: 'Completed',
        value: DocumentRequestLogActionEnum.completed,
      },
    ],
    []
  );

  return (
    <TitledPage
      title="Document Requests"
      description="All document requests that are marked as 'Paid'."
    >
      <Tabs
        value={selectedTab}
        onValueChange={(value: string) => setSelectedTab(value as DocumentRequestLogActionEnum)}
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
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <RequestGenericTab filter={tab.value} />
          </TabsContent>
        ))}
      </Tabs>
    </TitledPage>
  );
}
