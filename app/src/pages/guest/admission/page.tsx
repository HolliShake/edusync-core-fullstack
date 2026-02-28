import TitledPage from '@/components/pages/titled.page';
import { UniversityAdmissionStepEnum, type UniversityAdmissionApplication } from '@rest/models';
import type React from 'react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import GuestAdmissionExamBannerStep3 from './steps/banner.step3';
import GuestAdmissionSelectProgramStep4 from './steps/select-program.step4';
import GuestAdmissionSelectScheduleStep2 from './steps/select-schedule.step2';
import GuestAdmissionViewStep1 from './steps/view.step1';

export default function GuestAdmission(): React.ReactNode {
  const [view, setView] = useState(0);
  const [selectedApplication, setSelectedApplication] =
    useState<UniversityAdmissionApplication | null>(null);

  const onSelectApplication = (application: UniversityAdmissionApplication) => {
    setSelectedApplication(application);
    switch (application.next_step) {
      case UniversityAdmissionStepEnum.schedule_selection:
        return setView(1);
      case UniversityAdmissionStepEnum.take_exam:
        return setView(2);
      case UniversityAdmissionStepEnum.apply_to_program:
        return setView(3);
      case UniversityAdmissionStepEnum.locked:
        toast.warning('Application is locked');
        break;
      default:
        break;
    }
  };

  const steps = useMemo(
    () => [
      <GuestAdmissionViewStep1 onSelectApplication={onSelectApplication} />,
      <GuestAdmissionSelectScheduleStep2 selectedApplication={selectedApplication} />,
      <GuestAdmissionExamBannerStep3 selectedApplication={selectedApplication} />,
      <GuestAdmissionSelectProgramStep4 selectedApplication={selectedApplication} />,
    ],
    [selectedApplication]
  );

  return (
    <TitledPage title="My Applications" description="View your admission applications">
      {steps[view]}
    </TitledPage>
  );
}
