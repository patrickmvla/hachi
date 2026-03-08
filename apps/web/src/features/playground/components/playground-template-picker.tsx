"use client";

import { useCallback } from "react";
import { X, Sparkles } from "lucide-react";
import { cn } from "@hachi/ui/lib/utils";
import type { Template } from "@/features/templates/api/templates-api";
import { nodeRegistry } from "../config/node-registry";

const difficultyColor: Record<string, string> = {
  Beginner: "bg-green-500/10 text-green-600",
  Intermediate: "bg-yellow-500/10 text-yellow-600",
  Advanced: "bg-orange-500/10 text-orange-600",
  Expert: "bg-red-500/10 text-red-600",
};

interface PlaygroundTemplatePickerProps {
  templates: Template[];
  onSelect: (template: Template) => void;
  onDismiss: () => void;
}

export function PlaygroundTemplatePicker({
  templates,
  onSelect,
  onDismiss,
}: PlaygroundTemplatePickerProps) {
  const handleSelect = useCallback(
    (template: Template) => {
      onSelect(template);
    },
    [onSelect]
  );

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            <h2 className="text-sm font-semibold">Choose a template</h2>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded hover:bg-muted text-muted-foreground"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
          {templates.map((template) => {
            const graphNodes = template.graphJson?.nodes ?? [];
            return (
              <button
                key={template.id}
                onClick={() => handleSelect(template)}
                className="text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium truncate">{template.name}</h3>
                  <span
                    className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0",
                      difficultyColor[template.difficulty] ?? "bg-muted text-muted-foreground"
                    )}
                  >
                    {template.difficulty}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mb-2.5 line-clamp-2">
                  {template.description}
                </p>
                <div className="flex items-center gap-1 flex-wrap">
                  {(graphNodes as Array<{ id: string; data: { type: string } }>).map(
                    (node, i) => {
                      const reg = nodeRegistry[node.data.type];
                      if (!reg) return null;
                      const Icon = reg.icon;
                      return (
                        <div key={node.id} className="flex items-center">
                          <div
                            className={cn(
                              "w-5 h-5 rounded flex items-center justify-center",
                              reg.bgColor
                            )}
                          >
                            <Icon size={10} className={reg.color} />
                          </div>
                          {i < graphNodes.length - 1 && (
                            <div className="w-2 h-px bg-border mx-0.5" />
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-5 py-3 border-t border-border">
          <button
            onClick={onDismiss}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            or start from scratch
          </button>
        </div>
      </div>
    </div>
  );
}
