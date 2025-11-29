import { z } from "zod";

/**
 * Execution Schemas
 * Defines the structure for pipeline runs and SSE events
 */

// Run status enum
export const runStatusSchema = z.enum([
  "pending",
  "running",
  "completed",
  "failed",
  "cancelled",
]);

// Step status enum
export const stepStatusSchema = z.enum([
  "pending",
  "running",
  "completed",
  "failed",
  "skipped",
]);

// Run schema
export const runSchema = z.object({
  id: z.string().uuid(),
  canvasId: z.string().uuid(),
  triggeredBy: z.string().uuid().optional(),
  input: z.record(z.unknown()),
  status: runStatusSchema,
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  error: z.string().optional(),
});

// Step output schema (for Wire Tap)
export const stepOutputSchema = z.object({
  id: z.string().uuid(),
  runId: z.string().uuid(),
  nodeId: z.string(),
  nodeType: z.string(),
  nodeLabel: z.string(),
  status: stepStatusSchema,
  input: z.record(z.unknown()),
  output: z.record(z.unknown()).optional(),
  error: z.string().optional(),
  latencyMs: z.number().optional(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
});

// SSE Event types
export const sseEventTypeSchema = z.enum([
  "run:started",
  "run:completed",
  "run:failed",
  "step:started",
  "step:completed",
  "step:failed",
  "step:progress", // For streaming LLM output
]);

// Base SSE event
export const sseEventSchema = z.object({
  type: sseEventTypeSchema,
  timestamp: z.string().datetime(),
  runId: z.string().uuid(),
});

// Run started event
export const runStartedEventSchema = sseEventSchema.extend({
  type: z.literal("run:started"),
  data: z.object({
    canvasId: z.string().uuid(),
    input: z.record(z.unknown()),
    totalSteps: z.number(),
  }),
});

// Run completed event
export const runCompletedEventSchema = sseEventSchema.extend({
  type: z.literal("run:completed"),
  data: z.object({
    output: z.record(z.unknown()),
    totalLatencyMs: z.number(),
  }),
});

// Run failed event
export const runFailedEventSchema = sseEventSchema.extend({
  type: z.literal("run:failed"),
  data: z.object({
    error: z.string(),
    failedNodeId: z.string().optional(),
  }),
});

// Step started event
export const stepStartedEventSchema = sseEventSchema.extend({
  type: z.literal("step:started"),
  data: z.object({
    nodeId: z.string(),
    nodeType: z.string(),
    nodeLabel: z.string(),
    stepIndex: z.number(),
    input: z.record(z.unknown()),
  }),
});

// Step completed event
export const stepCompletedEventSchema = sseEventSchema.extend({
  type: z.literal("step:completed"),
  data: z.object({
    nodeId: z.string(),
    nodeType: z.string(),
    nodeLabel: z.string(),
    stepIndex: z.number(),
    output: z.record(z.unknown()),
    latencyMs: z.number(),
  }),
});

// Step failed event
export const stepFailedEventSchema = sseEventSchema.extend({
  type: z.literal("step:failed"),
  data: z.object({
    nodeId: z.string(),
    nodeType: z.string(),
    nodeLabel: z.string(),
    stepIndex: z.number(),
    error: z.string(),
  }),
});

// Step progress event (for streaming)
export const stepProgressEventSchema = sseEventSchema.extend({
  type: z.literal("step:progress"),
  data: z.object({
    nodeId: z.string(),
    chunk: z.string(), // Streaming text chunk
    done: z.boolean(),
  }),
});

// Union of all SSE events
export const anySSEEventSchema = z.discriminatedUnion("type", [
  runStartedEventSchema,
  runCompletedEventSchema,
  runFailedEventSchema,
  stepStartedEventSchema,
  stepCompletedEventSchema,
  stepFailedEventSchema,
  stepProgressEventSchema,
]);

// Export types
export type RunStatus = z.infer<typeof runStatusSchema>;
export type StepStatus = z.infer<typeof stepStatusSchema>;
export type Run = z.infer<typeof runSchema>;
export type StepOutput = z.infer<typeof stepOutputSchema>;
export type SSEEventType = z.infer<typeof sseEventTypeSchema>;
export type RunStartedEvent = z.infer<typeof runStartedEventSchema>;
export type RunCompletedEvent = z.infer<typeof runCompletedEventSchema>;
export type RunFailedEvent = z.infer<typeof runFailedEventSchema>;
export type StepStartedEvent = z.infer<typeof stepStartedEventSchema>;
export type StepCompletedEvent = z.infer<typeof stepCompletedEventSchema>;
export type StepFailedEvent = z.infer<typeof stepFailedEventSchema>;
export type StepProgressEvent = z.infer<typeof stepProgressEventSchema>;
export type AnySSEEvent = z.infer<typeof anySSEEventSchema>;
