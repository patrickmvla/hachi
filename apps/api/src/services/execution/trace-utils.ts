import type { TraceData } from "@hachi/schemas/execution";

/**
 * Trace Extraction Utility
 * Extracts per-step trace data (model, tokens, cost, dimensions, doc count)
 * from step outputs and calculates costs based on model pricing.
 */

/**
 * Pricing per 1M tokens (input/output) for common models.
 * Prices in USD.
 */
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  // OpenAI
  "gpt-4o": { input: 2.5, output: 10 },
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "gpt-4-turbo": { input: 10, output: 30 },
  "gpt-4": { input: 30, output: 60 },
  "gpt-3.5-turbo": { input: 0.5, output: 1.5 },
  "o1": { input: 15, output: 60 },
  "o1-mini": { input: 3, output: 12 },
  "o3-mini": { input: 1.1, output: 4.4 },

  // OpenAI Embeddings
  "text-embedding-3-small": { input: 0.02, output: 0 },
  "text-embedding-3-large": { input: 0.13, output: 0 },
  "text-embedding-ada-002": { input: 0.1, output: 0 },

  // Anthropic
  "claude-3-5-sonnet-20241022": { input: 3, output: 15 },
  "claude-3-5-sonnet-latest": { input: 3, output: 15 },
  "claude-3-5-haiku-20241022": { input: 0.8, output: 4 },
  "claude-3-opus-20240229": { input: 15, output: 75 },
  "claude-sonnet-4-6": { input: 3, output: 15 },
  "claude-opus-4-6": { input: 15, output: 75 },
  "claude-haiku-4-5-20251001": { input: 0.8, output: 4 },
};

/**
 * Calculates cost in USD for a given model and token usage.
 */
export function calculateCost(
  model: string,
  promptTokens?: number,
  completionTokens?: number
): { input: number; output: number; total: number } | undefined {
  // Try exact match, then prefix match
  let pricing = MODEL_PRICING[model];
  if (!pricing) {
    const key = Object.keys(MODEL_PRICING).find((k) => model.startsWith(k));
    if (key) pricing = MODEL_PRICING[key];
  }

  if (!pricing) return undefined;

  const inputCost = ((promptTokens || 0) / 1_000_000) * pricing.input;
  const outputCost = ((completionTokens || 0) / 1_000_000) * pricing.output;

  return {
    input: inputCost,
    output: outputCost,
    total: inputCost + outputCost,
  };
}

/**
 * Extracts trace data from a step's output based on its node type.
 */
export function extractTraceData(
  nodeType: string,
  output: Record<string, unknown>
): TraceData {
  const trace: TraceData = {};

  switch (nodeType) {
    case "generate":
    case "hyde":
    case "agent": {
      trace.model = output.model as string | undefined;
      trace.provider = detectProvider(trace.model);

      const usage = output.usage as
        | {
            promptTokens?: number;
            completionTokens?: number;
            totalTokens?: number;
          }
        | undefined;

      if (usage) {
        trace.tokenCount = {
          prompt: usage.promptTokens,
          completion: usage.completionTokens,
          total: usage.totalTokens,
        };
        trace.cost = calculateCost(
          trace.model || "",
          usage.promptTokens,
          usage.completionTokens
        );
      }

      // Hyde doesn't have usage in its output, estimate from response
      if (nodeType === "hyde" && !usage && trace.model) {
        const docs = output.hypotheticalDocuments as string[] | undefined;
        if (docs) {
          // Rough estimate: ~4 chars per token
          const estOutputTokens = docs.reduce(
            (sum, d) => sum + Math.ceil(d.length / 4),
            0
          );
          trace.tokenCount = { completion: estOutputTokens };
          trace.cost = calculateCost(trace.model, 0, estOutputTokens);
        }
      }

      trace.finishReason = output.finishReason as string | undefined;

      // Agent-specific
      if (nodeType === "agent") {
        const steps = output.steps as unknown[] | undefined;
        if (steps) {
          trace.documentCount = steps.length;
        }
      }
      break;
    }

    case "embed": {
      trace.model = output.model as string | undefined;
      trace.provider = detectProvider(trace.model);
      trace.dimensions = output.dimensions as number | undefined;

      const tokenCount = output.tokenCount as number | undefined;
      if (tokenCount) {
        trace.tokenCount = { total: tokenCount };
        trace.cost = calculateCost(trace.model || "", tokenCount, 0);
      }

      const chunks = output.chunks as unknown[] | undefined;
      if (chunks) {
        trace.documentCount = chunks.length;
      }
      break;
    }

    case "retrieve": {
      const docs = output.documents as unknown[] | undefined;
      trace.documentCount = docs?.length || (output.totalFound as number) || 0;
      break;
    }

    case "rerank": {
      trace.model = output.model as string | undefined;
      trace.provider = output.provider as string | undefined;
      const docs = output.documents as unknown[] | undefined;
      trace.documentCount = docs?.length || 0;
      break;
    }

    case "judge": {
      trace.model = output.model as string | undefined;
      trace.provider = detectProvider(trace.model);

      const relevant = output.relevantDocuments as unknown[] | undefined;
      const irrelevant = output.irrelevantDocuments as unknown[] | undefined;
      trace.documentCount =
        (relevant?.length || 0) + (irrelevant?.length || 0);
      trace.finishReason = output.recommendation as string | undefined;
      break;
    }

    case "eval-faithfulness":
    case "eval-relevancy":
    case "eval-context-precision": {
      trace.model = output.model as string | undefined;
      trace.provider = detectProvider(trace.model);

      const usage = output.usage as
        | {
            promptTokens?: number;
            completionTokens?: number;
            totalTokens?: number;
          }
        | undefined;

      if (usage) {
        trace.tokenCount = {
          prompt: usage.promptTokens,
          completion: usage.completionTokens,
          total: usage.totalTokens,
        };
        trace.cost = calculateCost(
          trace.model || "",
          usage.promptTokens,
          usage.completionTokens
        );
      }
      break;
    }

    case "query": {
      // Query step has no trace-worthy data
      break;
    }
  }

  return trace;
}

/**
 * Detects the AI provider from a model name.
 */
function detectProvider(model?: string): string | undefined {
  if (!model) return undefined;
  if (model.startsWith("claude")) return "anthropic";
  if (model.startsWith("gpt") || model.startsWith("o1") || model.startsWith("o3")) return "openai";
  if (model.startsWith("text-embedding")) return "openai";
  if (model.startsWith("rerank")) return "cohere";
  return undefined;
}

/**
 * Aggregates trace data from multiple steps into run-level totals.
 */
export function aggregateTraces(
  traces: TraceData[]
): { totalTokens: number; totalCost: number; stepCount: number } {
  let totalTokens = 0;
  let totalCost = 0;

  for (const trace of traces) {
    if (trace.tokenCount?.total) {
      totalTokens += trace.tokenCount.total;
    } else if (trace.tokenCount?.prompt || trace.tokenCount?.completion) {
      totalTokens +=
        (trace.tokenCount.prompt || 0) + (trace.tokenCount.completion || 0);
    }
    if (trace.cost?.total) {
      totalCost += trace.cost.total;
    }
  }

  return { totalTokens, totalCost, stepCount: traces.length };
}
