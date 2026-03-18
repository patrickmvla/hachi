"use client";

import { useCallback, type MouseEvent } from "react";
import { Copy, Trash2, Settings, Maximize2 } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { useCanvasStore } from "@/stores/canvas-store";
import { cn } from "@hachi/ui/lib/utils";

interface MenuPosition {
  x: number;
  y: number;
}

interface ContextMenuProps {
  id?: string;
  type: "node" | "edge" | "pane";
  position: MenuPosition;
  onClose: () => void;
}

/**
 * Context menu for nodes, edges, and pane
 */
export const ContextMenu = ({ id, type, position, onClose }: ContextMenuProps) => {
  const { fitView, getNode } = useReactFlow();
  const {
    duplicateNode,
    deleteNode,
    deleteEdge,
    setPropertyPanelNodeId,
    addNode,
  } = useCanvasStore();

  const handleDuplicate = useCallback(() => {
    if (id && type === "node") {
      duplicateNode(id);
    }
    onClose();
  }, [id, type, duplicateNode, onClose]);

  const handleDelete = useCallback(() => {
    if (id) {
      if (type === "node") {
        deleteNode(id);
      } else if (type === "edge") {
        deleteEdge(id);
      }
    }
    onClose();
  }, [id, type, deleteNode, deleteEdge, onClose]);

  const handleFocusNode = useCallback(() => {
    if (id && type === "node") {
      const node = getNode(id);
      if (node) {
        fitView({
          nodes: [node],
          padding: 0.5,
          duration: 500,
        });
      }
    }
    onClose();
  }, [id, type, getNode, fitView, onClose]);

  const handleSettings = useCallback(() => {
    if (id && type === "node") {
      setPropertyPanelNodeId(id);
    }
    onClose();
  }, [id, type, setPropertyPanelNodeId, onClose]);

  const handleAddNode = useCallback(
    (nodeType: string) => {
      const newNode = {
        id: crypto.randomUUID(),
        type: nodeType,
        position: { x: position.x, y: position.y },
        data: { label: `New ${nodeType}`, type: nodeType },
      };
      addNode(newNode);
      onClose();
    },
    [position, addNode, onClose]
  );

  // Prevent event propagation
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const menuItems =
    type === "node"
      ? [
          { icon: Copy, label: "Duplicate", onClick: handleDuplicate, shortcut: "Ctrl+D" },
          { icon: Maximize2, label: "Focus", onClick: handleFocusNode },
          { icon: Settings, label: "Settings", onClick: handleSettings },
          { divider: true },
          { icon: Trash2, label: "Delete", onClick: handleDelete, shortcut: "Del", danger: true },
        ]
      : type === "edge"
      ? [
          { icon: Settings, label: "Edge Settings", onClick: handleSettings },
          { divider: true },
          { icon: Trash2, label: "Delete Edge", onClick: handleDelete, shortcut: "Del", danger: true },
        ]
      : [
          { label: "Pre-Retrieval", header: true },
          { icon: null, label: "Query", onClick: () => handleAddNode("query") },
          { icon: null, label: "Query Rewriter", onClick: () => handleAddNode("queryRewriter") },
          { icon: null, label: "Router", onClick: () => handleAddNode("router") },
          { icon: null, label: "HyDE", onClick: () => handleAddNode("hyde") },
          { label: "Retrieval", header: true },
          { icon: null, label: "Embedding", onClick: () => handleAddNode("embedding") },
          { icon: null, label: "Retriever", onClick: () => handleAddNode("retriever") },
          { icon: null, label: "Web Search", onClick: () => handleAddNode("webSearch") },
          { icon: null, label: "Fusion (RRF)", onClick: () => handleAddNode("fusion") },
          { label: "Post-Retrieval", header: true },
          { icon: null, label: "Reranker", onClick: () => handleAddNode("reranker") },
          { icon: null, label: "Context Compressor", onClick: () => handleAddNode("contextCompressor") },
          { icon: null, label: "Context Optimizer", onClick: () => handleAddNode("contextOptimizer") },
          { label: "Generation", header: true },
          { icon: null, label: "LLM", onClick: () => handleAddNode("llm") },
          { icon: null, label: "Agent", onClick: () => handleAddNode("agent") },
          { label: "Evaluation", header: true },
          { icon: null, label: "Judge", onClick: () => handleAddNode("judge") },
          { icon: null, label: "Evaluator", onClick: () => handleAddNode("evaluator") },
        ];

  return (
    <div
      className="fixed z-50 min-w-[180px] rounded-lg border border-border bg-background shadow-lg py-1 animate-in fade-in-0 zoom-in-95"
      style={{
        left: position.x,
        top: position.y,
      }}
      onClick={handleClick}
      role="menu"
      aria-label={`${type} context menu`}
    >
      {menuItems.map((item, index) => {
        if ("divider" in item && item.divider) {
          return <div key={index} className="my-1 h-px bg-border" aria-hidden="true" />;
        }

        if ("header" in item && item.header) {
          return (
            <div
              key={index}
              className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              role="presentation"
            >
              {item.label}
            </div>
          );
        }

        const Icon = "icon" in item ? item.icon : null;
        const danger = "danger" in item && item.danger;
        const shortcut = "shortcut" in item ? item.shortcut : null;

        return (
          <button
            key={index}
            onClick={item.onClick}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-1.5 text-sm transition-colors",
              danger
                ? "text-red-500 hover:bg-red-500/10"
                : "text-foreground hover:bg-muted"
            )}
            role="menuitem"
          >
            {Icon && <Icon size={14} aria-hidden="true" />}
            <span className="flex-1 text-left">{item.label}</span>
            {shortcut && (
              <span className="text-xs text-muted-foreground" aria-hidden="true">{shortcut}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

/**
 * Hook to manage context menu state
 */
export interface ContextMenuState {
  show: boolean;
  type: "node" | "edge" | "pane";
  id?: string;
  position: MenuPosition;
}

export const initialContextMenuState: ContextMenuState = {
  show: false,
  type: "pane",
  position: { x: 0, y: 0 },
};
