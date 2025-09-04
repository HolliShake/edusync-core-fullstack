import { useTheme } from '@/components/theme.provider';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import type React from 'react';

export default function ThemeSwitcher(): React.ReactNode {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            onClick={toggleTheme}
            className={cn(
              'group relative h-10 w-10 rounded-md border border-border/50 bg-background text-foreground shadow-sm transition-all duration-200 motion-reduce:transition-none',
              'hover:bg-accent hover:text-accent-foreground hover:border-border hover:shadow-md',
              'active:scale-[0.98] active:shadow-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              theme === 'light' &&
                'bg-primary text-primary-foreground hover:bg-primary/90 border-primary/20'
            )}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all group-hover:rotate-6 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all group-hover:-rotate-6 dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          Switch to {theme === 'light' ? 'dark' : 'light'} theme
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
