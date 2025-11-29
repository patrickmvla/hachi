"use client";

import { useCallback, type MouseEvent } from "react";
import { Copy, Trash2, Settings, Play, Pause, RotateCcw, Maximize2 } from "lucide-react";
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
    setSelectedNodeId,
    setNodeStatus,
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

  const handleRunNode = useCallback(() => {
    if (id && type === "node") {
      setNodeStatus(id, "loading");
      // Simulate node execution
      setTimeout(() => {
        setNodeStatus(id, "success");
      }, 2000);
    }
    onClose();
  }, [id, type, setNodeStatus, onClose]);

  const handleResetStatus = useCallback(() => {
    if (id && type === "node") {
      setNodeStatus(id, "initial");
    }
    onClose();
  }, [id, type, setNodeStatus, onClose]);

  const handleSettings = useCallback(() => {
    if (id && type === "node") {
      setSelectedNodeId(id);
    }
    onClose();
  }, [id, type, setSelectedNodeId, onClose]);

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
          { icon: Play, label: "Run Node", onClick: handleRunNode, shortcut: "R" },
          { icon: RotateCcw, label: "Reset Status", onClick: handleResetStatus },
          { divider: true },
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
          { label: "Add Node", header: true },
          { icon: null, label: "Query", onClick: () => handleAddNode("query") },
          { icon: null, label: "Generate (LLM)", onClick: () => handleAddNode("llm") },
          { icon: null, label: "Retrieve", onClick: () => handleAddNode("retriever") },
          { icon: null, label: "Embed", onClick: () => handleAddNode("embedding") },
          { icon: null, label: "Rerank", onClick: () => handleAddNode("reranker") },
          { icon: null, label: "Judge", onClick: () => handleAddNode("judge") },
          { icon: null, label: "HyDE", onClick: () => handleAddNode("hyde") },
          { icon: null, label: "Agent", onClick: () => handleAddNode("agent") },
        ];

  return (
    <div
      className="fixed z-50 min-w-[180px] rounded-lg border border-[var(--border)] bg-[var(--background)] shadow-lg py-1 animate-in fade-in-0 zoom-in-95"
      style={{
        left: position.x,
        top: position.y,
      }}
      onClick={handleClick}
    >
      {menuItems.map((item, index) => {
        if ("divider" in item && item.divider) {
          return <div key={index} className="my-1 h-px bg-[var(--border)]" />;
        }

        if ("header" in item && item.header) {
          return (
            <div
              key={index}
              className="px-3 py-1.5 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider"
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
                : "text-[var(--foreground)] hover:bg-[var(--muted)]"
            )}
          >
            {Icon && <Icon size={14} />}
            <span className="flex-1 text-left">{item.label}</span>
            {shortcut && (
              <span className="text-xs text-[var(--muted-foreground)]">{shortcut}</span>
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
