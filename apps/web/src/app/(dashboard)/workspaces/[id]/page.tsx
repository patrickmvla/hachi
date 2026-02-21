"use client";

import Link from "next/link";
import {
  Settings,
  Users,
  Key,
  FileText,
  Zap,
  Loader2
} from "lucide-react";
import { useParams } from "next/navigation";
import { useOrganization } from "@/features/workspaces/hooks/use-workspace-queries";

export default function OrganizationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: org, isLoading } = useOrganization(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Organization not found
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
            {org.logo ? (
              <img src={org.logo} alt="" className="w-full h-full rounded-xl object-cover" />
            ) : (
              org.name.charAt(0)
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{org.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono text-xs">{org.slug}</span>
              <span>·</span>
              <span>{org.members?.length || 0} members</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/workspaces/${id}/members`}
            className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background hover:bg-muted transition-colors text-sm font-medium"
          >
            <Users size={16} aria-hidden="true" />
            Members
          </Link>
          <Link
            href={`/workspaces/${id}/credentials`}
            className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background hover:bg-muted transition-colors text-sm font-medium"
          >
            <Key size={16} aria-hidden="true" />
            Keys
          </Link>
          <Link
            href={`/workspaces/${id}/settings`}
            className="p-2 rounded-md border border-border bg-background hover:bg-muted transition-colors text-muted-foreground"
            aria-label="Settings"
          >
            <Settings size={20} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-muted-foreground">Active Canvases</div>
            <FileText size={16} className="text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="text-3xl font-bold">-</div>
          <div className="mt-2 text-xs text-muted-foreground">
            Across this organization
          </div>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-muted-foreground">Total Runs</div>
            <Zap size={16} className="text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="text-3xl font-bold">-</div>
          <div className="mt-2 text-xs text-muted-foreground">
            All time
          </div>
        </div>
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-muted-foreground">Members</div>
            <Users size={16} className="text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="text-3xl font-bold">{org.members?.length || 0}</div>
          <div className="mt-2 text-xs text-muted-foreground">
            In this organization
          </div>
        </div>
      </div>

      {/* Members Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Members</h2>
          <Link
            href={`/workspaces/${id}/members`}
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {(org.members || []).slice(0, 5).map((member: any, i: number) => (
            <div key={member.id} className={`p-4 flex items-center justify-between hover:bg-muted/50 transition-colors ${i !== Math.min((org.members?.length || 1) - 1, 4) ? 'border-b border-border' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-medium">
                  {member.user?.name?.charAt(0) || member.user?.email?.charAt(0) || "?"}
                </div>
                <div>
                  <div className="text-sm font-medium">{member.user?.name || member.user?.email}</div>
                  <div className="text-xs text-muted-foreground">{member.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
