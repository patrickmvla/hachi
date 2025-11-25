import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
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
  );
}
