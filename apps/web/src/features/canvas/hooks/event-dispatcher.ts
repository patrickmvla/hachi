import { useCanvasStore } from "@/stores/canvas-store";
import {
  useExecutionLogStore,
  type TraceInfo,
} from "@/stores/execution-log-store";

/**
 * Shared event dispatcher — handles SSE events from both live execution
 * and debug WebSocket connections.
 */
export function handleSSEEvent(event: Record<string, unknown>) {
  const canvasStore = useCanvasStore.getState();
  const logStore = useExecutionLogStore.getState();
  const type = event.type as string;
  const data = event.data as Record<string, unknown>;

  switch (type) {
    case "step:started": {
      const nodeId = data.nodeId as string;
      const nodeLabel = data.nodeLabel as string;
      const nodeType = data.nodeType as string;

      canvasStore.setNodeStatus(nodeId, "loading");
      logStore.setCurrentNodeId(nodeId);

      logStore.addEntry({
        id: `${event.runId}-${nodeId}`,
        nodeId,
        nodeName: nodeLabel,
        nodeType,
        status: "running",
        stepName: nodeLabel,
        latencyMs: 0,
        input: (data.input as Record<string, unknown>) || null,
        output: null,
        trace: null,
        logMessages: [`Processing ${nodeLabel}...`],
        timestamp: Date.now(),
      });
      break;
    }

    case "step:completed": {
      const nodeId = data.nodeId as string;
      const nodeType = data.nodeType as string;
      const latencyMs = data.latencyMs as number;
      const output = data.output as Record<string, unknown>;
      const trace = (data.trace as TraceInfo) || null;

      canvasStore.setNodeStatus(nodeId, "success");
      logStore.setCurrentNodeId(null);

      // Animate incoming edges
      const { edges } = useCanvasStore.getState();
      for (const edge of edges) {
        if (edge.target === nodeId) {
          canvasStore.setEdgeAnimated(edge.id, true);
        }
      }

      logStore.updateEntry(`${event.runId}-${nodeId}`, {
        status: "success",
        latencyMs,
        output,
        trace,
        logMessages: buildLogMessages(nodeType, output, trace, latencyMs),
      });
      break;
    }

    case "step:failed": {
      const nodeId = data.nodeId as string;
      const error = data.error as string;

      canvasStore.setNodeStatus(nodeId, "error");
      logStore.setCurrentNodeId(null);

      logStore.updateEntry(`${event.runId}-${nodeId}`, {
        status: "error",
        logMessages: [`Failed: ${error}`],
      });
      break;
    }

    case "run:completed": {
      const totalLatencyMs = data.totalLatencyMs as number;
      const trace = data.trace as
        | { totalTokens?: number; totalCost?: number; stepCount?: number }
        | undefined;

      logStore.setRunTrace({
        totalLatencyMs,
        totalTokens: trace?.totalTokens || 0,
        totalCost: trace?.totalCost || 0,
        stepCount: trace?.stepCount || 0,
      });
      break;
    }

    case "run:failed": {
      const error = data.error as string;
      logStore.setRunTrace({
        totalLatencyMs: 0,
        totalTokens: 0,
        totalCost: 0,
        stepCount: 0,
      });
      console.error("Run failed:", error);
      break;
    }
  }
}

/**
 * Creates human-readable log messages from trace data.
 */
export function buildLogMessages(
  nodeType: string,
  output: Record<string, unknown>,
  trace: TraceInfo | null,
  latencyMs: number
): string[] {
  const msgs: string[] = [];

  switch (nodeType) {
    case "query":
      msgs.push(`Query: "${(output.query as string)?.slice(0, 60)}..."`);
      break;

    case "embed":
      msgs.push(
        `Embedded with ${trace?.model || "unknown model"}`,
        `${trace?.dimensions || 0} dimensions`
      );
      if (trace?.tokenCount?.total) {
        msgs.push(`${trace.tokenCount.total} tokens`);
      }
      break;

    case "retrieve":
      msgs.push(
        `Retrieved ${trace?.documentCount || 0} documents`
      );
      break;

    case "generate":
    case "hyde":
    case "agent":
      if (trace?.model) msgs.push(`Model: ${trace.model}`);
      if (trace?.tokenCount?.total) {
        msgs.push(`Tokens: ${trace.tokenCount.total}`);
      }
      if (trace?.cost?.total) {
        msgs.push(`Cost: $${trace.cost.total.toFixed(6)}`);
      }
      break;

    case "rerank":
      msgs.push(
        `Reranked to ${trace?.documentCount || 0} documents`
      );
      if (trace?.model) msgs.push(`Model: ${trace.model}`);
      break;

    case "judge":
      msgs.push(
        `Judged ${trace?.documentCount || 0} documents`
      );
      if (trace?.finishReason) {
        msgs.push(`Recommendation: ${trace.finishReason}`);
      }
      break;
  }

  msgs.push(`${latencyMs}ms`);
  return msgs;
}
