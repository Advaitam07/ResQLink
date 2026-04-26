"use client";

import { usePathname } from 'next/navigation';
import { DashboardSidebar } from '@/components/dashboard-sidebar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isNoSidebarPage = pathname === '/' || pathname === '/initialize' || pathname === '/login';

  if (isNoSidebarPage) {
    return <>{children}</>;
  }

  return (
    <>
      <DashboardSidebar />
      {/* Offset content by sidebar width on desktop */}
      <div className="lg:pl-[260px] min-h-screen">
        {children}
      </div>
    </>
  );
}
