"use client";

import Link from "next/link";
import { 
  Settings, 
  Users, 
  Key, 
  Activity, 
  FileText, 
  Zap, 
  CheckCircle2,
  MoreHorizontal
} from "lucide-react";
import { workspaces, recentCanvases, recentRuns } from "@/lib/mock-data";

import { useParams } from "next/navigation";

export default function WorkspaceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  // Mock finding workspace
  const workspace = workspaces.find(w => w.id === id) || workspaces[0]!;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--primary)] to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
            {workspace.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{workspace.name}</h1>
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <span className="px-2 py-0.5 rounded-full bg-[var(--muted)] text-xs font-medium">
                {workspace.plan} Plan
              </span>
              <span>•</span>
              <span>{workspace.members} members</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link 
            href={`/workspaces/${params.id}/members`}
            className="flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] transition-colors text-sm font-medium"
          >
            <Users size={16} />
            Members
          </Link>
          <Link 
            href={`/workspaces/${params.id}/credentials`}
            className="flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] transition-colors text-sm font-medium"
          >
            <Key size={16} />
            Keys
          </Link>
          <Link 
            href={`/workspaces/${params.id}/settings`}
            className="p-2 rounded-md border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)]"
          >
            <Settings size={20} />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-[var(--muted-foreground)]">Active Canvases</div>
            <FileText size={16} className="text-[var(--muted-foreground)]" />
          </div>
          <div className="text-3xl font-bold">8</div>
          <div className="mt-2 text-xs text-[var(--muted-foreground)]">
            <span className="text-green-500 font-medium">+2</span> this week
          </div>
        </div>
        <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-[var(--muted-foreground)]">Total Runs</div>
            <Zap size={16} className="text-[var(--muted-foreground)]" />
          </div>
          <div className="text-3xl font-bold">1,240</div>
          <div className="mt-2 text-xs text-[var(--muted-foreground)]">
            <span className="text-green-500 font-medium">+12%</span> vs last month
          </div>
        </div>
        <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-[var(--muted-foreground)]">API Usage</div>
            <Activity size={16} className="text-[var(--muted-foreground)]" />
          </div>
          <div className="text-3xl font-bold">$42.50</div>
          <div className="mt-2 text-xs text-[var(--muted-foreground)]">
            Est. cost this month
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
            {recentRuns.slice(0, 3).map((run, i) => (
              <div key={run.id} className={`p-4 flex items-center justify-between hover:bg-[var(--muted)]/50 transition-colors ${i !== 2 ? 'border-b border-[var(--border)]' : ''}`}>
                <div className="flex items-center gap-3">
                  {run.status === 'success' ? (
                    <CheckCircle2 size={16} className="text-green-500" />
                  ) : (
                    <Activity size={16} className="text-blue-500" />
                  )}
                  <div>
                    <div className="text-sm font-medium">{run.canvasName}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">Run {run.id} • {run.startedAt}</div>
                  </div>
                </div>
                <div className="text-xs font-mono text-[var(--muted-foreground)]">
                  {run.duration}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Canvases */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Top Canvases</h2>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
            {recentCanvases.slice(0, 3).map((canvas, i) => (
              <div key={canvas.id} className={`p-4 flex items-center justify-between hover:bg-[var(--muted)]/50 transition-colors ${i !== 2 ? 'border-b border-[var(--border)]' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-[var(--primary)]/10 text-[var(--primary)]">
                    <FileText size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{canvas.name}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">{canvas.nodes} nodes</div>
                  </div>
                </div>
                <button className="p-1 hover:bg-[var(--muted)] rounded text-[var(--muted-foreground)]">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
