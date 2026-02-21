"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Plus, MoreHorizontal, Shield, User, Loader2 } from "lucide-react";
import { authClient } from "@hachi/auth/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrganizationMembersPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: session } = authClient.useSession();
  const [members, setMembers] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [membersRes, invitationsRes] = await Promise.all([
        authClient.organization.listMembers({ query: { organizationId: id } }),
        authClient.organization.listInvitations({ query: { organizationId: id } }),
      ]);
      setMembers((membersRes.data as any)?.members || membersRes.data || []);
      setInvitations((invitationsRes.data || []).filter((inv: any) => inv.status === "pending"));
      setIsLoading(false);
    }
    fetchData();
  }, [id]);

  const handleCancelInvitation = async (invitationId: string) => {
    await authClient.organization.cancelInvitation({ invitationId });
    setInvitations((prev) => prev.filter((inv) => inv.id !== invitationId));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/workspaces/${id}`}
            className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Back to organization"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Members</h1>
            <p className="text-muted-foreground">Manage access to your organization.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm">
          <Plus size={16} aria-hidden="true" />
          Invite Member
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        {invitations.length > 0 && (
          <div className="p-6 border-b border-border bg-muted/30">
            <h3 className="font-semibold">Pending Invites</h3>
            <div className="mt-4 space-y-3">
              {invitations.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-muted">
                      <Mail size={16} className="text-muted-foreground" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{inv.email}</div>
                      <div className="text-xs text-muted-foreground">
                        Role: {inv.role} · Expires {new Date(inv.expiresAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCancelInvitation(inv.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="divide-y divide-border" role="list" aria-label="Organization members">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors" role="listitem">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium">
                  {member.user?.name?.charAt(0) || member.user?.email?.charAt(0) || "?"}
                </div>
                <div>
                  <div className="font-medium">
                    {member.user?.name || member.user?.email}
                    {member.userId === session?.user?.id && (
                      <span className="text-muted-foreground font-normal"> (You)</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{member.user?.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-background text-sm">
                  {member.role === "owner" ? (
                    <Shield size={14} className="text-yellow-500" aria-hidden="true" />
                  ) : (
                    <User size={14} className="text-muted-foreground" aria-hidden="true" />
                  )}
                  <span className="capitalize">{member.role}</span>
                </div>
                <button
                  className="p-2 hover:bg-muted rounded text-muted-foreground"
                  aria-label={`More options for ${member.user?.name || member.user?.email}`}
                >
                  <MoreHorizontal size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
