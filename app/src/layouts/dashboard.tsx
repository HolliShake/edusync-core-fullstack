import Header from '@/components/navigation/header';
import AppSideBar from '@/components/navigation/sidebar';
import Provider from '@/components/provider';
import type React from 'react';
import { useState } from 'react';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps): React.ReactNode {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Provider>
      <div className="flex h-screen w-screen">
        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <AppSideBar isCollapsed={isSidebarOpen} setIsCollapsed={setIsSidebarOpen} />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header setIsSidebarOpen={setIsSidebarOpen} />

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto p-10 bg-background">{children}</main>
        </div>
      </div>
    </Provider>
  );
}
