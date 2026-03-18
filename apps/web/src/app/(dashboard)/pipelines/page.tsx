"use client";

import Link from "next/link";
import {
  Plus,
  Search,
  FileText,
  X,
  Loader2,
  AlertCircle,
  LayoutTemplate,
} from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { authClient } from "@hachi/auth/client";
import { useCanvasList, useCreatePipeline } from "@/features/canvas/hooks";
import { PipelineListView } from "@/features/canvas/components/pipeline-list-view";
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
  Button,
  Empty,
  EmptyMedia,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@hachi/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@hachi/ui/components/dialog";

function NewPipelineDialog({
  open,
  isPending,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  isPending: boolean;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("Untitled Pipeline");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName("Untitled Pipeline");
      setTimeout(() => inputRef.current?.select(), 0);
    }
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
            {isPending ? <Loader2 size={14} className="animate-spin" /> : "Create"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function PipelinesPage() {
  const { data: activeOrg, isPending: orgPending } = authClient.useActiveOrganization();
  const { data: canvases = [], isLoading, error } = useCanvasList(activeOrg?.id);
  const createPipeline = useCreatePipeline();
  const [searchQuery, setSearchQuery] = useState("");
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const loading = isLoading || orgPending;

  const filteredCanvases = useMemo(() => {
    if (searchQuery === "") return canvases;
    const q = searchQuery.toLowerCase();
    return canvases.filter((c) => c.name.toLowerCase().includes(q));
  }, [searchQuery, canvases]);

  const hasActiveFilters = searchQuery !== "";

  return (
    <div className="space-y-5">
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Pipelines</PageHeaderTitle>
          <PageHeaderDescription>Design and manage your RAG pipelines.</PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <Button variant="outline" asChild>
            <Link href="/pipelines/new">
              <LayoutTemplate size={16} aria-hidden="true" />
              From Template
            </Link>
          </Button>
          <Button
            onClick={() => setNameDialogOpen(true)}
            disabled={createPipeline.isPending}
          >
            {createPipeline.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} aria-hidden="true" />
            )}
            New Pipeline
          </Button>
        </PageHeaderActions>
      </PageHeader>

      {createPipeline.isError && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm" role="alert">
          {createPipeline.error.message}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search pipelines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            aria-label="Search pipelines"
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

        {hasActiveFilters && (
          <button
            onClick={() => setSearchQuery("")}
            className="flex items-center gap-1 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3 text-center max-w-sm">
            <div className="p-3 rounded-full bg-destructive/10">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <p className="text-sm font-medium">Failed to load pipelines</p>
            <p className="text-xs text-muted-foreground">{error.message}</p>
          </div>
        </div>
      ) : filteredCanvases.length === 0 ? (
        <Empty>
          <EmptyMedia variant="icon">
            <FileText size={24} />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No pipelines found</EmptyTitle>
            <EmptyDescription>
              {hasActiveFilters ? (
                <>No pipelines match your search. <button onClick={() => setSearchQuery("")} className="text-primary hover:underline">Clear search</button></>
              ) : (
                <button onClick={() => setNameDialogOpen(true)} className="text-primary hover:underline">Create your first pipeline</button>
              )}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <PipelineListView data={filteredCanvases} />
      )}

      <NewPipelineDialog
        open={nameDialogOpen}
        isPending={createPipeline.isPending}
        onConfirm={(name) => {
          setNameDialogOpen(false);
          createPipeline.mutate({ name });
        }}
        onCancel={() => setNameDialogOpen(false)}
      />
    </div>
  );
}
