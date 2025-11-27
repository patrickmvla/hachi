import { Lightbulb, GitFork, Merge, Scale } from "lucide-react";

export function AdvancedNodes() {
  return (
    <section className="py-24 px-6 border-t bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">Building blocks</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Advanced RAG patterns as nodes
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Each node encapsulates a complex pattern. Understand them by running and inspecting.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NodeCard
            icon={<Lightbulb className="size-5" />}
            name="HyDE"
            description="Generate hypothetical answers to improve short query embeddings"
            color="blue"
          />
          <NodeCard
            icon={<GitFork className="size-5" />}
            name="Parent-Child"
            description="Match on small chunks, return large chunks for context"
            color="purple"
          />
          <NodeCard
            icon={<Merge className="size-5" />}
            name="Fusion"
            description="Combine BM25 + vector search with reciprocal rank fusion"
            color="green"
          />
          <NodeCard
            icon={<Scale className="size-5" />}
            name="Judge (CRAG)"
            description="Evaluate relevance and route to fallback if needed"
            color="orange"
          />
        </div>
      </div>
    </section>
  );
}

function NodeCard({
  icon,
  name,
  description,
  color,
}: {
  icon: React.ReactNode;
  name: string;
  description: string;
  color: "blue" | "purple" | "green" | "orange";
}) {
  const colorClasses = {
    blue: {
      border: "border-blue-500/30 hover:border-blue-500/60",
      bg: "bg-blue-500/10",
      text: "text-blue-500",
      glow: "group-hover:shadow-blue-500/10",
    },
    purple: {
      border: "border-purple-500/30 hover:border-purple-500/60",
      bg: "bg-purple-500/10",
      text: "text-purple-500",
      glow: "group-hover:shadow-purple-500/10",
    },
    green: {
      border: "border-green-500/30 hover:border-green-500/60",
      bg: "bg-green-500/10",
      text: "text-green-500",
      glow: "group-hover:shadow-green-500/10",
    },
    orange: {
      border: "border-orange-500/30 hover:border-orange-500/60",
      bg: "bg-orange-500/10",
      text: "text-orange-500",
      glow: "group-hover:shadow-orange-500/10",
    },
  };

  const c = colorClasses[color];

  return (
    <div className={`group p-5 rounded-xl border ${c.border} bg-background hover:shadow-xl ${c.glow} transition-all duration-300`}>
      <div className={`size-10 rounded-lg ${c.bg} ${c.text} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h4 className="font-semibold text-lg mb-2">{name}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
