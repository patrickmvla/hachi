"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  fetchLatencyStats,
  fetchErrorStats,
  fetchCostStats,
  fetchRunSpans,
} from "../api/observability-api";

export function useLatencyStats(canvasId: string, days = 7) {
  return useQuery({
    queryKey: queryKeys.observability.latency(canvasId, days),
    queryFn: () => fetchLatencyStats(canvasId, days),
    enabled: !!canvasId,
  });
}

export function useErrorStats(canvasId: string, days = 7) {
  return useQuery({
    queryKey: queryKeys.observability.errors(canvasId, days),
    queryFn: () => fetchErrorStats(canvasId, days),
    enabled: !!canvasId,
  });
}

export function useCostStats(canvasId: string, days = 30) {
  return useQuery({
    queryKey: queryKeys.observability.costs(canvasId, days),
    queryFn: () => fetchCostStats(canvasId, days),
    enabled: !!canvasId,
  });
}

export function useRunSpans(runId: string) {
  return useQuery({
    queryKey: queryKeys.observability.spans(runId),
    queryFn: () => fetchRunSpans(runId),
    enabled: !!runId,
  });
}
