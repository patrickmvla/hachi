"use client";

import { useState, useEffect } from "react";
import { ChevronsUpDown, Check, Plus, Building2 } from "lucide-react";
import { workspaces } from "@/lib/mock-data";
import Link from "next/link";

export const WorkspaceSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState(workspaces[0]!);

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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors group"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
            {activeWorkspace.name.charAt(0)}
          </div>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-semibold group-hover:text-foreground transition-colors">{activeWorkspace.name}</span>
            <span className="text-xs text-muted-foreground">{activeWorkspace.plan} Plan</span>
          </div>
        </div>
        <ChevronsUpDown size={16} className="text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
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
              Workspaces
            </div>
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => {
                  setActiveWorkspace(ws);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm group"
                role="option"
                aria-selected={activeWorkspace.id === ws.id}
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-muted group-hover:bg-background">
                    <Building2 size={14} className="text-muted-foreground" />
                  </div>
                  {ws.name}
                </div>
                {activeWorkspace.id === ws.id && <Check size={14} className="text-primary" />}
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
              Create Workspace
            </Link>
          </div>
        </>
      )}
    </div>
  );
};
