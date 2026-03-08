"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, FileText } from "lucide-react";
import { createCanvas } from "@/features/canvas/api/canvas-api";
import { authClient } from "@hachi/auth/client";
import { useTemplates } from "@/features/templates/hooks/use-template-queries";
import type { Template } from "@/features/templates/api/templates-api";
import { nodeRegistry } from "@/features/playground/config/node-registry";
import { cn } from "@hachi/ui/lib/utils";
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderTitle,
  PageHeaderDescription,
  Input,
  Label,
  Button,
  Badge,
  Skeleton,
} from "@hachi/ui";

export default function NewCanvasPage() {
  return (
    <Suspense>
      <NewCanvasForm />
    </Suspense>
  );
}

const difficultyColor: Record<string, string> = {
  Beginner: "bg-green-500/10 text-green-600",
  Intermediate: "bg-yellow-500/10 text-yellow-600",
  Advanced: "bg-orange-500/10 text-orange-600",
  Expert: "bg-red-500/10 text-red-600",
};

function PipelineViz({ template }: { template: Template }) {
  const graphNodes = template.graphJson?.nodes ?? [];
  if (graphNodes.length === 0) return null;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {(graphNodes as Array<{ id: string; data: { type: string } }>).map(
        (node, i) => {
          const reg = nodeRegistry[node.data.type];
          if (!reg) return null;
          const Icon = reg.icon;
          return (
            <div key={node.id} className="flex items-center">
              <div
                className={cn(
                  "w-5 h-5 rounded flex items-center justify-center",
                  reg.bgColor
                )}
                title={reg.label}
              >
                <Icon size={10} className={reg.color} />
              </div>
              {i < graphNodes.length - 1 && (
                <div className="w-2 h-px bg-border mx-0.5" />
              )}
            </div>
          );
        }
      )}
    </div>
  );
}

function TemplateCard({
  template,
  selected,
  onSelect,
}: {
  template: Template;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "p-4 rounded-lg border text-left transition-all",
        selected
          ? "border-primary bg-primary/5 ring-2 ring-primary"
          : "border-border hover:border-muted-foreground"
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-sm font-medium truncate">{template.name}</h3>
        <span
          className={cn(
            "text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0",
            difficultyColor[template.difficulty] ??
              "bg-muted text-muted-foreground"
          )}
        >
          {template.difficulty}
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground mb-2.5 line-clamp-2">
        {template.description}
      </p>
      <PipelineViz template={template} />
      {template.tags.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap mt-2">
          {template.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-[10px] px-1.5 py-0"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </button>
  );
}

function TemplateGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-4 rounded-lg border border-border space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <div className="flex gap-1 pt-1">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-5 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function NewCanvasForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const { data: templates, isLoading: templatesLoading } = useTemplates();

  const [name, setName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-select template from URL param (e.g. /canvases/new?template=hyde)
  useEffect(() => {
    if (!templates) return;
    const templateId = searchParams.get("template");
    if (templateId && templates.some((t) => t.id === templateId)) {
      setSelectedTemplate(templateId);
    }
  }, [templates, searchParams]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter a canvas name");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Get initial graph from template or empty
      const template = templates?.find((t) => t.id === selectedTemplate);
      const initialGraph = template?.graphJson || { nodes: [], edges: [] };

      const canvas = await createCanvas(
        activeOrg?.id || "",
        name.trim(),
        initialGraph
      );

      router.push(`/canvases/${canvas.id}`);
    } catch {
      setError("Failed to create canvas. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/canvases"
          className="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
          aria-label="Back to canvases"
        >
          <ArrowLeft size={20} />
        </Link>
        <PageHeader className="flex-1">
          <PageHeaderContent>
            <PageHeaderTitle>Create New Canvas</PageHeaderTitle>
            <PageHeaderDescription>
              Design your RAG workflow from scratch or start with a template.
            </PageHeaderDescription>
          </PageHeaderContent>
        </PageHeader>
      </div>

      <form onSubmit={handleCreate} className="space-y-6">
        {error && (
          <div
            className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="canvas-name">Canvas Name</Label>
          <Input
            id="canvas-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Customer Support Agent"
            autoFocus
          />
        </div>

        <div className="space-y-3">
          <Label>
            Start from Template{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </Label>

          {templatesLoading ? (
            <TemplateGridSkeleton />
          ) : (
            <div className="max-h-[50vh] overflow-y-auto rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Blank canvas option */}
                <button
                  type="button"
                  onClick={() => setSelectedTemplate(null)}
                  className={cn(
                    "p-4 rounded-lg border-2 border-dashed text-left transition-all",
                    selectedTemplate === null
                      ? "border-primary bg-primary/5 ring-2 ring-primary"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 rounded-md bg-muted">
                      <FileText
                        size={16}
                        className="text-muted-foreground"
                      />
                    </div>
                    <h3 className="text-sm font-medium">Blank Canvas</h3>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Start with an empty canvas and build your pipeline from
                    scratch.
                  </p>
                </button>

                {/* Template cards */}
                {templates?.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    selected={selectedTemplate === template.id}
                    onSelect={() => setSelectedTemplate(template.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <Button variant="outline" asChild>
            <Link href="/canvases">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isCreating || !name.trim()}>
            {isCreating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              "Create Canvas"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
