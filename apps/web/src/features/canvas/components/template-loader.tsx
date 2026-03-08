"use client";

import { useState } from "react";
import { LayoutTemplate, ChevronDown, Loader2 } from "lucide-react";
import { useCanvasStore, type HachiNode, type HachiEdge } from "@/stores/canvas-store";
import { getNodeDefaults } from "../config/node-defaults";
import { useTemplates } from "@/features/templates/hooks/use-template-queries";
import type { Template } from "@/features/templates/api/templates-api";

export const TemplateLoader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setNodes, setEdges } = useCanvasStore();
  const { data: templates, isLoading } = useTemplates();

  const loadTemplate = (template: Template) => {
    const nodes = (template.graphJson.nodes as HachiNode[]).map((node) => ({
      ...node,
      data: {
        ...node.data,
        config: { ...getNodeDefaults(node.data.type), ...node.data.config },
      },
    }));
    setNodes(nodes);
    setEdges(template.graphJson.edges as HachiEdge[]);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <LayoutTemplate size={16} aria-hidden="true" />
        Templates
        <ChevronDown size={14} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-64 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden"
          role="menu"
          aria-label="Template options"
        >
          <div className="p-2">
            <div className="text-xs font-semibold text-muted-foreground px-2 py-1 mb-1">
              Load Template
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 size={16} className="animate-spin text-muted-foreground" />
              </div>
            ) : templates?.length ? (
              templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => loadTemplate(template)}
                  className="w-full text-left px-2 py-2 hover:bg-muted rounded-md transition-colors"
                  role="menuitem"
                >
                  <div className="text-sm font-medium">{template.name}</div>
                  <div className="text-xs text-muted-foreground">{template.description}</div>
                </button>
              ))
            ) : (
              <div className="text-xs text-muted-foreground px-2 py-2">No templates available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
