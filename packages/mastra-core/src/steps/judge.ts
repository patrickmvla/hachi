import { createStep } from "@mastra/core";
import { z } from "zod";
import {
  judgeNodeInputSchema,
  judgeNodeOutputSchema,
  type JudgeNodeConfig,
  type DocumentJudgment,
} from "@hachi/schemas/nodes";

/**
 * Judge Step (CRAG - Corrective RAG)
 * Evaluates relevance of retrieved documents and provides routing recommendations
 */
export const createJudgeStep = (config: Partial<JudgeNodeConfig> = {}) =>
  createStep({
    id: "judge",
    inputSchema: judgeNodeInputSchema,
    outputSchema: judgeNodeOutputSchema,
    execute: async ({ context }) => {
      const { query, documents } = context;
      const model = config.model || "gpt-4o-mini";
      const temperature = config.temperature ?? 0;
      const relevanceThreshold = config.relevanceThreshold ?? 0.7;
      const criteria = config.criteria || [
        "Relevance to the query",
        "Information completeness",
        "Factual accuracy indicators",
      ];
      const systemPrompt = config.systemPrompt;

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OpenAI API key is required for Judge");
      }

      if (documents.length === 0) {
        return {
          query,
          judgments: [],
          relevantDocuments: [],
          irrelevantDocuments: [],
          overallAssessment: "insufficient" as const,
          recommendation: "web_search" as const,
          reasoning: "No documents were retrieved to evaluate.",
        };
      }

      // Build the evaluation prompt
      const criteriaList = criteria.map((c, i) => `${i + 1}. ${c}`).join("\n");

      const evaluationPrompt = systemPrompt || `You are a document relevance judge for a RAG system.

Your task is to evaluate each retrieved document's relevance to the user's query.

Evaluation Criteria:
${criteriaList}

For each document, provide:
1. A relevance score from 0.0 to 1.0
2. Whether it's relevant (score >= ${relevanceThreshold})
3. Brief reasoning for your judgment

Then provide an overall assessment and recommendation.

Respond in JSON format:
{
  "judgments": [
    {
      "documentIndex": 0,
      "relevanceScore": 0.85,
      "isRelevant": true,
      "reasoning": "This document directly addresses..."
    }
  ],
  "overallAssessment": "sufficient|insufficient|ambiguous",
  "recommendation": "proceed|refine_query|web_search|fallback",
  "reasoning": "Overall reasoning for the assessment..."
}`;

      // Format documents for evaluation
      const documentsText = documents
        .map((doc: { content: string }, i: number) => `[Document ${i}]:\n${doc.content}`)
        .join("\n\n---\n\n");

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: evaluationPrompt },
            {
              role: "user",
              content: `Query: "${query}"\n\nRetrieved Documents:\n\n${documentsText}`
            },
          ],
          temperature,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => ({}))) as { error?: { message?: string } };
        throw new Error(
          `OpenAI API error: ${response.status} - ${error.error?.message || "Unknown error"}`
        );
      }

      interface OpenAIResponse {
        choices: Array<{ message: { content: string } }>;
      }

      interface JudgeResult {
        judgments: Array<{
          documentIndex: number;
          relevanceScore: number;
          isRelevant: boolean;
          reasoning: string;
        }>;
        overallAssessment: "sufficient" | "insufficient" | "ambiguous";
        recommendation: "proceed" | "refine_query" | "web_search" | "fallback";
        reasoning: string;
      }

      const data = (await response.json()) as OpenAIResponse;
      const choice = data.choices[0];
      if (!choice) {
        throw new Error("No response from OpenAI");
      }
      const result = JSON.parse(choice.message.content) as JudgeResult;

      // Map judgments to full document info
      const judgments: DocumentJudgment[] = result.judgments.map((j) => {
        const doc = documents[j.documentIndex];
        if (!doc) {
          throw new Error(`Document at index ${j.documentIndex} not found`);
        }
        return {
          id: doc.id,
          content: doc.content,
          relevanceScore: j.relevanceScore,
          isRelevant: j.isRelevant,
          reasoning: j.reasoning,
        };
      });

      const relevantDocuments = judgments.filter((j) => j.isRelevant);
      const irrelevantDocuments = judgments.filter((j) => !j.isRelevant);

      return {
        query,
        judgments,
        relevantDocuments,
        irrelevantDocuments,
        overallAssessment: result.overallAssessment,
        recommendation: result.recommendation,
        reasoning: result.reasoning,
      };
    },
  });

// Default export for simple usage
export const judgeStep = createJudgeStep();
