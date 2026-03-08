import type { AnySSEEvent } from "@hachi/schemas/execution";

/**
 * Langfuse Exporter (Optional)
 * Batches execution events and flushes to Langfuse on run completion.
 * Env-gated: only active when LANGFUSE_PUBLIC_KEY/SECRET_KEY are set.
 */

interface LangfuseConfig {
  publicKey: string;
  secretKey: string;
  host: string;
}

function getLangfuseConfig(): LangfuseConfig | null {
  const publicKey = process.env.LANGFUSE_PUBLIC_KEY;
  const secretKey = process.env.LANGFUSE_SECRET_KEY;
  if (!publicKey || !secretKey) return null;
  return {
    publicKey,
    secretKey,
    host: process.env.LANGFUSE_HOST || "https://cloud.langfuse.com",
  };
}

interface LangfuseIngestionEvent {
  id: string;
  type: string;
  body: Record<string, unknown>;
  timestamp: string;
}

/**
 * Creates a Langfuse exporter that wraps an onEvent callback.
 * Buffers events and flushes to Langfuse on run:completed/run:failed.
 * Returns null if Langfuse is not configured.
 */
export function createLangfuseExporter(
  onEvent: (event: AnySSEEvent) => void | Promise<void>
): ((event: AnySSEEvent) => void | Promise<void>) | null {
  const config = getLangfuseConfig();
  if (!config) return null;

  const buffer: LangfuseIngestionEvent[] = [];
  let traceId: string | undefined;

  return async (event: AnySSEEvent) => {
    // Always forward to original handler first
    await onEvent(event);

    const data = event.data as Record<string, unknown>;

    switch (event.type) {
      case "run:started": {
        traceId = (data.traceId as string) || event.runId;
        buffer.push({
          id: event.runId,
          type: "trace-create",
          body: {
            id: traceId,
            name: "canvas-run",
            input: data.input,
            metadata: { canvasId: data.canvasId, totalSteps: data.totalSteps },
          },
          timestamp: event.timestamp,
        });
        break;
      }

      case "step:started": {
        const spanId = (data.spanId as string) || data.nodeId;
        buffer.push({
          id: spanId as string,
          type: "span-create",
          body: {
            id: spanId,
            traceId,
            name: data.nodeLabel as string,
            input: data.input,
            metadata: { nodeType: data.nodeType, nodeId: data.nodeId },
            startTime: event.timestamp,
          },
          timestamp: event.timestamp,
        });
        break;
      }

      case "step:completed": {
        const spanId = (data.spanId as string) || data.nodeId;
        const isLlmStep = ["generate", "hyde", "agent"].includes(data.nodeType as string);

        if (isLlmStep) {
          const trace = data.trace as Record<string, unknown> | undefined;
          const tokenCount = trace?.tokenCount as Record<string, unknown> | undefined;
          buffer.push({
            id: `${spanId}-gen`,
            type: "generation-update",
            body: {
              id: spanId,
              traceId,
              output: data.output,
              model: trace?.model,
              usage: tokenCount ? {
                input: tokenCount.prompt,
                output: tokenCount.completion,
                total: tokenCount.total,
              } : undefined,
              endTime: event.timestamp,
            },
            timestamp: event.timestamp,
          });
        } else {
          buffer.push({
            id: `${spanId}-end`,
            type: "span-update",
            body: {
              id: spanId,
              traceId,
              output: data.output,
              endTime: event.timestamp,
            },
            timestamp: event.timestamp,
          });
        }
        break;
      }

      case "step:failed": {
        const spanId = (data.spanId as string) || data.nodeId;
        buffer.push({
          id: `${spanId}-end`,
          type: "span-update",
          body: {
            id: spanId,
            traceId,
            level: "ERROR",
            statusMessage: data.error,
            endTime: event.timestamp,
          },
          timestamp: event.timestamp,
        });
        break;
      }

      case "run:completed":
      case "run:failed": {
        // Update trace with final status
        buffer.push({
          id: `${event.runId}-end`,
          type: "trace-create",
          body: {
            id: traceId,
            output: event.type === "run:completed" ? data.output : undefined,
            level: event.type === "run:failed" ? "ERROR" : undefined,
            statusMessage: event.type === "run:failed" ? (data.error as string) : undefined,
          },
          timestamp: event.timestamp,
        });

        // Flush all buffered events to Langfuse (fire-and-forget)
        flushToLangfuse(config, buffer).catch((err) => {
          console.error("[Langfuse] Failed to flush:", err);
        });
        break;
      }
    }
  };
}

async function flushToLangfuse(config: LangfuseConfig, events: LangfuseIngestionEvent[]): Promise<void> {
  if (events.length === 0) return;

  const auth = btoa(`${config.publicKey}:${config.secretKey}`);

  const response = await fetch(`${config.host}/api/public/ingestion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({ batch: events }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Langfuse ingestion failed: ${response.status} ${text}`);
  }
}
