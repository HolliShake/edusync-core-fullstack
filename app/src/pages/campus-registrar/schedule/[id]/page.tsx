import TitledPage from '@/components/pages/titled.page';
import { decryptIdFromUrl } from '@/lib/hash';
import ScheduleInfoView from '@/views/shared/schedule-info.view';
import { useGetSectionById } from '@rest/api';
import type React from 'react';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

export default function CampusRegistrarScheduleDetail(): React.ReactNode {
  const { scheduleId } = useParams<{ scheduleId: string }>();

  const parsedScheduleId = useMemo(() => {
    return decryptIdFromUrl(scheduleId!);
  }, [scheduleId]);

  const { data: sectionResponse } = useGetSectionById(parsedScheduleId, {
    query: {
      enabled: !!parsedScheduleId,
    },
  });

  const section = useMemo(() => sectionResponse?.data, [sectionResponse]);

  return (
    <TitledPage
      title="Schedule Details"
      description="Manage teachers and students for this section"
    >
      <ScheduleInfoView section={section} />
    </TitledPage>
  );
}
