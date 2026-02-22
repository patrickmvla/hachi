"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { authClient } from "@hachi/auth/client";
import { SidebarTrigger } from "@hachi/ui/components/sidebar";
import { Separator } from "@hachi/ui/components/separator";

export function DashboardHeader() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const currentUser = {
    name: session?.user?.name || "User",
    email: session?.user?.email || "",
    avatar: session?.user?.image || null,
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border px-4 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <Separator orientation="vertical" className="hidden sm:block h-6" />
        <nav
          className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground min-w-0"
          aria-label="Breadcrumb"
        >
          <Link
            href="/dashboard"
            className="hover:text-foreground cursor-pointer whitespace-nowrap"
          >
            Dashboard
          </Link>
          {pathname !== "/dashboard" && pathname.split("/")[1] && (
            <>
              <span aria-hidden="true">/</span>
              <span className="text-foreground capitalize truncate">
                {pathname.split("/")[1]}
              </span>
            </>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="relative hidden lg:block">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-48 xl:w-64 pl-9 pr-4 py-1.5 rounded-full border border-border bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            aria-label="Search"
          />
        </div>

        <button
          className="relative p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors lg:hidden"
          aria-label="Search"
        >
          <Search size={20} />
        </button>

        <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-border">
          <div className="text-right hidden md:block">
            <div className="text-sm font-medium truncate max-w-[120px] lg:max-w-[160px]">
              {currentUser.name}
            </div>
            <div className="text-xs text-muted-foreground truncate max-w-[120px] lg:max-w-[160px]">
              {currentUser.email}
            </div>
          </div>
          <div className="w-9 h-9 shrink-0 rounded-full bg-muted overflow-hidden border border-border flex items-center justify-center text-muted-foreground font-medium text-sm">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              currentUser.name.charAt(0).toUpperCase()
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
