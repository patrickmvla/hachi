"use client";

import { templates, type Template } from "./template-loader";
import { Search, FileText, ArrowRightLeft, Bot, GitBranch, Database, Cpu, Scale } from "lucide-react";

const nodeTypeIcons: Record<string, { icon: typeof Search; color: string }> = {
  query: { icon: Search, color: "text-primary" },
  hyde: { icon: FileText, color: "text-blue-500" },
  embedding: { icon: GitBranch, color: "text-pink-500" },
  retriever: { icon: Database, color: "text-orange-500" },
  reranker: { icon: ArrowRightLeft, color: "text-yellow-500" },
  judge: { icon: Scale, color: "text-red-500" },
  agent: { icon: Bot, color: "text-green-500" },
  llm: { icon: Cpu, color: "text-purple-500" },
};

interface TemplatePickerProps {
  onSelect: (template: Template) => void;
  onDismiss: () => void;
}

export const TemplatePicker = ({ onSelect, onDismiss }: TemplatePickerProps) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-foreground">Choose a template to get started</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Select a RAG pipeline to explore how it works
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className="text-left p-4 rounded-lg border border-border bg-background hover:border-primary/50 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {template.name}
                </span>
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {template.nodes.length} nodes
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
              <div className="flex items-center gap-1">
                {template.nodes.map((node, i) => {
                  const iconDef = nodeTypeIcons[node.type] || { icon: Search, color: "text-muted-foreground" };
                  const Icon = iconDef.icon;
                  return (
                    <div key={node.id} className="flex items-center">
                      <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                        <Icon size={12} className={iconDef.color} />
                      </div>
                      {i < template.nodes.length - 1 && (
                        <div className="w-3 h-px bg-border mx-0.5" />
                      )}
                    </div>
                  );
                })}
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-4">
          <button
            onClick={onDismiss}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Start from scratch
          </button>
        </div>
      </div>
    </div>
  );
};
