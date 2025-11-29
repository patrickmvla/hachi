"use client";

import Link from "next/link";
import { 
  Plus, 
  Clock, 
  MoreHorizontal, 
  FileText, 
  Activity, 
  ArrowRight,
  Zap,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { recentCanvases, currentUser, recentRuns, activityFeed } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {currentUser.name.split(" ")[0]}</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Here's what's happening in your workspace today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/templates" 
            className="px-4 py-2 rounded-md border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] transition-colors text-sm font-medium"
          >
            Browse Templates
          </Link>
          <Link 
            href="/canvases/new" 
            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-md font-medium hover:bg-[var(--primary)]/90 transition-colors shadow-sm"
          >
            <Plus size={16} />
            New Canvas
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText size={64} />
          </div>
          <div className="text-sm font-medium text-[var(--muted-foreground)] mb-2">Total Canvases</div>
          <div className="text-3xl font-bold">12</div>
          <div className="mt-4 flex items-center text-xs text-green-500 font-medium">
            <Activity size={12} className="mr-1" />
            +2 this week
          </div>
        </div>
        <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={64} />
          </div>
          <div className="text-sm font-medium text-[var(--muted-foreground)] mb-2">Total Runs</div>
          <div className="text-3xl font-bold">1,420</div>
          <div className="mt-4 flex items-center text-xs text-green-500 font-medium">
            <Activity size={12} className="mr-1" />
            +15% from last month
          </div>
        </div>
        <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 size={64} />
          </div>
          <div className="text-sm font-medium text-[var(--muted-foreground)] mb-2">Success Rate</div>
          <div className="text-3xl font-bold">98.5%</div>
          <div className="mt-4 flex items-center text-xs text-[var(--muted-foreground)]">
            Last 30 days
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Canvases */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Canvases</h2>
            <Link href="/canvases" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentCanvases.map((canvas) => (
              <Link 
                key={canvas.id} 
                href={`/canvases/${canvas.id}`}
                className="group p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/50 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-foreground)] transition-colors">
                    <FileText size={20} />
                  </div>
                  <button className="p-1 hover:bg-[var(--muted)] rounded text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-[var(--primary)] transition-colors">{canvas.name}</h3>
                <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-4 h-10">{canvas.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    {canvas.tags?.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-[var(--muted)] text-[10px] font-medium text-[var(--muted-foreground)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                    <Clock size={12} />
                    {canvas.updatedAt}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Activity Feed & Recent Runs */}
        <div className="space-y-8">
          {/* Recent Runs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Runs</h2>
              <Link href="/runs" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                View all
              </Link>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
              {recentRuns.map((run, i) => (
                <div key={run.id} className={`p-4 flex items-center justify-between hover:bg-[var(--muted)]/50 transition-colors ${i !== recentRuns.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
                  <div className="flex items-center gap-3">
                    {run.status === 'success' ? (
                      <CheckCircle2 size={16} className="text-green-500" />
                    ) : run.status === 'failed' ? (
                      <AlertCircle size={16} className="text-red-500" />
                    ) : (
                      <Activity size={16} className="text-blue-500 animate-pulse" />
                    )}
                    <div>
                      <div className="text-sm font-medium">{run.canvasName}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">{run.startedAt}</div>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-[var(--muted-foreground)]">
                    {run.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Activity</h2>
            <div className="space-y-4 pl-2">
              {activityFeed.map((activity) => (
                <div key={activity.id} className="relative pl-6 pb-4 border-l border-[var(--border)] last:border-0 last:pb-0">
                  <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-[var(--muted)] border-2 border-[var(--background)]" />
                  <div className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-[var(--muted-foreground)]"> {activity.action} </span>
                    <span className="font-medium text-[var(--primary)]">{activity.target}</span>
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
