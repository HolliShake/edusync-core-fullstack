import { ThemeProvider } from '@/components/theme.provider';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </ThemeProvider>
  );
}
