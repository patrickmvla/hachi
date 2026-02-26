import {
  Workflow,
  Eye,
  Play,
  PenLine,
  Users,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Workflow,
    title: "Visual Canvas",
    description:
      "8 node types with typed connections. Drag, wire, configure.",
    detail: "query → embedding → retriever → reranker → llm",
  },
  {
    icon: Eye,
    title: "Wire Tap",
    description:
      "Click any connection. See embeddings, scores, reasoning.",
    detail: "score: 0.94 · docs: 5 · latency: 156ms",
  },
  {
    icon: Play,
    title: "Real Execution",
    description:
      "Your models, your vector store, your credentials. Live API calls, not a simulation.",
    detail: "openai / cohere / pinecone / qdrant",
  },
  {
    icon: PenLine,
    title: "Drawings",
    description:
      "Whiteboard your architecture before you build it. Powered by Excalidraw.",
    detail: "plan → sketch → annotate → share",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Live cursors, instant sync, shared results.",
    detail: "yjs-powered crdt",
  },
  {
    icon: Shield,
    title: "Teams & Roles",
    description:
      "Org-scoped canvases, documents, credentials.",
    detail: "owner / admin / editor / viewer",
  },
];

export const Features = () => {
  return (
    <section id="features" className="relative py-24 sm:py-32 px-6 bg-white">
      <div className="max-w-[1100px] mx-auto">
        <div className="max-w-[420px] mb-16">
          <span className="text-[12px] tracking-wide text-black/35 uppercase block mb-4">
            Capabilities
          </span>
          <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold tracking-[-0.03em] leading-[1.15] text-black">
            Built for testing, debugging
            <br />
            and understanding RAG pipelines.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-xl border border-black/[0.06] p-5 hover:border-black/[0.12] transition-colors"
              >
                <div className="inline-flex items-center justify-center size-9 rounded-lg border border-black/[0.06] mb-4 text-black/50 group-hover:text-black/70 transition-colors">
                  <Icon className="size-4" />
                </div>
                <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-black mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-black/40 mb-3">
                  {feature.description}
                </p>
                <span className="text-[11px] font-mono text-black/25">
                  {feature.detail}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
