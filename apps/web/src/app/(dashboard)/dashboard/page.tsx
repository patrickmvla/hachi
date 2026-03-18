"use client";

import Link from "next/link";
import {
  Plus,
  FileText,
  Files,
  Database,
  Users,
  Building2,
  LayoutTemplate,
  Upload,
  Settings,
} from "lucide-react";
import { authClient } from "@hachi/auth/client";
import { useCanvasList } from "@/features/canvas/hooks";
import { useDocumentList } from "@/features/documents/hooks/use-document-queries";
import { useMembers } from "@/features/workspaces/hooks/use-workspace-queries";
import { PipelineHealth } from "@/features/dashboard/pipeline-health";
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
  StatCard,
  Button,
  Skeleton,
  Empty,
  EmptyMedia,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@hachi/ui";

const quickActions = [
  {
    label: "New Pipeline",
    description: "Start a new RAG pipeline",
    href: "/pipelines",
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

function StatCards({ orgId }: { orgId: string }) {
  const { data: canvases = [] } = useCanvasList(orgId);
  const { data: docData } = useDocumentList(orgId);
  const { data: members = [] } = useMembers(orgId);

  const stats = docData?.stats ?? { total: 0, embedded: 0, pending: 0 };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        label="Pipelines"
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
  );
}

function QuickActions({ orgId }: { orgId: string }) {
  const allQuickActions = [
    ...quickActions,
    {
      label: "Manage Org",
      description: "Settings & members",
      href: `/workspaces/${orgId}`,
      icon: Settings,
    },
  ];

  return (
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
  );
}

export default function DashboardPage() {
  const { isPending: sessionPending } = authClient.useSession();
  const { data: activeOrg, isPending: orgPending } = authClient.useActiveOrganization();

  return (
    <div className="space-y-8">
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle className="text-3xl">
            Welcome back
          </PageHeaderTitle>
          <PageHeaderDescription>
            {activeOrg
              ? `Here's what's happening in ${activeOrg.name}.`
              : sessionPending || orgPending
                ? "Loading..."
                : "Select an organization to get started."}
          </PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <Button variant="outline" asChild>
            <Link href="/templates">Browse Templates</Link>
          </Button>
          <Button asChild>
            <Link href="/pipelines">
              <Plus size={16} aria-hidden="true" />
              New Pipeline
            </Link>
          </Button>
        </PageHeaderActions>
      </PageHeader>

      {sessionPending || orgPending ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
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
          <StatCards orgId={activeOrg.id} />
          <PipelineHealth />
          <QuickActions orgId={activeOrg.id} />
        </>
      )}
    </div>
  );
}
