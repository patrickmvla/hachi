import { Workflow, Eye, Play, Users, Zap, Code2 } from "lucide-react";

export function Features() {
  return (
    <section id="features" className="py-20 px-6 border-t">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Engineering tools for RAG architecture
          </h2>
          <p className="text-muted-foreground text-lg">
            Not a low-code builder. A platform for understanding complex systems.
          </p>
        </div>

        <div className="grid gap-12">
          {/* Visual Canvas */}
          <FeatureRow
            icon={<Workflow className="size-6" />}
            title="Visual Canvas"
            description="Design advanced RAG architectures by connecting nodes. Drag HyDE, Retriever, Reranker, and Judge nodes. Wire them together. See the data flow."
            highlights={[
              "Typed connections prevent invalid wiring",
              "Nodes represent real RAG patterns",
              "Export to code when ready",
            ]}
          />

          {/* Wire Tap */}
          <FeatureRow
            icon={<Eye className="size-6" />}
            title="Wire Tap Debugging"
            description="Click any connection to see the exact data flowing through. Stop guessing why retrieval failed - see the embeddings, the similarity scores, the Judge's reasoning."
            highlights={[
              "Inspect every step's input and output",
              "See embedding vectors and scores",
              "Understand why the LLM hallucinated",
            ]}
            reverse
          />

          {/* Real Execution */}
          <FeatureRow
            icon={<Play className="size-6" />}
            title="Real Execution"
            description="Not a simulation. Run actual LLM calls, real embeddings, against your documents. See real latency. Experience real failures - and understand them."
            highlights={[
              "Actual API calls to your models",
              "Your own documents and data",
              "SSE streaming shows progress live",
            ]}
          />

          {/* Collaboration */}
          <FeatureRow
            icon={<Users className="size-6" />}
            title="Real-time Collaboration"
            description="Build architectures together. Senior engineers can demonstrate patterns while the team watches. Debug together. Shared Wire Tap means shared understanding."
            highlights={[
              "Live cursors show who's working where",
              "Changes sync instantly",
              "Shared execution results",
            ]}
            reverse
          />
        </div>
      </div>
    </section>
  );
}

function FeatureRow({
  icon,
  title,
  description,
  highlights,
  reverse = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlights: string[];
  reverse?: boolean;
}) {
  return (
    <div className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} gap-8 items-center`}>
      <div className="flex-1">
        <div className="inline-flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary mb-4">
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <ul className="space-y-2">
          {highlights.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <Zap className="size-4 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 w-full h-64 rounded-xl border bg-muted/50 flex items-center justify-center text-muted-foreground">
        <Code2 className="size-12" />
      </div>
    </div>
  );
}
