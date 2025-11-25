export function AdvancedNodes() {
  return (
    <section className="py-20 px-6 border-t bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Advanced RAG patterns as nodes
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Each node encapsulates a complex pattern. Understand them by running and inspecting.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NodeCard
            name="HyDE"
            description="Generate hypothetical answers to improve short query embeddings"
            color="blue"
          />
          <NodeCard
            name="Parent-Child"
            description="Match on small chunks, return large chunks for context"
            color="purple"
          />
          <NodeCard
            name="Fusion"
            description="Combine BM25 + vector search with reciprocal rank fusion"
            color="green"
          />
          <NodeCard
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
  name,
  description,
  color,
}: {
  name: string;
  description: string;
  color: "blue" | "purple" | "green" | "orange";
}) {
  const colors = {
    blue: "border-l-blue-500",
    purple: "border-l-purple-500",
    green: "border-l-green-500",
    orange: "border-l-orange-500",
  };

  return (
    <div className={`p-4 rounded-lg border border-l-4 ${colors[color]} bg-background`}>
      <h4 className="font-semibold mb-1">{name}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
