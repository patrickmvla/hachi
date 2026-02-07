"use client";

import { NodeToolbar as ReactFlowNodeToolbar, Position } from "@xyflow/react";
import { Trash2, Copy, Settings, MoreHorizontal } from "lucide-react";
import { useCanvasStore } from "@/stores/canvas-store";

interface NodeToolbarProps {
  nodeId: string;
  isVisible: boolean;
}

export const NodeToolbar = ({ nodeId, isVisible }: NodeToolbarProps) => {
  const { deleteNode, duplicateNode, setSelectedNodeId } = useCanvasStore();

  const handleDelete = () => {
    deleteNode(nodeId);
  };

  const handleDuplicate = () => {
    duplicateNode(nodeId);
  };

  const handleSettings = () => {
    setSelectedNodeId(nodeId);
  };

  return (
    <ReactFlowNodeToolbar
      isVisible={isVisible}
      position={Position.Top}
      offset={10}
      className="flex items-center gap-1 p-1 rounded-lg border border-border bg-background shadow-lg"
    >
      <button
        onClick={handleDuplicate}
        className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
        title="Duplicate"
        aria-label="Duplicate node"
      >
        <Copy size={14} aria-hidden="true" />
      </button>
      <button
        onClick={handleSettings}
        className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
        title="Settings"
        aria-label="Node settings"
      >
        <Settings size={14} aria-hidden="true" />
      </button>
      <div className="w-px h-4 bg-border" aria-hidden="true" />
      <button
        onClick={handleDelete}
        className="p-1.5 hover:bg-red-500/10 rounded-md text-muted-foreground hover:text-red-500 transition-colors"
        title="Delete"
        aria-label="Delete node"
      >
        <Trash2 size={14} aria-hidden="true" />
      </button>
    </ReactFlowNodeToolbar>
  );
};

interface NodeToolbarWrapperProps {
  nodeId: string;
  selected?: boolean;
  children: React.ReactNode;
}

export const NodeToolbarWrapper = ({
  nodeId,
  selected = false,
  children,
}: NodeToolbarWrapperProps) => {
  return (
    <>
      <NodeToolbar nodeId={nodeId} isVisible={selected} />
      {children}
    </>
  );
};
