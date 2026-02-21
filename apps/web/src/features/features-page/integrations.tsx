export const IntegrationsSection = () => {
  return (
    <section id="integrations" className="py-20 px-6 bg-[#fafafa] scroll-mt-16">
      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="max-w-[520px] mb-14">
          <span className="text-[12px] tracking-wide text-black/35 uppercase block mb-4">
            Integrations
          </span>
          <h2 className="text-[24px] sm:text-[28px] font-bold tracking-[-0.02em] text-black mb-3">
            Works with your stack
          </h2>
          <p className="text-[15px] text-black/40 leading-relaxed">
            Connect to the models and vector stores you already use. OpenAI API compatible.
          </p>
        </div>

        {/* Tables */}
        <div className="space-y-10">
          {/* LLMs */}
          <div>
            <h3 className="text-[11px] tracking-wide text-black/25 uppercase mb-4">LLMs & Embeddings</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <IntegrationItem name="OpenAI" models="GPT-4o, o1, text-embedding-3" status="native" />
              <IntegrationItem name="Anthropic" models="Claude 3.5 Sonnet, Claude 3 Opus" status="native" />
              <IntegrationItem name="Cohere" models="Command R+, Rerank v3, embed-v3" status="native" />
              <IntegrationItem name="Ollama" models="Llama 3.1, Mistral, self-hosted" status="compatible" />
            </div>
          </div>

          {/* Vector stores */}
          <div>
            <h3 className="text-[11px] tracking-wide text-black/25 uppercase mb-4">Vector Stores</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <IntegrationItem name="Pinecone" models="Serverless, namespaces, metadata" status="native" />
              <IntegrationItem name="Weaviate" models="Hybrid search, multi-tenancy" status="native" />
              <IntegrationItem name="Qdrant" models="Filtering, sparse vectors" status="native" />
              <IntegrationItem name="PostgreSQL" models="pgvector, HNSW, IVFFlat" status="native" />
            </div>
          </div>
        </div>

        <p className="mt-8 text-[13px] text-black/25">
          Plus Chroma, Milvus, Azure OpenAI, AWS Bedrock, and any OpenAI-compatible API.
        </p>
      </div>
    </section>
  );
};

function IntegrationItem({
  name,
  models,
  status,
}: {
  name: string;
  models: string;
  status: "native" | "compatible";
}) {
  return (
    <div className="p-4 rounded-xl border border-black/[0.06] bg-white hover:border-black/[0.12] transition-colors">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[14px] font-semibold text-black">{name}</span>
        <span
          className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full uppercase tracking-wide ${
            status === "native"
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-blue-500/10 text-blue-600"
          }`}
        >
          {status}
        </span>
      </div>
      <p className="text-[11px] text-black/30">{models}</p>
    </div>
  );
}
