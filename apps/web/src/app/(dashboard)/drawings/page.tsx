"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, PenLine, MoreHorizontal, Clock, Grid, List, X, Loader2, AlertCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { authClient } from "@hachi/auth/client";
import { useDrawingList } from "@/features/drawings/hooks";
import { createDrawing } from "@/features/drawings/api/drawings-api";
import { formatRelativeDate } from "@/lib/format-date";
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
  Empty,
  EmptyMedia,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@hachi/ui";

type ViewMode = "grid" | "list";

export default function DrawingsPage() {
  const router = useRouter();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const { data: drawings = [], isLoading, error } = useDrawingList(activeOrg?.id);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isCreating, setIsCreating] = useState(false);

  const filteredDrawings = useMemo(() => {
    return drawings.filter(drawing => {
      return searchQuery === "" ||
        drawing.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery, drawings]);

  const clearFilters = () => {
    setSearchQuery("");
  };

  const hasActiveFilters = searchQuery !== "";

  const handleCreateDrawing = async () => {
    if (!activeOrg?.id) return;
    const name = prompt("Drawing name:");
    if (!name) return;

    setIsCreating(true);
    try {
      const drawing = await createDrawing(activeOrg.id, name);
      router.push(`/drawings/${drawing.id}`);
    } catch {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader>
          <PageHeaderContent>
            <PageHeaderTitle>Drawings</PageHeaderTitle>
            <PageHeaderDescription>Create and collaborate on whiteboards.</PageHeaderDescription>
          </PageHeaderContent>
        </PageHeader>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading drawings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <PageHeader>
          <PageHeaderContent>
            <PageHeaderTitle>Drawings</PageHeaderTitle>
            <PageHeaderDescription>Create and collaborate on whiteboards.</PageHeaderDescription>
          </PageHeaderContent>
        </PageHeader>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4 text-center max-w-md">
            <div className="p-4 rounded-full bg-destructive/10">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-lg font-semibold">Failed to load drawings</h2>
            <p className="text-muted-foreground">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Drawings</PageHeaderTitle>
          <PageHeaderDescription>Create and collaborate on whiteboards.</PageHeaderDescription>
        </PageHeaderContent>
        <PageHeaderActions>
          <button
            onClick={handleCreateDrawing}
            disabled={isCreating}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
          >
            {isCreating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} aria-hidden="true" />
            )}
            New Drawing
          </button>
        </PageHeaderActions>
      </PageHeader>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search drawings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            aria-label="Search drawings"
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
        <div className="flex items-center gap-2 w-full md:w-auto">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-2 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
              Clear
            </button>
          )}
          <div className="h-6 w-px bg-border mx-1 hidden md:block" aria-hidden="true" />
          <div className="flex bg-muted p-1 rounded-md" role="group" aria-label="View options">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "grid" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {filteredDrawings.length === 0 ? (
        <Empty>
          <EmptyMedia variant="icon">
            <PenLine size={24} />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No drawings found</EmptyTitle>
            <EmptyDescription>
              {hasActiveFilters ? (
                <>No drawings match your search. <button onClick={clearFilters} className="text-primary hover:underline">Clear search</button></>
              ) : (
                <button onClick={handleCreateDrawing} className="text-primary hover:underline">Create your first drawing</button>
              )}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : viewMode === "list" ? (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Updated</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredDrawings.map((drawing) => (
                <tr key={drawing.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/drawings/${drawing.id}`} className="font-medium hover:text-primary">
                      {drawing.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{formatRelativeDate(drawing.updatedAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-muted rounded text-muted-foreground" aria-label={`More options for ${drawing.name}`}>
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredDrawings.map((drawing) => (
            <Link
              key={drawing.id}
              href={`/drawings/${drawing.id}`}
              className="group flex flex-col p-5 rounded-xl border border-border bg-card hover:border-primary/50 transition-all shadow-sm hover:shadow-md h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <PenLine size={20} aria-hidden="true" />
                </div>
                <button
                  className="p-1 hover:bg-muted rounded text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`More options for ${drawing.name}`}
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div className="flex-1">
                <h3 className="font-semibold mb-1 line-clamp-1 group-hover:text-primary transition-colors">{drawing.name}</h3>
              </div>

              <div className="flex items-center pt-4 border-t border-border text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock size={12} aria-hidden="true" />
                  {formatRelativeDate(drawing.updatedAt)}
                </div>
              </div>
            </Link>
          ))}

          <button
            onClick={handleCreateDrawing}
            className="flex flex-col items-center justify-center gap-3 p-5 rounded-xl border border-dashed border-border hover:border-primary hover:bg-muted/30 transition-all text-muted-foreground hover:text-primary group h-full min-h-[200px]"
          >
            <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors" aria-hidden="true">
              <Plus size={24} />
            </div>
            <span className="font-medium">Create New Drawing</span>
          </button>
        </div>
      )}
    </div>
  );
}
