import { memo, useCallback } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { X } from "lucide-react";
import { cn } from "@hachi/ui/lib/utils";
import { nodeRegistry, getNodeConfigSummary } from "../config/node-registry";
import { usePlaygroundStore, type NodeStatus } from "../store/playground-store";

type PlaygroundNodeData = {
  label: string;
  type: string;
  config?: Record<string, unknown>;
  status?: NodeStatus;
  statusMessage?: string;
};

function statusRingClass(status?: NodeStatus): string {
  switch (status) {
    case "loading":
      return "ring-2 ring-blue-500 animate-pulse";
    case "success":
      return "ring-2 ring-green-500";
    case "error":
      return "ring-2 ring-red-500";
    default:
      return "ring-1 ring-border";
  }
}

export const PlaygroundNode = memo(function PlaygroundNode({
  id,
  data,
  selected,
}: NodeProps<Node<PlaygroundNodeData>>) {
  const deleteNode = usePlaygroundStore((s) => s.deleteNode);
  const setSelectedNodeId = usePlaygroundStore((s) => s.setSelectedNodeId);
  const registry = nodeRegistry[data.type];

  const handleClick = useCallback(() => {
    setSelectedNodeId(id);
  }, [id, setSelectedNodeId]);

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteNode(id);
    },
    [id, deleteNode]
  );

  if (!registry) return null;

  const Icon = registry.icon;
  const summary = getNodeConfigSummary(data.type, data.config);

  return (
    <div
      onClick={handleClick}
      className={cn(
        "bg-background rounded-lg shadow-sm border-l-[3px] min-w-[180px] max-w-[220px] transition-all",
        registry.borderColor,
        statusRingClass(data.status),
        selected && "ring-2 ring-primary"
      )}
    >
      {registry.hasTargetHandle && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-2.5 !h-2.5 !bg-muted-foreground/40 !border-background !border-2"
        />
      )}

      <div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
        <div className="flex items-center gap-2 min-w-0">
          <Icon size={14} className={cn("shrink-0", registry.color)} />
          <span className="text-xs font-semibold truncate">{data.label}</span>
        </div>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 hover:opacity-100 p-0.5 rounded hover:bg-muted transition-opacity text-muted-foreground"
          aria-label="Delete node"
        >
          <X size={12} />
        </button>
      </div>

      {summary && (
        <div className="px-3 py-1.5">
          <p className="text-[10px] text-muted-foreground truncate">{summary}</p>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-muted-foreground/40 !border-background !border-2"
      />
    </div>
  );
});
