"use client";

import { SidebarInset, SidebarProvider } from "@hachi/ui/components/sidebar";
import { DashboardSidebar } from "@/features/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/features/dashboard/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
