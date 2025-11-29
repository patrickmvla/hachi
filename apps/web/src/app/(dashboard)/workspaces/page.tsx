"use client";

import Link from "next/link";
import { Building2, Plus, Users, Settings, MoreHorizontal, Shield, CreditCard } from "lucide-react";
import { workspaces } from "@/lib/mock-data";

export default function WorkspacesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-[var(--muted-foreground)]">Manage your teams and projects.</p>
        </div>
        <Link 
          href="/workspaces/new" 
          className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md font-medium hover:bg-[var(--primary)]/90 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Create Workspace
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {workspaces.map((ws) => (
          <div key={ws.id} className="group flex flex-col md:flex-row md:items-center justify-between p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/50 transition-all shadow-sm hover:shadow-md">
            <div className="flex items-start gap-4 mb-4 md:mb-0">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--primary)] to-purple-600 flex items-center justify-center text-white shadow-sm">
                <Building2 size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{ws.name}</h3>
                  {ws.role === "Owner" && (
                    <span className="px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium">
                      Owner
                    </span>
                  )}
                </div>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">{ws.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-[var(--muted-foreground)]">
                  <div className="flex items-center gap-1.5">
                    <Users size={14} />
                    {ws.members} members
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield size={14} />
                    {ws.plan} Plan
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              <Link 
                href={`/workspaces/${ws.id}/settings`}
                className="p-2 hover:bg-[var(--muted)] rounded-md text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                title="Settings"
              >
                <Settings size={18} />
              </Link>
              <Link 
                href={`/workspaces/${ws.id}`}
                className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-md hover:bg-[var(--muted)] transition-colors"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        ))}
        
        <Link 
          href="/workspaces/new"
          className="flex items-center justify-center p-8 rounded-xl border border-dashed border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--muted)]/30 transition-all text-[var(--muted-foreground)] hover:text-[var(--primary)] gap-2 group"
        >
          <div className="p-2 rounded-full bg-[var(--muted)] group-hover:bg-[var(--primary)]/10 transition-colors">
            <Plus size={20} />
          </div>
          <span className="font-medium">Create a new workspace</span>
        </Link>
      </div>
    </div>
  );
}
