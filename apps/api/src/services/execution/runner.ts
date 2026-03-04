import { randomUUID } from "crypto";
import {
  compileToWorkflow,
  createExecutionPlan,
  type CanvasGraph,
} from "@hachi/mastra-core/compiler";
import type {
  AnySSEEvent,
  RunStartedEvent,
  RunCompletedEvent,
  RunFailedEvent,
  StepStartedEvent,
  StepCompletedEvent,
  StepFailedEvent,
  TraceData,
} from "@hachi/schemas/execution";
import type { NodeType } from "@hachi/schemas/nodes";
import { extractTraceData, aggregateTraces } from "./trace-utils";

/**
 * Execution Runner (vNext)
 * Compiles canvas graph into a Mastra vNext workflow, executes via workflow.stream(),
 * and emits SSE events with trace data for Wire Tap visualization.
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
  trace?: { totalTokens: number; totalCost: number; stepCount: number };
}

type SSECallback = (event: AnySSEEvent) => void | Promise<void>;

/**
 * Creates an SSE event with common fields
 */
const createEvent = <T extends AnySSEEvent>(
  type: T["type"],
  runId: string,
  data: T["data"]
): T =>
  ({
    type,
    timestamp: new Date().toISOString(),
    runId,
    data,
  }) as T;

/**
 * Injects credentials as environment variables for the duration of execution.
 * Returns a cleanup function to restore original values.
 */
function injectCredentials(config: RunnerConfig): () => void {
  const originals: Record<string, string | undefined> = {};
  const vars: Record<string, string | undefined> = {
    OPENAI_API_KEY: config.openaiApiKey,
    ANTHROPIC_API_KEY: config.anthropicApiKey,
    PINECONE_API_KEY: config.pineconeApiKey,
    PINECONE_INDEX_HOST: config.pineconeIndexHost,
    DATABASE_URL: config.databaseUrl,
  };

  for (const [key, value] of Object.entries(vars)) {
    if (value) {
      originals[key] = process.env[key];
      process.env[key] = value;
    }
  }

  return () => {
    for (const [key, value] of Object.entries(originals)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  };
}

/**
 * Executes a canvas graph using Mastra vNext workflow.stream()
 * and emits SSE events with trace data.
 */
export const executeGraph = async (
  graph: CanvasGraph,
  input: RunInput,
  config: RunnerConfig,
  onEvent: SSECallback
): Promise<RunResult> => {
  const runId = randomUUID();
  const startTime = Date.now();

  // Compile the graph to a Mastra vNext workflow
  const compilation = compileToWorkflow(graph);
  if (!compilation.success || !compilation.workflow) {
    const errorMsg = compilation.errors?.join(", ") || "Compilation failed";
    await onEvent(
      createEvent<RunFailedEvent>("run:failed", runId, { error: errorMsg })
    );
    return {
      runId,
      success: false,
      error: errorMsg,
      totalLatencyMs: Date.now() - startTime,
    };
  }

  // Also build the execution plan for step metadata
  const plan = createExecutionPlan(graph);
  const stepMeta = new Map<
    string,
    { nodeType: string; nodeLabel: string; stepIndex: number }
  >(
    plan.steps.map((s, i) => [
      s.nodeId,
      { nodeType: s.nodeType, nodeLabel: s.nodeLabel, stepIndex: i },
    ])
  );

  // Inject org credentials into env for step factories
  const cleanupCredentials = injectCredentials(config);

  try {
    // Emit run started
    await onEvent(
      createEvent<RunStartedEvent>("run:started", runId, {
        canvasId: graph.nodes[0]?.id || runId,
        input: input as Record<string, unknown>,
        totalSteps: plan.steps.length,
      })
    );

    // Create and stream the workflow
    const workflow = compilation.workflow;
    const run = await workflow.createRun();
    const streamResult = run.stream({
      inputData: { query: input.query },
    });

    // Track step timing and traces
    const stepStartTimes = new Map<string, number>();
    const stepTraces: TraceData[] = [];
    let finalOutput: Record<string, unknown> = {};

    // Consume workflow stream events
    for await (const event of streamResult) {
      switch (event.type) {
        case "workflow-step-start": {
          const nodeId = event.payload.id;
          const meta = stepMeta.get(nodeId);
          stepStartTimes.set(nodeId, Date.now());

          if (meta) {
            await onEvent(
              createEvent<StepStartedEvent>("step:started", runId, {
                nodeId,
                nodeType: meta.nodeType,
                nodeLabel: meta.nodeLabel,
                stepIndex: meta.stepIndex,
                input: {},
              })
            );
          }
          break;
        }

        case "workflow-step-result": {
          const nodeId = event.payload.id;
          const meta = stepMeta.get(nodeId);
          const output =
            (event.payload.output as Record<string, unknown>) || {};
          const stepStart = stepStartTimes.get(nodeId);
          const latencyMs = stepStart ? Date.now() - stepStart : 0;

          // Extract trace data
          const trace = meta
            ? extractTraceData(meta.nodeType, output)
            : {};
          stepTraces.push(trace);
          finalOutput = output;

          const status = event.payload.status;

          if (status === "failed") {
            if (meta) {
              await onEvent(
                createEvent<StepFailedEvent>("step:failed", runId, {
                  nodeId,
                  nodeType: meta.nodeType,
                  nodeLabel: meta.nodeLabel,
                  stepIndex: meta.stepIndex,
                  error:
                    (output as any)?.error?.message ||
                    (output as any)?.error ||
                    "Step failed",
                })
              );
            }
          } else if (meta) {
            await onEvent(
              createEvent<StepCompletedEvent>("step:completed", runId, {
                nodeId,
                nodeType: meta.nodeType,
                nodeLabel: meta.nodeLabel,
                stepIndex: meta.stepIndex,
                output,
                latencyMs,
                trace,
              })
            );
          }
          break;
        }

        case "workflow-finish": {
          // Workflow completed
          break;
        }

        case "workflow-canceled": {
          await onEvent(
            createEvent<RunFailedEvent>("run:failed", runId, {
              error: "Workflow was cancelled",
            })
          );
          break;
        }
      }
    }

    // Wait for final result
    const result = await streamResult.result;
    const totalLatencyMs = Date.now() - startTime;

    if (result.status === "success") {
      const runTrace = aggregateTraces(stepTraces);

      await onEvent(
        createEvent<RunCompletedEvent>("run:completed", runId, {
          output: finalOutput,
          totalLatencyMs,
          trace: runTrace,
        })
      );

      return {
        runId,
        success: true,
        output: finalOutput,
        totalLatencyMs,
        trace: runTrace,
      };
    } else {
      const errorMsg =
        result.status === "failed"
          ? (result as any).error?.message || "Workflow failed"
          : `Workflow ended with status: ${result.status}`;

      await onEvent(
        createEvent<RunFailedEvent>("run:failed", runId, {
          error: errorMsg,
        })
      );

      return {
        runId,
        success: false,
        error: errorMsg,
        totalLatencyMs,
      };
    }
  } catch (error) {
    const totalLatencyMs = Date.now() - startTime;
    const errorMessage =
      error instanceof Error ? error.message : "Run failed";

    await onEvent(
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
  } finally {
    cleanupCredentials();
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
      } catch {
        // Error already handled in executeGraph
      } finally {
        controller.close();
      }
    },
  });
};

// Re-export for backward compatibility
export { createExecutionPlan, type CanvasGraph };
