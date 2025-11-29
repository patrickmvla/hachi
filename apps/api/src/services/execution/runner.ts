import { randomUUID } from "crypto";
import {
  createExecutionPlan,
  type CanvasGraph,
} from "@hachi/mastra-core/compiler";
import {
  createQueryStep,
  createEmbedStep,
  createRetrieveStep,
  createGenerateStep,
  createHyDEStep,
  createRerankStep,
  createJudgeStep,
  createAgentStep,
} from "@hachi/mastra-core/steps";
import type {
  AnySSEEvent,
  RunStartedEvent,
  RunCompletedEvent,
  RunFailedEvent,
  StepStartedEvent,
  StepCompletedEvent,
  StepFailedEvent,
} from "@hachi/schemas/execution";
import type { NodeType } from "@hachi/schemas/nodes";

/**
 * Execution Runner
 * Executes a canvas graph and streams SSE events for Wire Tap visualization
 */

export interface RunnerConfig {
  openaiApiKey?: string;
  anthropicApiKey?: string;
  pineconeApiKey?: string;
  pineconeIndexHost?: string;
  databaseUrl?: string;
  vectorStoreType?: "memory" | "pgvector" | "pinecone";
  documents?: Array<{
    id: string;
    content: string;
    embedding: number[];
    metadata?: Record<string, unknown>;
  }>;
}

export interface RunInput {
  query: string;
  [key: string]: unknown;
}

export interface RunResult {
  runId: string;
  success: boolean;
  output?: Record<string, unknown>;
  error?: string;
  totalLatencyMs: number;
}

type SSECallback = (event: AnySSEEvent) => void;

/**
 * Step executor adapter - wraps Mastra steps to provide a unified execution interface
 */
interface StepExecutor {
  execute: (params: { inputData: Record<string, unknown>; mapiConfig: Record<string, unknown> }) => Promise<Record<string, unknown>>;
}

/**
 * Generic Mastra step type - accepts any step with an execute function
 */
interface MastraStep {
  execute: (ctx: {
    context: Record<string, unknown>;
    runId: string;
    suspend: () => Promise<unknown>;
  }) => Promise<Record<string, unknown>>;
}

/**
 * Creates an executor adapter for a Mastra step
 */
const createStepExecutor = (mastraStep: MastraStep): StepExecutor => ({
  execute: async ({ inputData }) => {
    // Mastra steps expect { context: inputData } format
    const result = await mastraStep.execute({
      context: inputData,
      runId: randomUUID(),
      suspend: async () => { throw new Error("Suspend not supported"); },
    });
    return result;
  },
});

/**
 * Step executor factory - maps node types to step execution
 */
const getStepExecutor = (nodeType: NodeType, config: Record<string, unknown>): StepExecutor => {
  // Create the Mastra step based on node type
  const stepConfig = config as any;
  let mastraStep: MastraStep;

  switch (nodeType) {
    case "query":
      mastraStep = createQueryStep(stepConfig) as unknown as MastraStep;
      break;
    case "embed":
      mastraStep = createEmbedStep(stepConfig) as unknown as MastraStep;
      break;
    case "retrieve":
      mastraStep = createRetrieveStep(stepConfig) as unknown as MastraStep;
      break;
    case "generate":
      mastraStep = createGenerateStep(stepConfig) as unknown as MastraStep;
      break;
    case "hyde":
      mastraStep = createHyDEStep(stepConfig) as unknown as MastraStep;
      break;
    case "rerank":
      mastraStep = createRerankStep(stepConfig) as unknown as MastraStep;
      break;
    case "judge":
      mastraStep = createJudgeStep(stepConfig) as unknown as MastraStep;
      break;
    case "agent":
      mastraStep = createAgentStep(stepConfig) as unknown as MastraStep;
      break;
    default:
      throw new Error(`Unknown node type: ${nodeType}`);
  }

  return createStepExecutor(mastraStep);
};

/**
 * Maps step outputs to the next step's inputs based on node type
 */
const mapStepOutputToInput = (
  nodeType: NodeType,
  previousOutputs: Map<string, Record<string, unknown>>,
  inputNodeIds: string[],
  initialQuery: string
): Record<string, unknown> => {
  // Collect all outputs from input nodes
  const inputOutputs = inputNodeIds
    .map((id) => previousOutputs.get(id))
    .filter(Boolean);

  switch (nodeType) {
    case "query":
      // Query node gets the initial input
      return { query: initialQuery };

    case "embed": {
      // Embed node needs text from query or hyde
      const queryOutput = inputOutputs.find((o) => o?.query);
      const hydeOutput = inputOutputs.find((o) => o?.hypotheticalDocument);
      return {
        text: hydeOutput?.hypotheticalDocument || queryOutput?.query || initialQuery,
      };
    }

    case "hyde": {
      // Hyde node needs the query
      const queryOutput = inputOutputs.find((o) => o?.query);
      return { query: queryOutput?.query || initialQuery };
    }

    case "retrieve": {
      // Retrieve node needs embedding and query
      const embedOutput = inputOutputs.find((o) => o?.embedding);
      const queryOutput = inputOutputs.find((o) => o?.query);
      return {
        embedding: embedOutput?.embedding || [],
        query: queryOutput?.query || embedOutput?.text || initialQuery,
      };
    }

    case "rerank": {
      // Rerank node needs documents and query
      const retrieveOutput = inputOutputs.find((o) => o?.documents);
      const queryOutput = inputOutputs.find((o) => o?.query);
      return {
        documents: retrieveOutput?.documents || [],
        query: queryOutput?.query || retrieveOutput?.query || initialQuery,
      };
    }

    case "judge": {
      // Judge node needs documents and query
      const retrieveOutput = inputOutputs.find((o) => o?.documents);
      const rerankOutput = inputOutputs.find((o) => o?.rankedDocuments);
      const queryOutput = inputOutputs.find((o) => o?.query);
      return {
        documents: rerankOutput?.rankedDocuments || retrieveOutput?.documents || [],
        query: queryOutput?.query || rerankOutput?.query || retrieveOutput?.query || initialQuery,
      };
    }

    case "generate": {
      // Generate node needs query, context, and documents
      const retrieveOutput = inputOutputs.find((o) => o?.documents);
      const rerankOutput = inputOutputs.find((o) => o?.rankedDocuments);
      const judgeOutput = inputOutputs.find((o) => o?.relevantDocuments);
      const queryOutput = inputOutputs.find((o) => o?.query);

      // Use the most processed documents available
      const documents = judgeOutput?.relevantDocuments || rerankOutput?.rankedDocuments || retrieveOutput?.documents;

      return {
        query: queryOutput?.query || initialQuery,
        documents,
      };
    }

    case "agent": {
      // Agent node needs query, context, and documents
      const retrieveOutput = inputOutputs.find((o) => o?.documents);
      const rerankOutput = inputOutputs.find((o) => o?.rankedDocuments);
      const judgeOutput = inputOutputs.find((o) => o?.relevantDocuments);
      const queryOutput = inputOutputs.find((o) => o?.query);

      const documents = judgeOutput?.relevantDocuments || rerankOutput?.rankedDocuments || retrieveOutput?.documents;

      return {
        query: queryOutput?.query || initialQuery,
        documents,
      };
    }

    default:
      return { query: initialQuery };
  }
};

/**
 * Creates an SSE event with common fields
 */
const createEvent = <T extends AnySSEEvent>(
  type: T["type"],
  runId: string,
  data: T["data"]
): T => ({
  type,
  timestamp: new Date().toISOString(),
  runId,
  data,
} as T);

/**
 * Executes a canvas graph with SSE streaming
 */
export const executeGraph = async (
  graph: CanvasGraph,
  input: RunInput,
  config: RunnerConfig,
  onEvent: SSECallback
): Promise<RunResult> => {
  const runId = randomUUID();
  const startTime = Date.now();
  const stepOutputs = new Map<string, Record<string, unknown>>();

  try {
    // Create execution plan
    const plan = createExecutionPlan(graph);

    // Emit run started event
    onEvent(
      createEvent<RunStartedEvent>("run:started", runId, {
        canvasId: graph.nodes[0]?.id || runId, // Use first node ID as canvas ID placeholder
        input: input as Record<string, unknown>,
        totalSteps: plan.steps.length,
      })
    );

    // Build mapiConfig for step execution
    const mapiConfig: Record<string, unknown> = {
      openaiApiKey: config.openaiApiKey,
      anthropicApiKey: config.anthropicApiKey,
      pineconeApiKey: config.pineconeApiKey,
      pineconeIndexHost: config.pineconeIndexHost,
      databaseUrl: config.databaseUrl,
      vectorStoreType: config.vectorStoreType || "memory",
      documents: config.documents || [],
    };

    // Execute each step in order
    let finalOutput: Record<string, unknown> = {};

    for (let i = 0; i < plan.steps.length; i++) {
      const step = plan.steps[i];
      if (!step) continue;

      const stepStartTime = Date.now();

      // Map inputs from previous steps
      const stepInput = mapStepOutputToInput(
        step.nodeType,
        stepOutputs,
        step.inputs,
        input.query
      );

      // Emit step started event
      onEvent(
        createEvent<StepStartedEvent>("step:started", runId, {
          nodeId: step.nodeId,
          nodeType: step.nodeType,
          nodeLabel: step.nodeLabel,
          stepIndex: i,
          input: stepInput,
        })
      );

      try {
        // Get step executor and execute
        const executor = getStepExecutor(step.nodeType, step.config);
        const output = await executor.execute({
          inputData: stepInput,
          mapiConfig,
        });

        // Store output for downstream steps
        stepOutputs.set(step.nodeId, output);
        finalOutput = output;

        const stepLatency = Date.now() - stepStartTime;

        // Emit step completed event
        onEvent(
          createEvent<StepCompletedEvent>("step:completed", runId, {
            nodeId: step.nodeId,
            nodeType: step.nodeType,
            nodeLabel: step.nodeLabel,
            stepIndex: i,
            output,
            latencyMs: stepLatency,
          })
        );
      } catch (stepError) {
        const errorMessage = stepError instanceof Error ? stepError.message : "Step execution failed";

        // Emit step failed event
        onEvent(
          createEvent<StepFailedEvent>("step:failed", runId, {
            nodeId: step.nodeId,
            nodeType: step.nodeType,
            nodeLabel: step.nodeLabel,
            stepIndex: i,
            error: errorMessage,
          })
        );

        throw stepError;
      }
    }

    const totalLatencyMs = Date.now() - startTime;

    // Emit run completed event
    onEvent(
      createEvent<RunCompletedEvent>("run:completed", runId, {
        output: finalOutput,
        totalLatencyMs,
      })
    );

    return {
      runId,
      success: true,
      output: finalOutput,
      totalLatencyMs,
    };
  } catch (error) {
    const totalLatencyMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Run failed";

    // Emit run failed event
    onEvent(
      createEvent<RunFailedEvent>("run:failed", runId, {
        error: errorMessage,
      })
    );

    return {
      runId,
      success: false,
      error: errorMessage,
      totalLatencyMs,
    };
  }
};

/**
 * Creates an SSE stream for a canvas execution
 */
export const createExecutionStream = (
  graph: CanvasGraph,
  input: RunInput,
  config: RunnerConfig
): ReadableStream<Uint8Array> => {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      const onEvent = (event: AnySSEEvent) => {
        const data = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(data));
      };

      try {
        await executeGraph(graph, input, config, onEvent);
      } catch (error) {
        // Error already handled in executeGraph
      } finally {
        controller.close();
      }
    },
  });
};
