"use client";

import { type DragEvent, useState } from "react";
import { Search, ChevronRight, X } from "lucide-react";
import { nodeRegistry } from "@/features/playground/config/node-registry";
import { cn } from "@hachi/ui/lib/utils";

interface NodeCategory {
  label: string;
  types: string[];
}

const categories: NodeCategory[] = [
  { label: "Pre-Retrieval", types: ["query", "queryRewriter", "router", "hyde"] },
  { label: "Retrieval", types: ["embedding", "retriever", "webSearch", "fusion"] },
  { label: "Post-Retrieval", types: ["reranker", "contextCompressor", "contextOptimizer"] },
  { label: "Generation", types: ["llm", "agent"] },
  { label: "Evaluation", types: ["judge", "evaluator"] },
];

function NodeCard({ type, collapsed }: { type: string; collapsed?: boolean }) {
  const reg = nodeRegistry[type];
  if (!reg) return null;
  const Icon = reg.icon;

  const onDragStart = (event: DragEvent) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.setData("application/reactflow-label", reg.label);
    event.dataTransfer.effectAllowed = "move";
  };

  if (collapsed) {
    return (
      <div
        className={cn(
          "w-9 h-9 shrink-0 flex items-center justify-center rounded-lg border border-border cursor-grab active:cursor-grabbing hover:border-primary hover:shadow-sm transition-all",
          reg.bgColor
        )}
        onDragStart={onDragStart}
        draggable
        title={reg.label}
      >
        <Icon size={16} className={reg.color} />
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg border border-border bg-card hover:border-primary hover:shadow-sm cursor-grab active:cursor-grabbing transition-all"
      onDragStart={onDragStart}
      draggable
      role="listitem"
      aria-label={`${reg.label}: ${reg.description}`}
    >
      <div className={cn("p-1.5 rounded-md shrink-0", reg.bgColor)}>
        <Icon size={14} className={reg.color} />
      </div>
      <div className="min-w-0">
        <span className="text-xs font-medium leading-none block">{reg.label}</span>
        <span className="text-[10px] text-muted-foreground leading-tight block mt-0.5 truncate">
          {reg.description}
        </span>
      </div>
    </div>
  );
}

interface NodePaletteProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export const NodePalette = ({ collapsed = false, onToggle }: NodePaletteProps) => {
  const [search, setSearch] = useState("");
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    new Set(categories.map((c) => c.label))
  );

  const toggleCategory = (label: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const filteredCategories = categories
    .map((cat) => ({
      ...cat,
      types: cat.types.filter((type) => {
        if (!search) return true;
        const reg = nodeRegistry[type];
        if (!reg) return false;
        const q = search.toLowerCase();
        return reg.label.toLowerCase().includes(q) || reg.description.toLowerCase().includes(q) || type.includes(q);
      }),
    }))
    .filter((cat) => cat.types.length > 0);

  if (collapsed) {
    return (
      <div className="w-12 border-r border-border bg-background flex flex-col items-center py-2 gap-1 h-full overflow-y-auto" onWheel={(e) => e.stopPropagation()}>
        <button
          onClick={onToggle}
          className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors mb-1"
          title="Expand palette"
        >
          <ChevronRight size={16} />
        </button>
        {categories.flatMap((cat) => cat.types).map((type) => (
          <NodeCard key={type} type={type} collapsed />
        ))}
      </div>
    );
  }

  return (
    <div className="w-56 border-r border-border bg-background flex flex-col h-full" onWheel={(e) => e.stopPropagation()}>
      <div className="p-3 border-b border-border space-y-2 shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Nodes</h2>
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Collapse palette"
            >
              <ChevronRight size={14} className="rotate-180" />
            </button>
          )}
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter nodes..."
            className="w-full pl-8 pr-7 py-1.5 text-xs rounded-md border border-border bg-muted/50 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1" role="list" aria-label="Available node types">
        {filteredCategories.map((cat) => {
          const isOpen = openCategories.has(cat.label);
          return (
            <div key={cat.label}>
              <button
                onClick={() => toggleCategory(cat.label)}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground rounded transition-colors"
              >
                <ChevronRight
                  size={12}
                  className={cn("transition-transform", isOpen && "rotate-90")}
                />
                {cat.label}
                <span className="ml-auto text-[10px] opacity-50">{cat.types.length}</span>
              </button>
              {isOpen && (
                <div className="space-y-1 pb-1">
                  {cat.types.map((type) => (
                    <NodeCard key={type} type={type} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {filteredCategories.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">No matching nodes</p>
        )}
      </div>
    </div>
  );
};
