import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as ShadcnSelect,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { SelectProps as ShadcnSelectProps } from '@radix-ui/react-select';

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
  // Always use controlled mode - normalize undefined/empty string to empty string
  const currentValue = value ?? '';

  const handleValueChange = (newValue: string) => {
    onValueChange?.(newValue);
  };

  // Find the selected option to display its label
  const selectedOption = options.find((option) => option.value === currentValue);

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
              {option.subtitle && (
                <span className="block text-xs text-muted-foreground">{option.subtitle}</span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </ShadcnSelect>
  );
};

Select.displayName = 'Select';

export default Select;
