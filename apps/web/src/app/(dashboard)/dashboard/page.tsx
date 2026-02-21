"use client";

import Link from "next/link";
import {
  Plus,
  Clock,
  MoreHorizontal,
  FileText,
  ArrowRight,
  Zap,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { authClient } from "@hachi/auth/client";
import { useCanvasList } from "@/features/canvas/hooks";
import { useDocumentList } from "@/features/documents/hooks/use-document-queries";
import type { Canvas } from "@/features/canvas/api/canvas-api";
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
  StatCard,
} from "@hachi/ui";

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const { data: activeOrg } = authClient.useActiveOrganization();

  const { data: canvases = [], isLoading: canvasesLoading } = useCanvasList(activeOrg?.id);
  const { data: docData, isLoading: docsLoading } = useDocumentList(activeOrg?.id);
  const docCount = docData?.stats?.total ?? docData?.documents?.length ?? 0;

  const isLoading = canvasesLoading || docsLoading;
  const firstName = session?.user?.name?.split(" ")[0] || "there";

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Unknown";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getNodeCount = (canvas: Canvas) => {
    return canvas.graphJson?.nodes?.length || 0;
  };

  return (
    <div className="space-y-8">
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle className="text-3xl">
            Welcome back, {firstName}
          </PageHeaderTitle>
          <PageHeaderDescription>
            {activeOrg
              ? `Here's what's happening in ${activeOrg.name}.`
              : "Select an organization to get started."}
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

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : !activeOrg ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No organization selected.</p>
          <Link
            href="/workspaces"
            className="text-primary hover:underline"
          >
            Go to Organizations
          </Link>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              label="Canvases"
              value={canvases.length}
              icon={<FileText size={64} />}
            />
            <StatCard
              label="Documents"
              value={docCount}
              icon={<Zap size={64} />}
            />
            <StatCard
              label="Members"
              value={(activeOrg as any).members?.length ?? "-"}
              icon={<CheckCircle2 size={64} />}
            />
          </div>

          {/* Recent Canvases */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Canvases</h2>
              <Link href="/canvases" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            {canvases.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-12 text-center">
                <FileText size={32} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No canvases yet. Create your first one!</p>
                <Link
                  href="/canvases/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  <Plus size={16} />
                  New Canvas
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {canvases.slice(0, 6).map((canvas) => (
                  <Link
                    key={canvas.id}
                    href={`/canvases/${canvas.id}`}
                    className="group p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <FileText size={20} />
                      </div>
                      <button
                        className="p-1 hover:bg-muted rounded text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.preventDefault()}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-1">{canvas.name}</h3>

                    <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatDate(canvas.updatedAt)}
                      </div>
                      <div>{getNodeCount(canvas)} nodes</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
