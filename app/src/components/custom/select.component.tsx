import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { forwardRef } from 'react';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  onChange: (value: string) => void;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
}

const CustomSelect = forwardRef<HTMLButtonElement, SelectProps>(
  ({ options, onChange, value, placeholder = 'Select an option...', disabled }, ref) => {
    return (
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger ref={ref}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

CustomSelect.displayName = 'CustomSelect';

export default CustomSelect;
