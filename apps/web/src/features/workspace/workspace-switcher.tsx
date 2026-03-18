"use client";

import { useState, useEffect } from "react";
import { ChevronsUpDown, Check, Plus, Building2 } from "lucide-react";
import { authClient } from "@hachi/auth/client";
import Link from "next/link";
import { useSidebar } from "@hachi/ui/components/sidebar";

export const WorkspaceSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: organizations } = authClient.useListOrganizations();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const displayName = activeOrg?.name || "Select Organization";

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 mx-auto rounded-md bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold shadow-sm relative"
        title={displayName}
        suppressHydrationWarning
      >
        {displayName.charAt(0)}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              aria-hidden="true"
            />
            <div
              className="absolute top-0 left-full ml-2 w-56 bg-popover border border-border rounded-lg shadow-xl z-50 p-1 animate-in fade-in zoom-in-95 duration-100"
              role="listbox"
            >
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Organizations
              </div>
              {(organizations || []).map((org) => (
                <button
                  key={org.id}
                  onClick={async (e) => {
                    e.stopPropagation();
                    await authClient.organization.setActive({
                      organizationId: org.id,
                    });
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm group text-foreground"
                  role="option"
                  aria-selected={activeOrg?.id === org.id}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded bg-muted group-hover:bg-background">
                      <Building2
                        size={14}
                        className="text-muted-foreground"
                      />
                    </div>
                    {org.name}
                  </div>
                  {activeOrg?.id === org.id && (
                    <Check size={14} className="text-primary" />
                  )}
                </button>
              ))}
              <div className="h-px bg-border my-1" />
              <Link
                href="/workspaces/new"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm text-muted-foreground"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded border border-dashed border-muted-foreground">
                  <Plus size={14} />
                </div>
                Create Organization
              </Link>
            </div>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors group min-h-0"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 shrink-0 rounded-md bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm" suppressHydrationWarning>
            {displayName.charAt(0)}
          </div>
          <div className="flex flex-col items-start text-left min-w-0">
            <span className="text-sm font-semibold truncate w-full group-hover:text-foreground transition-colors" suppressHydrationWarning>
              {displayName}
            </span>
            <span className="text-xs text-muted-foreground truncate w-full" suppressHydrationWarning>
              {activeOrg?.slug || ""}
            </span>
          </div>
        </div>
        <ChevronsUpDown
          size={16}
          className="text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity"
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-xl z-50 p-1 animate-in fade-in zoom-in-95 duration-100"
            role="listbox"
          >
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Organizations
            </div>
            {(organizations || []).map((org) => (
              <button
                key={org.id}
                onClick={async () => {
                  await authClient.organization.setActive({
                    organizationId: org.id,
                  });
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm group"
                role="option"
                aria-selected={activeOrg?.id === org.id}
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-muted group-hover:bg-background">
                    <Building2 size={14} className="text-muted-foreground" />
                  </div>
                  {org.name}
                </div>
                {activeOrg?.id === org.id && (
                  <Check size={14} className="text-primary" />
                )}
              </button>
            ))}
            <div className="h-px bg-border my-1" />
            <Link
              href="/workspaces/new"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm text-muted-foreground"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded border border-dashed border-muted-foreground">
                <Plus size={14} />
              </div>
              Create Organization
            </Link>
          </div>
        </>
      )}
    </div>
  );
};
