import Select from '@/components/custom/select.component';
import { useAuth } from '@/context/auth.context';
import { useGetAdmissionSchedulePaginated } from '@rest/api';
import React from 'react';

interface SelectAdmissionScheduleProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SelectAdmissionSchedule = React.forwardRef<HTMLButtonElement, SelectAdmissionScheduleProps>(
  ({ value, onValueChange, placeholder = 'Select admission schedule', className, ...props }, _) => {
    const { session } = useAuth();
    const { data: admissionSchedules } = useGetAdmissionSchedulePaginated(
      {
        'filter[academic_program_id]': Number(session?.active_academic_program),
        sort: '-start_date',
        page: 1,
        rows: Number.MAX_SAFE_INTEGER,
      },
      {
        query: {
          enabled: !!session?.active_academic_program,
        },
      }
    );

    const options = React.useMemo(() => {
      if (!admissionSchedules?.data) return [];

      return (
        admissionSchedules.data.data?.map((admission) => ({
          label: String(admission.title),
          value: String(admission.id),
        })) ?? []
      );
    }, [admissionSchedules?.data]);

    React.useEffect(() => {
      if (options.length > 0 && value === undefined) {
        onValueChange?.(options[0].value);
      }
    }, [options, value, onValueChange]);

    return (
      <Select
        options={options}
        value={value}
        onValueChange={onValueChange}
        placeholder={placeholder}
        className={className}
        {...props}
      />
    );
  }
);

SelectAdmissionSchedule.displayName = 'SelectAdmissionSchedule';

export default SelectAdmissionSchedule;
