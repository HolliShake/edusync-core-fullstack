import Select from '@/components/custom/select.component';
import { useGetUniversityAdmissionPaginated } from '@rest/api';
import React from 'react';

interface SelectUniversityAdmissionProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const SelectUniversityAdmission = React.forwardRef<
  HTMLButtonElement,
  SelectUniversityAdmissionProps
>(
  (
    {
      value,
      onValueChange,
      placeholder = 'Select admission schedule',
      className,
      disabled,
      ...props
    },
    _
  ) => {
    const { data: admissions } = useGetUniversityAdmissionPaginated({
      sort: '-open_date',
      page: 1,
      rows: Number.MAX_SAFE_INTEGER,
    });

    const options = React.useMemo(() => {
      if (!admissions?.data) return [];

      return (
        admissions.data.data?.map((admission) => ({
          label: `Admission For ${admission.school_year?.name}`,
          value: String(admission.id),
        })) ?? []
      );
    }, [admissions?.data]);

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
        disabled={disabled}
        {...props}
      />
    );
  }
);

SelectUniversityAdmission.displayName = 'SelectUniversityAdmission';

export default SelectUniversityAdmission;
