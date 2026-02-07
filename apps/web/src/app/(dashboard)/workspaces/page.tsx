"use client";

import Link from "next/link";
import { Building2, Plus, Users, Settings, MoreHorizontal, Shield, CreditCard } from "lucide-react";
import { workspaces } from "@/lib/mock-data";
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
} from "@hachi/ui";

export default function WorkspacesPage() {
  return (
    <div className="space-y-8">
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Workspaces</PageHeaderTitle>
          <PageHeaderDescription>Manage your teams and projects.</PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <Link
            href="/workspaces/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus size={16} aria-hidden="true" />
            Create Workspace
          </Link>
        </PageHeaderActions>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4" role="list" aria-label="Your workspaces">
        {workspaces.map((ws) => (
          <div key={ws.id} className="group flex flex-col md:flex-row md:items-center justify-between p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all shadow-sm hover:shadow-md" role="listitem">
            <div className="flex items-start gap-4 mb-4 md:mb-0">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-sm" aria-hidden="true">
                <Building2 size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{ws.name}</h3>
                  {ws.role === "Owner" && (
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      Owner
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{ws.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Users size={14} aria-hidden="true" />
                    {ws.members} members
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield size={14} aria-hidden="true" />
                    {ws.plan} Plan
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              <Link
                href={`/workspaces/${ws.id}/settings`}
                className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                aria-label={`Settings for ${ws.name}`}
              >
                <Settings size={18} aria-hidden="true" />
              </Link>
              <Link
                href={`/workspaces/${ws.id}`}
                className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        ))}

        <Link
          href="/workspaces/new"
          className="flex items-center justify-center p-8 rounded-xl border border-dashed border-border hover:border-primary hover:bg-muted/30 transition-all text-muted-foreground hover:text-primary gap-2 group"
        >
          <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors" aria-hidden="true">
            <Plus size={20} />
          </div>
          <span className="font-medium">Create a new workspace</span>
        </Link>
      </div>
    </div>
  );
}
