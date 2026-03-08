"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useCanvasStore } from "@/stores/canvas-store";
import { useExecutionLogStore } from "@/stores/execution-log-store";
import { handleSSEEvent } from "@/features/canvas/hooks/event-dispatcher";
import type { SpanEntry } from "../api/observability-api";

export type PlaybackSpeed = 0.5 | 1 | 2 | 5;

interface ReplayState {
  isPlaying: boolean;
  currentIndex: number;
  totalSteps: number;
  speed: PlaybackSpeed;
  progress: number; // 0-1
}

/**
 * Replay hook — takes stored spans and dispatches synthetic SSE events
 * with timing to replay a completed run.
 */
export function useReplay(runId: string, spans: SpanEntry[]) {
  const [state, setState] = useState<ReplayState>({
    isPlaying: false,
    currentIndex: 0,
    totalSteps: spans.length,
    speed: 1,
    progress: 0,
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef(0);

  // Build synthetic events from spans
  const events = useRef<Array<{ event: Record<string, unknown>; delayMs: number }>>([]);
  useEffect(() => {
    if (spans.length === 0) return;

    const sorted = [...spans].sort(
      (a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
    );
    const firstStart = new Date(sorted[0]!.startedAt).getTime();

    const built: Array<{ event: Record<string, unknown>; delayMs: number }> = [];
    for (const span of sorted) {
      const startOffset = new Date(span.startedAt).getTime() - firstStart;
      built.push({
        delayMs: startOffset,
        event: {
          type: "step:started",
          runId,
          data: {
            nodeId: span.nodeId,
            nodeType: span.nodeType,
            nodeLabel: span.nodeLabel,
            stepIndex: built.length,
            input: span.input || {},
          },
        },
      });

      const endOffset = span.completedAt
        ? new Date(span.completedAt).getTime() - firstStart
        : startOffset + (span.latencyMs || 100);

      built.push({
        delayMs: endOffset,
        event: {
          type: span.status === "failed" ? "step:failed" : "step:completed",
          runId,
          data: {
            nodeId: span.nodeId,
            nodeType: span.nodeType,
            nodeLabel: span.nodeLabel,
            stepIndex: built.length,
            output: span.output || {},
            latencyMs: span.latencyMs || 0,
            trace: span.trace || null,
            error: span.status === "failed" ? "Step failed" : undefined,
          },
        },
      });
    }

    events.current = built;
    setState((s) => ({ ...s, totalSteps: sorted.length }));
  }, [spans, runId]);

  const dispatchEvent = useCallback((index: number) => {
    const item = events.current[index];
    if (!item) return;
    handleSSEEvent(item.event);
  }, []);

  const scheduleNext = useCallback((fromIndex: number) => {
    if (fromIndex >= events.current.length) {
      // Run completed
      handleSSEEvent({
        type: "run:completed",
        runId,
        data: {
          output: {},
          totalLatencyMs: events.current.at(-1)?.delayMs || 0,
          trace: { totalTokens: 0, totalCost: 0, stepCount: spans.length },
        },
      });
      setState((s) => ({ ...s, isPlaying: false, progress: 1 }));
      return;
    }

    const current = events.current[fromIndex]!;
    const prev = fromIndex > 0 ? events.current[fromIndex - 1]! : { delayMs: 0 };
    const delay = (current.delayMs - prev.delayMs) / state.speed;

    timerRef.current = setTimeout(() => {
      dispatchEvent(fromIndex);
      indexRef.current = fromIndex + 1;
      setState((s) => ({
        ...s,
        currentIndex: fromIndex + 1,
        progress: (fromIndex + 1) / events.current.length,
      }));
      scheduleNext(fromIndex + 1);
    }, Math.max(delay, 10));
  }, [state.speed, dispatchEvent, runId, spans.length]);

  const play = useCallback(() => {
    if (events.current.length === 0) return;

    // Reset stores
    const canvasStore = useCanvasStore.getState();
    const logStore = useExecutionLogStore.getState();
    canvasStore.clearAllNodeStatuses();
    logStore.clear();

    indexRef.current = 0;
    setState((s) => ({ ...s, isPlaying: true, currentIndex: 0, progress: 0 }));
    scheduleNext(0);
  }, [scheduleNext]);

  const pause = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setState((s) => ({ ...s, isPlaying: false }));
  }, []);

  const resume = useCallback(() => {
    setState((s) => ({ ...s, isPlaying: true }));
    scheduleNext(indexRef.current);
  }, [scheduleNext]);

  const setSpeed = useCallback((speed: PlaybackSpeed) => {
    setState((s) => ({ ...s, speed }));
  }, []);

  const stepForward = useCallback(() => {
    if (indexRef.current < events.current.length) {
      dispatchEvent(indexRef.current);
      indexRef.current++;
      setState((s) => ({
        ...s,
        currentIndex: indexRef.current,
        progress: indexRef.current / events.current.length,
      }));
    }
  }, [dispatchEvent]);

  const stepBack = useCallback(() => {
    // Replay from beginning up to currentIndex - 1
    if (indexRef.current <= 0) return;

    const canvasStore = useCanvasStore.getState();
    const logStore = useExecutionLogStore.getState();
    canvasStore.clearAllNodeStatuses();
    logStore.clear();

    const target = indexRef.current - 1;
    for (let i = 0; i < target; i++) {
      dispatchEvent(i);
    }
    indexRef.current = target;
    setState((s) => ({
      ...s,
      currentIndex: target,
      progress: target / events.current.length,
    }));
  }, [dispatchEvent]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return {
    ...state,
    play,
    pause,
    resume,
    setSpeed,
    stepForward,
    stepBack,
  };
}
