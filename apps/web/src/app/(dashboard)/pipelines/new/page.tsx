"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, FileText, Plus, Search, X } from "lucide-react";
import { authClient } from "@hachi/auth/client";
import { useCreatePipeline } from "@/features/canvas/hooks";
import { useTemplates } from "@/features/templates/hooks/use-template-queries";
import type { Template } from "@/features/templates/api/templates-api";
import { TEMPLATE_METADATA } from "@/features/templates/template-metadata";
import { PipelineViz } from "@/features/canvas/components/pipeline-viz";
import { cn } from "@hachi/ui/lib/utils";
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderTitle,
  PageHeaderDescription,
  Badge,
  Skeleton,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@hachi/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@hachi/ui/components/dialog";
import type { GraphJson } from "@/features/canvas/api/canvas-api";

export default function NewPipelinePage() {
  return (
    <Suspense>
      <NewPipelineContent />
    </Suspense>
  );
}

const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced", "Expert"] as const;

const difficultyColor: Record<string, string> = {
  Beginner: "bg-green-500/10 text-green-600",
  Intermediate: "bg-blue-500/10 text-blue-600",
  Advanced: "bg-orange-500/10 text-orange-600",
  Expert: "bg-red-500/10 text-red-600",
};

function normalizeDifficulty(d: string) {
  return d.charAt(0).toUpperCase() + d.slice(1).toLowerCase();
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-5 rounded-xl border border-border space-y-3">
          <div className="flex gap-1.5">
            <Skeleton className="h-7 w-7 rounded" />
            <Skeleton className="h-7 w-7 rounded" />
            <Skeleton className="h-7 w-7 rounded" />
            <Skeleton className="h-7 w-7 rounded" />
          </div>
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-3/5" />
          <div className="flex gap-1.5 pt-2">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function TemplateCard({
  template,
  isCreating,
  onUse,
}: {
  template: Template;
  isCreating: boolean;
  onUse: () => void;
}) {
  const graphNodes = (template.graphJson?.nodes ?? []) as Array<{
    id: string;
    data: { type: string };
  }>;
  const meta = TEMPLATE_METADATA[template.id];
  const difficulty = normalizeDifficulty(template.difficulty);

  return (
    <div
      className={cn(
        "relative flex flex-col p-5 rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-md group h-full",
        isCreating && "opacity-70 pointer-events-none"
      )}
    >
      {isCreating && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/80 rounded-xl z-10">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      )}

      {/* Pipeline flow */}
      <div className="mb-3 min-h-[28px]">
        <PipelineViz nodes={graphNodes} size="md" />
      </div>

      {/* Name + difficulty + node count */}
      <div className="flex items-center gap-2 mb-1.5">
        <h3 className="text-sm font-semibold group-hover:text-primary transition-colors truncate">
          {template.name}
        </h3>
        <span
          className={cn(
            "text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0",
            difficultyColor[difficulty] ?? "bg-muted text-muted-foreground"
          )}
        >
          {difficulty}
        </span>
        <span className="text-[10px] text-muted-foreground shrink-0 ml-auto">
          {graphNodes.length}n
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
        {template.description}
      </p>

      {/* When to use */}
      {meta?.whenToUse && (
        <p className="text-[11px] text-muted-foreground/80 italic mb-3 line-clamp-1">
          Use when: {meta.whenToUse}
        </p>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {template.tags.slice(0, 3).map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="text-[10px] px-1.5 py-0"
          >
            {tag}
          </Badge>
        ))}
        {meta?.paperRef && (
          <span className="text-[10px] text-muted-foreground/60 ml-auto self-center">
            {meta.paperRef}
          </span>
        )}
      </div>

      {/* Use button */}
      <button
        type="button"
        onClick={onUse}
        disabled={isCreating}
        className="mt-auto w-full py-1.5 rounded-md text-xs font-medium border border-border bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors disabled:opacity-50"
      >
        Use Template
      </button>
    </div>
  );
}

function BlankCard({
  isCreating,
  onUse,
}: {
  isCreating: boolean;
  onUse: () => void;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed border-border transition-all hover:border-primary hover:bg-muted/30 group h-full min-h-[240px]",
        isCreating && "opacity-70 pointer-events-none"
      )}
    >
      {isCreating && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/80 rounded-xl z-10">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      )}
      <button
        type="button"
        onClick={onUse}
        disabled={isCreating}
        className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors"
      >
        <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
          <Plus size={20} />
        </div>
        <span className="text-sm font-medium">Blank Pipeline</span>
        <span className="text-xs text-muted-foreground">
          Start from scratch
        </span>
      </button>
    </div>
  );
}

function NameDialog({
  open,
  defaultName,
  isPending,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  defaultName: string;
  isPending: boolean;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(defaultName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(defaultName);
  }, [defaultName]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.select(), 0);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Name your pipeline</DialogTitle>
        </DialogHeader>
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && name.trim()) onConfirm(name.trim());
          }}
          placeholder="My Pipeline"
          className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          autoFocus
        />
        <DialogFooter>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-md border border-border hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => name.trim() && onConfirm(name.trim())}
            disabled={!name.trim() || isPending}
            className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              "Create"
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewPipelineContent() {
  const searchParams = useSearchParams();
  const { data: activeOrg, isPending: orgPending } =
    authClient.useActiveOrganization();
  const { data: templates, isLoading: templatesLoading } = useTemplates();
  const createPipeline = useCreatePipeline();
  const [creatingId, setCreatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const autoCreatedRef = useRef(false);

  // Name dialog state
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [pendingDefaultName, setPendingDefaultName] = useState("");
  const [pendingGraphJson, setPendingGraphJson] = useState<GraphJson | null>(null);
  const [pendingTemplateId, setPendingTemplateId] = useState<string | null>(null);

  const loading = templatesLoading || orgPending;

  // Auto-create from URL param (e.g. /pipelines/new?template=hyde)
  useEffect(() => {
    if (autoCreatedRef.current || !templates || !activeOrg) return;
    const templateId = searchParams.get("template");
    if (!templateId) return;
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    autoCreatedRef.current = true;
    setCreatingId(template.id);
    createPipeline.mutate({
      name: template.name,
      graphJson: template.graphJson || { nodes: [], edges: [] },
    });
  }, [templates, activeOrg, searchParams, createPipeline]);

  const filteredTemplates = useMemo(() => {
    if (!templates) return [];
    if (searchQuery === "") return templates;
    const q = searchQuery.toLowerCase();
    return templates.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [templates, searchQuery]);

  const countForDifficulty = (d: string) => {
    if (d === "All") return filteredTemplates.length;
    return filteredTemplates.filter(
      (t) => normalizeDifficulty(t.difficulty) === d
    ).length;
  };

  const openNameDialog = (template?: Template) => {
    if (createPipeline.isPending) return;
    if (template) {
      setPendingDefaultName(template.name);
      setPendingGraphJson(template.graphJson || { nodes: [], edges: [] });
      setPendingTemplateId(template.id);
    } else {
      setPendingDefaultName("Untitled Pipeline");
      setPendingGraphJson(null);
      setPendingTemplateId("blank");
    }
    setNameDialogOpen(true);
  };

  const confirmCreate = (name: string) => {
    setCreatingId(pendingTemplateId);
    setNameDialogOpen(false);
    createPipeline.mutate({
      name,
      graphJson: pendingGraphJson || { nodes: [], edges: [] },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/pipelines"
          className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
          aria-label="Back to pipelines"
        >
          <ArrowLeft size={20} />
        </Link>
        <PageHeader className="flex-1">
          <PageHeaderContent>
            <PageHeaderTitle>Reference Architectures</PageHeaderTitle>
            <PageHeaderDescription>
              Pre-built RAG pipelines grounded in research. Learn, experiment,
              customize.
            </PageHeaderDescription>
          </PageHeaderContent>
        </PageHeader>
      </div>

      {/* Error */}
      {createPipeline.isError && (
        <div
          className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm"
          role="alert"
        >
          {createPipeline.error.message}
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-8 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          aria-label="Search templates"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Tabs + Grid */}
      {loading ? (
        <GridSkeleton />
      ) : (
        <Tabs defaultValue="All">
          <TabsList>
            {DIFFICULTIES.map((d) => (
              <TabsTrigger key={d} value={d}>
                {d}
                <span className="ml-1 text-[10px] text-muted-foreground">
                  ({countForDifficulty(d)})
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {DIFFICULTIES.map((d) => {
            const items =
              d === "All"
                ? filteredTemplates
                : filteredTemplates.filter(
                    (t) => normalizeDifficulty(t.difficulty) === d
                  );

            return (
              <TabsContent key={d} value={d} className="mt-5">
                {items.length === 0 && d !== "All" ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No templates match your search in this category.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {(d === "All" || d === "Beginner") && (
                      <BlankCard
                        isCreating={
                          creatingId === "blank" && createPipeline.isPending
                        }
                        onUse={() => openNameDialog()}
                      />
                    )}

                    {items.map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        isCreating={
                          creatingId === template.id &&
                          createPipeline.isPending
                        }
                        onUse={() => openNameDialog(template)}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      )}

      <NameDialog
        open={nameDialogOpen}
        defaultName={pendingDefaultName}
        isPending={createPipeline.isPending}
        onConfirm={confirmCreate}
        onCancel={() => setNameDialogOpen(false)}
      />
    </div>
  );
}
