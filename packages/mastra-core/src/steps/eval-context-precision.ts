import { createStep } from "@mastra/core/workflows";
import {
  evalContextPrecisionInputSchema,
  evalContextPrecisionOutputSchema,
  type EvalContextPrecisionConfig,
  type DocRelevance,
} from "@hachi/schemas/nodes";

/**
 * Context Precision Evaluator Step
 * Evaluates whether relevant documents are ranked higher in the retrieval results.
 * Uses Average Precision: relevant docs at higher ranks contribute more to the score.
 */
export const createEvalContextPrecisionStep = (
  config: Partial<EvalContextPrecisionConfig> = {}
) =>
  createStep({
    id: "eval-context-precision",
    inputSchema: evalContextPrecisionInputSchema,
    outputSchema: evalContextPrecisionOutputSchema,
    execute: async ({ inputData }) => {
      const { query, documents, groundTruth } = inputData;
      const model = config.model || "gpt-4o-mini";
      const temperature = config.temperature ?? 0;

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error(
          "OpenAI API key is required for Context Precision evaluation"
        );
      }

      if (documents.length === 0) {
        return {
          score: 0,
          reasoning: "No documents to evaluate.",
          perDocRelevance: [],
        };
      }

      const groundTruthClause = groundTruth
        ? `\n\nGround Truth Answer: "${groundTruth}"\nUse this ground truth to judge whether each document contains information needed to answer the query correctly.`
        : "";

      const systemPrompt = `You are a context precision evaluator for a RAG system.

Your task is to evaluate each retrieved document's relevance to the query and determine if relevant documents are ranked higher than irrelevant ones.${groundTruthClause}

For each document, determine if it is relevant to answering the query.

Respond in JSON format:
{
  "perDocRelevance": [
    {
      "documentIndex": 0,
      "relevant": true,
      "reasoning": "This document contains information about..."
    }
  ],
  "reasoning": "Overall assessment of retrieval precision..."
}

I will compute the Average Precision score from your relevance judgments.`;

      const documentsText = documents
        .map(
          (doc, i) => `[Document ${i}]:\n${doc.content}`
        )
        .join("\n\n---\n\n");

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              {
                role: "user",
                content: `Query: "${query}"\n\nRetrieved Documents (in ranked order):\n\n${documentsText}`,
              },
            ],
            temperature,
            response_format: { type: "json_object" },
          }),
        }
      );

      if (!response.ok) {
        const error = (await response.json().catch(() => ({}))) as {
          error?: { message?: string };
        };
        throw new Error(
          `OpenAI API error: ${response.status} - ${error.error?.message || "Unknown error"}`
        );
      }

      interface OpenAIResponse {
        choices: Array<{ message: { content: string } }>;
      }

      interface ContextPrecisionResult {
        perDocRelevance: DocRelevance[];
        reasoning: string;
      }

      const data = (await response.json()) as OpenAIResponse;
      const choice = data.choices[0];
      if (!choice) {
        throw new Error("No response from OpenAI");
      }

      const result = JSON.parse(
        choice.message.content
      ) as ContextPrecisionResult;

      // Calculate Average Precision
      // AP = (1/R) * Σ(Precision@k * rel(k)) where R = total relevant docs
      const relevantDocs = result.perDocRelevance.filter((d) => d.relevant);
      const totalRelevant = relevantDocs.length;

      let ap = 0;
      if (totalRelevant > 0) {
        let relevantSoFar = 0;
        for (let k = 0; k < result.perDocRelevance.length; k++) {
          const doc = result.perDocRelevance[k]!;
          if (doc.relevant) {
            relevantSoFar++;
            ap += relevantSoFar / (k + 1);
          }
        }
        ap /= totalRelevant;
      }

      return {
        score: Math.max(0, Math.min(1, ap)),
        reasoning: result.reasoning,
        perDocRelevance: result.perDocRelevance,
      };
    },
  });

export const evalContextPrecisionStep = createEvalContextPrecisionStep();
