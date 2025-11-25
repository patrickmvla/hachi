import Link from "next/link";
import {
  ArrowRight,
  Workflow,
  Users,
  Zap,
  GitBranch,
  Eye,
  Play,
  Code2,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">H</span>
            </div>
            <span className="font-semibold text-lg">Hachi</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/canvas"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Open Canvas
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm text-muted-foreground mb-6">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            For engineers building production RAG systems
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
            Design RAG architectures
            <br />
            <span className="text-muted-foreground">you can actually debug</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Hachi is a visual platform where engineering teams design, execute, and
            debug advanced RAG pipelines. See exactly why your retrieval fails.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/canvas"
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Start Building
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium rounded-lg border hover:bg-accent transition-colors"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 border-t bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              You&apos;ve built naive RAG. Now what?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              You retrieve documents, pass them to an LLM, and get mediocre results.
              You&apos;ve read about HyDE, CRAG, and Fusion but can&apos;t visualize how they fit together.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <ProblemCard
              title="Architecture discussions happen on whiteboards"
              description="...that don't execute. You sketch ideas but can't test them."
            />
            <ProblemCard
              title="Failed experiments provide no insight"
              description="Your pipeline returns bad results but you don't know why."
            />
            <ProblemCard
              title="Advanced patterns are hard to visualize"
              description="HyDE, Parent-Child, CRAG - how do these actually work together?"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Advanced Nodes Section */}
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

      {/* Reference Architectures */}
      <section className="py-20 px-6 border-t">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Start with reference architectures
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Load production-grade patterns. Run them. Inspect them. Modify them. Learn how they work.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ArchitectureCard
              name="Naive RAG"
              description="Basic retrieve + generate baseline"
            />
            <ArchitectureCard
              name="HyDE Pipeline"
              description="Query expansion via hypothetical documents"
            />
            <ArchitectureCard
              name="Hybrid Search"
              description="BM25 + Vector + RRF + Reranker"
            />
            <ArchitectureCard
              name="CRAG Pipeline"
              description="Self-correcting with web search fallback"
            />
            <ArchitectureCard
              name="Parent-Child"
              description="Precision retrieval with context"
            />
            <ArchitectureCard
              name="Agentic RAG"
              description="Agent with retrieval tool"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t bg-muted/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to understand your RAG pipeline?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Stop guessing. Start seeing. Design architectures you can actually debug.
          </p>
          <Link
            href="/canvas"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Open Canvas
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">H</span>
            </div>
            <span>Hachi</span>
          </div>
          <p>Visual Architecture Platform for RAG Systems</p>
        </div>
      </footer>
    </main>
  );
}

function ProblemCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl border bg-background">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
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

function ArchitectureCard({ name, description }: { name: string; description: string }) {
  return (
    <div className="p-4 rounded-lg border bg-background hover:border-primary/50 transition-colors cursor-pointer group">
      <div className="flex items-center gap-3 mb-2">
        <GitBranch className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
        <h4 className="font-semibold">{name}</h4>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
