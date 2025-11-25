import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
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
  );
}
