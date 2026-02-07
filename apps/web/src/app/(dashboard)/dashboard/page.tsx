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
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
} from "@hachi/ui";
import { StatCard } from "@hachi/ui";
import { StatusBadge } from "@hachi/ui";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle className="text-3xl">
            Welcome back, {currentUser.name.split(" ")[0]}
          </PageHeaderTitle>
          <PageHeaderDescription>
            Here&apos;s what&apos;s happening in your workspace today.
          </PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <Link
            href="/templates"
            className="px-4 py-2 rounded-md border border-border bg-background hover:bg-muted transition-colors text-sm font-medium"
          >
            Browse Templates
          </Link>
          <Link
            href="/canvases/new"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus size={16} aria-hidden="true" />
            New Canvas
          </Link>
        </PageHeaderActions>
      </PageHeader>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Canvases"
          value={12}
          icon={<FileText size={64} />}
          trend={{ value: "+2 this week" }}
        />
        <StatCard
          label="Total Runs"
          value="1,420"
          icon={<Zap size={64} />}
          trend={{ value: "+15% from last month" }}
        />
        <StatCard
          label="Success Rate"
          value="98.5%"
          icon={<CheckCircle2 size={64} />}
          description="Last 30 days"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Canvases */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Canvases</h2>
            <Link href="/canvases" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentCanvases.map((canvas) => (
              <Link
                key={canvas.id}
                href={`/canvases/${canvas.id}`}
                className="group p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <FileText size={20} />
                  </div>
                  <button className="p-1 hover:bg-muted rounded text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{canvas.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">{canvas.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    {canvas.tags?.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
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
              <Link href="/runs" className="text-sm text-muted-foreground hover:text-foreground">
                View all
              </Link>
            </div>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              {recentRuns.map((run, i) => (
                <div key={run.id} className={`p-4 flex items-center justify-between hover:bg-muted/50 transition-colors ${i !== recentRuns.length - 1 ? 'border-b border-border' : ''}`}>
                  <div className="flex items-center gap-3">
                    <StatusBadge
                      status={run.status === 'success' ? 'completed' : run.status === 'failed' ? 'failed' : 'running'}
                      showIcon={true}
                      label=""
                      className="p-0 bg-transparent"
                    />
                    <div>
                      <div className="text-sm font-medium">{run.canvasName}</div>
                      <div className="text-xs text-muted-foreground">{run.startedAt}</div>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
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
                <div key={activity.id} className="relative pl-6 pb-4 border-l border-border last:border-0 last:pb-0">
                  <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-muted border-2 border-background" />
                  <div className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-muted-foreground"> {activity.action} </span>
                    <span className="font-medium text-primary">{activity.target}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
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
