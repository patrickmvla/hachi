import Link from "next/link";
import { ArrowRight, Clock, Zap } from "lucide-react";

export type TemplateData = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  complexity: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  nodes: string[];
  useCases: string[];
  diagram: React.ReactNode;
};

export function TemplateCard({ template }: { template: TemplateData }) {
  const complexityColors = {
    Beginner: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    Intermediate: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    Advanced: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  };

  return (
    <div className="group rounded-2xl border bg-background overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-300">
      {/* Diagram Preview */}
      <div className="h-48 bg-muted/30 border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:16px_16px] opacity-30" />
        <div className="relative h-full flex items-center justify-center p-4">
          {template.diagram}
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
          <span className={`text-xs px-2.5 py-1 rounded-full border shrink-0 ${complexityColors[template.complexity]}`}>
            {template.complexity}
          </span>
        </div>

        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {template.longDescription}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Zap className="size-3.5" />
            <span>{template.nodes.length} nodes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            <span>{template.estimatedTime}</span>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-6">
          <p className="text-xs font-medium text-muted-foreground mb-2">Best for:</p>
          <div className="flex flex-wrap gap-2">
            {template.useCases.map((useCase, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded-md bg-muted">
                {useCase}
              </span>
            ))}
          </div>
        </div>

        {/* Action */}
        <Link
          href={`/canvas?template=${template.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          Load template
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
