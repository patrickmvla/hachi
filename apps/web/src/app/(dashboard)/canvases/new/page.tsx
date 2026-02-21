"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, FileText, Sparkles } from "lucide-react";
import { canvasesApi } from "@/lib/api";
import { authClient } from "@hachi/auth/client";
import { templates } from "@/lib/mock-data";
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderTitle,
  PageHeaderDescription,
} from "@hachi/ui";

export default function NewCanvasPage() {
  return (
    <Suspense>
      <NewCanvasForm />
    </Suspense>
  );
}

function NewCanvasForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: activeOrg } = authClient.useActiveOrganization();

  const [name, setName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const initialGraph = selectedTemplate
        ? getTemplateGraph(selectedTemplate)
        : { nodes: [], edges: [] };

      const { data, error: apiError } = await canvasesApi.create(
        activeOrg?.id || "",
        name.trim(),
        initialGraph
      );

      if (apiError) {
        setError(apiError);
        return;
      }

      if (data?.canvas) {
        router.push(`/canvases/${data.canvas.id}`);
      }
    } catch {
      setError("Failed to create canvas. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
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
          <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm" role="alert">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="canvas-name" className="text-sm font-medium">
            Canvas Name
          </label>
          <input
            id="canvas-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Customer Support Agent"
            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            autoFocus
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">
            Start from Template <span className="text-muted-foreground">(optional)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedTemplate(null)}
              className={`p-4 rounded-lg border text-left transition-all ${
                selectedTemplate === null
                  ? "border-primary bg-primary/5 ring-2 ring-primary"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-md bg-muted">
                  <FileText size={16} className="text-muted-foreground" />
                </div>
                <span className="font-medium">Blank Canvas</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Start with an empty canvas
              </p>
            </button>

            {templates.slice(0, 3).map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selectedTemplate === template.id
                    ? "border-primary bg-primary/5 ring-2 ring-primary"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Sparkles size={16} className="text-primary" />
                  </div>
                  <span className="font-medium">{template.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {template.nodes} nodes - {template.difficulty}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Link
            href="/canvases"
            className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors text-sm font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isCreating || !name.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              "Create Canvas"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Get initial graph structure for a template
 * TODO: Replace with actual template data from API
 */
function getTemplateGraph(templateId: string): { nodes: unknown[]; edges: unknown[] } {
  // Placeholder template graphs
  const templateGraphs: Record<string, { nodes: unknown[]; edges: unknown[] }> = {
    "tmpl-1": {
      // Naive RAG
      nodes: [
        { id: "1", type: "query", position: { x: 100, y: 200 }, data: { label: "Query", type: "query" } },
        { id: "2", type: "retriever", position: { x: 350, y: 200 }, data: { label: "Retriever", type: "retriever" } },
        { id: "3", type: "llm", position: { x: 600, y: 200 }, data: { label: "LLM", type: "llm" } },
      ],
      edges: [
        { id: "e1-2", source: "1", target: "2", type: "data" },
        { id: "e2-3", source: "2", target: "3", type: "data" },
      ],
    },
    "tmpl-2": {
      // HyDE
      nodes: [
        { id: "1", type: "query", position: { x: 100, y: 200 }, data: { label: "Query", type: "query" } },
        { id: "2", type: "hyde", position: { x: 300, y: 200 }, data: { label: "HyDE", type: "hyde" } },
        { id: "3", type: "embedding", position: { x: 500, y: 200 }, data: { label: "Embedding", type: "embedding" } },
        { id: "4", type: "retriever", position: { x: 700, y: 200 }, data: { label: "Retriever", type: "retriever" } },
        { id: "5", type: "llm", position: { x: 900, y: 200 }, data: { label: "LLM", type: "llm" } },
      ],
      edges: [
        { id: "e1-2", source: "1", target: "2", type: "data" },
        { id: "e2-3", source: "2", target: "3", type: "data" },
        { id: "e3-4", source: "3", target: "4", type: "data" },
        { id: "e4-5", source: "4", target: "5", type: "data" },
      ],
    },
  };

  return templateGraphs[templateId] || { nodes: [], edges: [] };
}
