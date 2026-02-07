import { Plug } from "lucide-react";
import { IntegrationCard } from "./shared";

export const IntegrationsSection = () => {
  return (
    <section className="py-24 px-6 border-t bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-primary/10 text-primary mb-6 mx-auto">
            <Plug className="size-7" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Works with your stack</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect to the models and vector stores you already use. OpenAI API compatible — works with Azure, local LLMs, and custom endpoints.
          </p>
        </div>

        {/* LLMs & Embeddings */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">LLMs & Embeddings</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <IntegrationCard
              name="OpenAI"
              category="LLM & Embeddings"
              features={["GPT-4o", "o1-preview", "text-embedding-3"]}
              status="native"
            />
            <IntegrationCard
              name="Anthropic"
              category="LLM"
              features={["Claude 3.5 Sonnet", "Claude 3 Opus", "Streaming"]}
              status="native"
            />
            <IntegrationCard
              name="Cohere"
              category="LLM & Reranking"
              features={["Command R+", "Rerank v3", "embed-english-v3"]}
              status="native"
            />
            <IntegrationCard
              name="Ollama"
              category="Local LLMs"
              features={["Llama 3.1", "Mistral", "Self-hosted"]}
              status="compatible"
            />
          </div>
        </div>

        {/* Vector Stores */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Vector Stores</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <IntegrationCard
              name="Pinecone"
              category="Vector Store"
              features={["Serverless", "Namespaces", "Metadata filtering"]}
              status="native"
            />
            <IntegrationCard
              name="Weaviate"
              category="Vector Store"
              features={["Hybrid search", "Multi-tenancy", "GraphQL"]}
              status="native"
            />
            <IntegrationCard
              name="Qdrant"
              category="Vector Store"
              features={["Filtering", "Sparse vectors", "Self-hosted"]}
              status="native"
            />
            <IntegrationCard
              name="PostgreSQL"
              category="pgvector"
              features={["HNSW", "IVFFlat", "Your existing DB"]}
              status="native"
            />
          </div>
        </div>

        {/* More integrations hint */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Plus Chroma, Milvus, Azure OpenAI, AWS Bedrock, and any OpenAI-compatible API.
          </p>
        </div>
      </div>
    </section>
  );
};
