"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutGrid, 
  FileText, 
  History, 
  Settings, 
  LogOut,
  Search,
  Bell,
  Menu,
  PanelLeftClose,
  PanelLeft
} from "lucide-react";
import { WorkspaceSwitcher } from "@/features/workspace/workspace-switcher";
import { currentUser } from "@/lib/mock-data";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { href: "/workspaces/1", label: "Overview", icon: LayoutGrid },
    { href: "/canvases", label: "Canvases", icon: FileText },
    { href: "/documents", label: "Documents", icon: FileText },
    { href: "/runs", label: "Runs", icon: History },
    { href: "/workspaces/1/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? "w-64" : "w-[70px]"
        } border-r border-[var(--border)] flex flex-col bg-[var(--card)] transition-all duration-300 ease-in-out z-20`}
      >
        <div className="h-16 flex items-center px-4 border-b border-[var(--border)]">
          {sidebarOpen ? (
            <WorkspaceSwitcher />
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[var(--primary)] to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
                A
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all group relative ${
                  isActive
                    ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon size={20} className={isActive ? "text-[var(--primary)]" : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"} />
                <span className={`whitespace-nowrap transition-all duration-300 ${sidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute left-10 pointer-events-none"}`}>
                  {item.label}
                </span>
                {isActive && !sidebarOpen && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--primary)] rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[var(--border)]">
          <button 
            className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--destructive)]/10 hover:text-[var(--destructive)] transition-colors group ${!sidebarOpen && "justify-center"}`}
            title={!sidebarOpen ? "Sign Out" : undefined}
          >
            <LogOut size={20} />
            <span className={`whitespace-nowrap transition-all duration-300 ${sidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute left-10 pointer-events-none"}`}>
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[var(--background)]">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors"
            >
              {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
            </button>
            <div className="h-6 w-px bg-[var(--border)]" />
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <span className="hover:text-[var(--foreground)] cursor-pointer">Dashboard</span>
              {pathname !== "/" && (
                <>
                  <span>/</span>
                  <span className="text-[var(--foreground)] capitalize">{pathname.split("/")[1]}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-9 pr-4 py-1.5 rounded-full border border-[var(--border)] bg-[var(--muted)]/30 focus:bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all text-sm"
              />
            </div>
            
            <button className="relative p-2 rounded-full hover:bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--background)]" />
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-[var(--border)]">
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium">{currentUser.name}</div>
                <div className="text-xs text-[var(--muted-foreground)]">{currentUser.role}</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-[var(--muted)] overflow-hidden border border-[var(--border)]">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
