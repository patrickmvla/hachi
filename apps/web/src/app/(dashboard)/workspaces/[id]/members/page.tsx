"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Plus, MoreHorizontal, Shield, User } from "lucide-react";
import { workspaces, currentUser } from "@/lib/mock-data";
import { useParams } from "next/navigation";

export default function WorkspaceMembersPage() {
  const params = useParams();
  const id = params.id as string;
  const workspace = workspaces.find(w => w.id === id) || workspaces[0]!;

  const members = [
    { id: "1", name: currentUser.name, email: currentUser.email, role: "Owner", avatar: currentUser.avatar },
    { id: "2", name: "Bob Designer", email: "bob@acme.com", role: "Member", avatar: "https://github.com/shadcn.png" },
    { id: "3", name: "Charlie PM", email: "charlie@acme.com", role: "Viewer", avatar: "https://github.com/shadcn.png" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href={`/workspaces/${params.id}`}
            className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Back to workspace"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Members</h1>
            <p className="text-muted-foreground">Manage access to your workspace.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm">
          <Plus size={16} aria-hidden="true" />
          Invite Member
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-muted/30">
          <h3 className="font-semibold">Pending Invites</h3>
          <div className="mt-4 flex items-center justify-between p-3 bg-background rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-muted">
                <Mail size={16} className="text-muted-foreground" aria-hidden="true" />
              </div>
              <div>
                <div className="text-sm font-medium">dave@acme.com</div>
                <div className="text-xs text-muted-foreground">Invited 2 days ago</div>
              </div>
            </div>
            <button className="text-sm text-red-500 hover:underline">Revoke</button>
          </div>
        </div>

        <div className="divide-y divide-border" role="list" aria-label="Workspace members">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors" role="listitem">
              <div className="flex items-center gap-4">
                <img src={member.avatar} alt="" className="w-10 h-10 rounded-full bg-muted" />
                <div>
                  <div className="font-medium">{member.name} {member.id === "1" && <span className="text-muted-foreground font-normal">(You)</span>}</div>
                  <div className="text-sm text-muted-foreground">{member.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-background text-sm">
                  {member.role === "Owner" ? <Shield size={14} className="text-yellow-500" aria-hidden="true" /> : <User size={14} className="text-muted-foreground" aria-hidden="true" />}
                  <span>{member.role}</span>
                </div>
                <button
                  className="p-2 hover:bg-muted rounded text-muted-foreground"
                  aria-label={`More options for ${member.name}`}
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
