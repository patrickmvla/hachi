import { PenLine, CircleHelp, Puzzle } from "lucide-react";

export function Problem() {
  return (
    <section className="py-24 px-6 border-t bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">The challenge</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            You&apos;ve built naive RAG. Now what?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            You retrieve documents, pass them to an LLM, and get mediocre results.
            You&apos;ve read about HyDE, CRAG, and Fusion but can&apos;t visualize how they fit together.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <ProblemCard
            icon={<PenLine className="size-5" />}
            title="Architecture discussions happen on whiteboards"
            description="...that don't execute. You sketch ideas but can't test them."
          />
          <ProblemCard
            icon={<CircleHelp className="size-5" />}
            title="Failed experiments provide no insight"
            description="Your pipeline returns bad results but you don't know why."
          />
          <ProblemCard
            icon={<Puzzle className="size-5" />}
            title="Advanced patterns are hard to visualize"
            description="HyDE, Parent-Child, CRAG - how do these actually work together?"
          />
        </div>
      </div>
    </section>
  );
}

function ProblemCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group p-6 rounded-xl border bg-background hover:border-primary/30 hover:shadow-lg transition-all duration-300">
      <div className="size-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-semibold mb-2 text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
