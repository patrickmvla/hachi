import Link from "next/link";
import { ArrowRight, Clock, Zap } from "lucide-react";
import { cn } from "@hachi/ui/lib/utils";
import type { Template } from "@/features/templates/api/templates-api";
import { nodeRegistry } from "@/features/playground/config/node-registry";

const difficultyColors: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Intermediate: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Advanced: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  Expert: "bg-red-500/10 text-red-600 border-red-500/20",
};

export const TemplateCard = ({ template }: { template: Template }) => {
  const graphNodes = template.graphJson?.nodes ?? [];

  return (
    <div className="group rounded-2xl border bg-background overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-300">
      {/* Node Icons Preview */}
      <div className="h-48 bg-muted/30 border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:16px_16px] opacity-30" />
        <div className="relative h-full flex items-center justify-center p-4">
          <div className="flex items-center gap-1">
            {(graphNodes as Array<{ id: string; data: { type: string; label?: string } }>).map(
              (node, i) => {
                const reg = nodeRegistry[node.data.type];
                if (!reg) return null;
                const Icon = reg.icon;
                return (
                  <div key={node.id} className="flex items-center">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center border",
                          reg.bgColor,
                          reg.borderColor
                        )}
                      >
                        <Icon size={18} className={reg.color} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {node.data.label ?? reg.label}
                      </span>
                    </div>
                    {i < graphNodes.length - 1 && (
                      <div className="w-4 h-px bg-border mx-1" />
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
              {template.name}
            </h3>
            <p className="text-sm text-muted-foreground">{template.description}</p>
          </div>
          <span
            className={cn(
              "text-xs px-2.5 py-1 rounded-full border shrink-0",
              difficultyColors[template.difficulty] ?? "bg-muted text-muted-foreground"
            )}
          >
            {template.difficulty}
          </span>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Zap className="size-3.5" />
            <span>{template.nodes} nodes</span>
          </div>
          {template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {template.tags.map((tag, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-muted">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action */}
        <Link
          href={`/mini-map?template=${template.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          Load template
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};
