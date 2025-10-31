import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as ShadcnSelect,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { SelectProps as ShadcnSelectProps } from '@radix-ui/react-select';
import { useEffect, useState } from 'react';

export type SelectOption = {
  label: string;
  value: string;
  subtitle?: string;
  disabled?: boolean;
};

interface CustomSelectProps extends ShadcnSelectProps {
  className?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
}

const Select = ({
  options = [],
  placeholder = 'Select an option',
  value,
  onValueChange,
  className,
  ...props
}: CustomSelectProps) => {
  const [internalValue, setInternalValue] = useState<string | undefined>(value);

  const handleValueChange = (newValue: string) => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  // Use controlled value if provided, otherwise use internal state
  const currentValue = value !== undefined ? value : internalValue;

  // Find the selected option to display its label
  const selectedOption = options.find((option) => option.value === currentValue);

  useEffect(() => {
    if (value !== internalValue) setInternalValue(value || '');
  }, [value, internalValue]);

  return (
    <ShadcnSelect value={currentValue} onValueChange={handleValueChange} {...props}>
      <SelectTrigger className={cn(className)}>
        <SelectValue placeholder={placeholder}>{selectedOption?.label || placeholder}</SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[300px] overflow-y-auto">
        {options.map((option) => (
          <SelectItem
            key={`${option.value}-${option.label}`}
            value={option.value}
            disabled={option.disabled}
          >
            <div>
              {option.label}
              {option.subtitle && <span className="block text-xs">{option.subtitle}</span>}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </ShadcnSelect>
  );
};

Select.displayName = 'Select';

export default Select;
