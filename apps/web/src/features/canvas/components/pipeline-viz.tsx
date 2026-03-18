import { cn } from "@hachi/ui/lib/utils";
import { nodeRegistry } from "@/features/playground/config/node-registry";

const sizes = {
  sm: { box: "w-5 h-5", icon: 10, connector: "w-2", gap: "gap-0.5" },
  md: { box: "w-7 h-7", icon: 14, connector: "w-3", gap: "gap-1" },
} as const;

interface PipelineVizProps {
  nodes: Array<{ id: string; data: { type: string } }>;
  size?: "sm" | "md";
  className?: string;
}

export function PipelineViz({ nodes, size = "sm", className }: PipelineVizProps) {
  if (nodes.length === 0) {
    return <span className="text-xs text-muted-foreground italic">Empty pipeline</span>;
  }

  const s = sizes[size];

  return (
    <div className={cn("flex items-center flex-wrap", s.gap, className)}>
      {nodes.map((node, i) => {
        const reg = nodeRegistry[node.data.type];
        if (!reg) return null;
        const Icon = reg.icon;
        return (
          <div key={node.id} className="flex items-center">
            <div
              className={cn(
                "rounded flex items-center justify-center shrink-0",
                s.box,
                reg.bgColor
              )}
              title={reg.label}
            >
              <Icon size={s.icon} className={reg.color} />
            </div>
            {i < nodes.length - 1 && (
              <div className={cn("h-px bg-border mx-0.5", s.connector)} />
            )}
          </div>
        );
      })}
    </div>
  );
}
