import { IntegrationCard } from "./shared";

export const IntegrationsSection = () => {
  return (
    <section className="py-24 px-6 border-t bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Works with your stack</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect to the models and services you already use. No vendor lock-in.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <IntegrationCard name="OpenAI" category="LLM & Embeddings" />
          <IntegrationCard name="Anthropic" category="LLM" />
          <IntegrationCard name="Cohere" category="Reranking" />
          <IntegrationCard name="Pinecone" category="Vector Store" />
          <IntegrationCard name="Weaviate" category="Vector Store" />
          <IntegrationCard name="Qdrant" category="Vector Store" />
          <IntegrationCard name="Chroma" category="Vector Store" />
          <IntegrationCard name="PostgreSQL" category="pgvector" />
        </div>
      </div>
    </section>
  );
};
