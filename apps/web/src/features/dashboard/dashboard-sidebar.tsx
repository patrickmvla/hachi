"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  FileText,
  History,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { WorkspaceSwitcher } from "@/features/workspace/workspace-switcher";
import { authClient } from "@hachi/auth/client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@hachi/ui/components/sidebar";

type NavItem = { href: string; label: string; icon: LucideIcon };

const navSections: { label: string; items: NavItem[] }[] = [
  {
    label: "Main",
    items: [{ href: "/dashboard", label: "Overview", icon: LayoutGrid }],
  },
  {
    label: "Build",
    items: [
      { href: "/canvases", label: "Canvases", icon: FileText },
      { href: "/documents", label: "Documents", icon: FileText },
    ],
  },
  {
    label: "Monitor",
    items: [{ href: "/runs", label: "Runs", icon: History }],
  },
  {
    label: "Settings",
    items: [{ href: "/workspaces", label: "Organizations", icon: Settings }],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar side="left" collapsible="icon">
      <SidebarHeader className="h-16 shrink-0 justify-center border-b border-border">
        <WorkspaceSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {navSections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign Out"
              onClick={async () => {
                await authClient.signOut();
                router.push("/login");
              }}
            >
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
