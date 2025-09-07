import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type React from 'react';

export interface MenuItem {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link';
  disabled?: boolean;
}

export interface MenuProps {
  items: MenuItem[];
  trigger: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

const getVariantClasses = (variant?: string) => {
  switch (variant) {
    case 'destructive':
      return 'text-destructive focus:text-destructive';
    case 'outline':
      return 'text-muted-foreground focus:text-foreground';
    case 'ghost':
      return 'text-muted-foreground focus:text-foreground';
    case 'link':
      return 'text-primary focus:text-primary';
    default:
      return 'text-foreground focus:text-foreground';
  }
};

export default function Menu({
  items,
  trigger,
  className,
  contentClassName,
}: MenuProps): React.ReactNode {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={cn(className)}>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn('w-56', contentClassName)}>
        {items.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              item.onClick?.();
            }}
            onSelect={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            disabled={item.disabled}
            className={cn(
              'flex items-center gap-2 cursor-pointer select-none antialiased font-semibold text-base',
              getVariantClasses(item.variant)
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
