"use client";

import Link from "next/link";
import { Building2, Plus, Users, Settings, Shield } from "lucide-react";
import { authClient } from "@hachi/auth/client";
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
} from "@hachi/ui";

export default function WorkspacesPage() {
  const { data: organizations } = authClient.useListOrganizations();

  return (
    <div className="space-y-8">
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Organizations</PageHeaderTitle>
          <PageHeaderDescription>Manage your teams and projects.</PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <Link
            href="/workspaces/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus size={16} aria-hidden="true" />
            Create Organization
          </Link>
        </PageHeaderActions>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4" role="list" aria-label="Your organizations">
        {(organizations || []).map((org) => (
          <div key={org.id} className="group flex flex-col md:flex-row md:items-center justify-between p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all shadow-sm hover:shadow-md" role="listitem">
            <div className="flex items-start gap-4 mb-4 md:mb-0">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-sm" aria-hidden="true">
                {org.logo ? (
                  <img src={org.logo} alt="" className="w-full h-full rounded-lg object-cover" />
                ) : (
                  <Building2 size={24} />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{org.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{org.slug}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Users size={14} aria-hidden="true" />
                    {(org as any).members?.length || 0} members
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              <Link
                href={`/workspaces/${org.id}/settings`}
                className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                aria-label={`Settings for ${org.name}`}
              >
                <Settings size={18} aria-hidden="true" />
              </Link>
              <Link
                href={`/workspaces/${org.id}`}
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
          <span className="font-medium">Create a new organization</span>
        </Link>
      </div>
    </div>
  );
}
