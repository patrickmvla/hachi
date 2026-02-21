"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  PanelLeft,
  X
} from "lucide-react";
import { WorkspaceSwitcher } from "@/features/workspace/workspace-switcher";
import { authClient } from "@hachi/auth/client";
import { useState, useEffect } from "react";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentUser = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "",
    avatar: session?.user?.image || null,
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutGrid },
    { href: "/canvases", label: "Canvases", icon: FileText },
    { href: "/documents", label: "Documents", icon: FileText },
    { href: "/runs", label: "Runs", icon: History },
    { href: "/workspaces", label: "Organizations", icon: Settings },
  ];

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      <div className="h-16 flex items-center px-4 border-b border-border">
        {(sidebarOpen || isMobile) ? (
          <WorkspaceSwitcher />
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 rounded-md bg-linear-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
              A
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto" role="navigation" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all group relative ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              title={!sidebarOpen && !isMobile ? item.label : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon size={20} className={isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"} />
              <span className={`whitespace-nowrap transition-all duration-300 ${(sidebarOpen || isMobile) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute left-10 pointer-events-none"}`}>
                {item.label}
              </span>
              {isActive && !sidebarOpen && !isMobile && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <button
          onClick={async () => {
            await authClient.signOut();
            router.push("/login");
          }}
          className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors group ${!sidebarOpen && !isMobile && "justify-center"}`}
          title={!sidebarOpen && !isMobile ? "Sign Out" : undefined}
          aria-label="Sign out"
        >
          <LogOut size={20} />
          <span className={`whitespace-nowrap transition-all duration-300 ${(sidebarOpen || isMobile) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute left-10 pointer-events-none"}`}>
            Sign Out
          </span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 border-r border-border flex flex-col bg-card z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile navigation"
      >
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-md hover:bg-muted text-muted-foreground"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
        <SidebarContent isMobile />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex ${
          sidebarOpen ? "w-64" : "w-[70px]"
        } border-r border-border flex-col bg-card transition-all duration-300 ease-in-out z-20`}
        aria-label="Desktop navigation"
      >
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-card/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={20} />
            </button>

            {/* Desktop sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
            </button>

            <div className="hidden sm:block h-6 w-px bg-border" />

            <nav className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
              <Link href="/dashboard" className="hover:text-foreground cursor-pointer">Dashboard</Link>
              {pathname !== "/dashboard" && pathname.split("/")[1] && (
                <>
                  <span aria-hidden="true">/</span>
                  <span className="text-foreground capitalize">{pathname.split("/")[1]}</span>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-9 pr-4 py-1.5 rounded-full border border-border bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                aria-label="Search"
              />
            </div>

            <button
              className="relative p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" aria-hidden="true" />
            </button>

            <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-border">
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium">{currentUser.name}</div>
                <div className="text-xs text-muted-foreground">{currentUser.email}</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-muted overflow-hidden border border-border flex items-center justify-center text-muted-foreground font-medium text-sm">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  currentUser.name.charAt(0).toUpperCase()
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
