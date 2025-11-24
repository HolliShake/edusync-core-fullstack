import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export type SearchableSelectOption = {
  label: string;
  value: string;
  subtitle?: string;
  disabled?: boolean;
};

interface CustomSearchableSelectProps {
  className?: string;
  placeholder?: string;
  options: SearchableSelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
}

const SearchableSelect = ({
  options = [],
  placeholder = 'Select an option',
  value,
  onValueChange,
  className,
}: CustomSearchableSelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Find the selected option to display its label
  const selectedOption = options.find((option) => option.value === value);

  // Filter options based on debounced search query
  const filteredOptions = useMemo(() => {
    if (!debouncedSearchQuery) return options;

    const query = debouncedSearchQuery.toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(query) || option.subtitle?.toLowerCase().includes(query)
    );
  }, [options, debouncedSearchQuery]);

  const handleSelect = (optionValue: string) => {
    onValueChange?.(optionValue);
    setOpen(false);
    setSearchQuery('');
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          <span className="truncate">{selectedOption?.label || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] p-0" align="start">
        <div className="p-2 border-b">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8"
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
        <ScrollArea className="max-h-[300px]">
          {filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">No results found.</div>
          ) : (
            <div className="p-1">
              {filteredOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  disabled={option.disabled}
                  onSelect={() => handleSelect(option.value)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex-1">
                    {option.label}
                    {option.subtitle && (
                      <span className="block text-xs text-muted-foreground">{option.subtitle}</span>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

SearchableSelect.displayName = 'SearchableSelect';

export default SearchableSelect;
