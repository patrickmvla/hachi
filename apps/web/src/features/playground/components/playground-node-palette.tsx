"use client";

import { useCallback } from "react";
import { cn } from "@hachi/ui/lib/utils";
import { nodeRegistry, nodeTypes } from "../config/node-registry";

export function PlaygroundNodePalette() {
  const onDragStart = useCallback(
    (event: React.DragEvent, nodeType: string) => {
      event.dataTransfer.setData("application/playground-node-type", nodeType);
      event.dataTransfer.effectAllowed = "move";
    },
    []
  );

  return (
    <div className="w-52 border-r border-border bg-background overflow-y-auto shrink-0">
      <div className="p-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Nodes
        </h3>
        <div className="space-y-1.5">
          {nodeTypes.map((type) => {
            const entry = nodeRegistry[type];
            if (!entry) return null;
            const Icon = entry.icon;
            return (
              <div
                key={type}
                draggable
                onDragStart={(e) => onDragStart(e, type)}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-md cursor-grab active:cursor-grabbing",
                  "border border-transparent hover:border-border hover:bg-muted/50 transition-colors"
                )}
              >
                <div className={cn("shrink-0", entry.color)}>
                  <Icon size={14} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium truncate">{entry.label}</div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {entry.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
