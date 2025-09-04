import ThemeSwitcher from '@/components/custom/theme-switcher.component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, Search } from 'lucide-react';
import type React from 'react';

type HeaderProps = {
  setIsSidebarOpen?: (isOpen: boolean) => void;
};

export default function Header({ setIsSidebarOpen = undefined }: HeaderProps): React.ReactNode {
  return (
    <header className="relative min-h-[64px] flex items-center px-6 backdrop-blur-xl border-b border-border bg-sidebar">
      <div className="relative flex items-center justify-between w-full">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen?.(true)}
          className="lg:hidden w-12 h-12 rounded-lg hover:bg-accent text-foreground/70 hover:text-foreground transition-all duration-300 hover:scale-110 border border-border hover:border-border"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Search section */}
        <div className="flex-1 max-w-md mx-6 lg:mx-0">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors duration-300" />
            <Input
              placeholder="Search across the platform..."
              className="bg-background/50 backdrop-blur-sm border-border focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-300 rounded-lg"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex flex-row items-center gap-2">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
