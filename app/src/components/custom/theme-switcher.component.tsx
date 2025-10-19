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
              'group relative h-10 w-10 rounded-lg border border-border/50 bg-background text-foreground shadow-sm transition-all duration-300 ease-in-out motion-reduce:transition-none',
              'hover:bg-accent hover:text-accent-foreground hover:border-border hover:shadow-lg hover:scale-105',
              'active:scale-95 active:shadow-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              'backdrop-blur-sm',
              theme === 'light' &&
                'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 text-amber-900 dark:text-amber-100 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900 dark:hover:to-orange-900 border-amber-200/50 dark:border-amber-800/50 shadow-amber-200/50 dark:shadow-amber-900/50',
              theme === 'dark' &&
                'bg-gradient-to-br from-slate-800 to-slate-900 text-slate-100 hover:from-slate-700 hover:to-slate-800 border-slate-700/50 shadow-slate-900/50'
            )}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 dark:-rotate-90 dark:scale-0 text-amber-600 dark:text-amber-400" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 group-hover:-rotate-12 group-hover:scale-110 dark:rotate-0 dark:scale-100 text-slate-300" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="font-medium">
          <div className="flex items-center gap-2">
            {theme === 'light' ? (
              <>
                <Moon className="h-3.5 w-3.5" />
                <span>Switch to dark theme</span>
              </>
            ) : (
              <>
                <Sun className="h-3.5 w-3.5" />
                <span>Switch to light theme</span>
              </>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
