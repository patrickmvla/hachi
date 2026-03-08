import { createStep } from "@mastra/core/workflows";
import {
  evalFaithfulnessInputSchema,
  evalFaithfulnessOutputSchema,
  type EvalFaithfulnessConfig,
  type FaithfulnessClaim,
} from "@hachi/schemas/nodes";

/**
 * Faithfulness Evaluator Step
 * Decomposes the answer into claims and checks each against the retrieved contexts.
 * Returns a grounding score (0-1) representing what fraction of claims are supported.
 */
export const createEvalFaithfulnessStep = (
  config: Partial<EvalFaithfulnessConfig> = {}
) =>
  createStep({
    id: "eval-faithfulness",
    inputSchema: evalFaithfulnessInputSchema,
    outputSchema: evalFaithfulnessOutputSchema,
    execute: async ({ inputData }) => {
      const { query, answer, contexts } = inputData;
      const model = config.model || "gpt-4o-mini";
      const temperature = config.temperature ?? 0;

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OpenAI API key is required for Faithfulness evaluation");
      }

      const systemPrompt = `You are a faithfulness evaluator for a RAG system.

Your task is to evaluate whether the given answer is grounded in the provided context documents.

Steps:
1. Decompose the answer into individual factual claims.
2. For each claim, determine if it is supported by the context documents.
3. Provide evidence from the context for supported claims, or note the lack of evidence for unsupported ones.

Respond in JSON format:
{
  "claims": [
    {
      "claim": "The specific factual claim",
      "supported": true,
      "evidence": "Quote or reference from context supporting this claim"
    }
  ],
  "score": 0.85,
  "reasoning": "Overall assessment of faithfulness..."
}

The score should be the fraction of claims that are supported (supported_count / total_claims).
If there are no claims, return score 1.0.`;

      const contextsText = contexts
        .map((ctx, i) => `[Context ${i + 1}]:\n${ctx}`)
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
                content: `Query: "${query}"\n\nAnswer: "${answer}"\n\nContext Documents:\n\n${contextsText}`,
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
        usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
      }

      interface FaithfulnessResult {
        claims: FaithfulnessClaim[];
        score: number;
        reasoning: string;
      }

      const data = (await response.json()) as OpenAIResponse;
      const choice = data.choices[0];
      if (!choice) {
        throw new Error("No response from OpenAI");
      }

      const result = JSON.parse(choice.message.content) as FaithfulnessResult;

      return {
        score: Math.max(0, Math.min(1, result.score)),
        reasoning: result.reasoning,
        claims: result.claims,
      };
    },
  });

export const evalFaithfulnessStep = createEvalFaithfulnessStep();
