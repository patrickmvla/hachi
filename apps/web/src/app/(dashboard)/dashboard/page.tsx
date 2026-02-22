"use client";

import Link from "next/link";
import {
  Plus,
  Clock,
  FileText,
  Files,
  Database,
  Users,
  ArrowRight,
  Building2,
  LayoutTemplate,
  Upload,
  Settings,
} from "lucide-react";
import { authClient } from "@hachi/auth/client";
import { useCanvasList } from "@/features/canvas/hooks";
import { useDocumentList } from "@/features/documents/hooks/use-document-queries";
import { useMembers } from "@/features/workspaces/hooks/use-workspace-queries";
import type { Canvas } from "@/features/canvas/api/canvas-api";
import { formatRelativeDate } from "@/lib/format-date";
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
  StatCard,
  Button,
  Skeleton,
  StatusBadge,
  Empty,
  EmptyMedia,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@hachi/ui";

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      {/* Quick actions skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      {/* Recent canvases skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      </div>
      {/* Recent documents skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-44" />
        <div className="space-y-0 rounded-xl border border-border">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-none first:rounded-t-xl last:rounded-b-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

const quickActions = [
  {
    label: "New Canvas",
    description: "Start a new RAG pipeline",
    href: "/canvases/new",
    icon: Plus,
  },
  {
    label: "Use Template",
    description: "Browse pre-built pipelines",
    href: "/templates",
    icon: LayoutTemplate,
  },
  {
    label: "Upload Documents",
    description: "Add files to your knowledge base",
    href: "/documents/upload",
    icon: Upload,
  },
];

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const { data: activeOrg } = authClient.useActiveOrganization();

  const { data: canvases = [], isLoading: canvasesLoading } = useCanvasList(activeOrg?.id);
  const { data: docData, isLoading: docsLoading } = useDocumentList(activeOrg?.id);
  const { data: members = [], isLoading: membersLoading } = useMembers(activeOrg?.id ?? "");

  const stats = docData?.stats ?? { total: 0, embedded: 0, pending: 0 };
  const documents = docData?.documents ?? [];
  const isLoading = canvasesLoading || docsLoading || membersLoading;
  const firstName = session?.user?.name?.split(" ")[0] || "there";

  const getNodeCount = (canvas: Canvas) => {
    return canvas.graphJson?.nodes?.length || 0;
  };

  const sortedCanvases = [...canvases].sort(
    (a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime()
  );

  const manageOrgAction = {
    label: "Manage Org",
    description: "Settings & members",
    href: `/workspaces/${activeOrg?.id ?? ""}`,
    icon: Settings,
  };

  const allQuickActions = [...quickActions, manageOrgAction];

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
          <Button variant="outline" asChild>
            <Link href="/templates">Browse Templates</Link>
          </Button>
          <Button asChild>
            <Link href="/canvases/new">
              <Plus size={16} aria-hidden="true" />
              New Canvas
            </Link>
          </Button>
        </PageHeaderActions>
      </PageHeader>

      {isLoading ? (
        <DashboardSkeleton />
      ) : !activeOrg ? (
        <Empty>
          <EmptyMedia variant="icon">
            <Building2 size={24} />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Create your first workspace</EmptyTitle>
            <EmptyDescription>
              You need an organization to start building pipelines.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/workspaces/new">
                <Plus size={16} aria-hidden="true" />
                Create Organization
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Canvases"
              value={canvases.length}
              description="RAG pipelines"
              icon={<FileText size={64} />}
            />
            <StatCard
              label="Documents"
              value={stats.total}
              description={`${stats.embedded} embedded, ${stats.pending} pending`}
              icon={<Files size={64} />}
            />
            <StatCard
              label="Embedded"
              value={stats.embedded}
              description={`of ${stats.total} documents`}
              icon={<Database size={64} />}
            />
            <StatCard
              label="Members"
              value={members.length}
              description="team members"
              icon={<Users size={64} />}
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {allQuickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200"
              >
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <action.icon size={20} />
                </div>
                <div>
                  <p className="font-medium text-sm group-hover:text-primary transition-colors">
                    {action.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Canvases */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Canvases</h2>
              <Link href="/canvases" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            {canvases.length === 0 ? (
              <Empty>
                <EmptyMedia variant="icon">
                  <FileText size={24} />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No canvases yet</EmptyTitle>
                  <EmptyDescription>
                    Create your first RAG pipeline to get started.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button asChild>
                    <Link href="/canvases/new">
                      <Plus size={16} />
                      New Canvas
                    </Link>
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedCanvases.slice(0, 6).map((canvas) => (
                  <Link
                    key={canvas.id}
                    href={`/canvases/${canvas.id}`}
                    className="group p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <FileText size={20} />
                      </div>
                    </div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-1">
                      {canvas.name}
                    </h3>

                    <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatRelativeDate(canvas.updatedAt)}
                      </div>
                      <div>{getNodeCount(canvas)} nodes</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Documents */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Documents</h2>
              <Link href="/documents" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            {documents.length === 0 ? (
              <Empty>
                <EmptyMedia variant="icon">
                  <Files size={24} />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No documents yet</EmptyTitle>
                  <EmptyDescription>
                    Upload documents to build your knowledge base.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button asChild>
                    <Link href="/documents/upload">
                      <Upload size={16} />
                      Upload Documents
                    </Link>
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <div className="rounded-xl border border-border divide-y divide-border">
                {documents.slice(0, 5).map((doc) => {
                  const docName = (doc.metadata as any)?.filename || doc.id;
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText size={16} className="shrink-0 text-muted-foreground" />
                        <span className="text-sm font-medium truncate">{docName}</span>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <StatusBadge status={doc.hasEmbedding ? "completed" : "pending"} label={doc.hasEmbedding ? "Embedded" : "Pending"} />
                        <span className="text-xs text-muted-foreground w-16 text-right">
                          {formatRelativeDate(doc.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
