import Header from '@/components/navigation/header';
import AppSideBar from '@/components/navigation/sidebar';
import Providers from '@/components/providers';
import { AuthProvider } from '@/context/auth.context';
import type React from 'react';
import { useEffect, useState } from 'react';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps): React.ReactNode {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (isCollapsed: boolean) => {
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
    setIsSidebarCollapsed(isCollapsed);
  };

  useEffect(() => {
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed');
    setIsSidebarCollapsed(sidebarCollapsed === 'true');
  }, []);

  // Ensure sidebar is responsive to viewport size changes
  useEffect(() => {
    const updateSidebarStateForViewport = (): void => {
      if (typeof window === 'undefined') return;
      const isLarge = window.innerWidth >= 1024; // Tailwind lg breakpoint
      if (!isLarge) {
        setIsSidebarCollapsed(true);
      }
    };

    updateSidebarStateForViewport();
    window.addEventListener('resize', updateSidebarStateForViewport);
    return () => window.removeEventListener('resize', updateSidebarStateForViewport);
  }, []);

  return (
    <Providers>
      <AuthProvider>
        <div className="flex h-screen w-screen">
          {/* Mobile overlay */}
          {!isSidebarCollapsed && (
            <div
              className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
              onClick={() => handleSidebarToggle(true)}
            />
          )}

          {/* Sidebar */}
          <AppSideBar isCollapsed={isSidebarCollapsed} setIsCollapsed={handleSidebarToggle} />

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <Header setIsSidebarOpen={handleSidebarToggle} />

            {/* Main content area */}
            <main className="flex-1 overflow-auto p-10 bg-background">{children}</main>
          </div>
        </div>
      </AuthProvider>
    </Providers>
  );
}
