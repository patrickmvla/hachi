export function Problem() {
  return (
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
