import type {
  StepOutput,
  StepStatus,
  AnySSEEvent,
} from "@hachi/schemas/execution";
import { randomUUID } from "crypto";

/**
 * Step Tracer for Wire Tap
 * Collects and stores step execution data for visualization
 */

export interface TracedStep {
  id: string;
  runId: string;
  nodeId: string;
  nodeType: string;
  nodeLabel: string;
  status: StepStatus;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  latencyMs?: number;
  startedAt: string;
  completedAt?: string;
}

export interface TracedRun {
  id: string;
  canvasId: string;
  status: "pending" | "running" | "completed" | "failed";
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  totalLatencyMs?: number;
  startedAt: string;
  completedAt?: string;
  steps: TracedStep[];
}

/**
 * In-memory store for traced runs
 * In production, this would be backed by a database
 */
const runStore = new Map<string, TracedRun>();
const stepStore = new Map<string, TracedStep>();

// Max runs to keep in memory
const MAX_RUNS = 100;

/**
 * Creates a tracer callback that records SSE events
 */
export const createTracer = (canvasId: string): {
  onEvent: (event: AnySSEEvent) => void;
  getRun: () => TracedRun | undefined;
} => {
  let currentRunId: string | undefined;

  const onEvent = (event: AnySSEEvent) => {
    switch (event.type) {
      case "run:started": {
        currentRunId = event.runId;

        const run: TracedRun = {
          id: event.runId,
          canvasId: event.data.canvasId,
          status: "running",
          input: event.data.input,
          startedAt: event.timestamp,
          steps: [],
        };

        // Clean up old runs if needed
        if (runStore.size >= MAX_RUNS) {
          const oldestRunId = runStore.keys().next().value;
          if (oldestRunId) {
            const oldRun = runStore.get(oldestRunId);
            if (oldRun) {
              // Clean up step store
              for (const step of oldRun.steps) {
                stepStore.delete(step.id);
              }
            }
            runStore.delete(oldestRunId);
          }
        }

        runStore.set(event.runId, run);
        break;
      }

      case "run:completed": {
        const run = runStore.get(event.runId);
        if (run) {
          run.status = "completed";
          run.output = event.data.output;
          run.totalLatencyMs = event.data.totalLatencyMs;
          run.completedAt = event.timestamp;
        }
        break;
      }

      case "run:failed": {
        const run = runStore.get(event.runId);
        if (run) {
          run.status = "failed";
          run.error = event.data.error;
          run.completedAt = event.timestamp;
        }
        break;
      }

      case "step:started": {
        const run = runStore.get(event.runId);
        if (run) {
          const step: TracedStep = {
            id: randomUUID(),
            runId: event.runId,
            nodeId: event.data.nodeId,
            nodeType: event.data.nodeType,
            nodeLabel: event.data.nodeLabel,
            status: "running",
            input: event.data.input,
            startedAt: event.timestamp,
          };

          run.steps.push(step);
          stepStore.set(step.id, step);
        }
        break;
      }

      case "step:completed": {
        const run = runStore.get(event.runId);
        if (run) {
          const step = run.steps.find((s) => s.nodeId === event.data.nodeId && s.status === "running");
          if (step) {
            step.status = "completed";
            step.output = event.data.output;
            step.latencyMs = event.data.latencyMs;
            step.completedAt = event.timestamp;
          }
        }
        break;
      }

      case "step:failed": {
        const run = runStore.get(event.runId);
        if (run) {
          const step = run.steps.find((s) => s.nodeId === event.data.nodeId && s.status === "running");
          if (step) {
            step.status = "failed";
            step.error = event.data.error;
            step.completedAt = event.timestamp;
          }
        }
        break;
      }

      case "step:progress": {
        // Progress events can be used for streaming LLM output
        // For now, we'll just log them
        break;
      }
    }
  };

  const getRun = () => {
    if (!currentRunId) return undefined;
    return runStore.get(currentRunId);
  };

  return { onEvent, getRun };
};

/**
 * Gets a run by ID
 */
export const getRun = (runId: string): TracedRun | undefined => {
  return runStore.get(runId);
};

/**
 * Gets all runs for a canvas
 */
export const getRunsByCanvas = (canvasId: string): TracedRun[] => {
  const runs: TracedRun[] = [];
  for (const run of runStore.values()) {
    if (run.canvasId === canvasId) {
      runs.push(run);
    }
  }
  return runs.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
};

/**
 * Gets a specific step output
 */
export const getStepOutput = (stepId: string): TracedStep | undefined => {
  return stepStore.get(stepId);
};

/**
 * Gets all steps for a run
 */
export const getRunSteps = (runId: string): TracedStep[] => {
  const run = runStore.get(runId);
  return run?.steps || [];
};

/**
 * Gets the step output for a specific node in a run
 */
export const getNodeOutput = (runId: string, nodeId: string): TracedStep | undefined => {
  const run = runStore.get(runId);
  if (!run) return undefined;
  return run.steps.find((s) => s.nodeId === nodeId);
};

/**
 * Clears all traced data
 */
export const clearTraces = (): void => {
  runStore.clear();
  stepStore.clear();
};

/**
 * Clears traced data for a specific canvas
 */
export const clearCanvasTraces = (canvasId: string): void => {
  for (const [runId, run] of runStore.entries()) {
    if (run.canvasId === canvasId) {
      for (const step of run.steps) {
        stepStore.delete(step.id);
      }
      runStore.delete(runId);
    }
  }
};

/**
 * Converts traced step to schema format
 */
export const toStepOutput = (step: TracedStep): StepOutput => ({
  id: step.id,
  runId: step.runId,
  nodeId: step.nodeId,
  nodeType: step.nodeType,
  nodeLabel: step.nodeLabel,
  status: step.status,
  input: step.input,
  output: step.output,
  error: step.error,
  latencyMs: step.latencyMs,
  startedAt: step.startedAt,
  completedAt: step.completedAt,
});
