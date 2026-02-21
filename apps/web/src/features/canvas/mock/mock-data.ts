export interface MockNodeOutput {
  stepName: string;
  latencyMs: number;
  output: Record<string, unknown>;
  logMessages: string[];
}

export function getMockOutput(nodeType: string, query: string): MockNodeOutput {
  switch (nodeType) {
    case "query":
      return {
        stepName: "Parse Query",
        latencyMs: 200,
        output: {
          query,
          tokens: query.split(" ").length,
          language: "en",
        },
        logMessages: [
          `Received query: "${query}"`,
          `Tokenized: ${query.split(" ").length} tokens`,
        ],
      };

    case "hyde":
      return {
        stepName: "Generate Hypothetical Document",
        latencyMs: 1200,
        output: {
          hypothetical_document: `Based on the query "${query}", a relevant document would discuss the key concepts and provide detailed explanations with examples and references to current research.`,
          model: "gpt-4-turbo",
          tokens_used: 180,
        },
        logMessages: [
          "Generating hypothetical document with GPT-4",
          "Hypothetical document generated (180 tokens)",
          "Combining with original query for embedding",
        ],
      };

    case "embedding":
      return {
        stepName: "Generate Embeddings",
        latencyMs: 350,
        output: {
          model: "text-embedding-3-small",
          dimensions: 1536,
          vectors_generated: 1,
          embedding_preview: [0.023, -0.041, 0.089, 0.012, -0.067, "..."],
        },
        logMessages: [
          "Encoding input with text-embedding-3-small",
          "Generated 1536-dimensional embedding vector",
        ],
      };

    case "retriever":
      return {
        stepName: "Retrieve Documents",
        latencyMs: 450,
        output: {
          strategy: "cosine_similarity",
          top_k: 5,
          documents: [
            { id: "doc_1", score: 0.92, title: "Introduction to the Topic" },
            { id: "doc_2", score: 0.89, title: "Advanced Concepts & Patterns" },
            { id: "doc_3", score: 0.87, title: "Practical Implementation Guide" },
            { id: "doc_4", score: 0.84, title: "Performance Benchmarks" },
            { id: "doc_5", score: 0.81, title: "Common Pitfalls & Solutions" },
          ],
        },
        logMessages: [
          "Searching vector store with cosine similarity",
          "Found 5 documents above threshold (0.80)",
          "Top result: doc_1 (score: 0.92)",
        ],
      };

    case "reranker":
      return {
        stepName: "Rerank Results",
        latencyMs: 600,
        output: {
          model: "cross-encoder/ms-marco",
          input_count: 5,
          output_count: 3,
          reranked: [
            { id: "doc_3", original_rank: 3, new_rank: 1, score: 0.95 },
            { id: "doc_1", original_rank: 1, new_rank: 2, score: 0.91 },
            { id: "doc_2", original_rank: 2, new_rank: 3, score: 0.88 },
          ],
        },
        logMessages: [
          "Reranking 5 documents with cross-encoder",
          "doc_3 promoted from rank 3 to rank 1",
          "Returning top 3 reranked documents",
        ],
      };

    case "judge":
      return {
        stepName: "Judge Relevance",
        latencyMs: 800,
        output: {
          verdict: "relevant",
          confidence: 0.94,
          reasoning: "Documents contain direct answers to the query with supporting evidence",
          documents_passed: 3,
          documents_filtered: 0,
        },
        logMessages: [
          "Evaluating document relevance to query",
          "Verdict: RELEVANT (confidence: 0.94)",
          "All 3 documents passed quality check",
        ],
      };

    case "agent":
      return {
        stepName: "Agent Planning",
        latencyMs: 900,
        output: {
          plan: [
            "Decompose query into sub-questions",
            "Search knowledge base for each sub-question",
            "Aggregate and deduplicate results",
          ],
          tools_selected: ["vector_search", "web_search"],
          reasoning: "Query requires multi-step retrieval for comprehensive answer",
        },
        logMessages: [
          "Analyzing query complexity",
          "Selected tools: vector_search, web_search",
          "Generated 3-step retrieval plan",
        ],
      };

    case "llm":
      return {
        stepName: "Generate Response",
        latencyMs: 1500,
        output: {
          model: "gpt-4-turbo",
          text: `Based on the retrieved documents, here is a comprehensive answer to your query. The key points are: (1) the fundamental concepts are well-established in the literature, (2) practical implementations show significant improvements, and (3) best practices recommend an iterative approach.`,
          usage: {
            prompt_tokens: 450,
            completion_tokens: 120,
            total_tokens: 570,
          },
          temperature: 0.7,
        },
        logMessages: [
          "Constructing prompt with 3 context documents",
          "Generating response with gpt-4-turbo (temp=0.7)",
          "Response generated: 120 tokens",
          "Total latency: 1.5s",
        ],
      };

    default:
      return {
        stepName: nodeType,
        latencyMs: 500,
        output: { status: "completed" },
        logMessages: [`${nodeType} node executed`],
      };
  }
}
