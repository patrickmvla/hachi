import { type DragEvent } from "react";
import { 
  Search, 
  Database, 
  FileText, 
  Cpu, 
  GitBranch, 
  ArrowRightLeft, 
  Scale, 
  Bot 
} from "lucide-react";

const nodeTypes = [
  { type: "query", label: "Query Input", icon: Search, description: "Start with a user query" },
  { type: "hyde", label: "HyDE", icon: FileText, description: "Hypothetical Document Embeddings" },
  { type: "retriever", label: "Retriever", icon: Database, description: "Fetch relevant documents" },
  { type: "reranker", label: "Reranker", icon: ArrowRightLeft, description: "Re-order results by relevance" },
  { type: "judge", label: "Judge", icon: Scale, description: "Evaluate result quality" },
  { type: "llm", label: "LLM Generate", icon: Cpu, description: "Generate text with AI" },
  { type: "embedding", label: "Embedding", icon: GitBranch, description: "Convert text to vectors" },
  { type: "agent", label: "Agent", icon: Bot, description: "Autonomous agent step" },
];

export const NodePalette = () => {
  const onDragStart = (event: DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("application/reactflow-label", label);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-64 border-r border-border bg-background flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-sm">Components</h2>
        <p className="text-xs text-muted-foreground">Drag to add to canvas</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3" role="list" aria-label="Available node types">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary hover:shadow-sm cursor-grab active:cursor-grabbing transition-all"
            onDragStart={(event) => onDragStart(event, node.type, node.label)}
            draggable
            role="listitem"
            aria-label={`${node.label}: ${node.description}`}
          >
            <div className="p-2 rounded-md bg-muted text-foreground">
              <node.icon size={16} aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none mb-1">{node.label}</span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                {node.description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
