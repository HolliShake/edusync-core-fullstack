import TitledPage from '@/components/pages/titled.page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RequestGenericTab from './request-generic-tab';
import { useEffect, useMemo, useState } from 'react';
import { DocumentRequestLogAction } from '@rest/models';

export default function CampusRegistrarRequest(): React.ReactNode {
  const [selectedTab, setSelectedTab] = useState<DocumentRequestLogAction>(() => {
    const saved = sessionStorage.getItem(window.location.pathname + '_tab');
    return saved ? (saved as DocumentRequestLogAction) : DocumentRequestLogAction.paid;
  });

  useEffect(() => {
    sessionStorage.setItem(window.location.pathname + '_tab', selectedTab);
  }, [selectedTab]);

  const tabs = useMemo(() => [
    {
      label: 'Pending Approval',
      value: DocumentRequestLogAction.paid,
    },
    {
        label: 'Processing',
        value: DocumentRequestLogAction.processing,
    },
    {
      label: 'Pending Pickup',
      value: DocumentRequestLogAction.pickup,
    },
    {
      label: 'Completed',
      value: DocumentRequestLogAction.completed,
    },
  ], []);

  return (
    <TitledPage title="Document Requests" description="All document requests that are marked as 'Paid'.">
      <Tabs value={selectedTab} onValueChange={(value: string) => setSelectedTab(value as DocumentRequestLogAction)}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">{tab.label}</TabsTrigger>
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